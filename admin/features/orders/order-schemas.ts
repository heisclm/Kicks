import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  id: z.string().uuid("Invalid order ID"),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], {
    error: "Please select a valid order status"
  })
});
