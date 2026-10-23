// Pharmacy section: the attached pharmacy, kept separate from the doctor’s
// medical profile. Confirmed name, hours, and contact details are managed
// from the admin dashboard and will be published once verified.

"use client";

import { pharmacyData } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

export function PharmacySection() {
  const { t } = useI18n();
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:hard">
          <div className="rounded-2xl bg-teal-50 p-6 sm:p-8 border border-teal-200">
            <h2 className="text-2xl font-bold text-slate-800">{t('pharmacy.title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('pharmacy.intro')}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="font-medium text-teal-800">{pharmacyData.name}</p>
              <p className="text-slate-500">{pharmacyData.address}</p>
              <p className="text-slate-500">{pharmacyData.open}</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">{pharmacyData.note}</p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">{t('pharmacy.title')}</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">{t('pharmacy.intro')}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><strong>{t('contact.name')}:</strong> {pharmacyData.name}</p>
              <p><strong>{t('contact.address')}:</strong> {pharmacyData.address}</p>
              <p><strong>{t('contact.open')}:</strong> {pharmacyData.open}</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">{pharmacyData.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
