import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, getSponsors, uploadSponsor, deleteSponsor } from '../services/api';
import axios from 'axios';
import RoleNotice from './RoleNotice';

const API_BASE = `${API_BASE_URL}/api`;

export default function SponsorManager({ token, userRole }) {
  const [sponsors, setSponsors]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [websiteUrl, setWebsiteUrl]   = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview]         = useState(null);
  const [msg, setMsg]                 = useState(null);
  const [isErr, setIsErr]             = useState(false);
  // Editing state
  const [editingId, setEditingId]     = useState(null);
  const [editTitle, setEditTitle]     = useState('');
  const [editUrl, setEditUrl]         = useState('');
  const [saving, setSaving]           = useState(false);
  const fileRef = useRef(null);

  const flash = (text, err = false) => {
    setMsg(text); setIsErr(err);
    setTimeout(() => setMsg(null), 3500);
  };

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await getSponsors();
      setSponsors(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSponsors(); }, []);

  /* ── Upload ── */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!sponsorName) setSponsorName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) { flash('❌ Please select an image first.', true); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', selectedFile);
      fd.append('title', sponsorName || selectedFile.name);
      fd.append('url', websiteUrl.trim());
      await uploadSponsor(fd, token);
      flash('✅ Sponsor added!');
      setShowForm(false); setSelectedFile(null); setPreview(null);
      setWebsiteUrl(''); setSponsorName('');
      if (fileRef.current) fileRef.current.value = '';
      await fetchSponsors();
    } catch { flash('❌ Upload failed. Try again.', true); }
    finally { setUploading(false); }
  };

  /* ── Edit ── */
  const startEdit = (sp) => {
    setEditingId(sp._id);
    setEditTitle(sp.title || '');
    setEditUrl(sp.url || '');
  };

  const cancelEdit = () => { setEditingId(null); setEditTitle(''); setEditUrl(''); };

  const saveEdit = async (sp) => {
    setSaving(true);
    try {
      // For static-* IDs update sponsor-urls.json via a custom endpoint
      await axios.put(
        `${API_BASE}/sponsors/${encodeURIComponent(sp._id)}`,
        { title: editTitle, url: editUrl },
        { headers: { 'x-auth-token': token } }
      );
      flash('✅ Saved!');
      setEditingId(null);
      await fetchSponsors();
    } catch {
      flash('❌ Save failed.', true);
    } finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!confirm('Delete this sponsor?')) return;
    try {
      await deleteSponsor(id, token);
      flash('🗑 Deleted');
      await fetchSponsors();
    } catch { flash('❌ Delete failed.', true); }
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="sponsors" />
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: 30 }}>🏢</span>
          <div>
            <h2 style={s.title}>Sponsor Manager</h2>
            <p style={s.sub}>Upload, edit and manage sponsor logos</p>
          </div>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
          {showForm ? '✕ Cancel' : '+ Add Sponsor'}
        </button>
      </div>

      {/* Flash */}
      {msg && (
        <div style={{
          ...s.flash,
          background: isErr ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${isErr ? '#fca5a5' : '#86efac'}`,
          color: isErr ? '#dc2626' : '#16a34a',
        }}>{msg}</div>
      )}

      {/* Upload Form */}
      {showForm && (
        <div style={s.formBox}>
          <h3 style={s.formTitle}>Add New Sponsor</h3>
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
          <label style={s.label}>Sponsor Name</label>
          <input type="text" placeholder="e.g. Synergy Shipping" value={sponsorName}
            onChange={e => setSponsorName(e.target.value)} style={s.input} />
          <label style={s.label}>Website URL (clicking logo opens this)</label>
          <input type="url" placeholder="https://example.com" value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)} style={s.input} />
          <button onClick={handleUpload} disabled={uploading}
            style={{ ...s.submitBtn, opacity: uploading ? 0.7 : 1 }}>
            {uploading ? '⏳ Uploading…' : '✅ Save Sponsor'}
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={s.empty}>Loading…</div>
      ) : sponsors.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏢</div>
          <p>No sponsors yet. Click <b>&quot;+ Add Sponsor&quot;</b> to add the first one.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {sponsors.map((sp) => {
            const isEditing = editingId === sp._id;
            let domain = '';
            try { domain = sp.url ? new URL(sp.url).hostname.replace('www.', '') : ''; } catch {}

            return (
              <div key={sp._id} style={s.card}>
                {/* Logo preview */}
                <div style={s.imgWrap}>
                  <img src={sp.imageUrl} alt={sp.title} style={s.img}
                    onError={e => { e.target.style.opacity = 0.3; }} />
                </div>

                <div style={s.cardBody}>
                  {isEditing ? (
                    /* ── Edit mode ── */
                    <>
                      <label style={s.editLabel}>Name</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        style={s.editInput}
                        placeholder="Sponsor name"
                      />
                      <label style={s.editLabel}>Website URL</label>
                      <input
                        type="url"
                        value={editUrl}
                        onChange={e => setEditUrl(e.target.value)}
                        style={s.editInput}
                        placeholder="https://example.com"
                      />
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => saveEdit(sp)} disabled={saving}
                          style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}>
                          {saving ? '…' : '✅ Save'}
                        </button>
                        <button onClick={cancelEdit} style={s.cancelBtn}>
                          ✕
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ── View mode ── */
                    <>
                      <p style={s.cardTitle} title={sp.title}>{sp.title || '—'}</p>
                      {domain
                        ? <a href={sp.url} target="_blank" rel="noopener noreferrer" style={s.linkBadge}>
                            🔗 {domain}
                          </a>
                        : <span style={{ ...s.linkBadge, background: '#f3f4f6', color: '#9ca3af' }}>
                            No link set
                          </span>
                      }
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => startEdit(sp)} style={s.editBtn}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(sp._id)} style={s.delBtn}>
                          🗑 Delete
                        </button>
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
  wrap: { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 },
  sub: { fontSize: 13, color: '#6b7280', margin: '2px 0 0' },
  addBtn: { background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  flash: { padding: '10px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  formBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 24 },
  formTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' },
  dropZone: { border: '2px dashed #cbd5e1', borderRadius: 10, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 16, minHeight: 120, background: '#fff' },
  previewImg: { maxHeight: 100, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', outline: 'none' },
  submitBtn: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: 40 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 },
  card: { border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#f9fafb' },
  imgWrap: { height: 100, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, borderBottom: '1px solid #f3f4f6' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  cardBody: { padding: '10px 10px 12px' },
  cardTitle: { fontSize: 12, color: '#374151', fontWeight: 600, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  linkBadge: { display: 'block', fontSize: 11, background: '#eff6ff', color: '#2563eb', borderRadius: 4, padding: '3px 7px', marginBottom: 4, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  editBtn: { flex: 1, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  delBtn: { flex: 1, background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  editLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 },
  editInput: { width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, marginBottom: 8, boxSizing: 'border-box', outline: 'none' },
  saveBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};
