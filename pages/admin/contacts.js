import { useEffect, useState } from 'react';
import { getAllContactsAdmin, updateContact, deleteContact, getStoredAuthToken } from '../../services/api';
import Head from 'next/head';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // NOTE: this page requires an admin JWT token. Replace this with your auth flow.
  const token = getStoredAuthToken();

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllContactsAdmin(token);
      // API returns { success, data }
      setContacts(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load contacts. Ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id) => {
    try {
      await updateContact(id, { isRead: true }, token);
      setContacts((prev) => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
    } catch (err) {
      console.error(err);
      alert('Failed to mark as read');
    }
  };

  const removeContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await deleteContact(id, token);
      setContacts((prev) => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Head>
        <title>Admin - Contacts</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin — Contacts</h1>

        {error && <div className="mb-4 text-red-700">{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {contacts.length === 0 && <div>No contacts found.</div>}

            {contacts.map(contact => (
              <div key={contact._id} className={`bg-white border p-4 rounded-lg shadow-sm ${contact.isRead ? 'opacity-70' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <p className="text-sm text-slate-600">{contact.email} • {contact.phone}</p>
                    <p className="mt-1 text-sm text-slate-500">Subject: {contact.subject || 'General'} • Type: {contact.type || 'general'}</p>
                    <p className="mt-2 text-slate-700 whitespace-pre-wrap">{contact.message}</p>
                    <p className="mt-2 text-xs text-slate-500">Submitted: {new Date(contact.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!contact.isRead && (
                      <button onClick={() => markAsRead(contact._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Mark read</button>
                    )}
                    <button onClick={() => removeContact(contact._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
