import { createClient } from '../../utils/supabase/server';
import { Promotion, CreatePromotionInput, UpdatePromotionInput } from './promotion-types';

export class PromotionRepository {
  static async getPromotions(): Promise<Promotion[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Promotion[];
  }

  static async createPromotion(input: CreatePromotionInput): Promise<Promotion> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('promotions')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Promotion;
  }

  static async updatePromotion(id: string, input: UpdatePromotionInput): Promise<Promotion> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('promotions')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Promotion;
  }

  static async deletePromotion(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
