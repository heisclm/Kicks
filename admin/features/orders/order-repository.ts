import { createClient } from '../../utils/supabase/server';
import { Order, OrderFilters, OrderStatus } from './order-types';

export class OrderRepository {
  static async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const supabase = await createClient();

    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:profiles(id, first_name, last_name, email),
        items:order_items(id)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    // UUID search
    if (filters?.search) {
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(filters.search);
      if (isUUID) {
        query = query.eq('id', filters.search);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error.message);
      return [];
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let results: Order[] = (data || []).map((row: any) => ({
      ...row,
      customer: row.customer ? Array.isArray(row.customer) ? row.customer[0] : row.customer : undefined
    }));

    if (filters?.search && !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(filters.search)) {
      const s = filters.search.toLowerCase();
      results = results.filter(r => 
        r.customer?.email?.toLowerCase().includes(s) ||
        r.customer?.first_name?.toLowerCase().includes(s) ||
        r.customer?.last_name?.toLowerCase().includes(s)
      );
    }

    return results;
  }

  static async getOrderById(id: string): Promise<Order | undefined> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles(id, first_name, last_name, email),
        items:order_items(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return undefined;
    }

    return {
      ...data,
      customer: data.customer ? Array.isArray(data.customer) ? data.customer[0] : data.customer : undefined
    } as any;
  }

  static async updateOrderStatus(id: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}
