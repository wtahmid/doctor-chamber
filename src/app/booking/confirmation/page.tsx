// Booking confirmation page — displays the saved booking details.
//
// The page is opened from the booking confirmation screen using the unique
// booking reference. It fetches the booking from the database and shows the
// confirmation. If the booking does not exist, it shows a not-found message.

"use client";

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

type Booking = {
  id: string;
  patient_name: string;
  patient_mobile: string;
  patient_email: string | null;
  date: string;
  time: string;
  serial_number: string | null;
  duration: string;
  notes: string | null;
  reference: string;
  status: string;
  created_at: string;
};

function BookingConfirmationContent() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useSearchParams returns a tuple [string, string].
  // The first element is the key, the second is the value.
  const reference = searchParams[1] || '';

  useEffect(() => {
    async function loadBooking() {
      if (!reference) {
        setError('Missing booking reference');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/booking/${encodeURIComponent(reference)}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error ?? t('errors.unknownError'));
          setBooking(null);
        } else {
          setBooking(data.booking);
        }
      } catch {
        setError(t('errors.unknownError'));
        setBooking(null);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [reference, t]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-4xl" aria-hidden="true">⏳</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-800">{t('appointment.confirm')} …</h1>
          <p className="mt-2 text-slate-500">{t('appointment.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 text-center">
          <span className="text-5xl" aria-hidden="true">⚠️</span>
          <h1 className="mt-4 text-2xl font-bold text-red-800">{t('errors.unknownError')}</h1>
          <p className="mt-2 text-sm text-red-700">{error || t('errors.unknownError')}</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← {t('home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← {t('home')}
      </Link>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center">
        <span className="text-5xl" aria-hidden="true">✨</span>
        <h1 className="mt-4 text-2xl font-bold text-emerald-800">{t('appointment.confirm')}</h1>
        <p className="mt-2 text-sm text-emerald-700">{t('appointment.confirmationNote')}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{t('appointment.review')}</h2>
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {booking.reference}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.name')}</dt>
            <dd className="text-sm text-slate-800">{booking.patient_name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.mobile')}</dt>
            <dd className="text-sm text-slate-800">{booking.patient_mobile}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.email')}</dt>
            <dd className="text-sm text-slate-800">{booking.patient_email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.date')}</dt>
            <dd className="text-sm text-slate-800">{booking.date} · {booking.time}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.duration')}</dt>
            <dd className="text-sm text-slate-800">{booking.duration}</dd>
          </div>
          {booking.serial_number && (
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.serialNumber')}</dt>
              <dd className="text-sm text-slate-800">{booking.serial_number}</dd>
            </div>
          )}
          {booking.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.reason')}</dt>
              <dd className="text-sm text-slate-800">{booking.notes}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.status')}</dt>
            <dd className="text-sm text-slate-800">
              <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {booking.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← {t('appointment.newBooking')}
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('contact.clinics')}
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingConfirmationContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-4xl" aria-hidden="true">⏳</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Confirmation</h1>
        <p className="mt-2 text-slate-500">Loading your booking details.</p>
      </div>
    </div>
  );
}
