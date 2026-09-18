"use server";

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { PromotionRepository } from './promotion-repository';
import { promotionSchema } from './promotion-schemas';
import { z } from 'zod';

export async function createPromotionAction(formData: FormData) {
  try {
    await requirePermission('promotions.manage');

    const rawData = {
      code: formData.get('code') as string,
      discount_type: formData.get('discount_type') as string,
      discount_value: formData.get('discount_value'),
      min_order_value: formData.get('min_order_value') || 0,
      start_date: formData.get('start_date') || null,
      end_date: formData.get('end_date') || null,
      usage_limit: formData.get('usage_limit') || null,
      is_active: formData.get('is_active') === 'on' || formData.get('is_active') === 'true'
    };

    const validated = promotionSchema.parse(rawData);
    await PromotionRepository.createPromotion(validated);
    
    revalidatePath('/promotions');
    return { success: true };
  } catch (err: unknown) {
    const error = err as { errors?: { message: string }[] };
    if (error && error.errors && Array.isArray(error.errors)) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}

export async function togglePromotionAction(id: string, is_active: boolean) {
  try {
    await requirePermission('promotions.manage');
    await PromotionRepository.updatePromotion(id, { is_active });
    revalidatePath('/promotions');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}

export async function deletePromotionAction(id: string) {
  try {
    await requirePermission('promotions.manage');
    await PromotionRepository.deletePromotion(id);
    revalidatePath('/promotions');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}
