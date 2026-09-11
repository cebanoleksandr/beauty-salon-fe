import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../network/hooks/useAuth';
import { useMyBookings } from '../network/hooks/useBookings';
import type { BookingStatus } from '../types/api';

const STATUS_COLOR: Record<BookingStatus, 'warning' | 'success' | 'default' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'default',
  CANCELLED: 'error',
};

const UPCOMING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED'];
const UPCOMING_PREVIEW_LIMIT = 3;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const ROLE_REDIRECTS: Partial<Record<string, string>> = {
  MASTER: '/master/dashboard',
  SALON_OWNER: '/join-requests',
  ADMIN: '/salons',
};

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: bookings, isLoading: isBookingsLoading } = useMyBookings();

  const redirectTo = profile ? ROLE_REDIRECTS[profile.role] : undefined;

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [redirectTo, navigate]);

  if (isProfileLoading || redirectTo) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  const upcomingBookings = (bookings ?? [])
    .filter((booking) => UPCOMING_STATUSES.includes(booking.status))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, UPCOMING_PREVIEW_LIMIT);

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {t('home.greeting', { name: profile?.firstName })}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t('home.subtitle')}</p>
      </div>

      <Button component={RouterLink} to="/salons" variant="contained" className="self-start">
        {t('home.browseSalons')}
      </Button>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('home.upcomingBookings')}</h2>

        {isBookingsLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isBookingsLoading && upcomingBookings.length === 0 && (
          <p className="text-slate-500 text-sm">{t('home.noUpcomingBookings')}</p>
        )}

        <div className="flex flex-col gap-3">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">
                  {formatDateTime(booking.startAt)}
                </p>
                <Chip
                  size="small"
                  label={t(`bookings.status.${booking.status}`)}
                  color={STATUS_COLOR[booking.status]}
                />
              </div>
              {booking.master && (
                <p className="text-sm text-slate-600">
                  {booking.master.firstName} {booking.master.lastName}
                </p>
              )}
            </div>
          ))}
        </div>

        {upcomingBookings.length > 0 && (
          <RouterLink to="/bookings/my" className="text-sm text-sky-600 hover:underline mt-2 inline-block">
            {t('home.viewAllBookings')}
          </RouterLink>
        )}
      </section>
    </div>
  );
}
