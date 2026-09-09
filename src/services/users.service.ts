import type { User } from "../types/api";
import { apiClient } from "./client";

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const usersService = {
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const res = await apiClient.patch<User>('/users/me', data);
    return res.data;
  },
};
