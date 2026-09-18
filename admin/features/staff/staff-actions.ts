"use server";

import { revalidatePath } from 'next/cache';
import { requirePermission } from '../../lib/auth/guards';
import { StaffRepository } from './staff-repository';
import { AppRole } from './staff-types';

export async function assignRoleAction(userId: string, role: string) {
  try {
    await requirePermission('staff.manage');
    await StaffRepository.assignRole(userId, role as AppRole);
    revalidatePath('/staff');
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}
