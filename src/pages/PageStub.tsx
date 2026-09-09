import { useTranslation } from 'react-i18next';

interface PageStubProps {
  titleKey: string;
}

export default function PageStub({ titleKey }: PageStubProps) {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">{t(titleKey)}</h1>
      <p className="text-slate-500 mt-2">{t('common.inProgress')}</p>
    </div>
  );
}
