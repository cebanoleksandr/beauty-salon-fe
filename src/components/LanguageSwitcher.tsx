import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'EN',
  uk: 'UA',
  pl: 'PL',
  es: 'ES',
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="border border-slate-300 rounded-md px-2 py-1 text-sm bg-white"
      aria-label="Language"
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <option key={lng} value={lng}>
          {LANGUAGE_LABELS[lng]}
        </option>
      ))}
    </select>
  );
}
