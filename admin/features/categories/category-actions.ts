'use server';
import { requirePermission } from '../../lib/auth/guards';
import { CategoryRepository, Category } from './category-repository';
import { CreateCategorySchema, UpdateCategorySchema, DeleteCategorySchema } from '../../lib/validation/category';
import { handleActionError } from '../../lib/errors/handle-action-error';
import { revalidatePath } from 'next/cache';

export type ActionState<T> = { success: boolean; data?: T; error?: string; };

export async function createCategoryAction(formData: FormData): Promise<ActionState<Category>> {
  try {
    await requirePermission('categories.create');
    const rawData = { name: formData.get('name'), description: formData.get('description') || '', parent_id: formData.get('parent_id') || undefined };
    const validated = CreateCategorySchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const category = await CategoryRepository.createCategory(validated.data);
    revalidatePath('/categories');
    revalidatePath('/products/new');
    return { success: true, data: category };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to create category') }; }
}

export async function updateCategoryAction(formData: FormData): Promise<ActionState<Category>> {
  try {
    await requirePermission('categories.update');
    const rawData = { id: formData.get('id'), name: formData.get('name'), description: formData.get('description') || '', parent_id: formData.get('parent_id') || undefined };
    const validated = UpdateCategorySchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const category = await CategoryRepository.updateCategory(validated.data);
    revalidatePath('/categories');
    revalidatePath('/products/new');
    return { success: true, data: category };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to update category') }; }
}

export async function deleteCategoryAction(formData: FormData): Promise<ActionState<void>> {
  try {
    await requirePermission('categories.delete');
    const validated = DeleteCategorySchema.safeParse({ id: formData.get('id') });
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    await CategoryRepository.deleteCategory(validated.data.id);
    revalidatePath('/categories');
    revalidatePath('/products/new');
    return { success: true };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to delete category') }; }
}
