"use server";

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { NotificationRepository } from './notification-repository';
import { notificationSchema } from './notification-schemas';
import { z } from 'zod';

export async function createNotificationAction(formData: FormData) {
  try {
    await requirePermission('notifications.send');

    const rawData = {
      user_id: formData.get('user_id') || null,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
    };

    const validated = notificationSchema.parse(rawData);
    await NotificationRepository.createNotification(validated);
    
    revalidatePath('/notifications');
    return { success: true };
  } catch (err: unknown) {
    const error = err as { errors?: { message: string }[] };
    if (error && error.errors && Array.isArray(error.errors)) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function deleteNotificationAction(id: string) {
  try {
    await requirePermission('notifications.send');
    await NotificationRepository.deleteNotification(id);
    revalidatePath('/notifications');
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}
