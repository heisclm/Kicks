const { z } = require('zod');
const schema = z.object({
  name: z.string().min(1, "Category name is required").max(100).trim(),
  description: z.string().max(500).trim().optional().or(z.literal('')),
  parent_id: z.string().uuid("Invalid parent category ID").optional().or(z.literal('')),
});
const rawData = { name: 'Basketball', description: '', parent_id: null };
console.log(schema.safeParse(rawData));
