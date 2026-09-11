import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="p-8 max-w-md mx-auto flex flex-col items-center text-center gap-3 mt-16">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold text-slate-800">{t('pages.notFound')}</h1>
      <p className="text-sm text-slate-500">{t('notFound.description')}</p>
      <Button component={RouterLink} to="/" variant="contained" className="mt-2">
        {t('notFound.goHome')}
      </Button>
    </div>
  );
}
