// Hero section: the first thing visitors see — doctor name, welcome
// message, and the primary CTA.

"use client";

import { doctorData } from '@/lib/config';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl" aria-hidden="true" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">{t('doctorProfile')}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t('hero.welcome')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{t('hero.intro')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">📅</span>
              {t('hero.primaryCta')}
            </Link>
            <Link
              href="/location"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">🧭</span>
              {t('hero.secondaryCta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
