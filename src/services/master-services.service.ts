import { apiClient } from './client';
import type { MasterService } from '../types/api';

export const masterServicesService = {
  getByMaster: async (masterId: number): Promise<MasterService[]> => {
    const res = await apiClient.get<MasterService[]>(`/master-services/master/${masterId}`);
    return res.data;
  },

  getMy: async (): Promise<MasterService[]> => {
    const res = await apiClient.get<MasterService[]>('/master-services/my');
    return res.data;
  },

  assign: async (serviceId: number): Promise<MasterService> => {
    const res = await apiClient.post<MasterService>(`/master-services/${serviceId}`);
    return res.data;
  },

  remove: async (serviceId: number): Promise<void> => {
    await apiClient.delete(`/master-services/${serviceId}`);
  },
};
