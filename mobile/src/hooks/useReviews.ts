import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/ReviewService';
import { useAuthStore } from '../store/useAuthStore';

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
  });
}

export function useReviewEligibility(productId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['reviewEligibility', user?.id, productId],
    queryFn: () => {
      if (!user) return null;
      return reviewService.canUserReview(user.id, productId);
    },
    enabled: !!user && !!productId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      userId: string;
      productId: string;
      orderItemId: string;
      rating: number;
      comment: string;
    }) => reviewService.addReview(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviewEligibility', variables.userId, variables.productId] });
    },
  });
}
