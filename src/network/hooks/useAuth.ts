import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { authService, type LoginDto, type RegisterDto } from '../../services/auth.service';
import { EQueries } from '../_types';

export const useProfile = () =>
  useQuery({
    queryKey: [EQueries.PROFILE],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('beauty_access_token'),
  });

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.PROFILE] });
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.PROFILE] });
    },
  });

export const useLogout = () => {
  return () => {
    authService.logout();
    queryClient.invalidateQueries({ queryKey: [EQueries.PROFILE] });
  };
};
