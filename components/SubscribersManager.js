import { useEffect, useState } from 'react';
import { getAllSubscribersAdmin, deleteSubscriber } from '../services/api';
import RoleNotice from './RoleNotice';

export default function SubscribersManager({ token, userRole }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getAllSubscribersAdmin(token);
      setList(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMsg('Unable to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetch(); }, [token]);
  useEffect(() => { if (!token) { setLoading(false); setMsg('Please login to view subscribers'); } }, [token]);

  const handleRemove = async (id) => {
    if (!confirm('Remove subscriber?')) return;
    try {
      await deleteSubscriber(id, token);
      setMsg('Subscriber removed');
      fetch();
    } catch (err) {
      console.error(err);
      setMsg('Failed to remove subscriber');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
          <p className="text-sm text-gray-600">Manage collected emails for future mailings.</p>
        </div>
      </div>
      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="subscriber list" />
      {msg && <div className="mb-4 text-sm text-gray-700">{msg}</div>}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="text-sm text-gray-500">No subscribers yet.</div>
      ) : (
        <div className="space-y-2">
          {list.map(s => (
            <div key={s._id} className="flex items-center justify-between rounded-xl border p-3 bg-white">
              <div>
                <div className="font-medium">{s.email}</div>
                <div className="text-xs text-gray-500">{s.name || '—'} · {new Date(s.subscribedAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard?.writeText(s.email)} className="rounded-full border px-3 py-1 text-sm">Copy</button>
                <button onClick={() => handleRemove(s._id)} className="rounded-full bg-red-500 px-3 py-1 text-sm text-white">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
