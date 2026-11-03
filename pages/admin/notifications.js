import React, { useEffect, useState } from 'react';
import { fetchNotifications, createNotification, updateNotification, deleteNotification, getStoredAuthToken } from '../../services/api';
import { useRouter } from 'next/router';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [important, setImportant] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getStoredAuthToken();
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createNotification({ title, important, visible }, token);
      setMessage('Notification created');
      setTitle(''); setImportant(false); setVisible(true);
      await load();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) { setMessage('Create failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?') || !token) return;
    try {
      await deleteNotification(id, token);
      setMessage('Deleted');
      await load();
      setTimeout(() => setMessage(null), 2000);
    } catch (e) { setMessage('Delete failed'); }
  };

  const toggle = async (id, field, value) => {
    if (!token) return;
    try {
      await updateNotification(id, { [field]: value }, token);
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Manage Notifications</h1>

        <div className="bg-white shadow rounded p-4 mb-6">
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notification Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter notification title" required />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2"><input type="checkbox" checked={important} onChange={e=>setImportant(e.target.checked)} /> <span>Important</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)} /> <span>Visible</span></label>
            </div>

            <div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add Notification</button>
            </div>
          </form>
          {message && <div className="mt-3 text-sm text-green-600">{message}</div>}
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-3">All Notifications</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (!notifications.length ? (
            <div className="text-gray-500">No notifications yet.</div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n._id} className="flex items-center justify-between border p-3 rounded">
                  <div className="flex items-center space-x-3">
                    {n.important && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">IMPORTANT</span>}
                    <div>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={()=>toggle(n._id, 'visible', !n.visible)} className="px-2 py-1 rounded border text-sm">{n.visible ? 'Hide' : 'Show'}</button>
                    <button onClick={()=>toggle(n._id, 'important', !n.important)} className="px-2 py-1 rounded border text-sm">{n.important ? 'Unmark' : 'Mark Important'}</button>
                    <button onClick={()=>handleDelete(n._id)} className="px-2 py-1 rounded bg-red-500 text-white text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
