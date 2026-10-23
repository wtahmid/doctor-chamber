// Privacy policy page.

"use client";

import { useI18n } from '@/lib/i18n';

// Compute the date at module level (outside the component) to avoid
// prerendering errors with unstable `new Date()` values.
const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function PrivacyPage() {
  const { t } = useI18n();
  const locale = t('siteTitle') === 'Zahra Health Point' ? 'en' : 'bn';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('privacy.title')}</h1>
      <p className="mt-2 text-slate-600">
        {t('privacy.lastUpdated', { date: currentDate })}
      </p>
      <p className="mt-4 text-slate-600">{t('privacy.intro')}</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">{t('privacy.collected')}</h2>
        <p className="mt-1 text-slate-600">{t('privacy.collectedDetail')}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">{t('privacy.used')}</h2>
        <p className="mt-1 text-slate-600">{t('privacy.usedDetail')}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">{t('privacy.shared')}</h2>
        <p className="mt-1 text-slate-600">{t('privacy.sharedDetail')}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800">{t('privacy.consent')}</h2>
        <p className="mt-1 text-slate-600">{t('privacy.consentDetail')}</p>
      </section>

      <section className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700">{t('privacy.contactLine')}</p>
        <p className="mt-1">{t('privacy.included')}</p>
      </section>
    </div>
  );
}
