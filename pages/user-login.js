import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserAuthLayout from '../components/UserAuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { loginUser, loginUserWithGoogle } from '../services/api';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, isLoading, signIn } = useAuth();

  useEffect(() => {
    if (!isLoading && user) router.replace('/');
  }, [isLoading, router, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await loginUser({ email, password });
      signIn(data);
      await router.replace('/user-dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await loginUserWithGoogle(credential);
      signIn(data);
      await router.replace('/user-dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAuthLayout
      eyebrow="Welcome to the GVP community"
      title="Sign in"
      description="Sign in to continue to the Gayatri Grads Association website."
    >
      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Email address
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#9a4a31] focus:ring-2 focus:ring-[#9a4a31]/15"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#9a4a31] focus:ring-2 focus:ring-[#9a4a31]/15"
            placeholder="Your password"
          />
        </label>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-[#8b3c2d] hover:text-[#4c111b]">Forgot password?</Link>
        </div>
        <button type="submit" disabled={isSubmitting || (isLoading || Boolean(user))} className="w-full rounded-xl bg-[#4c111b] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#731d2b] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or continue temporarily with Google
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isSubmitting || isLoading || Boolean(user)} />
    </UserAuthLayout>
  );
}
