// Chamber location section: the verified address and a Google Maps embed
// with a "Get Directions" button. The map link is provided by the owner and
// must NOT be modified or "corrected" until verified with the chamber owner.

"use client";

import { locationData } from '@/lib/config';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export function LocationSection() {
  const { t } = useI18n();
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('location.title')}</h2>
          <p className="mt-2 text-slate-600">{t('location.mapLabel')}</p>
          <div className="mt-6 flex flex-col justify-center rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
            <p className="text-lg font-medium text-slate-800">{t('contact.address')}</p>
            <p className="mt-1 text-slate-600">{locationData.addressLine1}</p>
            <p className="text-slate-500">{locationData.addressLine2}</p>
            <p className="mt-3 text-sm text-slate-500">{locationData.verifyMap}</p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={locationData.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">🧭</span>
              {t('location.mapInstructions')}
            </Link>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
              aria-disabled
            >
              <span aria-hidden="true">📍</span>
              {t('location.verifyMap')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
