import { z } from 'zod';

export const notificationSchema = z.object({
  user_id: z.string().uuid().nullable().optional(),
  title: z.string().min(3).max(100),
  message: z.string().min(3).max(500)
});
