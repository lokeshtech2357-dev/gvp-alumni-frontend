import { useEffect, useState, useRef } from 'react';
import { getAllEventsAdmin, createEvent, updateEvent, deleteEvent, hardDeleteEvent, uploadEventImage, getStoredAuthToken } from '../services/api';
import RoleNotice from './RoleNotice';

const TYPE_COLORS = {
  conference: '#3b82f6',
  workshop: '#10b981',
  seminar: '#8b5cf6',
  cultural: '#ec4899',
  sports: '#f59e0b',
  reunion: '#6366f1',
  other: '#64748b'
};

const isVideoUrl = (url) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) || lowerUrl.includes('data:video/');
};

const emptyForm = {
  title: '',
  description: '',
  date: '2024-11-24', // default to past date
  location: '',
  type: 'cultural',
  organizer: 'Gayatri Vidya Parishad',
  registrationLink: '',
  maxParticipants: '',
  images: [],
  banner: '',
  isActive: true,
};

export default function PreviousEventsManager({ token, userRole }) {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragOverBanner, setDragOverBanner] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const bannerFileRef = useRef();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEventsAdmin(token);
      // Filter past events only
      const past = (res.data.data || []).filter(e => new Date(e.date) < new Date());
      setEvents(past);
    } catch {
      notify('error', 'Failed to load previous events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const notify = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) }); // yesterday
    setShowForm(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title:            ev.title || '',
      description:      ev.description || '',
      date:             ev.date ? ev.date.slice(0, 10) : '',
      location:         ev.location || '',
      type:             ev.type || 'other',
      organizer:        ev.organizer || '',
      registrationLink: ev.registrationLink || '',
      maxParticipants:  ev.maxParticipants || '',
      images:           ev.images || [],
      banner:           ev.banner || '',
      isActive:         ev.isActive !== false,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    readImages(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    readImages(files);
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    setDragOverBanner(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) uploadBannerFile(files[0]);
  };

  const handleBannerFileInput = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) uploadBannerFile(files[0]);
  };

  const uploadBannerFile = async (file) => {
    const token = getStoredAuthToken();
    setUploading(true);
    try {
      if (token) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await uploadEventImage(fd, token);
        const url = res?.data?.data?.imageUrl || res?.data?.imageUrl || res?.data?.data?.imageUrl;
        if (url) {
          setForm(prev => ({ ...prev, banner: url }));
        } else {
          const reader = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(file);
          });
          setForm(prev => ({ ...prev, banner: reader }));
        }
      } else {
        const reader = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        setForm(prev => ({ ...prev, banner: reader }));
      }
    } catch (err) {
      try {
        const reader = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        setForm(prev => ({ ...prev, banner: reader }));
      } catch (e) {
        console.error('Failed to upload banner', e);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeBanner = () => {
    setForm(prev => ({ ...prev, banner: '' }));
  };

  const readImages = async (files) => {
    const token = getStoredAuthToken();
    const added = [];
    setUploading(true);

    for (const file of files) {
      try {
        if (token) {
          const fd = new FormData();
          fd.append('image', file);
          const res = await uploadEventImage(fd, token);
          const url = res?.data?.data?.imageUrl || res?.data?.imageUrl || res?.data?.data?.imageUrl;
          if (url) added.push(url);
          else {
            const reader = await new Promise((resolve, reject) => {
              const r = new FileReader();
              r.onload = () => resolve(r.result);
              r.onerror = reject;
              r.readAsDataURL(file);
            });
            added.push(reader);
          }
        } else {
          const reader = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(file);
          });
          added.push(reader);
        }
      } catch (err) {
        try {
          const reader = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(file);
          });
          added.push(reader);
        } catch (e) {
          console.error('Failed to read file', e);
        }
      }
    }

    if (added.length) setForm(prev => ({ ...prev, images: [...prev.images, ...added] }));
    setUploading(false);
  };

  const removeImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const dragIndexRef = useRef(null);
  const handleThumbDragStart = (e, idx) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleThumbDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleThumbDrop = (e, targetIdx) => {
    e.preventDefault();
    const src = dragIndexRef.current;
    const dst = targetIdx;
    if (src == null || dst == null || src === dst) return;
    setForm(prev => {
      const imgs = [...prev.images];
      const [moved] = imgs.splice(src, 1);
      imgs.splice(dst, 0, moved);
      return { ...prev, images: imgs };
    });
    dragIndexRef.current = null;
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date || !form.location || !form.organizer) {
      return notify('error', 'Please fill all required fields.');
    }
    // Validation: make sure date is in the past
    if (new Date(form.date) >= new Date()) {
      return notify('error', 'Date must be in the past for Previous Events.');
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
      };
      if (editing) {
        await updateEvent(editing._id, payload, token);
        notify('success', 'Past event updated successfully!');
      } else {
        await createEvent(payload, token);
        notify('success', 'Past event created successfully!');
      }
      closeForm();
      fetchEvents();
    } catch (err) {
      notify('error', err?.response?.data?.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Move this event to inactive (soft delete)?')) return;
    try {
      setDeleting(id);
      await deleteEvent(id, token);
      notify('success', 'Past event deactivated.');
      fetchEvents();
    } catch {
      notify('error', 'Failed to delete event.');
    } finally {
      setDeleting(null);
    }
  };

  const handleHardDelete = async (id) => {
    if (!window.confirm('Permanently delete this event? This cannot be undone.')) return;
    try {
      setDeleting(id);
      await hardDeleteEvent(id, token);
      notify('success', 'Past event permanently deleted.');
      fetchEvents();
    } catch {
      notify('error', 'Failed to delete event.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>⏳ Previous Events Manager (Memory Lane)</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
            Manage past college celebrations, sports meets, and reunions.
          </p>
        </div>
        <button onClick={openCreate} style={s.addBtn}>
          + Add Past Event
        </button>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['admin', 'manager', 'super-admin']} feature="previous events" />

      {msg && <div style={s.notify(msg.type)}>{msg.text}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading past events…</div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: 12 }}>
          No past events found. Click &quot;+ Add Past Event&quot; to populate the Memory Lane.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {events.map((ev) => (
            <div key={ev._id} style={{ ...s.card, opacity: ev.isActive ? 1 : 0.6 }}>
              <div style={s.cardHeader}>
                {ev.banner ? (
                  <img src={ev.banner} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                ) : ev.images?.[0] ? (
                  isVideoUrl(ev.images[0]) ? (
                    <video src={ev.images[0]} muted style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <img src={ev.images[0]} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  )
                ) : (
                  <div style={{ width: 80, height: 60, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justify: 'center', fontSize: 20 }}>🎬</div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>{ev.title}</h3>
                    <span style={s.badge(ev.type)}>{ev.type}</span>
                    {!ev.isActive && <span style={{ fontSize: 10, background: '#f1f5f9', color: '#94a3b8', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>INACTIVE</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} | 📍 {ev.location} | 👥 {ev.organizer}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={s.editBtn} onClick={() => openEdit(ev)}>✏️ Edit</button>
                  <button style={s.delBtn} onClick={() => handleDelete(ev._id)} disabled={deleting === ev._id}>
                    {deleting === ev._id ? '...' : 'Hide'}
                  </button>
                  <button style={s.hardDelBtn} onClick={() => handleHardDelete(ev._id)} disabled={deleting === ev._id}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Overlay */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>{editing ? '✏️ Edit Past Event' : '🚀 Add New Past Event'}</h3>
              <button style={s.closeBtn} onClick={closeForm}>✕</button>
            </div>

            <div style={s.body}>
              {/* Row 1: Title + Date */}
              <div style={{ ...s.row2, marginBottom: 16 }}>
                <div>
                  <label style={s.label}>Event Title *</label>
                  <input style={s.input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div>
                  <label style={s.label}>Event Date (Past Only) *</label>
                  <input style={s.input} type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                </div>
              </div>

              {/* Row 2: Location + Organizer */}
              <div style={{ ...s.row2, marginBottom: 16 }}>
                <div>
                  <label style={s.label}>Location *</label>
                  <input style={s.input} placeholder="e.g. Open Auditorium, GVP" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required />
                </div>
                <div>
                  <label style={s.label}>Organizer / Club *</label>
                  <input style={s.input} placeholder="e.g. Cultural Club" value={form.organizer} onChange={e => setForm(p => ({ ...p, organizer: e.target.value }))} required />
                </div>
              </div>

              {/* Row 3: Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={s.label}>Event Description *</label>
                <textarea style={{ ...s.input, height: 100, resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
              </div>

              {/* Row 4: Event Type */}
              <div style={{ ...s.row2, marginBottom: 16 }}>
                <div>
                  <label style={s.label}>Event Type</label>
                  <select style={s.input} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="cultural">🎭 Cultural</option>
                    <option value="sports">🏆 Sports</option>
                    <option value="reunion">🤝 Reunion / Alumni Meet</option>
                    <option value="conference">💼 Conference</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="seminar">🎤 Seminar</option>
                    <option value="other">📅 Other</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Active (Visible on website)</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: 42 }}>
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    <label htmlFor="isActive" style={{ marginLeft: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>Visible</label>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Banner */}
              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>🖼️ Event Banner / Flyer (Mockup Layout Poster)</label>
                {form.banner ? (
                  <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={form.banner} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    <button type="button" onClick={removeBanner} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                  </div>
                ) : (
                  <div style={s.dropZone(dragOverBanner)} onDragOver={e => { e.preventDefault(); setDragOverBanner(true); }} onDragLeave={() => setDragOverBanner(false)} onDrop={handleBannerDrop} onClick={() => !uploading && bannerFileRef.current?.click()}>
                    {uploading ? (
                      <div>Uploading Banner...</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>🖼️</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Drag & drop Banner Flyer here</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>or click to browse</div>
                      </>
                    )}
                    <input ref={bannerFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFileInput} />
                  </div>
                )}
              </div>

              {/* Drag & Drop Media */}
              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>🎬 Event Media Gallery (Images & Videos)</label>
                <div style={s.dropZone(dragOver)} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => !uploading && fileRef.current?.click()}>
                  {uploading ? (
                    <div>Uploading media files...</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>🎥</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Drag & drop images/videos here</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>or click to browse</div>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleFileInput} />
                </div>

                {form.images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    {form.images.map((img, idx) => (
                      <div key={idx} style={s.imgThumb} draggable onDragStart={e => handleThumbDragStart(e, idx)} onDragOver={handleThumbDragOver} onDrop={e => handleThumbDrop(e, idx)}>
                        {isVideoUrl(img) ? (
                          <video src={img} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', color: '#fff', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Past Event' : 'Create Past Event'}
              </button>
              <button style={s.cancelBtn} onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { fontFamily: "'Inter', sans-serif", background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 },
  addBtn: { background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  notify: (type) => ({ padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, background: type === 'success' ? '#dcfce7' : '#fee2e2', color: type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${type === 'success' ? '#86efac' : '#fca5a5'}` }),
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', padding: 14, transition: 'box-shadow 0.2s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 14 },
  badge: (type) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 50, fontSize: 10, fontWeight: 700, background: TYPE_COLORS[type] + '15', color: TYPE_COLORS[type], textTransform: 'uppercase' }),
  editBtn: { padding: '5px 12px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  delBtn: { padding: '5px 12px', border: '1px solid #fca5a5', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  hardDelBtn: { padding: '5px 12px', border: 'none', borderRadius: 6, background: '#7f1d1d', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHead: { padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 },
  closeBtn: { background: '#f1f5f9', border: 'none', borderRadius: 6, width: 30, height: 30, cursor: 'pointer' },
  body: { padding: 24 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, background: '#f9fafb', outline: 'none' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  dropZone: (over) => ({ border: `2px dashed ${over ? '#4f46e5' : '#cbd5e1'}`, borderRadius: 10, padding: '20px 10px', textAlign: 'center', cursor: 'pointer', background: over ? '#eff6ff' : '#f9fafb' }),
  imgThumb: { position: 'relative', width: 70, height: 50, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1' },
  saveBtn: { width: '100%', padding: 12, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 },
  cancelBtn: { width: '100%', padding: 12, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }
};
