import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const adminRoles = ['admin', 'editor', 'manager', 'super-admin'];

export default function LoginSelection() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) return;

    const destination = adminRoles.includes(user.role) ? '/dashboard' : '/user-dashboard';
    router.replace(destination);
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f8ff]" aria-busy="true">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#0f3d7a]" />
          <p className="mt-4 text-sm font-medium text-slate-600">Preparing your access…</p>
        </div>
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7ff] via-white to-[#fefaf0] px-4 py-10 sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/logos/gvp-college-seal.jpg')" }}
      />
      <div aria-hidden="true" className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl rounded-[2rem] border border-blue-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,61,122,0.15)] backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#d9b56d] bg-white p-2 shadow-md shadow-amber-200/60 sm:h-24 sm:w-24">
            <img
              src="/images/logos/gvp-college-seal.jpg"
              alt="GVPIHLR seal"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.48em] text-blue-700 sm:text-xs">GVPIHLR</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0b1d3e] sm:text-5xl">GVPIHLR</h1>
          <p className="mt-3 text-base font-medium text-[#234a7c] sm:text-xl">Connecting Alumni, Inspiring Futures.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-[#f4f9ff] via-white to-[#eaf3ff] p-6 shadow-sm shadow-blue-100/80 sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 20c1.1-3.2 4-5 7.5-5s6.4 1.8 7.5 5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0b1d3e]">User Sign In</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Access your alumni profile, connect with fellow alumni, and explore career opportunities.
            </p>
            <div className="mt-8">
              <Link
                href="/user-login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0f3d7a] to-[#1d5bbf] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue as User
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-100 bg-gradient-to-br from-[#fffdf8] via-white to-[#fff6e7] p-6 shadow-sm shadow-amber-100/80 sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9b56d] text-[#0d1a2a] shadow-lg shadow-amber-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
                <path d="M12 3 5 6v5c0 4.3 2.7 8.2 7 10 4.3-1.8 7-5.7 7-10V6l-7-3Z" />
                <path d="M9.5 12.5 11 14l3.5-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0b1d3e]">Administration Login</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Authorized administrators can manage alumni records, registrations, events, and website content.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1a3558] to-[#2d4f7d] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue as Administrator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
