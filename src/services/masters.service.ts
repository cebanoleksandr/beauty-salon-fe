import { apiClient } from './client';
import type { MasterProfile, MasterService } from '../types/api';

export interface AssignServiceDto {
  masterId: string;
  serviceId: string;
  customPrice?: number;
  customDuration?: number;
}

export const mastersService = {
  getAll: async (salonId?: string): Promise<MasterProfile[]> => {
    const res = await apiClient.get<MasterProfile[]>('/masters', { params: { salonId } });
    return res.data;
  },

  getById: async (id: string): Promise<MasterProfile> => {
    const res = await apiClient.get<MasterProfile>(`/masters/${id}`);
    return res.data;
  },

  assignService: async (
    masterId: string,
    serviceId: string,
    customPrice?: number,
    customDuration?: number,
  ): Promise<MasterService> => {
    const res = await apiClient.post<MasterService>('/master-services', {
      masterId,
      serviceId,
      customPrice,
      customDuration,
    });
    return res.data;
  },
};
