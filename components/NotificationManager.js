import { useEffect, useState } from 'react';
import { fetchNotifications, createNotification, updateNotification, deleteNotification } from '../services/api';
import RoleNotice from './RoleNotice';

export default function NotificationManager({ token, userRole }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isError, setIsError] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: '', link: '', important: false, visible: true });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const flash = (text, err = false) => {
    setMsg(text);
    setIsError(err);
    setTimeout(() => setMsg(null), 3000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', link: '', important: false, visible: true });
    setShowForm(true);
  };

  const openEdit = (n) => {
    setEditId(n._id);
    setForm({ title: n.title, link: n.link || '', important: n.important, visible: n.visible });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      flash('Admin token is required for notifications.', true);
      return;
    }

    try {
      if (editId) {
        await updateNotification(editId, form, token);
        flash('✅ Notification updated!');
      } else {
        await createNotification(form, token);
        flash('✅ Notification added!');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ title: '', important: false, visible: true });
      await load();
    } catch (err) {
      flash('❌ Failed to save. Try again.', true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    if (!token) {
      flash('Admin token is required for notifications.', true);
      return;
    }

    try {
      await deleteNotification(id, token);
      flash('🗑️ Deleted successfully');
      await load();
    } catch (e) {
      flash('❌ Delete failed.', true);
    }
  };

  const handleToggle = async (id, field, value) => {
    if (!token) {
      flash('Admin token is required for notifications.', true);
      return;
    }

    try {
      await updateNotification(id, { [field]: value }, token);
      await load();
    } catch (e) {
      flash('❌ Update failed.', true);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>🔔</div>
          <div>
            <h2 style={styles.title}>Latest News Manager</h2>
            <p style={styles.subtitle}>Manage the announcements shown in the Latest News panel above the footer</p>
          </div>
        </div>
        <button onClick={openAdd} style={styles.addBtn}>
          + Add Notification
        </button>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['admin', 'manager', 'super-admin']} feature="notifications" />

      {/* Flash message */}
      {msg && (
        <div style={{
          ...styles.flash,
          ...(isError
            ? { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }
            : { background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a' })
        }}>
          {msg}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editId ? '✏️ Edit Notification' : '➕ New Notification'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notification Text *</label>
              <input
                style={styles.input}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Examinations April 2026 Notification"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notice Link</label>
              <input
                style={styles.input}
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="Optional URL or path, e.g. /notices or /upcoming-events#123"
              />
            </div>
            <div style={styles.checkRow}>
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.important}
                  onChange={(e) => setForm({ ...form, important: e.target.checked })}
                  style={styles.checkbox}
                />
                <span style={{ color: '#e94560', fontWeight: 700 }}>🔴 Mark as IMPORTANT</span>
              </label>
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  style={styles.checkbox}
                />
                <span>👁 Visible on website</span>
              </label>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn}>
                {editId ? '💾 Update' : '➕ Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={styles.emptyState}>Loading notifications…</div>
      ) : items.length === 0 ? (
        <div style={styles.emptyState}>No notifications yet. Click &quot;Add Notification&quot; to create one.</div>
      ) : (
        <div style={styles.list}>
          {items.map((n) => (
            <div key={n._id} style={{ ...styles.item, opacity: n.visible ? 1 : 0.5 }}>
              <div style={styles.itemLeft}>
                {n.important && (
                  <span style={styles.importantBadge}>IMPORTANT</span>
                )}
                {!n.visible && (
                  <span style={styles.hiddenBadge}>HIDDEN</span>
                )}
                <span style={styles.itemTitle}>{n.title}</span>
                {n.link && (
                  <span style={styles.linkBadge}>Link Added</span>
                )}
              </div>
              <div style={styles.itemActions}>
                <button
                  onClick={() => handleToggle(n._id, 'visible', !n.visible)}
                  style={{ ...styles.actionBtn, ...styles.toggleBtn }}
                  title={n.visible ? 'Hide from Latest News' : 'Show in Latest News'}
                >
                  {n.visible ? '👁 Hide' : '👁 Show'}
                </button>
                <button
                  onClick={() => handleToggle(n._id, 'important', !n.important)}
                  style={{ ...styles.actionBtn, ...styles.importantBtn }}
                  title="Toggle important flag"
                >
                  {n.important ? '🔴 Unmark' : '⚡ Important'}
                </button>
                <button
                  onClick={() => openEdit(n)}
                  style={{ ...styles.actionBtn, ...styles.editBtn }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
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

const styles = {
  container: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #e5e7eb',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  headerIcon: {
    fontSize: '32px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '2px 0 0',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  flash: {
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#16a34a',
  },
  formCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
  },
  saveBtn: {
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 22px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    padding: '32px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    flexWrap: 'wrap',
    gap: '10px',
    transition: 'opacity 0.2s',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '200px',
  },
  importantBadge: {
    background: '#e94560',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: '4px',
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  hiddenBadge: {
    background: '#f1f5f9',
    color: '#94a3b8',
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    flexShrink: 0,
  },
  itemTitle: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: 500,
  },
  linkBadge: {
    background: '#eff6ff',
    color: '#2563eb',
    fontSize: '10px',
    fontWeight: 700,
    borderRadius: '999px',
    padding: '2px 8px',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  itemActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  toggleBtn: {
    background: '#f1f5f9',
    color: '#475569',
  },
  importantBtn: {
    background: '#fff7ed',
    color: '#ea580c',
  },
  editBtn: {
    background: '#eff6ff',
    color: '#2563eb',
  },
  deleteBtn: {
    background: '#fef2f2',
    color: '#dc2626',
  },
};
