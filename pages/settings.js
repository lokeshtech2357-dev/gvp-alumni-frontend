import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const [preferences, setPreferences] = useState({
    eventAlerts: true,
    newsletter: true,
    mentorshipRequests: true,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSignOut = async () => {
    await signOut();
    await router.push('/login-selection');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-[#0284c7]" />
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading settings…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="text-center max-w-sm rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Please sign in to view your account settings.</p>
          <Link
            href="/login-selection"
            className="mt-4 inline-block rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Account Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account preferences, security settings, and communication options.
          </p>
        </div>

        {savedNotice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 transition">
            ✓ Preferences saved successfully.
          </div>
        )}

        {/* Account Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{user.name}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email Address</span>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">{user.email}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Membership Role</span>
              <p className="text-sm font-bold text-cyan-700 mt-1 capitalize">{user.role} Member</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Profile Status</span>
              <p className="text-sm font-bold text-emerald-700 mt-1">Active</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/alumni-profile"
              className="rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
            >
              Edit Full Alumni Profile →
            </Link>
          </div>
        </div>

        {/* Notifications & Communications Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900">Communication Preferences</h2>
          
          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Upcoming Alumni Events</p>
                <p className="text-xs text-slate-500">Receive notifications about reunions and college webinars.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.eventAlerts}
                onChange={() => handleToggle('eventAlerts')}
                className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Gayatri Grads Newsletter</p>
                <p className="text-xs text-slate-500">Occasional updates and institutional achievements.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={() => handleToggle('newsletter')}
                className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Mentorship &amp; Networking Alerts</p>
                <p className="text-xs text-slate-500">Allow fellow alumni and students to contact you for guidance.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.mentorshipRequests}
                onChange={() => handleToggle('mentorshipRequests')}
                className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Sign Out */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">End your current session across this browser securely.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 px-5 py-2.5 text-xs font-bold transition"
          >
            Sign Out Now
          </button>
        </div>

      </div>
    </div>
  );
}

