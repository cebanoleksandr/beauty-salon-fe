import { apiClient } from './client';
import type {
  AvailabilityQuery,
  AvailabilitySlot,
  Booking,
  BookingStatus,
  CreateBookingDto,
} from '../types/api';

export const bookingsService = {
  getAvailability: async ({
    masterId,
    serviceIds,
    date,
  }: AvailabilityQuery): Promise<AvailabilitySlot[]> => {
    const query = new URLSearchParams({ masterId: String(masterId), date });
    serviceIds.forEach((id) => query.append('serviceIds[]', String(id)));

    const res = await apiClient.get<AvailabilitySlot[]>(
      `/bookings/availability?${query.toString()}`,
    );
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

  getMasterBookings: async (status?: BookingStatus): Promise<Booking[]> => {
    const res = await apiClient.get<Booking[]>('/bookings/master', {
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  cancel: async (id: string, reason?: string): Promise<Booking> => {
    const res = await apiClient.patch<Booking>(`/bookings/${id}/cancel`, { reason });
    return res.data;
  },
};
