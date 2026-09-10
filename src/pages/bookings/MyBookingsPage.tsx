import { useState } from 'react';
import { Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCancelBooking, useMyBookings } from '../../network/hooks/useBookings';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import type { Booking, BookingStatus } from '../../types/api';

const STATUS_COLOR: Record<BookingStatus, 'warning' | 'success' | 'default' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'default',
  CANCELLED: 'error',
};

const CANCELLABLE_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function BookingCard({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const handleCancel = () => {
    cancelBooking(
      { id: booking.id },
      {
        onSuccess: () => {
          dispatch(setAlertAC({ text: 'bookings.cancelSuccess', mode: 'success' }));
        },
        onError: () => {
          dispatch(setAlertAC({ text: 'bookings.cancelError', mode: 'error' }));
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{formatDateTime(booking.startAt)}</p>
          {booking.master?.firstName && booking.master?.lastName && (
            <p className="text-sm text-slate-600">
              {booking.master.firstName} {booking.master.lastName}
            </p>
          )}
        </div>
        <Chip
          size="small"
          label={t(`bookings.status.${booking.status}`)}
          color={STATUS_COLOR[booking.status]}
        />
      </div>

      {booking.services.length > 0 && (
        <ul className="text-sm text-slate-600 flex flex-col gap-1">
          {booking.services.map((item) => (
            <li key={item.id}>{item.serviceName ?? item.serviceId}</li>
          ))}
        </ul>
      )}

      <p className="text-sm text-slate-600">
        {t('bookings.total')}: <strong>{booking.totalPrice} ₴</strong>
      </p>

      {booking.comment && <p className="text-sm text-slate-500 italic">{booking.comment}</p>}

      {CANCELLABLE_STATUSES.includes(booking.status) && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleCancel}
          disabled={isPending}
        >
          {t('bookings.cancel')}
        </Button>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const { t } = useTranslation();
  const { data: bookings, isLoading } = useMyBookings();
  const [showPast, setShowPast] = useState(false);

  const filtered = (bookings ?? []).filter(
    (booking) => showPast || booking.status === 'PENDING' || booking.status === 'CONFIRMED',
  );

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{t('bookings.myTitle')}</h1>
        <Button size="small" onClick={() => setShowPast((prev) => !prev)}>
          {showPast ? t('bookings.hidePast') : t('bookings.showPast')}
        </Button>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="text-slate-500 text-sm">{t('bookings.empty')}</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
