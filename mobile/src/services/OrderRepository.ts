import { supabase } from '../api/supabase';
import { Order, OrderStatus, CartItem } from '../types';

class OrderRepository {
  async getOrders(userId: string): Promise<Order[]> {
    

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        tracking_number,
        order_items (
          id,
          quantity,
          unit_price_at_purchase,
          snapshot_name,
          snapshot_size,
          snapshot_color,
          product_variants (
            product_id,
            products (
              product_images (image_url)
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return (data || []).map(this.mapToAppOrder);
  }

  private mapToAppOrder(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      date: dbOrder.created_at,
      status: mapStatus(dbOrder.status),
      total: dbOrder.total_amount,
      trackingNumber: dbOrder.tracking_number,
      items: dbOrder.order_items.map((item: any): CartItem & { image?: any; name?: string } => ({
        id: item.id,
        productId: item.product_variants?.product_id || '',
        size: item.snapshot_size,
        quantity: item.quantity,
        price: item.unit_price_at_purchase,
        // We inject the image URL directly into the item for the UI to use if needed
        image: item.product_variants?.products?.product_images?.[0]?.image_url ? { uri: item.product_variants.products.product_images[0].image_url } : null,
        name: item.snapshot_name || 'Unknown Product',
      })),
    };
  }
}

function mapStatus(dbStatus: string): OrderStatus {
  switch (dbStatus) {
    case 'pending':
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Processing';
  }
}

export const orderRepository = new OrderRepository();
