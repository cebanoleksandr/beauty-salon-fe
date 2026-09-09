import { apiClient } from './client';
import type { AuthResponse, User, UserRole } from '../types/api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phone?: string;
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.data.accessToken) {
      localStorage.setItem('beauty_access_token', res.data.accessToken);
    }
    return res.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.data.accessToken) {
      localStorage.setItem('beauty_access_token', res.data.accessToken);
    }
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  logout: (): void => {
    localStorage.removeItem('beauty_access_token');
  },
};
