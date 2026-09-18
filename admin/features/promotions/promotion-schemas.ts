import { z } from 'zod';

export const promotionSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().positive(),
  min_order_value: z.coerce.number().min(0).default(0),
  start_date: z.string().nullable().default(null),
  end_date: z.string().nullable().default(null),
  usage_limit: z.coerce.number().nullable().default(null),
  is_active: z.boolean().default(true)
}).refine(data => {
  if (data.discount_type === 'percentage' && data.discount_value > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100",
  path: ["discount_value"]
});

export const updatePromotionSchema = promotionSchema.partial().extend({
  id: z.string().uuid()
});
