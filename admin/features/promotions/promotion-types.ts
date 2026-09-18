export type DiscountType = 'percentage' | 'fixed';

export interface Promotion {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  start_date: string | null;
  end_date: string | null;
  usage_limit: number | null;
  is_active: boolean;
  created_at: string;
}

export type CreatePromotionInput = Omit<Promotion, 'id' | 'created_at'>;
export type UpdatePromotionInput = Partial<CreatePromotionInput>;
