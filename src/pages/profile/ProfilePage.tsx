import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Avatar, Button, Chip, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLogout, useProfile } from '../../network/hooks/useAuth';
import { useUpdateProfile } from '../../network/hooks/useUsers';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import ConfirmPopup from '../../components/popups/ConfirmPopup';
import type { UserRole } from '../../types/api';
import type { UpdateProfileDto } from '../../services/users.service';

const ROLE_KEYS: Record<UserRole, string> = {
  CLIENT: 'auth.roleClient',
  MASTER: 'auth.roleMaster',
  SALON_OWNER: 'auth.roleSalonOwner',
  ADMIN: 'auth.roleAdmin',
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useProfile();
  const logout = useLogout();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        firstName: yup.string().required(t('validation.required')),
        lastName: yup.string().required(t('validation.required')),
        phone: yup.string().optional(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    resolver: yupResolver(schema) as Resolver<UpdateProfileDto>,
    values: user
      ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' }
      : undefined,
  });

  const handleLogout = () => {
    logout();
    setIsLogoutPopupOpen(false);
    navigate('/login');
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
    }
    setIsEditing(false);
  };

  const onSubmit = (data: UpdateProfileDto) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== ''),
    ) as UpdateProfileDto;

    updateProfile(payload, {
      onSuccess: () => {
        dispatch(setAlertAC({ text: 'profile.updateSuccess', mode: 'success' }));
        setIsEditing(false);
      },
      onError: () => {
        dispatch(setAlertAC({ text: 'profile.updateError', mode: 'error' }));
      },
    });
  };

  if (isLoading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  if (!user) {
    return null;
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('profile.title')}</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center gap-3">
        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 72, height: 72, fontSize: 28 }}>
          {initials}
        </Avatar>

        {!isEditing && (
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-slate-500">{user.email}</p>
          </div>
        )}

        <Chip label={t(ROLE_KEYS[user.role])} color="primary" variant="outlined" />

        {isEditing ? (
          <form className="w-full flex flex-col gap-3 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label={t('auth.firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextField
              label={t('auth.lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName')}
            />
            <TextField
              label={t('profile.phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone')}
            />

            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="contained" fullWidth disabled={isPending}>
                {t('common.save')}
              </Button>
              <Button variant="outlined" fullWidth onClick={cancelEditing} disabled={isPending}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="w-full mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">{t('profile.phone')}</span>
                <span className="text-slate-800">{user.phone ?? t('profile.noPhone')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">{t('profile.memberSince')}</span>
                <span className="text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Button variant="contained" fullWidth onClick={startEditing}>
              {t('profile.edit')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => setIsLogoutPopupOpen(true)}
            >
              {t('profile.logout')}
            </Button>
          </>
        )}
      </div>

      <ConfirmPopup
        isVisible={isLogoutPopupOpen}
        title={t('profile.logoutConfirmTitle')}
        description={t('profile.logoutConfirmMessage')}
        confirmColor="error"
        onConfirm={handleLogout}
        onClose={() => setIsLogoutPopupOpen(false)}
      />
    </div>
  );
}
