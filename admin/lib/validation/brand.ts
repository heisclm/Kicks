import { z } from 'zod';

export const CreateBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100).trim(),
  description: z.string().max(500).trim().optional().or(z.literal('')),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});
export type CreateBrandInput = z.infer<typeof CreateBrandSchema>;

export const UpdateBrandSchema = CreateBrandSchema.extend({
  id: z.string().uuid("Invalid brand ID"),
});
export type UpdateBrandInput = z.infer<typeof UpdateBrandSchema>;

export const DeleteBrandSchema = z.object({
  id: z.string().uuid("Invalid brand ID"),
});
