import { apiClient } from './client';
import type { SalonJoinRequest } from '../types/api';

export const joinRequestsService = {
  create: async (salonId: string, message?: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.post<SalonJoinRequest>('/salon-join-requests', { salonId, message });
    return res.data;
  },

  approve: async (id: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.patch<SalonJoinRequest>(`/salon-join-requests/${id}/approve`);
    return res.data;
  },

  reject: async (id: string, reason?: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.patch<SalonJoinRequest>(`/salon-join-requests/${id}/reject`, { reason });
    return res.data;
  },
};
