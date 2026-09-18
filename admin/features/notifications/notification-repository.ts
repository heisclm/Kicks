import { createClient } from '../../utils/supabase/server';
import { Notification, CreateNotificationInput } from './notification-types';

export class NotificationRepository {
  static async getNotifications(): Promise<Notification[]> {
    const supabase = await createClient();
    
    // Admins can see all notifications to manage them
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Notification[];
  }

  static async createNotification(input: CreateNotificationInput): Promise<Notification> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Notification;
  }

  static async deleteNotification(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
