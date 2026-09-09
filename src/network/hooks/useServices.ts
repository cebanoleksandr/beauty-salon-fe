import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import {
  servicesService,
  type CreateServiceDto,
  type UpdateServiceDto,
} from '../../services/services.service';
import { EQueries } from '../_types';

export const useServices = (salonId?: string) =>
  useQuery({
    queryKey: [EQueries.SERVICES, salonId],
    queryFn: () => servicesService.getAll(salonId),
  });

export const useCreateService = () => {
  return useMutation({
    mutationFn: (data: CreateServiceDto) => servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};

export const useUpdateService = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) =>
      servicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};
