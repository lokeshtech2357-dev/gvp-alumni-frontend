import { useState } from 'react';
import Link from 'next/link';
import UserAuthLayout from '../components/UserAuthLayout';
import { requestUserPasswordReset } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const { data } = await requestUserPasswordReset(email);
      setMessage(data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'Unable to reach the authentication server. Check that the backend is running, then try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAuthLayout
      eyebrow="Account recovery"
      title="Forgot password?"
      description="Enter the email address linked to your GVP account and we will send a reset link."
    >
      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
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
        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#4c111b] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#731d2b] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Remember your password? <Link href="/user-login" className="font-semibold text-[#8b3c2d] hover:text-[#4c111b]">Sign in</Link>
      </p>
    </UserAuthLayout>
  );
}
