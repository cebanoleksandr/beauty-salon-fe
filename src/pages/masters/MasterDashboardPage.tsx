import { Link as RouterLink } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../network/hooks/useAuth';
import {
  useCancelBookingByMaster,
  useCompleteBooking,
  useConfirmBooking,
  useMasterBookings,
} from '../../network/hooks/useBookings';
import { useMyMasterServices, useRemoveMasterService } from '../../network/hooks/useMasterServices';
import { useCancelJoinRequest, useMyJoinRequests } from '../../network/hooks/useJoinRequests';
import type { Booking, BookingStatus, JoinRequestStatus } from '../../types/api';

const STATUS_COLOR: Record<BookingStatus, 'warning' | 'success' | 'default' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'default',
  CANCELLED: 'error',
};

const JOIN_REQUEST_STATUS_COLOR: Record<JoinRequestStatus, 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

const UPCOMING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function UpcomingBookingCard({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBookingByMaster();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{formatDateTime(booking.startAt)}</p>
          {booking.user && (
            <p className="text-sm text-slate-600">
              {booking.user.firstName} {booking.user.lastName}
            </p>
          )}
        </div>
        <Chip size="small" label={t(`bookings.status.${booking.status}`)} color={STATUS_COLOR[booking.status]} />
      </div>

      {booking.services.length > 0 && (
        <ul className="text-sm text-slate-600 flex flex-col gap-1">
          {booking.services.map((item) => (
            <li key={item.id}>{item.serviceName ?? item.serviceId}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-1">
        {booking.status === 'PENDING' && (
          <Button
            size="small"
            variant="contained"
            disabled={isConfirming}
            onClick={() => confirmBooking(booking.id)}
          >
            {t('masterDashboard.confirmBooking')}
          </Button>
        )}

        {booking.status === 'CONFIRMED' && (
          <Button
            size="small"
            variant="contained"
            disabled={isCompleting}
            onClick={() => completeBooking(booking.id)}
          >
            {t('masterDashboard.completeBooking')}
          </Button>
        )}

        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={isCancelling}
            onClick={() => cancelBooking({ id: booking.id })}
          >
            {t('masterDashboard.cancelBooking')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MasterDashboardPage() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: bookings, isLoading: isBookingsLoading } = useMasterBookings();
  const { data: myServices, isLoading: isServicesLoading } = useMyMasterServices();
  const { mutate: removeService, isPending: isRemoving } = useRemoveMasterService();
  const { data: joinRequests, isLoading: isJoinRequestsLoading } = useMyJoinRequests();
  const { mutate: cancelJoinRequest, isPending: isCancellingJoinRequest } = useCancelJoinRequest();

  const upcomingBookings = (bookings ?? [])
    .filter((booking) => UPCOMING_STATUSES.includes(booking.status))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t('pages.masterDashboard')}</h1>
        {profile && (
          <p className="text-sm text-slate-500 mt-1">
            {t('masterDashboard.greeting', { name: profile.firstName })}
          </p>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">
            {t('masterDashboard.upcomingBookings')}
          </h2>
          <Button component={RouterLink} to="/master/working-hours" size="small">
            {t('masterDashboard.manageWorkingHours')}
          </Button>
        </div>

        {isBookingsLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isBookingsLoading && upcomingBookings.length === 0 && (
          <p className="text-slate-500 text-sm">{t('masterDashboard.noUpcomingBookings')}</p>
        )}

        <div className="flex flex-col gap-3">
          {upcomingBookings.map((booking) => (
            <UpcomingBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          {t('masterDashboard.myJoinRequests')}
        </h2>

        {isJoinRequestsLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isJoinRequestsLoading && (joinRequests?.length ?? 0) === 0 && (
          <p className="text-slate-500 text-sm">{t('masterDashboard.noJoinRequests')}</p>
        )}

        <div className="flex flex-col gap-3">
          {joinRequests?.map((joinRequest) => (
            <div
              key={joinRequest.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {joinRequest.salon?.name ?? joinRequest.salonId}
                </p>
                {joinRequest.status === 'REJECTED' && joinRequest.rejectionReason && (
                  <p className="text-xs text-slate-500 mt-1">{joinRequest.rejectionReason}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Chip
                  size="small"
                  label={t(`masterDashboard.joinRequestStatus.${joinRequest.status}`)}
                  color={JOIN_REQUEST_STATUS_COLOR[joinRequest.status]}
                />
                {joinRequest.status === 'PENDING' && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={isCancellingJoinRequest}
                    onClick={() => cancelJoinRequest(joinRequest.id)}
                  >
                    {t('masterDashboard.cancelJoinRequest')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('masterDashboard.myServices')}</h2>

        {isServicesLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isServicesLoading && myServices?.length === 0 && (
          <p className="text-slate-500 text-sm">{t('masterDashboard.noServices')}</p>
        )}

        <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
          {myServices?.map((masterService) => (
            <div key={masterService.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {masterService.service?.name ?? masterService.serviceId}
                </p>
                {masterService.service && (
                  <p className="text-xs text-slate-500">
                    {masterService.service.price} ₴ · {masterService.service.duration}{' '}
                    {t('salons.minutesShort')}
                  </p>
                )}
              </div>
              <Button
                size="small"
                color="error"
                disabled={isRemoving}
                onClick={() => removeService(masterService.serviceId)}
              >
                {t('masterDashboard.removeService')}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
