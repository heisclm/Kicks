import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  variant_id: z.string().uuid("Invalid variant ID"),
  quantity_change: z.number().int().refine(val => val !== 0, {
    message: "Adjustment quantity cannot be zero",
  }),
  reason: z.enum([
    "New shipment",
    "Restock",
    "Damaged",
    "Lost",
    "Returned",
    "Manual correction",
    "Inventory count",
    "Other"
  ], {
    error: "Please select a valid adjustment reason"
  }),
  note: z.string().max(500).optional(),
});
