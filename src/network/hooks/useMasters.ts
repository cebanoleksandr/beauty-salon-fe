import { useQuery } from '@tanstack/react-query';
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
