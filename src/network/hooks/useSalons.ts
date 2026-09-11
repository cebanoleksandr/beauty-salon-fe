import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import {
  salonsService,
  type CreateSalonDto,
  type SearchSalonsQueryDto,
  type UpdateSalonDto,
} from '../../services/salons.service';
import type { NearbySalonsQuery, PaginationQuery } from '../../types/api';
import { EQueries } from '../_types';

export const useSalons = (params?: PaginationQuery) =>
  useQuery({
    queryKey: [EQueries.SALONS, params],
    queryFn: () => salonsService.getAll(params),
  });

export const useMySalons = () =>
  useQuery({
    queryKey: [EQueries.SALONS_MY],
    queryFn: salonsService.getMy,
  });

export const useNearbySalons = (params: NearbySalonsQuery) =>
  useQuery({
    queryKey: [EQueries.SALONS_NEARBY, params],
    queryFn: () => salonsService.getNearby(params),
    enabled: !!params.lat && !!params.lng,
  });

export const useSearchSalons = (params: SearchSalonsQueryDto) =>
  useQuery({
    queryKey: [EQueries.SALONS_SEARCH, params],
    queryFn: () => salonsService.search(params),
    enabled: !!params.q,
  });

export const useSalon = (id: string) =>
  useQuery({
    queryKey: [EQueries.SALON, id],
    queryFn: () => salonsService.getById(id),
    enabled: !!id,
  });

export const useCreateSalon = () => {
  return useMutation({
    mutationFn: (data: CreateSalonDto) => salonsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS_MY] });
    },
  });
};

export const useUpdateSalon = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalonDto }) =>
      salonsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS_MY] });
      queryClient.invalidateQueries({ queryKey: [EQueries.SALON, updated.id] });
    },
  });
};

export const useDeleteSalon = () => {
  return useMutation({
    mutationFn: (id: string) => salonsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.SALONS_MY] });
    },
  });
};
