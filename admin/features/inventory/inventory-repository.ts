import { createClient } from '../../utils/supabase/server';
import { InventoryItem, InventoryFilters, InventoryStatus, StockAdjustmentInput, InventoryHistoryFilters, InventoryMovementRecord } from './inventory-types';

export function getInventoryStatus(stockQuantity: number): InventoryStatus {
  if (stockQuantity === 0) return 'OUT_OF_STOCK';
  if (stockQuantity < 10) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export class InventoryRepository {
  static async getInventory(filters?: InventoryFilters): Promise<InventoryItem[]> {
    const supabase = await createClient();

    let query = supabase
      .from('product_variants')
      .select(`
        id,
        size,
        sku,
        stock_quantity,
        color_name,
        updated_at,
        products!inner (
          id,
          name,
          brands!inner ( name )
        )
      `)
      .order('updated_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`sku.ilike.%${filters.search}%, products.name.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inventory:', error.message);
      return [];
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let results: InventoryItem[] = (data || []).map((row: any) => ({
      variant_id: row.id,
      product_id: row.products.id,
      product_name: row.products.name,
      brand_name: row.products.brands.name,
      color_name: row.color_name,
      size: row.size,
      sku: row.sku,
      stock_quantity: row.stock_quantity,
      status: getInventoryStatus(row.stock_quantity),
      updated_at: row.updated_at
    }));

    if (filters?.status) {
      results = results.filter(item => item.status === filters.status);
    }
    
    if (filters?.brand_name) {
      results = results.filter(item => item.brand_name.toLowerCase() === filters.brand_name?.toLowerCase());
    }

    return results;
  }

  static async adjustStock(input: StockAdjustmentInput): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase.rpc('adjust_inventory_stock', {
      p_variant_id: input.variant_id,
      p_change: input.quantity_change,
      p_reason: input.reason,
      p_note: input.note || null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  static async getInventoryHistory(filters?: InventoryHistoryFilters): Promise<{ data: InventoryMovementRecord[], count: number }> {
    const supabase = await createClient();
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('inventory_movements')
      .select(`
        id,
        variant_id,
        quantity_change,
        previous_quantity,
        new_quantity,
        reason,
        note,
        created_by,
        created_at,
        product_variants!inner (
          sku,
          color_name,
          size,
          products!inner (
            name
          )
        ),
        profiles!inner (
          first_name,
          last_name
        )
      `, { count: 'exact' });

    if (filters?.reason) {
      query = query.eq('reason', filters.reason);
    }
    
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters?.endDate) {
      // Add 1 day to include the end date fully if it's just a date string
      query = query.lte('created_at', filters.endDate + 'T23:59:59.999Z');
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching inventory history:', error.message);
      return { data: [], count: 0 };
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Manual filtering for search since deeply nested ILIKE across multiple tables is complex in PostgREST
    let results: InventoryMovementRecord[] = (data || []).map((row: any) => {
      // profiles doesn't have email? Let's check auth.users. But we can't join auth.users easily. 
      // We'll use first_name + last_name as name.
      const firstName = row.profiles?.first_name || '';
      const lastName = row.profiles?.last_name || '';
      const name = `${firstName} ${lastName}`.trim() || 'System';

      return {
        id: row.id,
        variant_id: row.variant_id,
        quantity_change: row.quantity_change,
        previous_quantity: row.previous_quantity,
        new_quantity: row.new_quantity,
        reason: row.reason,
        note: row.note,
        created_by: row.created_by,
        created_at: row.created_at,
        product_name: row.product_variants.products.name,
        sku: row.product_variants.sku,
        color_name: row.product_variants.color_name,
        size: row.product_variants.size,
        performed_by_name: name,
        performed_by_email: '', // Not available via profiles without a special view
      };
    });

    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(r => 
        r.sku.toLowerCase().includes(s) || 
        r.product_name.toLowerCase().includes(s)
      );
    }

    return { data: results, count: count || 0 };
  }
}
