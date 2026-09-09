import { useMutation } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { usersService, type UpdateProfileDto } from '../../services/users.service';
import { EQueries } from '../_types';

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data: UpdateProfileDto) => usersService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.PROFILE] });
    },
  });
