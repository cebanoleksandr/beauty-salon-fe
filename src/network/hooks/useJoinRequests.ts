import { useMutation } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { joinRequestsService } from '../../services/join-requests.service';
import { EQueries } from '../_types';

export const useCreateJoinRequest = () => {
  return useMutation({
    mutationFn: ({ salonId, message }: { salonId: string; message?: string }) =>
      joinRequestsService.create(salonId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.JOIN_REQUESTS] });
    },
  });
};

export const useApproveJoinRequest = () => {
  return useMutation({
    mutationFn: (id: string) => joinRequestsService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.JOIN_REQUESTS] });
    },
  });
};

export const useRejectJoinRequest = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      joinRequestsService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.JOIN_REQUESTS] });
    },
  });
};
