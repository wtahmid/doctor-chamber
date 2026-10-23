// Admin dashboard — protected landing page after login.
//
// Lists today's and upcoming appointments, with links to manage each one.
// Real data comes from /api/admin/appointments (server-side authorization).

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  name: string;
  role: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  patient_mobile: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reference: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        // Check auth
        const meRes = await fetch('/api/admin/me', { cache: 'no-store' });
        const me = await meRes.json();
        if (!me.success || !me.admin) {
          router.push('/admin/login');
          return;
        }
        setAdmin(me.admin);

        // Fetch appointments
        const res = await fetch('/api/admin/appointments', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setAppointments(data.appointments ?? []);
        } else {
          setError(data.error ?? 'Failed to load appointments');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  // Group upcoming (today + next 7 days) vs older
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = appointments.filter((a) => {
    const d = new Date(a.date);
    return d >= today;
  });
  const past = appointments.filter((a) => {
    const d = new Date(a.date);
    return d < today;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">
              Welcome, {admin.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">{admin.role}</span>
              <button
                onClick={() => fetch('/api/admin/logout', { method: 'POST' }).then(() => router.push('/admin/login'))}
                className="text-sm text-slate-500 hover:text-red-600 underline"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming appointments.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {upcoming.map((a) => (
                    <tr key={a.reference}>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.time}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.patient_name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600">
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{a.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-4 bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800">Past Appointments ({past.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {past.map((a) => (
                    <tr key={a.reference}>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.time}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.patient_name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
