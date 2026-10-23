// Appointment booking section: the primary call-to-action on every page.
//
// This is the entry point for the booking flow. The actual booking logic
// (form, validation, API submission, concurrency-safe slot allocation,
// confirmation) is implemented in Phase 2. This version renders the section
// with placeholders — no booking state is created here.

"use client";

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export function AppointmentSection() {
  const { t } = useI18n();
  return (
    <section className="bg-blue-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('appointment.title')}</h2>
          <p className="mt-2 text-slate-600">{t('appointment.noAccount')}</p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">📅</span>
              {t('appointment.confirm')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">📞</span>
              {t('contact.phone')}
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t('contact.phoneNote')}</p>
        </div>
      </div>
    </section>
  );
}
