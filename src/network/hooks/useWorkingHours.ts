import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { workingHoursService } from '../../services/working-hours.service';
import type { CreateBlockedTimeDto, SetWorkingHoursDto } from '../../types/api';
import { EQueries } from '../_types';

export const useWorkingHours = (masterId: string) =>
  useQuery({
    queryKey: [EQueries.WORKING_HOURS, masterId],
    queryFn: () => workingHoursService.getByMaster(masterId),
    enabled: !!masterId,
  });

export const useSetWorkingHours = () => {
  return useMutation({
    mutationFn: (data: SetWorkingHoursDto) => workingHoursService.setWorkingHours(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.WORKING_HOURS, data.masterId] });
    },
  });
};

export const useCreateBlockedTime = () => {
  return useMutation({
    mutationFn: (data: CreateBlockedTimeDto) => workingHoursService.createBlockedTime(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.WORKING_HOURS, data.masterId] });
    },
  });
};

export const useDeleteBlockedTime = () => {
  return useMutation({
    mutationFn: (id: string) => workingHoursService.deleteBlockedTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.WORKING_HOURS] });
    },
  });
};
