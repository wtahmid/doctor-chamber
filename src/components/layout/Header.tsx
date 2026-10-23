// Site header: branding, language switcher, and top-level navigation.
//
// The header is present on every page. The language switch toggles the
// active locale through the I18nProvider context.

"use client";

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { siteConfig } from '@/lib/config';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
  { href: '/', label: 'home' },
  { href: '/doctor', label: 'doctorProfile' },
  { href: '/booking', label: 'bookAppointment' },
  { href: '/location', label: 'chamberLocation' },
  { href: '/pharmacy', label: 'attachedPharmacy' },
  { href: '/contact', label: 'contact' },
  { href: '/privacy', label: 'privacyPolicy' },
];

export function Header() {
  const { t, locale } = useI18n();
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="text-2xl" aria-hidden="true">🏥</span>
            <span className="hidden sm:inline">
              {t('siteTitle')} <span className="text-sm font-normal text-slate-500">· {t('siteTagline')}</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={[
                  'px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                  locale === 'en'
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
                ].join(' ')}
              >
                {t(label)}
              </Link>
            ))}
            <Link
              href="/booking"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">📅</span>
              {t('bookAppointment')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
