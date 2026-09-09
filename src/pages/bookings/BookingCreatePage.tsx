import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSalon } from '../../network/hooks/useSalons';
import { useMasters } from '../../network/hooks/useMasters';
import { useServicesBySalon } from '../../network/hooks/useServices';
import { useMasterServices } from '../../network/hooks/useMasterServices';
import { useAvailability, useCreateBooking } from '../../network/hooks/useBookings';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import SalonSearch from '../../components/salons/SalonSearch';
import type { Salon } from '../../types/api';

const today = () => new Date().toISOString().slice(0, 10);

export default function BookingCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [salonId, setSalonId] = useState(searchParams.get('salonId') ?? '');
  const [masterId, setMasterId] = useState<number | null>(
    Number(searchParams.get('masterId')) || null,
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState('');
  const [comment, setComment] = useState('');

  const { data: initialSalon } = useSalon(salonId);
  const effectiveSalon = salon ?? initialSalon ?? null;

  const { data: masters } = useMasters(salonId || undefined);
  const { data: services } = useServicesBySalon(Number(salonId) || 0);
  const { data: masterServices } = useMasterServices(masterId ?? 0);

  const masterServiceIds = useMemo(
    () => new Set(masterServices?.map((ms) => ms.serviceId)),
    [masterServices],
  );
  const availableServices = useMemo(
    () => services?.items.filter((service) => masterServiceIds.has(service.id)) ?? [],
    [services, masterServiceIds],
  );

  const { data: availability, isLoading: isAvailabilityLoading } = useAvailability({
    masterId: masterId ?? 0,
    serviceIds: selectedServiceIds,
    date,
  });

  const { mutate: createBooking, isPending } = useCreateBooking();

  const toggleService = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSelectSalon = (selected: Salon) => {
    setSalon(selected);
    setSalonId(String(selected.id));
    setMasterId(null);
    setSelectedServiceIds([]);
    setSlot('');
  };

  const canSubmit = !!masterId && selectedServiceIds.length > 0 && !!slot;

  const handleSubmit = () => {
    createBooking(
      {
        salonId: Number(salonId),
        masterId: masterId ?? 0,
        serviceIds: selectedServiceIds,
        startAt: slot,
        comment: comment || undefined,
      },
      {
        onSuccess: () => {
          dispatch(setAlertAC({ text: 'bookings.createSuccess', mode: 'success' }));
          navigate('/bookings/my');
        },
        onError: () => {
          dispatch(setAlertAC({ text: 'bookings.createError', mode: 'error' }));
        },
      },
    );
  };

  const totalPrice = useMemo(
    () =>
      availableServices
        .filter((service) => selectedServiceIds.includes(service.id))
        .reduce((sum, service) => sum + service.price, 0),
    [availableServices, selectedServiceIds],
  );

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('bookings.newTitle')}</h1>

      <section className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">{t('bookings.stepSalon')}</h2>
        <SalonSearch onSelect={handleSelectSalon} />
        {effectiveSalon && (
          <p className="text-sm text-slate-600 mt-3">
            {t('bookings.selectedSalon')}: <strong>{effectiveSalon.name}</strong>
          </p>
        )}
      </section>

      {salonId && (
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">{t('bookings.stepMaster')}</h2>

          {masters?.items.length === 0 && (
            <p className="text-slate-500 text-sm">{t('salons.noMasters')}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {masters?.items.map((master) => (
              <Button
                key={master.id}
                variant={masterId === master.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setMasterId(master.id);
                  setSelectedServiceIds([]);
                  setSlot('');
                }}
              >
                {master.user.firstName} {master.user.lastName}
              </Button>
            ))}
          </div>
        </section>
      )}

      {masterId && (
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">{t('bookings.stepServices')}</h2>

          {availableServices.length === 0 && (
            <p className="text-slate-500 text-sm">{t('salons.noServices')}</p>
          )}

          <div className="flex flex-col gap-1">
            {availableServices.map((service) => (
              <FormControlLabel
                key={service.id}
                control={
                  <Checkbox
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={() => {
                      toggleService(service.id);
                      setSlot('');
                    }}
                  />
                }
                label={`${service.name} — ${service.price} ₴ (${service.duration} ${t('salons.minutesShort')})`}
              />
            ))}
          </div>

          {totalPrice > 0 && (
            <p className="text-sm text-slate-600 mt-2">
              {t('bookings.total')}: <strong>{totalPrice} ₴</strong>
            </p>
          )}
        </section>
      )}

      {masterId && selectedServiceIds.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">{t('bookings.stepDate')}</h2>

          <TextField
            type="date"
            size="small"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlot('');
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {isAvailabilityLoading && (
              <p className="text-slate-500 text-sm">{t('common.loading')}</p>
            )}

            {!isAvailabilityLoading && availability?.length === 0 && (
              <p className="text-slate-500 text-sm">{t('bookings.noSlots')}</p>
            )}

            {availability?.map((availabilitySlot) => (
              <Button
                key={availabilitySlot.startAt}
                variant={slot === availabilitySlot.startAt ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSlot(availabilitySlot.startAt)}
              >
                {new Date(availabilitySlot.startAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Button>
            ))}
          </div>
        </section>
      )}

      {canSubmit && (
        <section className="bg-white rounded-xl shadow-sm p-5">
          <TextField
            fullWidth
            multiline
            minRows={2}
            label={t('bookings.comment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            className="mt-4"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {t('bookings.confirm')}
          </Button>
        </section>
      )}
    </div>
  );
}
