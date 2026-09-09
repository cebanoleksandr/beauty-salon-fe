import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import {
  servicesService,
  type CreateServiceDto,
  type UpdateServiceDto,
} from '../../services/services.service';
import type { PaginationQuery } from '../../types/api';
import { EQueries } from '../_types';

export const useServicesBySalon = (salonId: number, pagination?: PaginationQuery) =>
  useQuery({
    queryKey: [EQueries.SERVICES, salonId, pagination],
    queryFn: () => servicesService.getBySalon(salonId, pagination),
    enabled: !!salonId,
  });

export const useService = (id: number) =>
  useQuery({
    queryKey: [EQueries.SERVICES, id],
    queryFn: () => servicesService.getById(id),
    enabled: !!id,
  });

export const useCreateService = () => {
  return useMutation({
    mutationFn: ({ salonId, data }: { salonId: number; data: CreateServiceDto }) =>
      servicesService.create(salonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};

export const useUpdateService = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceDto }) =>
      servicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: (id: number) => servicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SERVICES] });
    },
  });
};
