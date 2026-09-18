import { createClient } from '../../utils/supabase/server';
import { StaffMember, AppRole } from './staff-types';

export class StaffRepository {
  static async getStaff(): Promise<StaffMember[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('admin_get_staff');

    if (error) {
      console.error("Error fetching staff:", error);
      return [];
    }

    return data as StaffMember[];
  }

  static async assignRole(userId: string, role: AppRole): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.rpc('admin_assign_role', {
      p_user_id: userId,
      p_role: role
    });

    if (error) throw new Error(error.message);
  }
}
