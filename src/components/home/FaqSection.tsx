// Frequently Asked Questions section: expandable Q&A pairs.
//
// The questions and generic answers here are safe to publish; specific
// specialist claims and fees must be added only after verification.

"use client";

import { faqItems } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

export function FaqSection() {
  const { t } = useI18n();
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">{t('faq.title')}</h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, idx) => (
            <details key={idx} className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 cursor-pointer list-none">
                <span className="truncate">{t(item.q)}</span>
                <span className="transition-transform group-open:rotate-180 text-slate-400" aria-hidden="true">
                  ▶
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-slate-600">{t(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
