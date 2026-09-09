import { apiClient } from './client';
import type { ServiceItem } from '../types/api';

export type CreateServiceDto = Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt' | 'salon'>;
export type UpdateServiceDto = Partial<CreateServiceDto>;

export const servicesService = {
  getAll: async (salonId?: string): Promise<ServiceItem[]> => {
    const res = await apiClient.get<ServiceItem[]>('/services', { params: { salonId } });
    return res.data;
  },

  create: async (data: CreateServiceDto): Promise<ServiceItem> => {
    const res = await apiClient.post<ServiceItem>('/services', data);
    return res.data;
  },

  update: async (id: string, data: UpdateServiceDto): Promise<ServiceItem> => {
    const res = await apiClient.patch<ServiceItem>(`/services/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
};
