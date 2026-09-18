'use server';
import { requirePermission } from '../../lib/auth/guards';
import { ProductRepository } from './product-repository';
import { Product } from './product-types';
import { CreateProductSchema, UpdateProductSchema, DeleteProductSchema } from '../../lib/validation/product';
import { handleActionError } from '../../lib/errors/handle-action-error';
import { revalidatePath } from 'next/cache';

export type ActionState<T> = { success: boolean; data?: T; error?: string; };

export async function createProductAction(formData: FormData): Promise<ActionState<Product>> {
  try {
    await requirePermission('products.create');
    const rawData = { 
      name: formData.get('name'), 
      description: formData.get('description'), 
      brand_id: formData.get('brand_id'),
      category_id: formData.get('category_id'),
      base_price: formData.get('base_price'),
      is_active: formData.get('is_active') === 'true'
    };
    const validated = CreateProductSchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const product = await ProductRepository.createProduct(validated.data);
    revalidatePath('/products');
    return { success: true, data: product };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to create product') }; }
}

export async function updateProductAction(formData: FormData): Promise<ActionState<Product>> {
  try {
    await requirePermission('products.update');
    const rawData = { 
      id: formData.get('id'),
      name: formData.get('name'), 
      description: formData.get('description'), 
      brand_id: formData.get('brand_id'),
      category_id: formData.get('category_id'),
      base_price: formData.get('base_price'),
      is_active: formData.get('is_active') === 'true'
    };
    const validated = UpdateProductSchema.safeParse(rawData);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    const product = await ProductRepository.updateProduct(validated.data);
    revalidatePath('/products');
    return { success: true, data: product };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to update product') }; }
}

export async function deleteProductAction(formData: FormData): Promise<ActionState<void>> {
  try {
    await requirePermission('products.delete');
    const validated = DeleteProductSchema.safeParse({ id: formData.get('id') });
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };
    await ProductRepository.deleteProduct(validated.data.id);
    revalidatePath('/products');
    return { success: true };
  } catch (e) { return { success: false, error: handleActionError(e, 'Failed to delete product') }; }
}
