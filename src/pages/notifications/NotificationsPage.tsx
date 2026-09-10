import { useTranslation } from 'react-i18next';
import { useMarkNotificationAsRead, useNotifications } from '../../network/hooks/useNotifications';
import type { Notification } from '../../types/api';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function NotificationCard({ notification }: { notification: Notification }) {
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  return (
    <div
      className={`rounded-xl shadow-sm p-4 flex flex-col gap-1 cursor-pointer transition-colors ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      }`}
      onClick={() => {
        if (!notification.isRead) markAsRead(notification.id);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
      </div>
      <p className="text-sm text-slate-600">{notification.message}</p>
      <p className="text-xs text-slate-400">{formatDateTime(notification.createdAt)}</p>
    </div>
  );
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useNotifications();
  const notifications = data?.items ?? [];

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('notifications.title')}</h1>

      {isLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

      {!isLoading && notifications.length === 0 && (
        <p className="text-slate-500 text-sm">{t('notifications.empty')}</p>
      )}

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
