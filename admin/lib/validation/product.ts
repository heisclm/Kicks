import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(150).trim(),
  description: z.string().max(2000).trim().optional().or(z.literal('')),
  brand_id: z.string().uuid("Invalid brand selection"),
  category_id: z.string().uuid("Invalid category selection"),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  is_active: z.boolean().default(false),
  image_url: z.string().url().optional(),
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.extend({
  id: z.string().uuid("Invalid product ID"),
});
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const DeleteProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});
