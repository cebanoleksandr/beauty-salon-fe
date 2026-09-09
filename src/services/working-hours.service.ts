import { apiClient } from './client';
import type {
  BlockedTime,
  CreateBlockedTimeDto,
  SetWorkingHoursDto,
  WorkingHour,
} from '../types/api';

export const workingHoursService = {
  getByMaster: async (masterId: string): Promise<WorkingHour[]> => {
    const res = await apiClient.get<WorkingHour[]>(`/working-hours/master/${masterId}`);
    return res.data;
  },

  setWorkingHours: async (data: SetWorkingHoursDto): Promise<WorkingHour> => {
    const res = await apiClient.post<WorkingHour>('/working-hours', data);
    return res.data;
  },

  createBlockedTime: async (data: CreateBlockedTimeDto): Promise<BlockedTime> => {
    const res = await apiClient.post<BlockedTime>('/blocked-times', data);
    return res.data;
  },

  deleteBlockedTime: async (id: string): Promise<void> => {
    await apiClient.delete(`/blocked-times/${id}`);
  },
};
