'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { handleActionError } from '../../lib/errors/handle-action-error';
import { OrderRepository } from './order-repository';
import { updateOrderStatusSchema } from './order-schemas';

export async function updateOrderStatusAction(formData: FormData) {
  try {
    await requirePermission('orders.manage');

    const validatedData = updateOrderStatusSchema.parse({
      id: formData.get('id'),
      status: formData.get('status'),
    });

    const result = await OrderRepository.updateOrderStatus(validatedData.id, validatedData.status);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath('/orders');
    revalidatePath(`/orders/${validatedData.id}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: handleActionError(error) };
  }
}
