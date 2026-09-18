'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { handleActionError } from '../../lib/errors/handle-action-error';
import { InventoryRepository } from './inventory-repository';
import { stockAdjustmentSchema } from './inventory-schemas';

export async function adjustInventoryAction(formData: FormData) {
  try {
    // 1. Verify Authentication & Authorization
    await requirePermission('inventory.update');

    // 2. Validate input
    const quantity_change = parseInt(formData.get('quantity_change') as string, 10);
    const validatedData = stockAdjustmentSchema.parse({
      variant_id: formData.get('variant_id'),
      quantity_change: isNaN(quantity_change) ? 0 : quantity_change,
      reason: formData.get('reason'),
      note: formData.get('note') || undefined,
    });

    // 3. Perform the secure atomic DB adjustment
    const result = await InventoryRepository.adjustStock(validatedData);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // 4. Revalidate cache
    revalidatePath('/inventory');
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    return { success: false, error: handleActionError(error) };
  }
}
