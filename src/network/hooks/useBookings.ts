import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { bookingsService } from '../../services/bookings.service';
import type { AvailabilityQuery, BookingStatus, CreateBookingDto } from '../../types/api';
import { EQueries } from '../_types';

export const useAvailability = (params: AvailabilityQuery) =>
  useQuery({
    queryKey: [EQueries.BOOKINGS_AVAILABILITY, params],
    queryFn: () => bookingsService.getAvailability(params),
    enabled: !!params.masterId && params.serviceIds.length > 0 && !!params.date,
  });

export const useMyBookings = () =>
  useQuery({
    queryKey: [EQueries.BOOKINGS_MY],
    queryFn: bookingsService.getMyBookings,
  });

export const useMasterBookings = (status?: BookingStatus) =>
  useQuery({
    queryKey: [EQueries.BOOKINGS_MASTER, status],
    queryFn: () => bookingsService.getMasterBookings(status),
  });

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_MY] });
      queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_MASTER] });
      queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_AVAILABILITY] });
    },
  });
};

const invalidateBookings = () => {
  queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_MY] });
  queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_MASTER] });
  queryClient.invalidateQueries({ queryKey: [EQueries.BOOKINGS_AVAILABILITY] });
};

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsService.cancelByClient(id, reason),
    onSuccess: invalidateBookings,
  });
};

export const useCancelBookingByMaster = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsService.cancelByMaster(id, reason),
    onSuccess: invalidateBookings,
  });
};

export const useConfirmBooking = () => {
  return useMutation({
    mutationFn: (id: string) => bookingsService.confirm(id),
    onSuccess: invalidateBookings,
  });
};

export const useCompleteBooking = () => {
  return useMutation({
    mutationFn: (id: string) => bookingsService.complete(id),
    onSuccess: invalidateBookings,
  });
};
