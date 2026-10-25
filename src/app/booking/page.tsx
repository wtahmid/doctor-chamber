// Booking page — the patient appointment booking flow.
//
// Flow:
//   1. User chooses a date -> server returns available time slots.
//   2. User selects a slot (or serial number).
//   3. User reviews the booking.
//   4. User submits -> server validates + inserts atomically.
//   5. On success, user sees the confirmation with a reference.

"use client";

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type Slot = {
  time: string;
  label: string;
};

type Availability = {
  success: boolean;
  date: string;
  day_of_week: string;
  available_slots: string[];
  note?: string;
};

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

export default function BookingPage() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState<'date' | 'time' | 'review' | 'confirmation'>('date');
  const [loading, setLoading] = useState(false);

  // Date selection
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [availability, setAvailability] = useState<Availability | null>(null);

  // Time selection
  const [time, setTime] = useState('');
  const [selectedSerial, setSelectedSerial] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Review / confirmation
  const [booking, setBooking] = useState<Booking | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch available slots for a date.
  const fetchAvailability = useCallback(async (d: string) => {
    try {
      const res = await fetch(`/api/schedule/available?date=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (data.success) {
        setAvailability(data);
        if (data.available_slots?.length) {
          setStep('time');
        } else {
          setStep('date');
          setError(t('errors.noSlotsForDate'));
        }
      } else {
        setError(data.error ?? t('errors.unknownError'));
        setStep('date');
      }
    } catch {
      setError(t('errors.unknownError'));
      setStep('date');
    }
  }, [t]);

  const selectTime = (slot: string) => {
    setTime(slot);
    setStep('review');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          mobile,
          email,
          date,
          time,
          duration,
          notes,
          serialNumber: selectedSerial || undefined,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? t('errors.bookingFailed'));
        setLoading(false);
        return;
      }

      setBooking(data.appointment);
      setConfirmationMessage(data.message ?? t('appointment.confirmationNote'));
      setStep('confirmation');
    } catch {
      setError(t('errors.unknownError'));
      setLoading(false);
    }
  };

  const resetToDateStep = () => {
    setStep('date');
    setAvailability(null);
    setTime('');
    setBooking(null);
    setConfirmationMessage('');
    setError('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← {t('home')}
      </Link>

      {step === 'date' && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('appointment.title')}</h1>
          <p className="mt-2 text-slate-600">{t('appointment.noAccount')}</p>

          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  {t('appointment.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('appointment.namePlaceholder')}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">
                  {t('appointment.mobile')}
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={t('appointment.mobilePlaceholder')}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {t('appointment.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                {t('appointment.date')}
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (e.target.value) fetchAvailability(e.target.value);
                }}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="primary" fullWidth>
              {t('appointment.next')}
            </Button>
          </form>
        </div>
      )}

      {step === 'time' && availability && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('appointment.title')}</h1>
          <p className="mt-2 text-slate-600">
            {t('appointment.date')} {availability.date} · {t('appointment.time')} {availability.day_of_week}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {availability.available_slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => selectTime(slot)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {slot}
              </button>
            ))}
            {availability.available_slots.length === 0 && (
              <p className="col-span-3 text-sm text-slate-500">{t('errors.noSlotsForDate')}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">
              {t('appointment.duration')}
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="30 min">30 minutes</option>
              <option value="45 min">45 minutes</option>
              <option value="60 min">60 minutes</option>
              <option value="90 min">90 minutes</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep('date')}>
              {t('appointment.back')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep('review')}
              disabled={!time}
            >
              {t('appointment.next')}
            </Button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('appointment.review')}</h1>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.name')}</dt>
                <dd className="text-sm text-slate-800">{name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.mobile')}</dt>
                <dd className="text-sm text-slate-800">{mobile}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.email')}</dt>
                <dd className="text-sm text-slate-800">{email || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.date')}</dt>
                <dd className="text-sm text-slate-800">{date} · {availability?.day_of_week}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.time')}</dt>
                <dd className="text-sm text-slate-800">{time}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.duration')}</dt>
                <dd className="text-sm text-slate-800">{duration}</dd>
              </div>
              {reason && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.reason')}</dt>
                  <dd className="text-sm text-slate-800">{reason}</dd>
                </div>
              )}
              {notes && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500 uppercase">{t('appointment.notes')}</dt>
                  <dd className="text-sm text-slate-800">{notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep('time')}>
              {t('appointment.back')}
            </Button>
            <Button type="button" variant="primary" onClick={() => setStep('confirmation')}>
              {t('appointment.confirm')}
            </Button>
          </div>
        </div>
      )}

      {step === 'confirmation' && booking && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="text-center">
            <span className="text-5xl" aria-hidden="true">✓</span>
            <h1 className="mt-4 text-2xl font-bold text-emerald-800">{t('appointment.confirm')}</h1>
            <p className="mt-2 text-sm text-emerald-700">{confirmationMessage}</p>
          </div>

          {booking.reference && (
            <div className="mt-4 rounded-lg bg-white p-4 text-sm font-mono text-emerald-700">
              <span className="font-medium">{t('appointment.reference')}:</span> {booking.reference}
            </div>
          )}

          <div className="mt-4 grid gap-3 text-sm">
            <p><strong>{t('appointment.name')}:</strong> {booking.patient_name}</p>
            <p><strong>{t('appointment.mobile')}:</strong> {booking.patient_mobile}</p>
            {booking.patient_email && <p><strong>{t('appointment.email')}:</strong> {booking.patient_email}</p>}
            <p><strong>{t('appointment.date')}:</strong> {booking.date}</p>
            <p><strong>{t('appointment.time')}:</strong> {booking.time}</p>
            {booking.serial_number && <p><strong>{t('appointment.serialNumber')}:</strong> {booking.serial_number}</p>}
            <p><strong>{t('appointment.duration')}:</strong> {booking.duration}</p>
            {booking.notes && <p><strong>{t('appointment.reason')}:</strong> {booking.notes}</p>}
            <p><strong>{t('appointment.status')}:</strong> {booking.status}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={resetToDateStep}>
              {t('appointment.newBooking')}
            </Button>
            <Link
              href={`/booking/confirmation/${encodeURIComponent(booking.reference)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t('appointment.confirmationScreen')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
