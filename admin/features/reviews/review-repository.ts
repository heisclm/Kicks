import { createClient } from '../../utils/supabase/server';
import { Review } from './review-types';

export class ReviewRepository {
  static async getReviews(): Promise<Review[]> {
    const supabase = await createClient();
    
    // We join profiles and products to display the reviewer name and product name
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        customer:profiles(first_name, last_name),
        product:products(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (data || []).map((row: any) => ({
      ...row,
      customer: row.customer ? Array.isArray(row.customer) ? row.customer[0] : row.customer : undefined,
      product: row.product ? Array.isArray(row.product) ? row.product[0] : row.product : undefined,
    })) as Review[];
  }

  static async deleteReview(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
