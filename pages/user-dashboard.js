import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AlumniAnalyticsDashboard from '../components/AlumniAnalyticsDashboard';
import { getMyOfficialAlumniRecord, getStoredAuthToken } from '../services/api';

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [officialAlumni, setOfficialAlumni] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login-selection');
    } else if (['admin', 'editor', 'manager', 'super-admin'].includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (user?.role !== 'alumni') return;
    const token = getStoredAuthToken();
    if (token) getMyOfficialAlumniRecord(token).then((response) => setOfficialAlumni(response.data.alumni)).catch(() => setOfficialAlumni(null));
  }, [user]);

  if (isLoading || !user || !['alumni', 'guest'].includes(user.role)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc]" aria-busy="true">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-[#0284c7]" />
          <p className="mt-4 text-xs font-semibold text-slate-500">Opening your dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full">
      {user.role === 'alumni' && <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {officialAlumni?.officialName || user.name}!</h1>
          <p className="mt-1 text-sm text-slate-600">We&apos;re delighted to reconnect with you through the GVPIHLR Alumni Community.</p>
          {officialAlumni && <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Course</dt><dd className="mt-1 font-semibold text-slate-800">{officialAlumni.course}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Year of joining</dt><dd className="mt-1 font-semibold text-slate-800">{officialAlumni.yearOfJoining}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Register number</dt><dd className="mt-1 font-semibold text-slate-800">{officialAlumni.registerNumber}</dd></div>
            {officialAlumni.department && <div><dt className="text-xs font-semibold uppercase text-slate-500">Department</dt><dd className="mt-1 font-semibold text-slate-800">{officialAlumni.department}</dd></div>}
          </dl>}
        </div>
      </section>}
      <AlumniAnalyticsDashboard />
    </div>
  );
}
