import { useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../../network/hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { setAlertAC } from '../../store/alertSlice';
import type { LoginDto } from '../../services/auth.service';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: login, isPending } = useLogin();

  const schema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(t('validation.emailInvalid'))
          .required(t('validation.required')),
        password: yup
          .string()
          .min(6, t('validation.passwordMin'))
          .required(t('validation.required')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: yupResolver(schema) as Resolver<LoginDto>,
  });

  const onSubmit = (data: LoginDto) => {
    login(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: () => {
        dispatch(setAlertAC({ text: 'auth.loginError', mode: 'error' }));
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold text-slate-800">{t('auth.login')}</h1>

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
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="contained" size="large" disabled={isPending}>
        {t('auth.login')}
      </Button>

      <p className="text-sm text-center text-slate-600">
        {t('auth.noAccount')}{' '}
        <RouterLink to="/register" className="text-sky-600 hover:underline">
          {t('auth.register')}
        </RouterLink>
      </p>
    </form>
  );
}
