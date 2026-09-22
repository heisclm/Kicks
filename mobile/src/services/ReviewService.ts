import { supabase } from '../api/supabase';

export interface AppReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string | null;
  };
}

class ReviewService {
  async getProductReviews(productId: string): Promise<AppReview[]> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return []; // No mock reviews to return
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        product_id,
        rating,
        comment,
        created_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return (data || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      productId: r.product_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      user: {
        fullName: r.profiles?.full_name || 'Anonymous User',
        avatarUrl: r.profiles?.avatar_url || null,
      },
    }));
  }

  async canUserReview(userId: string, productId: string): Promise<string | null> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return 'mock-order-item-id';
    }

    // Do a raw query to find an order item for this user and product
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        order_id,
        orders!inner (
          user_id,
          status
        ),
        product_variants!inner (
          product_id
        ),
        reviews (
          id
        )
      `)
      .eq('orders.user_id', userId)
      .eq('product_variants.product_id', productId)
      // .eq('orders.status', 'delivered') // optional: require delivery
      .limit(10);

    if (orderItemsError) {
      console.error('Error checking review eligibility:', orderItemsError);
      return null;
    }

    // Find the first order item that has NO reviews yet
    const eligibleItem = orderItems?.find(item => !item.reviews || item.reviews.length === 0);

    return eligibleItem ? eligibleItem.id : null;
  }

  async addReview(params: {
    userId: string;
    productId: string;
    orderItemId: string;
    rating: number;
    comment: string;
  }): Promise<void> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      user_id: params.userId,
      product_id: params.productId,
      order_item_id: params.orderItemId,
      rating: params.rating,
      comment: params.comment,
    });

    if (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
