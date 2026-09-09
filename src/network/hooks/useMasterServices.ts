import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { masterServicesService } from '../../services/master-services.service';
import { EQueries } from '../_types';

export const useMasterServices = (masterId: number) =>
  useQuery({
    queryKey: [EQueries.MASTER_SERVICES, masterId],
    queryFn: () => masterServicesService.getByMaster(masterId),
    enabled: !!masterId,
  });

export const useMyMasterServices = () =>
  useQuery({
    queryKey: [EQueries.MASTER_SERVICES_MY],
    queryFn: masterServicesService.getMy,
  });

export const useAssignMasterService = () => {
  return useMutation({
    mutationFn: (serviceId: number) => masterServicesService.assign(serviceId),
    onSuccess: (assigned) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTER_SERVICES, assigned.masterId] });
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTER_SERVICES_MY] });
    },
  });
};

export const useRemoveMasterService = () => {
  return useMutation({
    mutationFn: (serviceId: number) => masterServicesService.remove(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTER_SERVICES] });
      queryClient.invalidateQueries({ queryKey: [EQueries.MASTER_SERVICES_MY] });
    },
  });
};
