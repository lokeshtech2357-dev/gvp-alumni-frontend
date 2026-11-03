import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { API_BASE_URL, loginAdminWithGoogle } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const apiUrl = `${API_BASE_URL}/api/auth/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.token || !data.user) {
        setError(data.message || 'Unable to sign in. Please check your details and try again.');
        return;
      }

      if (!['admin', 'editor', 'manager', 'super-admin'].includes(data.user.role)) {
        setError('Only accounts created by an administrator can access this portal.');
        return;
      }

      signIn(data);
      await router.push('/dashboard');
    } catch (err) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const { data } = await loginAdminWithGoogle(credential);
      if (!data.token || !data.user || !['admin', 'editor', 'manager', 'super-admin'].includes(data.user.role)) {
        setError('This Google account is not approved for administrator access.');
        return;
      }

      signIn(data);
      await router.push('/dashboard');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'Could not connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f4ef] px-4 py-8 sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-36 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(47,24,20,0.16)] lg:min-h-[650px] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative isolate flex min-h-[330px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4c111b] via-[#731d2b] to-[#9c4a31] p-7 text-white sm:p-10 lg:p-12">
          <div aria-hidden="true" className="absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border-[46px] border-white/[0.07]" />
          <div aria-hidden="true" className="absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-2xl" />
          <div aria-hidden="true" className="absolute right-8 top-1/3 -z-10 h-2 w-2 rounded-full bg-amber-200/70 shadow-[0_0_34px_14px_rgba(253,230,138,0.14)]" />

          <div className="flex items-center gap-4">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-lg ring-1 ring-white/40 sm:h-20 sm:w-20">
              <img
                src="/images/logos/gvp-college-seal.jpg"
                alt="Gayatri Vidya Parishad College seal"
                className="h-full w-full rounded-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide sm:text-base">Gayatri Vidya Parishad</p>
              <p className="mt-1 text-xs text-rose-100 sm:text-sm">Alumni community</p>
            </div>
          </div>

          <div className="relative z-10 py-8 lg:py-12">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100/20 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              A community that stays with you
            </p>
            <h1 className="max-w-md text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Your GVP story
              <span className="mt-1 block text-amber-200">keeps going.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-rose-100 sm:text-base">
              Reconnect with the people, memories, and moments that make GVP feel like home.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-rose-100">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="h-7 w-7 rounded-full border-2 border-[#731d2b] bg-amber-200" />
              <span className="h-7 w-7 rounded-full border-2 border-[#731d2b] bg-rose-200" />
              <span className="h-7 w-7 rounded-full border-2 border-[#731d2b] bg-orange-300" />
            </span>
            <span>One community. A lifetime of connection.</span>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a4a31]">Administrator access</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#281b1a] sm:text-4xl">
                Welcome back<span className="text-[#b77928]">.</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to manage your GVP alumni portal.</p>
            </div>

            {error && (
              <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            {success && (
              <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition focus-within:border-[#9a4a31] focus-within:ring-4 focus-within:ring-[#9a4a31]/10">
                  <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#9a4a31]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gvp.edu.in"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition focus-within:border-[#9a4a31] focus-within:ring-4 focus-within:ring-[#9a4a31]/10">
                  <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#9a4a31]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="10" width="16" height="11" rx="3" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
                  </svg>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:text-[#9a4a31] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4a31]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.6 3.5M6.2 6.2C3.9 7.7 2.7 10 2.5 12c.5 1.2 3.8 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#4c111b] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c111b]/15 transition hover:-translate-y-0.5 hover:bg-[#731d2b] focus:outline-none focus:ring-4 focus:ring-[#9a4a31]/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}
                {!isSubmitting && <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or use an approved Google account
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isSubmitting} />

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <span className="text-xs text-slate-400">Secure access for administrators</span>
              <Link href="/" className="text-sm font-semibold text-[#8b3c2d] transition hover:text-[#4c111b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4a31]">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
