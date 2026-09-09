import { apiClient } from './client';
import type {
  NearbySalonsQuery,
  PaginatedResult,
  PaginationQuery,
  Salon,
} from '../types/api';

export type CreateSalonDto = Omit<Salon, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;
export type UpdateSalonDto = Partial<CreateSalonDto>;

export const salonsService = {
  getAll: async (params?: PaginationQuery): Promise<PaginatedResult<Salon>> => {
    const res = await apiClient.get<PaginatedResult<Salon>>('/salons', { params });
    return res.data;
  },

  getNearby: async (params: NearbySalonsQuery): Promise<Salon[]> => {
    const res = await apiClient.get<Salon[]>('/salons/nearby', { params });
    return res.data;
  },

  getById: async (id: string): Promise<Salon> => {
    const res = await apiClient.get<Salon>(`/salons/${id}`);
    return res.data;
  },

  create: async (data: CreateSalonDto): Promise<Salon> => {
    const res = await apiClient.post<Salon>('/salons', data);
    return res.data;
  },

  update: async (id: string, data: UpdateSalonDto): Promise<Salon> => {
    const res = await apiClient.patch<Salon>(`/salons/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/salons/${id}`);
  },
};
