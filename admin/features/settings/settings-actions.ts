"use server";

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { SettingsRepository } from './settings-repository';
import { storeSettingsSchema } from './settings-schemas';

export async function updateSettingsAction(formData: FormData) {
  try {
    await requirePermission('settings.manage');

    const rawData = {
      store_name: formData.get('store_name') as string,
      contact_email: formData.get('contact_email') as string,
      store_address: formData.get('store_address') as string,
      default_currency: formData.get('default_currency') as string,
      timezone: formData.get('timezone') as string,
    };

    const validated = storeSettingsSchema.parse(rawData);
    await SettingsRepository.updateSettings(validated);
    
    revalidatePath('/settings');
    return { success: true };
  } catch (err: unknown) {
    const error = err as { errors?: { message: string }[] };
    if (error && error.errors && Array.isArray(error.errors)) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}
