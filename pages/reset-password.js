import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserAuthLayout from '../components/UserAuthLayout';
import { resetUserPassword } from '../services/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (typeof router.query.token !== 'string') {
      setError('This password reset link is invalid or expired.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await resetUserPassword({
        token: router.query.token,
        password,
        confirmPassword
      });
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAuthLayout
      eyebrow="Account recovery"
      title="Set a new password"
      description="Choose a new password for your GVP account."
    >
      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message ? (
        <div className="mt-5">
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>
          <Link href="/user-login" className="mt-5 inline-block font-semibold text-[#8b3c2d] hover:text-[#4c111b]">Go to sign in</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            New password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#9a4a31] focus:ring-2 focus:ring-[#9a4a31]/15"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#9a4a31] focus:ring-2 focus:ring-[#9a4a31]/15"
              placeholder="Re-enter your password"
            />
          </label>
          <button type="submit" disabled={isSubmitting || !router.isReady} className="w-full rounded-xl bg-[#4c111b] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#731d2b] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Updating password…' : 'Reset password'}
          </button>
        </form>
      )}
    </UserAuthLayout>
  );
}
