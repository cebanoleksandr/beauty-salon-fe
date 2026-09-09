import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../queryClient';
import { notificationsService } from '../../services/notifications.service';
import { EQueries } from '../_types';

export const useNotifications = () =>
  useQuery({
    queryKey: [EQueries.NOTIFICATIONS],
    queryFn: notificationsService.getAll,
  });

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.NOTIFICATIONS] });
    },
  });
};
