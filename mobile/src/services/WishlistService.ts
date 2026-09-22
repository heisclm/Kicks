import { supabase } from '../api/supabase';

class WishlistService {
  async getWishlist(userId: string): Promise<string[]> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return [];
    }
    
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
    
    return data.map(item => item.product_id);
  }

  async addProduct(userId: string, productId: string): Promise<boolean> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return true;

    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, product_id: productId });
      
    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
    return true;
  }

  async removeProduct(userId: string, productId: string): Promise<boolean> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') return true;

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
    return true;
  }
}

export const wishlistService = new WishlistService();
