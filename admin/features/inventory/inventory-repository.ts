import { createClient } from '../../utils/supabase/server';
import { InventoryItem, InventoryFilters, InventoryStatus, StockAdjustmentInput } from './inventory-types';

export function getInventoryStatus(stockQuantity: number): InventoryStatus {
  if (stockQuantity === 0) return 'OUT_OF_STOCK';
  if (stockQuantity < 10) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export class InventoryRepository {
  /**
   * Retrieves variant-level inventory details.
   */
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
    
    // We fetch everything first because filtering on joined relations and calculated fields 
    // is tricky without custom database views. In a massive scale app, this would use a view or RPC.
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

  /**
   * Adjusts stock for a variant using the secure atomic RPC function.
   */
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
}
