import { useMemo } from 'react';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../../network/hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import type { RegisterDto } from '../../services/auth.service';

const REGISTER_ROLES = ['CLIENT', 'MASTER', 'SALON_OWNER'] as const;

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: registerUser, isPending } = useRegister();

  const schema = useMemo(
    () =>
      yup.object({
        firstName: yup.string().required(t('validation.required')),
        lastName: yup.string().required(t('validation.required')),
        email: yup
          .string()
          .email(t('validation.emailInvalid'))
          .required(t('validation.required')),
        password: yup
          .string()
          .min(6, t('validation.passwordMin'))
          .required(t('validation.required')),
        role: yup.string().oneOf(REGISTER_ROLES).required(),
        phone: yup.string().optional(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: yupResolver(schema) as Resolver<RegisterDto>,
    defaultValues: { role: 'CLIENT' },
  });

  const onSubmit = (data: RegisterDto) => {
    registerUser(data, {
      onSuccess: () => {
        dispatch(setAlertAC({ text: 'auth.registerSuccess', mode: 'success' }));
        navigate('/');
      },
      onError: () => {
        dispatch(setAlertAC({ text: 'auth.registerError', mode: 'error' }));
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold text-slate-800">{t('auth.register')}</h1>

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
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="new-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <FormControl>
        <InputLabel id="register-role-label">{t('auth.role')}</InputLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select labelId="register-role-label" label={t('auth.role')} {...field}>
              {REGISTER_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {t(`auth.role${role === 'CLIENT' ? 'Client' : role === 'MASTER' ? 'Master' : 'SalonOwner'}`)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <Button type="submit" variant="contained" size="large" disabled={isPending}>
        {t('auth.register')}
      </Button>

      <p className="text-sm text-center text-slate-600">
        {t('auth.haveAccount')}{' '}
        <RouterLink to="/login" className="text-sky-600 hover:underline">
          {t('auth.login')}
        </RouterLink>
      </p>
    </form>
  );
}
