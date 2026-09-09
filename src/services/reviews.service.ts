import { apiClient } from './client';
import type { CreateReviewDto, Review } from '../types/api';

export const reviewsService = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    const res = await apiClient.post<Review>('/reviews', data);
    return res.data;
  },

  getBySalon: async (salonId: string): Promise<Review[]> => {
    const res = await apiClient.get<Review[]>(`/reviews/salon/${salonId}`);
    return res.data;
  },
};
