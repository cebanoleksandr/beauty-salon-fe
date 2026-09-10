import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { joinRequestsService } from '../../services/join-requests.service';
import { EQueries } from '../_types';

const invalidateJoinRequests = () => {
  queryClient.invalidateQueries({ queryKey: [EQueries.JOIN_REQUESTS] });
  queryClient.invalidateQueries({ queryKey: [EQueries.JOIN_REQUESTS_MY] });
};

export const useCreateJoinRequest = () => {
  return useMutation({
    mutationFn: ({ salonId }: { salonId: string }) => joinRequestsService.create(salonId),
    onSuccess: invalidateJoinRequests,
  });
};

export const useMyJoinRequests = () =>
  useQuery({
    queryKey: [EQueries.JOIN_REQUESTS_MY],
    queryFn: joinRequestsService.getMy,
  });

export const useCancelJoinRequest = () => {
  return useMutation({
    mutationFn: (id: string) => joinRequestsService.cancel(id),
    onSuccess: invalidateJoinRequests,
  });
};

export const useSalonJoinRequests = (salonId: string) =>
  useQuery({
    queryKey: [EQueries.JOIN_REQUESTS, salonId],
    queryFn: () => joinRequestsService.getBySalon(salonId),
    enabled: !!salonId,
  });

export const useAcceptJoinRequest = () => {
  return useMutation({
    mutationFn: (id: string) => joinRequestsService.accept(id),
    onSuccess: invalidateJoinRequests,
  });
};

export const useRejectJoinRequest = () => {
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason?: string }) =>
      joinRequestsService.reject(id, rejectionReason),
    onSuccess: invalidateJoinRequests,
  });
};
