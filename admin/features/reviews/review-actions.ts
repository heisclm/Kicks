"use server";

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { ReviewRepository } from './review-repository';

export async function deleteReviewAction(id: string) {
  try {
    await requirePermission('reviews.manage');
    await ReviewRepository.deleteReview(id);
    revalidatePath('/reviews');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}
