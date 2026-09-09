import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { mastersService } from '../../services/masters.service';
import { EQueries } from '../_types';

export const useMasters = (salonId?: string) =>
  useQuery({
    queryKey: [EQueries.MASTERS, salonId],
    queryFn: () => mastersService.getAll(salonId),
  });

export const useMaster = (id: number) =>
  useQuery({
    queryKey: [EQueries.MASTER, id],
    queryFn: () => mastersService.getById(id),
    enabled: !!id,
  });

export const useAssignService = () => {
  return useMutation({
    mutationFn: ({
      masterId,
      serviceId,
      customPrice,
      customDuration,
    }: {
      masterId: number;
      serviceId: string;
      customPrice?: number;
      customDuration?: number;
    }) => mastersService.assignService(masterId, serviceId, customPrice, customDuration),
    onSuccess: (_, { masterId }) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTER, masterId] });
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTERS] });
    },
  });
};
