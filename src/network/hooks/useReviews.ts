import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { reviewsService } from '../../services/reviews.service';
import type { CreateReviewDto } from '../../types/api';
import { EQueries } from '../_types';

export const useSalonReviews = (salonId: string) =>
  useQuery({
    queryKey: [EQueries.REVIEWS_SALON, salonId],
    queryFn: () => reviewsService.getBySalon(salonId),
    enabled: !!salonId,
  });

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (data: CreateReviewDto) => reviewsService.create(data),
    onSuccess: (_, data) => {
      if (data.salonId) {
        queryClient.invalidateQueries({ queryKey: [EQueries.REVIEWS_SALON, data.salonId] });
      }
    },
  });
};
