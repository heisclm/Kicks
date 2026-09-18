import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100).trim(),
  description: z.string().max(500).trim().optional().or(z.literal('')),
  parent_id: z.string().uuid("Invalid parent category ID").optional().or(z.literal('')),
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.extend({
  id: z.string().uuid("Invalid category ID"),
});
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

export const DeleteCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});
