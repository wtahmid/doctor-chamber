// Contact page: phone, WhatsApp, email, and hours.

"use client";

import { contactData } from '@/lib/config';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export default function ContactPage() {
  const { t, locale } = useI18n();

  const whatsappHref = contactData.whatsapp
    ? `https://wa.me/${contactData.whatsapp.replace(/\s/g, '')}`
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← {t('home')}
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">{t('contact.title')}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">{t('contact.phone')}</p>
          <a
            href={`tel:${contactData.phone.replace(/\s/g, '')}`}
            className="text-lg font-semibold text-blue-700 hover:underline"
          >
            {contactData.phone}
          </a>
          <p className="mt-1 text-sm text-slate-500">{t('contact.phoneNote')}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">{t('contact.whatsapp')}</p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-green-700 hover:underline"
            >
              {contactData.whatsapp}
            </a>
          ) : (
            <span className="text-lg font-semibold text-slate-400">—</span>
          )}
          <p className="mt-1 text-sm text-slate-500">Enquiries are NOT confirmed appointments.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">{t('contact.openingHours')}</p>
        <p className="mt-1 text-slate-700">
          {locale === 'bn'
            ? 'সপ্তাহের দিনগুলো ৮টা–১২টা এবং ৫টা–১০টা রাত; বৃহস্পতিবার ৮টা–১২টা শুধু।'
            : 'Weekdays 8am–12pm and 5pm–10pm; Friday 8am–12pm only.'}
        </p>
        <p className="mt-1 text-sm text-slate-500">{t('contact.clinics')}</p>
        <p className="mt-1 text-sm text-slate-500">{t('contact.email')}: {contactData.email}</p>
      </div>

      <div className="mt-6 text-sm text-slate-500">
        <p>{t('footer.address')}</p>
        <p>{t('footer.cta')}</p>
      </div>
    </div>
  );
}
