import { apiClient } from './client';
import type { Notification } from '../types/api';

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>('/notifications');
    return res.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return res.data;
  },
};
