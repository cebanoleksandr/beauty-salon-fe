import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Chip, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSalon } from '../../network/hooks/useSalons';
import { useServicesBySalon } from '../../network/hooks/useServices';
import { useMasters } from '../../network/hooks/useMasters';
import { useSalonReviews } from '../../network/hooks/useReviews';
import { useCreateJoinRequest } from '../../network/hooks/useJoinRequests';
import { useProfile } from '../../network/hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';

export default function SalonDetailPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { salonId = '' } = useParams<{ salonId: string }>();
  const salonIdNumber = Number(salonId);

  const { data: salon, isLoading } = useSalon(salonId);
  const { data: services, isLoading: isServicesLoading } = useServicesBySalon(salonIdNumber);
  const { data: masters, isLoading: isMastersLoading } = useMasters(salonId);
  const { data: reviews, isLoading: isReviewsLoading } = useSalonReviews(salonId);
  const { data: user } = useProfile();
  const { mutate: createJoinRequest, isPending: isJoining } = useCreateJoinRequest();

  const handleJoin = () => {
    createJoinRequest(
      { salonId },
      {
        onSuccess: () => {
          dispatch(setAlertAC({ text: 'salons.joinRequestSent', mode: 'success' }));
        },
        onError: () => {
          dispatch(setAlertAC({ text: 'salons.joinRequestError', mode: 'error' }));
        },
      },
    );
  };

  if (isLoading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  if (!salon) {
    return null;
  }

  const isOwner = user?.role === 'SALON_OWNER' && user.id === salon.ownerId;
  const isMaster = user?.role === 'MASTER';
  const averageRating = reviews?.averageRating ?? null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{salon.name}</h1>
            <p className="text-slate-500 mt-1">{salon.address}</p>
            {salon.phone && <p className="text-slate-500 text-sm mt-1">{salon.phone}</p>}
          </div>

          {averageRating !== null && (
            <div className="flex flex-col items-end shrink-0">
              <Rating value={averageRating} precision={0.1} readOnly size="small" />
              <span className="text-xs text-slate-400">
                {averageRating.toFixed(1)} ({reviews?.total})
              </span>
            </div>
          )}
        </div>

        {salon.description && <p className="text-slate-600 mt-4">{salon.description}</p>}

        <div className="flex gap-2 mt-5">
          <Button component={RouterLink} to={`/bookings/new?salonId=${salon.id}`} variant="contained">
            {t('salons.bookNow')}
          </Button>

          {isOwner && (
            <Button component={RouterLink} to={`/salons/${salon.id}/manage`} variant="outlined">
              {t('salons.manage')}
            </Button>
          )}

          {isMaster && (
            <Button variant="outlined" onClick={handleJoin} disabled={isJoining}>
              {t('salons.joinSalon')}
            </Button>
          )}
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('salons.servicesTitle')}</h2>

        {isServicesLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isServicesLoading && services?.items.length === 0 && (
          <p className="text-slate-500 text-sm">{t('salons.noServices')}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services?.items.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-baseline">
                <p className="font-medium text-slate-800">{service.name}</p>
                <p className="text-sky-600 font-semibold">{service.price} ₴</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {service.durationMinutes} {t('salons.minutesShort')}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('salons.mastersTitle')}</h2>

        {isMastersLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isMastersLoading && masters?.items.length === 0 && (
          <p className="text-slate-500 text-sm">{t('salons.noMasters')}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {masters?.items.map((master) => (
            <RouterLink
              key={master.id}
              to={`/masters/${master.id}`}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex gap-3"
            >
              {master.imageUrl && (
                <img
                  src={master.imageUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              )}
              <div>
                <p className="font-medium text-slate-800">
                  {master.user.firstName} {master.user.lastName}
                </p>
                {master.bio && <p className="text-xs text-slate-500 mt-1">{master.bio}</p>}
                {master.experience != null && (
                  <p className="text-xs text-slate-400 mt-1">
                    {t('salons.experienceYears', { count: master.experience })}
                  </p>
                )}
              </div>
            </RouterLink>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('salons.reviewsTitle')}</h2>

        {isReviewsLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isReviewsLoading && reviews?.items.length === 0 && (
          <p className="text-slate-500 text-sm">{t('salons.noReviews')}</p>
        )}

        <div className="flex flex-col gap-3">
          {reviews?.items.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <Chip
                  label={
                    review.user ? `${review.user.firstName} ${review.user.lastName}` : t('salons.anonymous')
                  }
                  size="small"
                />
                <Rating value={review.rating} readOnly size="small" />
              </div>
              <p className="text-slate-600 text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
