import { supabase } from '../api/supabase';
import { CartItem } from '../types';

class CartService {
  async getCart(userId: string): Promise<CartItem[]> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        variant:product_variants (
          id,
          product_id,
          size,
          product:products (
            base_price
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      productId: item.variant.product_id,
      size: item.variant.size,
      quantity: item.quantity,
      price: Number(item.variant.product?.base_price || 0),
      variantId: item.variant.id,
    }));
  }

  async syncCartItem(userId: string, productId: string, size: number, quantity: number): Promise<string | null> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return null;

    // 1. Get Variant ID
    const { data: variant, error: varError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('size', size)
      .limit(1)
      .single();

    if (varError || !variant) {
      console.error('Error finding variant:', varError);
      return null;
    }

    // 2. Upsert into cart_items
    // First, check if it exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', userId)
      .eq('variant_id', variant.id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', existing.id)
        .select('id')
        .single();
      return data?.id || null;
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          variant_id: variant.id,
          quantity,
        })
        .select('id')
        .single();
      return data?.id || null;
    }
  }

  async removeCartItem(cartItemId: string): Promise<boolean> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return true;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
    return true;
  }
  
  async removeCartItemByVariant(userId: string, productId: string, size: number): Promise<boolean> {
      if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return true;
      
      const { data: variant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .eq('size', size)
        .single();
        
      if (!variant) return false;
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('variant_id', variant.id);
        
      return !error;
  }

  async clearCart(userId: string): Promise<boolean> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return true;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return !error;
  }
}

export const cartService = new CartService();
