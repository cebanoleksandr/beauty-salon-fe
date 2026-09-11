import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ConfirmPopup from '../../components/popups/ConfirmPopup';
import EditableLocationMap from '../../components/salons/EditableLocationMap';
import { useDeleteSalon, useSalon, useUpdateSalon } from '../../network/hooks/useSalons';
import { useMasters } from '../../network/hooks/useMasters';
import {
  useCreateService,
  useDeleteService,
  useServicesBySalon,
  useUpdateService,
} from '../../network/hooks/useServices';
import { geocodingService } from '../../services/geocoding.service';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import type { ServiceItem } from '../../types/api';

interface SalonForm {
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

interface ServiceForm {
  name: string;
  description: string;
  duration: string;
  price: string;
}

const EMPTY_SERVICE_FORM: ServiceForm = { name: '', description: '', duration: '', price: '' };

function ServiceRow({ service }: { service: ServiceItem }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    name: service.name,
    description: service.description ?? '',
    duration: String(service.duration),
    price: String(service.price),
  });

  const handleSave = () => {
    updateService(
      {
        id: service.id,
        data: {
          name: form.name,
          description: form.description || undefined,
          duration: Number(form.duration),
          price: Number(form.price),
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteService(service.id, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
        dispatch(setAlertAC({ text: 'salons.serviceDeleted', mode: 'success' }));
      },
      onError: () => {
        setIsConfirmingDelete(false);
        dispatch(setAlertAC({ text: 'salons.serviceDeleteError', mode: 'error' }));
      },
    });
  };

  if (isEditing) {
    return (
      <div className="px-4 py-3 flex flex-wrap items-center gap-2">
        <TextField
          size="small"
          label={t('salons.serviceName')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          size="small"
          type="number"
          label={t('salons.serviceDuration')}
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-28"
        />
        <TextField
          size="small"
          type="number"
          label={t('salons.servicePrice')}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-28"
        />
        <Button size="small" variant="contained" disabled={isUpdating} onClick={handleSave}>
          {t('common.save')}
        </Button>
        <Button size="small" onClick={() => setIsEditing(false)}>
          {t('common.cancel')}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{service.name}</p>
        <p className="text-xs text-slate-500">
          {service.price} ₴ · {service.duration} {t('salons.minutesShort')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="small" onClick={() => setIsEditing(true)}>
          {t('common.edit')}
        </Button>
        <Button size="small" color="error" onClick={() => setIsConfirmingDelete(true)}>
          {t('common.delete')}
        </Button>
      </div>

      <ConfirmPopup
        isVisible={isConfirmingDelete}
        title={t('salons.deleteServiceTitle')}
        description={t('salons.deleteServiceConfirm', { name: service.name })}
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmingDelete(false)}
      />
    </div>
  );
}

export default function SalonManagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { salonId = '' } = useParams<{ salonId: string }>();
  const salonIdNumber = Number(salonId);

  const { data: salon, isLoading } = useSalon(salonId);
  const { mutate: updateSalon, isPending: isSaving } = useUpdateSalon();
  const { mutate: deleteSalon, isPending: isDeletingSalon } = useDeleteSalon();

  const { data: services, isLoading: isServicesLoading } = useServicesBySalon(salonIdNumber);
  const { mutate: createService, isPending: isCreatingService } = useCreateService();
  const [newService, setNewService] = useState<ServiceForm>(EMPTY_SERVICE_FORM);

  const { data: masters, isLoading: isMastersLoading } = useMasters(salonId);

  const [isConfirmingDeleteSalon, setIsConfirmingDeleteSalon] = useState(false);

  const [form, setForm] = useState<SalonForm | null>(null);
  const activeForm =
    form ??
    (salon
      ? {
          name: salon.name,
          description: salon.description ?? '',
          address: salon.address,
          phone: salon.phone ?? '',
          latitude: String(salon.latitude),
          longitude: String(salon.longitude),
        }
      : null);

  // Tracks whether the last address change came from typing (needs forward geocoding) or from
  // picking a point on the map (address was just set by reverse geocoding — don't geocode it back).
  const addressUpdateSource = useRef<'user' | 'map'>('user');
  const isFirstAddressEffect = useRef(true);

  useEffect(() => {
    if (!activeForm) return;

    if (isFirstAddressEffect.current) {
      isFirstAddressEffect.current = false;
      return;
    }

    if (addressUpdateSource.current === 'map') {
      addressUpdateSource.current = 'user';
      return;
    }

    const address = activeForm.address.trim();
    if (address.length < 3) return;

    const timeout = setTimeout(() => {
      geocodingService.geocodeAddress(address).then((result) => {
        if (!result) return;
        setForm((prev) => {
          const base = prev ?? activeForm;
          return { ...base, latitude: String(result.latitude), longitude: String(result.longitude) };
        });
      });
    }, 800);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeForm?.address]);

  const handleLocationChange = (latitude: number, longitude: number) => {
    addressUpdateSource.current = 'map';
    setForm((prev) => {
      const base = prev ?? activeForm;
      return base ? { ...base, latitude: String(latitude), longitude: String(longitude) } : base;
    });

    geocodingService.reverseGeocode(latitude, longitude).then((address) => {
      if (!address) return;
      setForm((prev) => {
        const base = prev ?? activeForm;
        return base ? { ...base, address } : base;
      });
    });
  };

  const handleSaveSalon = () => {
    if (!activeForm) return;
    updateSalon(
      {
        id: salonId,
        data: {
          name: activeForm.name,
          description: activeForm.description || undefined,
          address: activeForm.address,
          phone: activeForm.phone || undefined,
          latitude: Number(activeForm.latitude),
          longitude: Number(activeForm.longitude),
        },
      },
      {
        onSuccess: () => dispatch(setAlertAC({ text: 'salons.saveSuccess', mode: 'success' })),
        onError: () => dispatch(setAlertAC({ text: 'salons.saveError', mode: 'error' })),
      },
    );
  };

  const handleDeleteSalon = () => {
    deleteSalon(salonId, {
      onSuccess: () => navigate('/join-requests'),
      onError: () => {
        setIsConfirmingDeleteSalon(false);
        dispatch(setAlertAC({ text: 'salons.deleteError', mode: 'error' }));
      },
    });
  };

  const handleCreateService = () => {
    if (!newService.name || !newService.duration || !newService.price) return;
    createService(
      {
        salonId: salonIdNumber,
        data: {
          name: newService.name,
          description: newService.description || undefined,
          duration: Number(newService.duration),
          price: Number(newService.price),
        },
      },
      { onSuccess: () => setNewService(EMPTY_SERVICE_FORM) },
    );
  };

  if (isLoading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  if (!salon || !activeForm) {
    return null;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('pages.salonManage')}</h1>

      <section className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
        <TextField
          size="small"
          label={t('salons.name')}
          value={activeForm.name}
          onChange={(e) => setForm({ ...activeForm, name: e.target.value })}
        />
        <TextField
          size="small"
          multiline
          minRows={2}
          label={t('salons.description')}
          value={activeForm.description}
          onChange={(e) => setForm({ ...activeForm, description: e.target.value })}
        />
        <TextField
          size="small"
          label={t('salons.address')}
          value={activeForm.address}
          onChange={(e) => setForm({ ...activeForm, address: e.target.value })}
        />
        <TextField
          size="small"
          label={t('salons.phone')}
          value={activeForm.phone}
          onChange={(e) => setForm({ ...activeForm, phone: e.target.value })}
        />

        <div>
          <p className="text-sm text-slate-500 mb-2">{t('salons.pickLocationHint')}</p>
          <EditableLocationMap
            latitude={Number(activeForm.latitude) || 0}
            longitude={Number(activeForm.longitude) || 0}
            onChange={handleLocationChange}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="contained" disabled={isSaving} onClick={handleSaveSalon}>
            {t('common.save')}
          </Button>
          <Button color="error" onClick={() => setIsConfirmingDeleteSalon(true)}>
            {t('salons.deleteSalon')}
          </Button>
        </div>

        <ConfirmPopup
          isVisible={isConfirmingDeleteSalon}
          title={t('salons.deleteSalonTitle')}
          description={t('salons.deleteSalonConfirm', { name: salon.name })}
          confirmColor="error"
          isLoading={isDeletingSalon}
          onConfirm={handleDeleteSalon}
          onClose={() => setIsConfirmingDeleteSalon(false)}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('salons.servicesTitle')}</h2>

        {isServicesLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100 mb-3">
          {services?.items.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-2">
          <TextField
            size="small"
            label={t('salons.serviceName')}
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <TextField
            size="small"
            type="number"
            label={t('salons.serviceDuration')}
            value={newService.duration}
            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
            className="w-28"
          />
          <TextField
            size="small"
            type="number"
            label={t('salons.servicePrice')}
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            className="w-28"
          />
          <Button
            variant="contained"
            size="small"
            disabled={isCreatingService}
            onClick={handleCreateService}
          >
            {t('salons.addService')}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('salons.mastersTitle')}</h2>

        {isMastersLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isMastersLoading && masters?.items.length === 0 && (
          <p className="text-slate-500 text-sm">{t('salons.noMasters')}</p>
        )}

        <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
          {masters?.items.map((master) => (
            <div key={master.id} className="px-4 py-3 text-sm text-slate-700">
              {master.user.firstName} {master.user.lastName}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
