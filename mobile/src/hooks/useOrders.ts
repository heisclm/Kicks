import { useQuery } from '@tanstack/react-query';
import { orderRepository } from '../services/OrderRepository';
import { useAuthStore } from '../store/useAuthStore';

export function useOrders() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated');
      return orderRepository.getOrders(user.id);
    },
    enabled: !!user,
  });
}
