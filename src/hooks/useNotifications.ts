import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/NotificationService';
import { useAuthStore } from '../store/useAuthStore';

export function useNotifications() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated');
      return notificationService.getNotifications(user.id);
    },
    enabled: !!user,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      }
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated');
      return notificationService.markAllAsRead(user.id);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      }
    },
  });
}
