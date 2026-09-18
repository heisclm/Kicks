export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  snapshot_name: string;
  snapshot_sku: string;
  snapshot_color: string;
  snapshot_size: number;
  quantity: number;
  unit_price_at_purchase: number;
  created_at: string;
}

export interface CustomerSummary {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  discount_total: number;
  total_amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shipping_snapshot: any;
  tracking_number?: string;
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  customer?: CustomerSummary;
  items?: OrderItem[];
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string; // Search by ID or customer email
}
