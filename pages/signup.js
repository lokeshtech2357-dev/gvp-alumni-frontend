import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserAuthLayout from '../components/UserAuthLayout';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

const fieldClassName = 'mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#9a4a31] focus:ring-2 focus:ring-[#9a4a31]/15';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, isLoading, signIn } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === 'alumni' ? '/alumni-profile' : '/');
    }
  }, [isLoading, router, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await registerUser({ name, email, password, confirmPassword });
      if (!data.token || !data.user) {
        throw new Error('The registration response did not contain an authenticated user.');
      }
      signIn(data);
      await router.replace('/alumni-profile');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAuthLayout
      eyebrow="Join the GVP community"
      title="Create account"
      description="Create your account to connect with the Gayatri Grads Association community."
    >
      {error && (
        <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Full Name
          <input
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClassName}
            placeholder="Your full name"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClassName}
            placeholder="At least 8 characters"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Confirm Password
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={fieldClassName}
            placeholder="Re-enter your password"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting || isLoading || Boolean(user) || Boolean(success)}
          className="w-full rounded-xl bg-[#4c111b] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#731d2b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/user-login" className="font-semibold text-[#8b3c2d] hover:text-[#4c111b]">
          Sign In
        </Link>
      </p>
    </UserAuthLayout>
  );
}
