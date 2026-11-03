import { useState, useEffect } from 'react';
import { getAllContactsAdmin, updateContact, hardDeleteContact, getStoredAuthToken } from '../services/api';
import RoleNotice from './RoleNotice';

export default function ContactManager({ token, userRole }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const flash = (text, err = false) => {
    setMsg(text);
    setIsErr(err);
    setTimeout(() => setMsg(null), 3500);
  };

  const getAuthToken = () => {
    if (token) return token;
    return getStoredAuthToken();
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      const res = await getAllContactsAdmin(authToken);
      setContacts(res.data.data || []);
    } catch (e) {
      console.error(e);
      flash('❌ Failed to fetch messages.', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchContacts();
  }, [token]);

  const handleToggleRead = async (contact) => {
    try {
      const nextReadState = !contact.isRead;
      const authToken = getAuthToken();
      await updateContact(contact._id, { isRead: nextReadState }, authToken);
      flash(`✅ Marked message from ${contact.name} as ${nextReadState ? 'Read' : 'Unread'}`);
      await fetchContacts();
    } catch {
      flash('❌ Failed to update status.', true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      const authToken = getAuthToken();
      await hardDeleteContact(id, authToken);
      flash('🗑 Message deleted successfully.');
      await fetchContacts();
    } catch {
      flash('❌ Delete failed.', true);
    }
  };

  // Filter messages
  const filtered = contacts.filter((c) => {
    const matchType = filterType === 'all' || c.type === filterType;
    const matchRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !c.isRead) ||
      (filterRead === 'read' && c.isRead);
    return matchType && matchRead;
  });

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const fmtDate = (d) => {
    return d ? new Date(d).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '—';
  };

  const typeLabels = {
    general: 'General Enquiry',
    alumni: 'Alumni Stack',
    events: 'Events Enquiry',
    careers: 'Careers / Jobs',
    other: 'Other Enquiry'
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: 30 }}>📬</span>
          <div>
            <h2 style={s.title}>User Messages & Enquiries</h2>
            <p style={s.sub}>
              Read and manage contact messages submitted by alumni and visitors ({contacts.length} total)
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span style={s.unreadBadge}>
            {unreadCount} Unread Message{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Flash Alert */}
      <RoleNotice userRole={userRole} allowedRoles={['admin', 'manager', 'super-admin']} feature="contact messages" />

      {msg && (
        <div style={{
          ...s.flash,
          background: isErr ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${isErr ? '#fca5a5' : '#86efac'}`,
          color: isErr ? '#dc2626' : '#16a34a',
        }}>{msg}</div>
      )}

      {/* Filters Bar */}
      <div style={s.filtersBar}>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Filter Category:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={s.select}>
            <option value="all">All Categories</option>
            <option value="general">General Enquiry</option>
            <option value="alumni">Alumni Stack</option>
            <option value="events">Events Enquiry</option>
            <option value="careers">Careers</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Status:</label>
          <select value={filterRead} onChange={e => setFilterRead(e.target.value)} style={s.select}>
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>

        <button onClick={fetchContacts} style={s.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      {/* Message List */}
      {loading ? (
        <div style={s.empty}>Loading contact submissions…</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
          <p>No messages match your selected filters.</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((msg) => (
            <div
              key={msg._id}
              style={{
                ...s.card,
                borderLeft: `5px solid ${msg.isRead ? '#cbd5e1' : '#4f46e5'}`,
                background: msg.isRead ? '#f8fafc' : '#ffffff'
              }}
            >
              {/* Card Header Info */}
              <div style={s.cardHead}>
                <div>
                  <h3 style={s.senderName}>{msg.name}</h3>
                  <div style={s.metaRow}>
                    <a href={`mailto:${msg.email}`} style={s.metaLink} title="Send Email">
                      ✉️ {msg.email}
                    </a>
                    {msg.phone && (
                      <span style={s.metaText}>
                        📞 {msg.phone}
                      </span>
                    )}
                    <span style={s.metaText}>
                      📅 {fmtDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    ...s.categoryTag,
                    background: msg.isRead ? '#e2e8f0' : '#e0e7ff',
                    color: msg.isRead ? '#475569' : '#4f46e5'
                  }}>
                    {typeLabels[msg.type] || msg.type}
                  </span>
                  {!msg.isRead && <span style={s.newDot} title="Unread message" />}
                </div>
              </div>

              {/* Subject */}
              <div style={s.subjectRow}>
                <strong>Subject:</strong> {msg.subject}
              </div>

              {/* Message Content Box */}
              <div style={s.messageBox}>
                {msg.message}
              </div>

              {/* Card Actions */}
              <div style={s.actions}>
                <button
                  onClick={() => handleToggleRead(msg)}
                  style={{
                    ...s.btn,
                    background: msg.isRead ? '#f1f5f9' : '#eff6ff',
                    color: msg.isRead ? '#475569' : '#1d4ed8',
                    border: `1.5px solid ${msg.isRead ? '#cbd5e1' : '#bfdbfe'}`
                  }}
                >
                  {msg.isRead ? '👁️ Mark Unread' : '✅ Mark as Read'}
                </button>

                <a
                  href={`mailto:${msg.email}?subject=Regarding your GVP Alumni message: ${encodeURIComponent(msg.subject)}`}
                  style={{
                    ...s.btn,
                    textDecoration: 'none',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  💬 Reply via Email
                </a>

                <button
                  onClick={() => handleDelete(msg._id)}
                  style={{
                    ...s.btn,
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    marginLeft: 'auto'
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { background: '#wrapBg', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', background: '#fff' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 },
  sub: { fontSize: 13, color: '#6b7280', margin: '2px 0 0' },
  unreadBadge: { background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 50, padding: '5px 14px' },
  flash: { padding: '10px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  filtersBar: { display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20, flexWrap: 'wrap' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: 8 },
  filterLabel: { fontSize: 12, fontWeight: 650, color: '#475569' },
  select: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' },
  refreshBtn: { background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto', transition: 'background 0.2s' },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: 50 },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { borderRadius: 14, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  senderName: { fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  metaLink: { fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 },
  metaText: { fontSize: 12, color: '#64748b' },
  categoryTag: { fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: 0.5 },
  newDot: { width: 10, height: 10, borderRadius: '50%', background: '#4f46e5' },
  subjectRow: { fontSize: 14, color: '#334155', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' },
  messageBox: { fontSize: 14, color: '#475569', lineHeight: 1.6, background: '#f8fafc', padding: 14, borderRadius: 10, whiteSpace: 'pre-line', border: '1px solid #f1f5f9' },
  actions: { display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  btn: { padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' },
};
