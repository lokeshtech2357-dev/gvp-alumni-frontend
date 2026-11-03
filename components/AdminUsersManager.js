import { useCallback, useEffect, useState } from 'react';
import {
  createAdminUser,
  createPasswordAdminAccount,
  deleteAdminUser,
  deletePasswordAdminAccount,
  getAdminUsers,
  getPasswordAdminAccounts,
  updateAdminUser,
  updatePasswordAdminAccount
} from '../services/api';
import RoleNotice from './RoleNotice';

const roles = ['editor', 'admin', 'manager', 'super-admin'];

export default function AdminUsersManager({ token, userRole, currentUserId }) {
  const [grants, setGrants] = useState([]);
  const [passwordAccounts, setPasswordAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [passwordAccountForm, setPasswordAccountForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor'
  });
  const [isCreatingPasswordAccount, setIsCreatingPasswordAccount] = useState(false);
  const [passwordEditingId, setPasswordEditingId] = useState(null);
  const [passwordEditForm, setPasswordEditForm] = useState({
    name: '',
    email: '',
    role: 'editor',
    password: '',
    confirmPassword: ''
  });
  const [isSavingPasswordAccount, setIsSavingPasswordAccount] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'editor' });
  const [message, setMessage] = useState(null);
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);
  const canAssignSuperAdmin = userRole === 'super-admin';

  const fetchGrants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers(token);
      setGrants(response.data.data || []);
    } catch (error) {
      console.error('Unable to load approved account roles:', error);
      setMessage({ type: 'error', text: 'Unable to load approved accounts.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPasswordAccounts = useCallback(async () => {
    try {
      const response = await getPasswordAdminAccounts(token);
      setPasswordAccounts(response.data.data || []);
    } catch (error) {
      console.error('Unable to load password-based admin accounts:', error);
      setMessage({ type: 'error', text: 'Unable to load password-based admin accounts.' });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchGrants();
      fetchPasswordAccounts();
    }
  }, [fetchGrants, fetchPasswordAccounts, token]);

  const handleCreatePasswordAccount = async (event) => {
    event.preventDefault();
    if (passwordAccountForm.password !== passwordAccountForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsCreatingPasswordAccount(true);
    try {
      await createPasswordAdminAccount(passwordAccountForm, token);
      setMessage({ type: 'success', text: 'Password-based admin account created. The user can sign in at the Admin Login page.' });
      setPasswordAccountForm({ name: '', email: '', password: '', confirmPassword: '', role: 'editor' });
      await fetchPasswordAccounts();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to create password-based admin account.'
      });
    } finally {
      setIsCreatingPasswordAccount(false);
    }
  };

  const startEditingPasswordAccount = (account) => {
    setPasswordEditingId(account._id);
    setPasswordEditForm({
      name: account.name,
      email: account.email,
      role: account.role,
      password: '',
      confirmPassword: ''
    });
  };

  const handleSavePasswordAccount = async (event) => {
    event.preventDefault();
    if (passwordEditForm.password !== passwordEditForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSavingPasswordAccount(true);
    try {
      await updatePasswordAdminAccount(passwordEditingId, passwordEditForm, token);
      setPasswordEditingId(null);
      setMessage({ type: 'success', text: 'Admin account updated. Existing sessions for this account have been signed out.' });
      await fetchPasswordAccounts();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to update password-based admin account.'
      });
    } finally {
      setIsSavingPasswordAccount(false);
    }
  };

  const handleDeletePasswordAccount = async (account) => {
    if (!confirm(`Permanently remove ${account.name}'s admin account? They will no longer be able to sign in.`)) return;
    try {
      await deletePasswordAdminAccount(account._id, token);
      setMessage({ type: 'success', text: 'Password-based admin account removed.' });
      await fetchPasswordAccounts();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to remove password-based admin account.'
      });
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsGrantingAccess(true);
    try {
      await createAdminUser({ name, email, role }, token);
      setMessage({ type: 'success', text: 'Role access granted. The user can now sign in with that Google email.' });
      setName('');
      setEmail('');
      setRole('editor');
      await fetchGrants();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to grant account access.'
      });
    } finally {
      setIsGrantingAccess(false);
    }
  };

  const startEditing = (grant) => {
    setEditingId(grant._id);
    setEditForm({ name: grant.name || '', email: grant.email, role: grant.role });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await updateAdminUser(editingId, editForm, token);
      setEditingId(null);
      setMessage({ type: 'success', text: 'Approved name, email, and role updated.' });
      await fetchGrants();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to update approved account.'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this account’s approved access?')) return;
    try {
      await deleteAdminUser(id, token);
      setMessage({ type: 'success', text: 'Approved access removed.' });
      await fetchGrants();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to remove approved access.'
      });
    }
  };

  const isCurrentGrant = (grant) => {
    const currentId = String(currentUserId || '');
    return currentId === String(grant._id) || currentId === `grant:${grant._id}`;
  };
  const googleAdminCount = grants.filter((grant) => ['admin', 'super-admin'].includes(grant.role)).length;
  const managerCount = grants.filter((grant) => grant.role === 'manager').length;
  const editorCount = grants.filter((grant) => grant.role === 'editor').length;

  return (
    <div className="space-y-7">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 p-6 text-white shadow-xl sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[40px] border-white/[0.06]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Access control
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your team, with the right access.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                Invite trusted teammates with Google sign-in and assign only the role they need. Passwords and Google profile details are never stored here.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[370px]">
              {[
                { label: 'Google accounts', value: grants.length },
                { label: 'Editors', value: editorCount },
                { label: 'Managers', value: managerCount }
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-4 backdrop-blur-sm sm:px-4">
                  <div className="text-2xl font-bold tabular-nums sm:text-3xl">{loading ? '—' : stat.value}</div>
                  <div className="mt-1 text-[11px] leading-4 text-blue-100/75 sm:text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-blue-100/70">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
              <path d="M10 2.5 16 5v4.4c0 3.8-2.6 6.5-6 8.1-3.4-1.6-6-4.3-6-8.1V5l6-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m7.5 10 1.7 1.7 3.4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{loading ? 'Loading team access…' : `${googleAdminCount} admin${googleAdminCount === 1 ? '' : 's'} with elevated access`}</span>
          </div>
        </div>
      </section>

      {message && (
        <div role="status" className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${message.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${message.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          {message.text}
        </div>
      )}

      <RoleNotice userRole={userRole} allowedRoles={['admin', 'super-admin']} feature="admin user management" />

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0M19 8v6m-3-3h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Add a teammate</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Grant Google sign-in access</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">Use the exact Google email address they will use to sign in.</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleCreate} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-[1fr_1.2fr_0.8fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Lokesh Kumar"
              aria-label="Account name"
              autoComplete="name"
              maxLength={100}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Google account email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              aria-label="Google account email"
              autoComplete="email"
              maxLength={254}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Assign role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-label="Account role"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              {roles.map((item) => (
                <option key={item} value={item} disabled={item === 'super-admin' && !canAssignSuperAdmin}>
                  {item === 'super-admin' && !canAssignSuperAdmin ? 'super-admin (super-admin only)' : item}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={isGrantingAccess}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isGrantingAccess ? 'Granting access…' : 'Grant access'}
            {!isGrantingAccess && <span aria-hidden="true">→</span>}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Approved Google accounts</h3>
            <p className="mt-1 text-sm text-slate-500">Review team access and make role changes when needed.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {loading ? 'Loading…' : `${grants.length} ${grants.length === 1 ? 'account' : 'accounts'}`}
          </span>
        </div>
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : grants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">Your approved team starts here</h4>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Add a teammate above to give them secure access with their Google account.</p>
            </div>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {grants.map((grant) => (
                <article key={grant._id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md sm:p-5">
                  {editingId === grant._id ? (
                    <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Full name</span>
                        <input
                          value={editForm.name}
                          onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                          aria-label="Account name"
                          maxLength={100}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          required
                        />
                      </label>
                      <label>
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Google email</span>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                          aria-label="Approved Google email"
                          maxLength={254}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          required
                        />
                      </label>
                      <label>
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">Role</span>
                        <select
                          value={editForm.role}
                          onChange={(event) => setEditForm({ ...editForm, role: event.target.value })}
                          aria-label="Approved account role"
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm capitalize text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          {roles.map((item) => (
                            <option key={item} value={item} disabled={item === 'super-admin' && !canAssignSuperAdmin}>
                              {item === 'super-admin' && !canAssignSuperAdmin ? 'super-admin (super-admin only)' : item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="flex gap-2 sm:col-span-2">
                        <button className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Save changes</button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-bold uppercase text-blue-700">
                          {(grant.name || grant.email || '?').charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate font-semibold text-slate-900">{grant.name || 'Name not set'}</h4>
                          <p className="mt-0.5 truncate text-sm text-slate-500">{grant.email}</p>
                          <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700">
                            {grant.role}
                          </span>
                        </div>
                      </div>
                      {isCurrentGrant(grant) ? (
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">Current account</span>
                      ) : grant.role === 'super-admin' && userRole !== 'super-admin' ? (
                        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">Super-admin only</span>
                      ) : (
                        <div className="flex shrink-0 gap-2">
                          <button type="button" onClick={() => startEditing(grant)} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Edit</button>
                          <button type="button" onClick={() => handleDelete(grant._id)} className="rounded-xl border border-rose-100 px-3.5 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">Remove</button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900">Create password-based admin account</h3>
          <p className="mt-1 text-sm text-slate-600">
            Create a separate email-and-password account for the admin login page. Passwords are securely hashed and never displayed or stored as plain text.
          </p>
        </div>

        <form onSubmit={handleCreatePasswordAccount} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={passwordAccountForm.name}
            onChange={(event) => setPasswordAccountForm({ ...passwordAccountForm, name: event.target.value })}
            placeholder="Full name"
            aria-label="Password account name"
            maxLength={100}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-gray-900"
            required
          />
          <input
            type="email"
            value={passwordAccountForm.email}
            onChange={(event) => setPasswordAccountForm({ ...passwordAccountForm, email: event.target.value })}
            placeholder="Admin email"
            aria-label="Password account email"
            maxLength={254}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-gray-900"
            required
          />
          <select
            value={passwordAccountForm.role}
            onChange={(event) => setPasswordAccountForm({ ...passwordAccountForm, role: event.target.value })}
            aria-label="Password account role"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-gray-900"
          >
            {roles.map((item) => (
              <option key={item} value={item} disabled={item === 'super-admin' && !canAssignSuperAdmin}>
                {item === 'super-admin' && !canAssignSuperAdmin ? 'super-admin (super-admin only)' : item}
              </option>
            ))}
          </select>
          <input
            type="password"
            autoComplete="new-password"
            value={passwordAccountForm.password}
            onChange={(event) => setPasswordAccountForm({ ...passwordAccountForm, password: event.target.value })}
            placeholder="Password (at least 8 characters)"
            aria-label="Password for new admin account"
            minLength={8}
            maxLength={72}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-gray-900"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            value={passwordAccountForm.confirmPassword}
            onChange={(event) => setPasswordAccountForm({ ...passwordAccountForm, confirmPassword: event.target.value })}
            placeholder="Confirm password"
            aria-label="Confirm password for new admin account"
            minLength={8}
            maxLength={72}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-gray-900"
            required
          />
          <button
            type="submit"
            disabled={isCreatingPasswordAccount}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingPasswordAccount ? 'Creating account…' : 'Create admin account'}
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Admin email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Sign-in method</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordAccounts.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-5 text-center text-slate-500">No password-based admin accounts yet.</td></tr>
              ) : passwordAccounts.map((account) => (
                <tr key={account._id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {passwordEditingId === account._id ? (
                      <input
                        value={passwordEditForm.name}
                        onChange={(event) => setPasswordEditForm({ ...passwordEditForm, name: event.target.value })}
                        aria-label="Edit admin account name"
                        maxLength={100}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        required
                      />
                    ) : account.name}
                  </td>
                  <td className="px-4 py-3">
                    {passwordEditingId === account._id ? (
                      <input
                        type="email"
                        value={passwordEditForm.email}
                        onChange={(event) => setPasswordEditForm({ ...passwordEditForm, email: event.target.value })}
                        aria-label="Edit admin account email"
                        maxLength={254}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        required
                      />
                    ) : account.email}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {passwordEditingId === account._id ? (
                      <select
                        value={passwordEditForm.role}
                        onChange={(event) => setPasswordEditForm({ ...passwordEditForm, role: event.target.value })}
                        aria-label="Edit admin account role"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                      >
                        {roles.map((item) => (
                          <option key={item} value={item} disabled={item === 'super-admin' && !canAssignSuperAdmin}>
                            {item === 'super-admin' && !canAssignSuperAdmin ? 'super-admin (super-admin only)' : item}
                          </option>
                        ))}
                      </select>
                    ) : account.role}
                  </td>
                  <td className="px-4 py-3">Email and password</td>
                  <td className="px-4 py-3">
                    {passwordEditingId === account._id ? (
                      <form onSubmit={handleSavePasswordAccount} className="min-w-52 space-y-2">
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={passwordEditForm.password}
                          onChange={(event) => setPasswordEditForm({ ...passwordEditForm, password: event.target.value })}
                          aria-label="New admin account password"
                          placeholder="New password (optional)"
                          minLength={8}
                          maxLength={72}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={passwordEditForm.confirmPassword}
                          onChange={(event) => setPasswordEditForm({ ...passwordEditForm, confirmPassword: event.target.value })}
                          aria-label="Confirm new admin account password"
                          placeholder="Confirm new password"
                          minLength={8}
                          maxLength={72}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isSavingPasswordAccount}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {isSavingPasswordAccount ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPasswordEditingId(null)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : String(account._id) === String(currentUserId) ? (
                      <span className="text-xs text-slate-500">Current account</span>
                    ) : account.role === 'super-admin' && userRole !== 'super-admin' ? (
                      <span className="text-xs text-slate-500">Super-admin only</span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditingPasswordAccount(account)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePasswordAccount(account)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
