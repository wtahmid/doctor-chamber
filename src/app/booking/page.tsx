// Booking page — the appointment booking flow.
//
// The booking logic (form, validation, API submission, concurrency-safe
// slot allocation, confirmation) lives in Phase 2. This page renders the
// booking form with placeholder actions. No booking state is created yet.

"use client";

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function BookingPage() {
  const { t } = useI18n();

  // Placeholder form state — replaced by a real form in Phase 2.
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: validate on client + server, submit to database, prevent double-booking.
    alert(t('errors.bookingFailed'));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← {t('home')}
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">{t('appointment.title')}</h1>
      <p className="mt-2 text-slate-600">{t('appointment.noAccount')}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700">
              {t('appointment.date')}
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-700">
              {t('appointment.time')}
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">{t('appointment.time')}</option>
              <option value="08:00">8:00 AM</option>
              <option value="08:30">8:30 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="09:30">9:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="17:00">5:00 PM</option>
              <option value="17:30">5:30 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="18:30">6:30 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="19:30">7:30 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
            {t('appointment.reason')}
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('appointment.reason')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          {t('appointment.confirm')}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700">{t('appointment.review')}</p>
        <p className="mt-1 text-slate-600">
          {t('appointment.noAccount')} — {name ? `Name: ${name}` : ''} {mobile ? `Mobile: ${mobile}` : ''}{' '}
          {date ? `Date: ${date}` : ''} {time ? `Time: ${time}` : ''}
        </p>
      </div>
    </div>
  );
}
