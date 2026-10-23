// Language switcher: toggles between English and Bangla.
//
// The locale change is stored in React state and propagates through the
// I18nProvider so every component that calls `useI18n()` re-renders with
// the new language.

import { useI18n } from '@/lib/i18n';
import { SUPPORTED_LOCALES } from '@/messages/en';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-white p-0.5 shadow-sm">
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={[
            'relative px-2.5 py-1 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
            locale === l
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          ].join(' ')}
          aria-current={locale === l ? 'page' : undefined}
        >
          {l === 'en' ? 'EN' : 'বাংলা'}
        </button>
      ))}
    </div>
  );
}
