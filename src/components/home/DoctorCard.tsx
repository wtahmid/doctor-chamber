// Doctor profile card: displays the verified doctor details with a
// placeholder photo until a real portrait is supplied.

"use client";

import { doctorData } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

export function DoctorCard() {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44">
          <div className="absolute inset-0 rounded-full bg-slate-100 flex items-center justify-center text-5xl" aria-hidden="true">
            🧑‍⚕️
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {doctorData.qualification.slice(0, 2)}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('doctor.title')}</h2>
          <p className="text-xl text-slate-700">{doctorData.name}</p>
          <p className="text-sm text-slate-500">{doctorData.qualification} · {doctorData.designation}</p>
          <p className="mt-2 text-slate-600">{doctorData.description}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">👤</span> {t('doctor.photoAlt')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">📷</span> {doctorData.photoPlaceholder}
        </span>
      </div>
    </div>
  );
}
