import { apiClient } from './client';
import type { SalonJoinRequest } from '../types/api';

export const joinRequestsService = {
  create: async (salonId: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.post<SalonJoinRequest>('/salon-join-requests', { salonId });
    return res.data;
  },

  getMy: async (): Promise<SalonJoinRequest[]> => {
    const res = await apiClient.get<SalonJoinRequest[]>('/salon-join-requests/my');
    return res.data;
  },

  cancel: async (id: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.patch<SalonJoinRequest>(`/salon-join-requests/${id}/cancel`);
    return res.data;
  },

  getBySalon: async (salonId: string): Promise<SalonJoinRequest[]> => {
    const res = await apiClient.get<SalonJoinRequest[]>(`/salon-join-requests/salon/${salonId}`);
    return res.data;
  },

  accept: async (id: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.patch<SalonJoinRequest>(`/salon-join-requests/${id}/accept`);
    return res.data;
  },

  reject: async (id: string, rejectionReason?: string): Promise<SalonJoinRequest> => {
    const res = await apiClient.patch<SalonJoinRequest>(`/salon-join-requests/${id}/reject`, {
      rejectionReason,
    });
    return res.data;
  },
};
