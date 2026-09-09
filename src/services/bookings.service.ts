import { apiClient } from './client';
import type { AvailabilityQuery, Booking, CreateBookingDto } from '../types/api';

export const bookingsService = {
  getAvailability: async (params: AvailabilityQuery): Promise<string[]> => {
    const res = await apiClient.get<string[]>('/bookings/availability', { params });
    return res.data;
  },

  create: async (data: CreateBookingDto): Promise<Booking> => {
    const res = await apiClient.post<Booking>('/bookings', data);
    return res.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get<Booking[]>('/bookings/my');
    return res.data;
  },

  cancel: async (id: string, reason?: string): Promise<Booking> => {
    const res = await apiClient.patch<Booking>(`/bookings/${id}/cancel`, { reason });
    return res.data;
  },
};
