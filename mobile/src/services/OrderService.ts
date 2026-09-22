import { supabase } from '../api/supabase';
import { Address, PaymentMethod } from '../store/useCheckoutStore';

export interface CheckoutRequest {
  userId: string;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  deliveryMethodId: string;
}

class OrderService {
  async placeOrder(request: CheckoutRequest): Promise<string | null> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return `mock-order-${Date.now()}`;
    }

    try {
      // Use the Postgres RPC function to safely convert the cart to an order
      const { data: orderId, error } = await supabase.rpc('checkout_order', {
        p_user_id: request.userId,
        p_shipping_snapshot: request.shippingAddress as any,
        p_delivery_method_id: request.deliveryMethodId,
        // p_promotion_code is optional
      });

      if (error || !orderId) {
        console.error('Order creation failed via RPC:', error);
        return null;
      }

      // The RPC function should automatically delete the cart items for this user.
      return orderId;
    } catch (err) {
      console.error('Error placing order:', err);
      return null;
    }
  }
}

export const orderService = new OrderService();
