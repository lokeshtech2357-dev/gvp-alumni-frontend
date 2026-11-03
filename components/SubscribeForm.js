import { useState } from 'react';
import { subscribeEmail } from '../services/api';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    try {
      const res = await subscribeEmail({ email, name, source: 'footer' });
      if (res.data && res.data.success) {
        setStatus({ type: 'success', text: res.data.message || 'Subscribed — thank you!' });
        setEmail(''); setName('');
      } else if (res.data && res.data.message) {
        setStatus({ type: 'info', text: res.data.message });
      } else {
        setStatus({ type: 'success', text: 'Subscribed — thank you!' });
      }
    } catch (err) {
      console.error('Subscribe error', err);
      const serverMsg = err?.response?.data?.message || err.message || 'Subscription failed. Try again later.';
      setStatus({ type: 'error', text: serverMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="footer-email" className="block text-xs font-medium text-indigo-100">Email</label>
        <input
          id="footer-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-indigo-100/70 outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/30"
        />
      </div>
      <div>
        <label htmlFor="footer-name" className="block text-xs font-medium text-indigo-100">Name (optional)</label>
        <input
          id="footer-name"
          autoComplete="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-indigo-100/70 outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/30"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Joining...' : 'Join the community'}
        </button>
        {status && (
          <div role="status" className={`text-sm ${status.type === 'error' ? 'text-rose-200' : 'text-emerald-100'}`}>{status.text}</div>
        )}
      </div>
    </form>
  );
}
