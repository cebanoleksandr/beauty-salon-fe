import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMaster } from '../../network/hooks/useMasters';
import { useSalon } from '../../network/hooks/useSalons';
import { useWorkingHours } from '../../network/hooks/useWorkingHours';

// Assumes ISO weekday numbering (0 = Monday) since the backend's convention is unconfirmed.
const WEEKDAY_KEYS = [
  'common.weekday0',
  'common.weekday1',
  'common.weekday2',
  'common.weekday3',
  'common.weekday4',
  'common.weekday5',
  'common.weekday6',
];

export default function MasterDetailPage() {
  const { t } = useTranslation();
  const { masterId = '' } = useParams<{ masterId: string }>();
  const masterIdNumber = Number(masterId);

  const { data: master, isLoading } = useMaster(masterIdNumber);
  const { data: salon } = useSalon(master ? String(master.salonId) : '');
  const { data: workingHours, isLoading: isWorkingHoursLoading } = useWorkingHours(
    master ? String(master.id) : '',
  );

  if (isLoading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  if (!master) {
    return null;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex gap-4">
        {master.imageUrl && (
          <img
            src={master.imageUrl}
            alt=""
            className="w-20 h-20 rounded-full object-cover shrink-0"
          />
        )}

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {master.user.firstName} {master.user.lastName}
          </h1>

          {salon && (
            <RouterLink to={`/salons/${salon.id}`} className="text-sm text-sky-600 hover:underline">
              {salon.name}
            </RouterLink>
          )}

          {master.experience != null && (
            <p className="text-sm text-slate-500 mt-1">
              {t('salons.experienceYears', { count: master.experience })}
            </p>
          )}

          {master.bio && <p className="text-slate-600 mt-3">{master.bio}</p>}

          <Button
            component={RouterLink}
            to={`/bookings/new?salonId=${master.salonId}&masterId=${master.id}`}
            variant="contained"
            className="mt-4"
          >
            {t('salons.bookNow')}
          </Button>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          {t('masters.workingHoursTitle')}
        </h2>

        {isWorkingHoursLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isWorkingHoursLoading && workingHours?.length === 0 && (
          <p className="text-slate-500 text-sm">{t('masters.noWorkingHours')}</p>
        )}

        <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
          {workingHours?.map((wh) => (
            <div key={wh.id} className="flex justify-between px-4 py-2 text-sm">
              <span className="text-slate-700">{t(WEEKDAY_KEYS[wh.dayOfWeek])}</span>
              <span className="text-slate-500">
                {wh.isDayOff ? t('masters.dayOff') : `${wh.startTime} – ${wh.endTime}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
