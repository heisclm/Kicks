'use server';
import { requirePermission } from '../../lib/auth/guards';
import { BrandRepository, Brand } from './brand-repository';
import { CreateBrandSchema, UpdateBrandSchema, DeleteBrandSchema } from '../../lib/validation/brand';
import { handleActionError } from '../../lib/errors/handle-action-error';
import { revalidatePath } from 'next/cache';

export type ActionState<T> = { success: boolean; data?: T; error?: string; };

export async function createBrandAction(formData: FormData): Promise<ActionState<Brand>> {
  try {
    await requirePermission('brands.create');
    const rawData = { name: formData.get('name'), description: formData.get('description'), logo_url: formData.get('logo_url') };
    const validated = CreateBrandSchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const brand = await BrandRepository.createBrand(validated.data);
    revalidatePath('/brands');
    revalidatePath('/products/new');
    return { success: true, data: brand };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to create brand') }; }
}

export async function updateBrandAction(formData: FormData): Promise<ActionState<Brand>> {
  try {
    await requirePermission('brands.update');
    const rawData = { id: formData.get('id'), name: formData.get('name'), description: formData.get('description'), logo_url: formData.get('logo_url') };
    const validated = UpdateBrandSchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const brand = await BrandRepository.updateBrand(validated.data);
    revalidatePath('/brands');
    revalidatePath('/products/new');
    return { success: true, data: brand };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to update brand') }; }
}

export async function deleteBrandAction(formData: FormData): Promise<ActionState<void>> {
  try {
    await requirePermission('brands.delete');
    const validated = DeleteBrandSchema.safeParse({ id: formData.get('id') });
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    await BrandRepository.deleteBrand(validated.data.id);
    revalidatePath('/brands');
    revalidatePath('/products/new');
    return { success: true };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to delete brand') }; }
}
