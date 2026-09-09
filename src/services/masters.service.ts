import { apiClient } from './client';
import type { MasterProfile, PaginatedResult } from '../types/api';

export const mastersService = {
  getAll: async (salonId?: string): Promise<PaginatedResult<MasterProfile>> => {
    const res = await apiClient.get<PaginatedResult<MasterProfile>>('/masters', {
      params: { salonId },
    });
    return res.data;
  },

  getById: async (id: number): Promise<MasterProfile> => {
    const res = await apiClient.get<MasterProfile>(`/masters/${id}`);
    return res.data;
  },
};
