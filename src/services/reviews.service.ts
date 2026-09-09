import { apiClient } from './client';
import type { CreateReviewDto, Review, SalonReviewsResult } from '../types/api';

export const reviewsService = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    const res = await apiClient.post<Review>('/reviews', data);
    return res.data;
  },

  getBySalon: async (salonId: string): Promise<SalonReviewsResult> => {
    const res = await apiClient.get<SalonReviewsResult>(`/reviews/salon/${salonId}`);
    return res.data;
  },
};
