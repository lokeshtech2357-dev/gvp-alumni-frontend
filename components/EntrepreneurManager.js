import { useState, useEffect, useRef } from 'react';
import { getEntrepreneurs, uploadEntrepreneur, updateEntrepreneur, deleteEntrepreneur, getStoredAuthToken } from '../services/api';
import RoleNotice from './RoleNotice';

const GRADIENTS = [
  { key: 'green',  label: '🟢 Green',  from: '#34d399', to: '#2dd4bf' },
  { key: 'purple', label: '🟣 Purple', from: '#818cf8', to: '#f472b6' },
  { key: 'blue',   label: '🔵 Blue',   from: '#60a5fa', to: '#818cf8' },
  { key: 'orange', label: '🟠 Orange', from: '#fb923c', to: '#f59e0b' },
];

const gradientStyle = (key) => {
  const g = GRADIENTS.find(g => g.key === key) || GRADIENTS[0];
  return { background: `linear-gradient(135deg, ${g.from}, ${g.to})` };
};

export default function EntrepreneurManager({ token, userRole }) {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [msg, setMsg]               = useState(null);
  const [isErr, setIsErr]           = useState(false);

  // Add form state
  const [name, setName]             = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [gradient, setGradient]     = useState('green');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview]       = useState(null);
  const fileRef = useRef(null);

  // Edit state
  const [editingId, setEditingId]   = useState(null);
  const [editName, setEditName]     = useState('');
  const [editUrl, setEditUrl]       = useState('');
  const [editGradient, setEditGradient] = useState('green');
  const [saving, setSaving]         = useState(false);

  const flash = (text, err = false) => {
    setMsg(text); setIsErr(err);
    setTimeout(() => setMsg(null), 3500);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getEntrepreneurs();
      setItems(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  /* ── File select ── */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!name) setName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── Upload / Add ── */
  const handleUpload = async () => {
    if (!selectedFile) { flash('❌ Please select an image.', true); return; }
    if (!name.trim())  { flash('❌ Please enter a name.', true); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', selectedFile);
      fd.append('name', name.trim());
      fd.append('websiteUrl', websiteUrl.trim());
      fd.append('gradient', gradient);
      const authToken = token || getStoredAuthToken();
      await uploadEntrepreneur(fd, authToken);
      flash('✅ Entrepreneur added!');
      setShowForm(false);
      setName(''); setWebsiteUrl(''); setGradient('green');
      setSelectedFile(null); setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      await fetchItems();
    } catch (e) {
      console.error('Upload error', e);
      const errMsg = e?.response?.data?.message || e?.response?.data?.msg || e?.message || 'Upload failed';
      flash(`❌ Upload failed: ${errMsg}`, true);
    }
    finally { setUploading(false); }
  };

  /* ── Edit ── */
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name || '');
    setEditUrl(item.websiteUrl || '');
    setEditGradient(item.gradient || 'green');
  };
  const cancelEdit = () => { setEditingId(null); setEditName(''); setEditUrl(''); setEditGradient('green'); };

  const saveEdit = async (item) => {
    setSaving(true);
    try {
      await updateEntrepreneur(item._id, { name: editName, websiteUrl: editUrl, gradient: editGradient }, token);
      flash('✅ Saved!');
      setEditingId(null);
      await fetchItems();
    } catch { flash('❌ Save failed.', true); }
    finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!confirm('Delete this entrepreneur entry?')) return;
    try {
      await deleteEntrepreneur(id, token);
      flash('🗑 Deleted');
      await fetchItems();
    } catch { flash('❌ Delete failed.', true); }
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: 30 }}>🏆</span>
          <div>
            <h2 style={s.title}>Alumni Entrepreneurs Manager</h2>
            <p style={s.sub}>Manage entries shown on the Corporate Connect page</p>
          </div>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
          {showForm ? '✕ Cancel' : '+ Add Entrepreneur'}
        </button>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="entrepreneurs" />

      {/* Flash */}
      {msg && (
        <div style={{
          ...s.flash,
          background: isErr ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${isErr ? '#fca5a5' : '#86efac'}`,
          color: isErr ? '#dc2626' : '#16a34a',
        }}>{msg}</div>
      )}

      {/* Add Form */}
      {showForm && (
        <div style={s.formBox}>
          <h3 style={s.formTitle}>Add New Entrepreneur</h3>

          {/* Image drop zone */}
          <div style={s.dropZone} onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
            {preview
              ? <img src={preview} alt="preview" style={s.previewImg} />
              : <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🖼</div>
                  <p style={{ margin: 0, fontSize: 13 }}>Click to select logo</p>
                </div>
            }
          </div>

          <label style={s.label}>Company / Entrepreneur Name *</label>
          <input type="text" placeholder="e.g. Synergy Shipping" value={name}
            onChange={e => setName(e.target.value)} style={s.input} />

          <label style={s.label}>Website URL</label>
          <input type="url" placeholder="https://example.com" value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)} style={s.input} />

          <label style={s.label}>Card Colour Theme</label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {GRADIENTS.map(g => (
              <button key={g.key} onClick={() => setGradient(g.key)}
                style={{
                  ...gradientStyle(g.key),
                  color: '#fff', border: gradient === g.key ? '3px solid #1e293b' : '3px solid transparent',
                  borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                {g.label}
              </button>
            ))}
          </div>

          <button onClick={handleUpload} disabled={uploading}
            style={{ ...s.submitBtn, opacity: uploading ? 0.7 : 1 }}>
            {uploading ? '⏳ Uploading…' : '✅ Save Entrepreneur'}
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div style={s.empty}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏆</div>
          <p>No entrepreneurs yet. Click <b>&quot;+ Add Entrepreneur&quot;</b> to add the first one.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((item) => {
            const isEditing = editingId === item._id;
            const imgSrc = item.imageUrl || '';

            return (
              <div key={item._id} style={s.card}>
                {/* Gradient preview banner */}
                <div style={{ ...gradientStyle(item.gradient), height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '6px 10px', maxWidth: '80%' }}>
                    <img src={imgSrc} alt={item.name} style={{ maxHeight: 50, maxWidth: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.style.opacity = 0.3; }} />
                  </div>
                </div>

                <div style={s.cardBody}>
                  {isEditing ? (
                    <>
                      <label style={s.editLabel}>Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                        style={s.editInput} placeholder="Company name" />

                      <label style={s.editLabel}>Website URL</label>
                      <input type="url" value={editUrl} onChange={e => setEditUrl(e.target.value)}
                        style={s.editInput} placeholder="https://example.com" />

                      <label style={s.editLabel}>Colour Theme</label>
                      <select value={editGradient} onChange={e => setEditGradient(e.target.value)} style={s.editInput}>
                        {GRADIENTS.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
                      </select>

                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => saveEdit(item)} disabled={saving}
                          style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}>
                          {saving ? '…' : '✅ Save'}
                        </button>
                        <button onClick={cancelEdit} style={s.cancelBtn}>✕</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={s.cardTitle} title={item.name}>{item.name || '—'}</p>
                      {item.websiteUrl
                        ? <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" style={s.linkBadge}>
                            🔗 {item.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        : <span style={{ ...s.linkBadge, background: '#f3f4f6', color: '#9ca3af' }}>No link set</span>
                      }
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => startEdit(item)} style={s.editBtn}>✏️ Edit</button>
                        <button onClick={() => handleDelete(item._id)} style={s.delBtn}>🗑 Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap:       { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb' },
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  title:      { fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 },
  sub:        { fontSize: 13, color: '#6b7280', margin: '2px 0 0' },
  addBtn:     { background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  flash:      { padding: '10px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  formBox:    { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 24 },
  formTitle:  { fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' },
  dropZone:   { border: '2px dashed #cbd5e1', borderRadius: 10, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 16, minHeight: 120, background: '#fff' },
  previewImg: { maxHeight: 100, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 },
  label:      { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:      { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', outline: 'none' },
  submitBtn:  { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' },
  empty:      { textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: 40 },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  card:       { border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#f9fafb' },
  cardBody:   { padding: '10px 12px 14px' },
  cardTitle:  { fontSize: 13, color: '#374151', fontWeight: 700, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  linkBadge:  { display: 'block', fontSize: 11, background: '#eff6ff', color: '#2563eb', borderRadius: 4, padding: '3px 7px', marginBottom: 4, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  editBtn:    { flex: 1, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  delBtn:     { flex: 1, background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  editLabel:  { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 },
  editInput:  { width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, marginBottom: 8, boxSizing: 'border-box', outline: 'none' },
  saveBtn:    { flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  cancelBtn:  { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};
