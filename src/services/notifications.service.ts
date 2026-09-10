import { apiClient } from './client';
import type { Notification, PaginatedResult } from '../types/api';

export const notificationsService = {
  getAll: async (): Promise<PaginatedResult<Notification>> => {
    const res = await apiClient.get<PaginatedResult<Notification>>('/notifications');
    return res.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return res.data;
  },
};
