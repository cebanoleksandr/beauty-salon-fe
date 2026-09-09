import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNearbySalons } from '../../network/hooks/useSalons';
import { useGeolocation } from '../../hooks/useGeolocation';
import SalonsMap from '../../components/salons/SalonsMap';
import SalonSearch from '../../components/salons/SalonSearch';

const NEARBY_RADIUS_KM = 10;

export default function SalonsListPage() {
  const { t } = useTranslation();
  const geo = useGeolocation();
  const [manualPosition, setManualPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const position =
    manualPosition ??
    (geo.latitude !== null && geo.longitude !== null
      ? { lat: geo.latitude, lng: geo.longitude }
      : null);

  const { data: nearbySalons, isLoading: isNearbyLoading } = useNearbySalons({
    lat: position?.lat ?? 0,
    lng: position?.lng ?? 0,
    radiusKm: NEARBY_RADIUS_KM,
  });

  return (
    <div className="relative h-full w-full">
      {position ? (
        <SalonsMap
          latitude={position.lat}
          longitude={position.lng}
          salons={nearbySalons ?? []}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-500">
          {geo.error ? t('salons.locationUnavailable') : t('common.loading')}
        </div>
      )}

      <div className="absolute top-4 left-4 z-1100 w-80 max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] flex flex-col gap-3">
        <SalonSearch
          latitude={position?.lat}
          longitude={position?.lng}
          onSelect={(salon) => setManualPosition({ lat: salon.latitude, lng: salon.longitude })}
        />

        <div className="bg-white rounded-xl shadow-md p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">{t('salons.nearby')}</h2>

          {isNearbyLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

          {!isNearbyLoading && nearbySalons?.length === 0 && (
            <p className="text-slate-500 text-sm">{t('salons.emptyNearby')}</p>
          )}

          <ul className="flex flex-col gap-2">
            {nearbySalons?.map((salon) => (
              <li key={salon.id}>
                <RouterLink
                  to={`/salons/${salon.id}`}
                  className="block rounded-lg p-2 hover:bg-slate-100"
                >
                  <p className="text-sm font-medium text-slate-800">{salon.name}</p>
                  <p className="text-xs text-slate-500">{salon.address}</p>
                </RouterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
