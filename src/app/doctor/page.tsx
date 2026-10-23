// Doctor profile page.

"use client";

import { DoctorCard } from '@/components/home/DoctorCard';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function DoctorPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← {t('home')}
      </Link>
      <DoctorCard />
    </div>
  );
}
