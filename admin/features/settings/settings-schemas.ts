import { z } from 'zod';

export const storeSettingsSchema = z.object({
  store_name: z.string().min(2, "Store name must be at least 2 characters").max(100),
  contact_email: z.string().email("Valid email is required"),
  store_address: z.string().max(255),
  default_currency: z.enum(['USD', 'EUR', 'GBP']),
  timezone: z.string().min(2).max(50),
});
