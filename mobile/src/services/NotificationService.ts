import { supabase } from '../api/supabase';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'Order' | 'Release' | 'Promo' | 'Restock';
  isRead: boolean;
}

class NotificationService {
  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      const { notifications } = require('../data');
      return notifications;
    }

    const { data, error } = await (supabase as any)
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return (data || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      date: n.created_at,
      type: n.type as 'Order' | 'Release' | 'Promo' | 'Restock',
      isRead: n.is_read,
    }));
  }

  async markAsRead(notificationId: string): Promise<void> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return;
    }

    const { error } = await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      return;
    }

    const { error } = await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
