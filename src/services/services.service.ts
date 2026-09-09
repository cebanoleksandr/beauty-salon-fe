import { apiClient } from './client';
import type { PaginatedResult, PaginationQuery, ServiceItem } from '../types/api';

export type CreateServiceDto = Omit<
  ServiceItem,
  'id' | 'createdAt' | 'updatedAt' | 'salon' | 'salonId'
>;
export type UpdateServiceDto = Partial<CreateServiceDto>;

export const servicesService = {
  getBySalon: async (
    salonId: number,
    pagination?: PaginationQuery,
  ): Promise<PaginatedResult<ServiceItem>> => {
    const res = await apiClient.get<PaginatedResult<ServiceItem>>(`/services/salon/${salonId}`, {
      params: pagination,
    });
    return res.data;
  },

  getById: async (id: number): Promise<ServiceItem> => {
    const res = await apiClient.get<ServiceItem>(`/services/${id}`);
    return res.data;
  },

  create: async (salonId: number, data: CreateServiceDto): Promise<ServiceItem> => {
    const res = await apiClient.post<ServiceItem>(`/services/salon/${salonId}`, data);
    return res.data;
  },

  update: async (id: number, data: UpdateServiceDto): Promise<ServiceItem> => {
    const res = await apiClient.patch<ServiceItem>(`/services/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
};
