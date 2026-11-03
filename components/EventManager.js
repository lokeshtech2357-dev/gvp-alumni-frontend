import { useState, useEffect, useRef } from 'react';
import { getAllEventsAdmin, createEvent, updateEvent, deleteEvent, hardDeleteEvent, uploadEventImage, getStoredAuthToken } from '../services/api';
import RoleNotice from './RoleNotice';

const EVENT_TYPES = ['conference', 'workshop', 'seminar', 'cultural', 'sports', 'reunion', 'other'];

const TYPE_COLORS = {
  conference: '#3b82f6',
  workshop:   '#10b981',
  seminar:    '#8b5cf6',
  cultural:   '#ec4899',
  sports:     '#f97316',
  reunion:    '#6366f1',
  other:      '#64748b',
};

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) || lowerUrl.includes('data:video/');
};

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  type: 'other',
  organizer: '',
  registrationLink: '',
  maxParticipants: '',
  galleryScrollDuration: 35,
  images: [],
  banner: '',
  isActive: true,
};

export default function EventManager({ token, userRole }) {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);   // event being edited
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null);   // { type:'success'|'error', text }
  const [dragOver, setDragOver] = useState(false);
  const [dragOverBanner, setDragOverBanner] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const bannerFileRef = useRef();

  const getAuthToken = () => {
    if (token) return token;
    return getStoredAuthToken();
  };

  /* ── Fetch ── */
  const fetchEvents = async () => {
    const authToken = getAuthToken();
    if (!authToken) return;

    try {
      setLoading(true);
      const res = await getAllEventsAdmin(authToken);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error('Event fetch failed:', err);
      setMsg({ type: 'error', text: 'Failed to load events.' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchEvents(); }, [token]);

  /* ── Notify ── */
  const notify = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  /* ── Form helpers ── */
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title:                ev.title || '',
      description:          ev.description || '',
      date:                 ev.date ? ev.date.slice(0, 10) : '',
      location:             ev.location || '',
      type:                 ev.type || 'other',
      organizer:            ev.organizer || '',
      registrationLink:     ev.registrationLink || '',
      maxParticipants:      ev.maxParticipants || '',
      galleryScrollDuration: ev.galleryScrollDuration || 35,
      images:               ev.images || [],
      banner:               ev.banner || '',
      isActive:             ev.isActive !== false,
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); };

  /* ── Drag & Drop media handling ── */
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

  /* ── Drag & Drop banner handling ── */
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
          // fallback to base64
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
    // If admin token provided, upload files to server and use returned URLs
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
            // fallback to base64
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
        // on any error, fall back to base64
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

  // Reorder images via drag & drop of thumbnails
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

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.title || !form.description || !form.date || !form.location || !form.organizer) {
      return notify('error', 'Please fill all required fields.');
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        galleryScrollDuration: form.galleryScrollDuration ? Number(form.galleryScrollDuration) : 35,
      };
      const authToken = getAuthToken();
      if (!authToken) throw new Error('Missing auth token');
      if (editing) {
        await updateEvent(editing._id, payload, authToken);
        notify('success', 'Event updated successfully!');
      } else {
        await createEvent(payload, authToken);
        notify('success', 'Event created successfully!');
      }
      closeForm();
      fetchEvents();
    } catch (err) {
      notify('error', err?.response?.data?.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Move this event to inactive (soft delete)?')) return;
    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error('Missing auth token');
      setDeleting(id);
      await deleteEvent(id, authToken);
      notify('success', 'Event deactivated.');
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
      const authToken = getAuthToken();
      if (!authToken) throw new Error('Missing auth token');
      setDeleting(id);
      await hardDeleteEvent(id, authToken);
      notify('success', 'Event permanently deleted.');
      fetchEvents();
    } catch {
      notify('error', 'Failed to delete event.');
    } finally {
      setDeleting(null);
    }
  };

  /* ── Styles ── */
  const s = {
    wrap:  { fontFamily: "'Inter', sans-serif" },
    header: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
    title: { fontSize:22, fontWeight:700, color:'#1e293b' },
    addBtn: {
      display:'flex', alignItems:'center', gap:8,
      background:'linear-gradient(135deg,#1e40af,#3b82f6)',
      color:'#fff', border:'none', borderRadius:10,
      padding:'10px 22px', fontSize:14, fontWeight:600,
      cursor:'pointer', boxShadow:'0 4px 14px rgba(59,130,246,0.35)',
      transition:'transform 0.15s,box-shadow 0.15s',
    },
    notify: (type) => ({
      padding:'12px 20px', borderRadius:10, fontSize:14, fontWeight:500,
      marginBottom:16,
      background: type === 'success' ? '#dcfce7' : '#fee2e2',
      color:       type === 'success' ? '#166534' : '#991b1b',
      border:`1px solid ${type === 'success' ? '#86efac' : '#fca5a5'}`,
    }),
    card: {
      background:'#fff', borderRadius:14, border:'1px solid #e2e8f0',
      boxShadow:'0 2px 10px rgba(0,0,0,0.06)',
      overflow:'hidden', marginBottom:14, transition:'box-shadow 0.2s',
    },
    cardHeader: { display:'flex', alignItems:'flex-start', gap:14, padding:'16px 20px' },
    badge: (type) => ({
      display:'inline-block', padding:'3px 12px', borderRadius:50,
      fontSize:11, fontWeight:700, letterSpacing:1,
      background: TYPE_COLORS[type] + '20',
      color: TYPE_COLORS[type],
      border:`1px solid ${TYPE_COLORS[type]}40`,
      textTransform:'uppercase',
    }),
    editBtn: {
      padding:'6px 14px', border:'1px solid #3b82f6', borderRadius:8,
      background:'#eff6ff', color:'#2563eb', fontSize:13, fontWeight:600,
      cursor:'pointer', transition:'background 0.15s',
    },
    delBtn: {
      padding:'6px 14px', border:'1px solid #ef4444', borderRadius:8,
      background:'#fef2f2', color:'#dc2626', fontSize:13, fontWeight:600,
      cursor:'pointer', transition:'background 0.15s',
    },
    hardDelBtn: {
      padding:'6px 14px', border:'1px solid #7f1d1d', borderRadius:8,
      background:'#7f1d1d', color:'#fff', fontSize:13, fontWeight:600,
      cursor:'pointer', transition:'background 0.15s',
    },
    /* Form */
    overlay: {
      position:'fixed', inset:0, background:'rgba(15,23,42,0.55)',
      zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
      padding:16,
    },
    modal: {
      background:'#fff', borderRadius:20, width:'100%', maxWidth:680,
      maxHeight:'90vh', overflowY:'auto',
      boxShadow:'0 25px 80px rgba(0,0,0,0.3)',
      animation:'slideUp 0.25s ease',
    },
    modalHead: {
      position:'sticky', top:0, background:'#fff',
      padding:'20px 28px 16px', borderBottom:'1px solid #e2e8f0',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      zIndex:1,
    },
    modalTitle: { fontSize:18, fontWeight:700, color:'#0f172a' },
    closeBtn: {
      background:'#f1f5f9', border:'none', borderRadius:8,
      width:34, height:34, fontSize:18, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
    },
    body: { padding:'24px 28px' },
    label: { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 },
    input: {
      width:'100%', padding:'10px 14px', border:'1.5px solid #e2e8f0',
      borderRadius:10, fontSize:14, color:'#0f172a',
      outline:'none', transition:'border-color 0.2s',
      background:'#f9fafb',
    },
    row2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
    dropZone: (over) => ({
      border:`2px dashed ${over ? '#3b82f6' : '#cbd5e1'}`,
      borderRadius:14, padding:'32px 20px', textAlign:'center',
      cursor:'pointer', transition:'all 0.2s',
      background: over ? '#eff6ff' : '#f8fafc',
    }),
    imgThumb: {
      position:'relative', width:90, height:70,
      borderRadius:8, overflow:'hidden', border:'1px solid #e2e8f0',
    },
    saveBtn: {
      width:'100%', padding:'13px', border:'none', borderRadius:12,
      background:'linear-gradient(135deg,#1e40af,#3b82f6)', color:'#fff',
      fontSize:15, fontWeight:700, cursor:'pointer', marginTop:8,
      boxShadow:'0 6px 20px rgba(59,130,246,0.35)',
    },
    cancelBtn: {
      width:'100%', padding:'12px', border:'1.5px solid #e2e8f0', borderRadius:12,
      background:'#f8fafc', color:'#64748b',
      fontSize:15, fontWeight:600, cursor:'pointer', marginTop:8,
    },
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .em-input:focus { border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
        .em-add:hover  { transform:translateY(-1px); box-shadow:0 8px 20px rgba(59,130,246,0.45) !important; }
        .em-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.1) !important; }
        .spin-ring { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.title}>🗓️ Event Manager</div>
          <div style={{fontSize:13,color:'#64748b',marginTop:2}}>{events.length} events total</div>
        </div>
        <button style={s.addBtn} className="em-add" onClick={openCreate}>
          ＋ Add New Event
        </button>
      </div>

      {/* Notification */}
      {msg && <div style={s.notify(msg.type)}>{msg.type === 'success' ? '✅' : '❌'} {msg.text}</div>}

      {/* Loading */}
      {loading ? (
        <div style={{textAlign:'center',padding:'40px',color:'#64748b'}}>
          <div style={{width:36,height:36,border:'3px solid #e2e8f0',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}}/>
          Loading events…
        </div>
      ) : events.length === 0 ? (
        <div style={{textAlign:'center',padding:48,color:'#94a3b8',border:'2px dashed #e2e8f0',borderRadius:16}}>
          <div style={{fontSize:40,marginBottom:12}}>📅</div>
          <div style={{fontWeight:600,fontSize:16,marginBottom:6}}>No events yet</div>
          <div style={{fontSize:13}}>Click &quot;Add New Event&quot; to get started</div>
        </div>
      ) : (
        <div>
          {events.map(ev => (
            <div key={ev._id} style={s.card} className="em-card">
              <div style={s.cardHeader}>
                {/* Left: info */}
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:6}}>
                    <span style={s.badge(ev.type)}>{ev.type}</span>
                    {!ev.isActive && <span style={{fontSize:11,color:'#dc2626',fontWeight:600,background:'#fef2f2',padding:'2px 8px',borderRadius:50,border:'1px solid #fca5a5'}}>INACTIVE</span>}
                    <span style={{fontSize:12,color:'#94a3b8'}}>📅 {fmtDate(ev.date)}</span>
                  </div>
                  <div style={{fontSize:16,fontWeight:700,color:'#0f172a',marginBottom:4}}>{ev.title}</div>
                  <div style={{fontSize:13,color:'#64748b',marginBottom:4}}>📍 {ev.location} &nbsp;·&nbsp; 👤 {ev.organizer}</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:6,fontSize:12,color:'#64748b'}}>
                    <span>Gallery speed: <strong>{ev.galleryScrollDuration || 35}s</strong></span>
                    <span>•</span>
                    <span>{ev.images?.length || 0} media items</span>
                  </div>
                  <div style={{fontSize:13,color:'#94a3b8',lineHeight:1.6,maxWidth:520}}>
                    {ev.description?.slice(0, 120)}{ev.description?.length > 120 ? '…' : ''}
                  </div>
                  {ev.images?.length > 0 && (
                    <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>
                      {ev.images.slice(0,4).map((img,i) => (
                        <div key={i} style={{...s.imgThumb}}>
                         {isVideoUrl(img) ? (
                          <video src={img} muted style={{width:'100%',height:'100%',objectFit:'cover'}} />
                        ) : (
                          <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                        )}
                        </div>
                      ))}
                      {ev.images.length > 4 && <div style={{...s.imgThumb,display:'flex',alignItems:'center',justifyContent:'center',background:'#f1f5f9',fontSize:12,color:'#64748b',fontWeight:600}}>+{ev.images.length-4}</div>}
                    </div>
                  )}
                </div>
                {/* Right: actions */}
                <div style={{display:'flex',flexDirection:'column',gap:8,flexShrink:0}}>
                  <button style={s.editBtn} onClick={() => openEdit(ev)}>✏️ Edit</button>
                  <button style={s.delBtn} disabled={deleting===ev._id} onClick={() => handleDelete(ev._id)}>🗑️ Deactivate</button>
                  <button style={s.hardDelBtn} disabled={deleting===ev._id} onClick={() => handleHardDelete(ev._id)}>🔥 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FORM MODAL ── */}
      {showForm && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div style={s.modal}>
            {/* Modal Header */}
            <div style={s.modalHead}>
              <div style={s.modalTitle}>{editing ? '✏️ Edit Event' : '➕ Add New Event'}</div>
              <button style={s.closeBtn} onClick={closeForm}>✕</button>
            </div>

            <div style={s.body}>
              {/* Title */}
              <div style={{marginBottom:16}}>
                <label style={s.label}>Event Title *</label>
                <input className="em-input" style={s.input} placeholder="e.g. Alumni Meet 2025"
                  value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} />
              </div>

              {/* Date + Location */}
              <div style={{...s.row2, marginBottom:16}}>
                <div>
                  <label style={s.label}>Date *</label>
                  <input className="em-input" style={s.input} type="date"
                    value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} />
                </div>
                <div>
                  <label style={s.label}>Location *</label>
                  <input className="em-input" style={s.input} placeholder="e.g. GVP Campus"
                    value={form.location} onChange={e => setForm(p=>({...p,location:e.target.value}))} />
                </div>
              </div>

              {/* Type + Organizer */}
              <div style={{...s.row2, marginBottom:16}}>
                <div>
                  <label style={s.label}>Event Type</label>
                  <select className="em-input" style={{...s.input, cursor:'pointer'}}
                    value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Organizer *</label>
                  <input className="em-input" style={s.input} placeholder="e.g. Alumni Association"
                    value={form.organizer} onChange={e => setForm(p=>({...p,organizer:e.target.value}))} />
                </div>
              </div>

              {/* Description */}
              <div style={{marginBottom:16}}>
                <label style={s.label}>Description *</label>
                <textarea className="em-input" style={{...s.input, height:100, resize:'vertical'}}
                  placeholder="Describe the event…"
                  value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} />
              </div>

              {/* Registration Link + Max Participants + Gallery Speed */}
              <div style={{...s.row2, marginBottom:16}}>
                <div>
                  <label style={s.label}>Registration Link</label>
                  <input className="em-input" style={s.input} placeholder="https://..."
                    value={form.registrationLink} onChange={e => setForm(p=>({...p,registrationLink:e.target.value}))} />
                </div>
                <div>
                  <label style={s.label}>Max Participants</label>
                  <input className="em-input" style={s.input} type="number" placeholder="e.g. 200"
                    value={form.maxParticipants} onChange={e => setForm(p=>({...p,maxParticipants:e.target.value}))} />
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={s.label}>Gallery Scroll Duration (seconds)</label>
                <input className="em-input" style={s.input} type="number" min={10} max={90}
                  value={form.galleryScrollDuration} onChange={e => setForm(p => ({ ...p, galleryScrollDuration: e.target.value }))} />
                <p style={{marginTop:6,fontSize:12,color:'#64748b'}}>Higher values will slow the image motion down; lower values move faster.</p>
              </div>

              {/* Active toggle */}
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm(p=>({...p,isActive:e.target.checked}))}
                  style={{width:16,height:16,cursor:'pointer'}} />
                <label htmlFor="isActive" style={{...s.label,marginBottom:0,cursor:'pointer'}}>Active (visible on website)</label>
              </div>

              {/* Drag & Drop Banner/Template Upload */}
              <div style={{marginBottom:20}}>
                <label style={s.label}>
                  Event Banner / Poster <span style={{color: '#ef4444', fontWeight: 'bold'}}>(Single Image Only)</span>
                </label>
                <div style={{fontSize:11, color:'#64748b', marginBottom:6}}>
                  This is the main banner/poster shown at the top of the event page. Only one image can be selected.
                </div>
                {form.banner ? (
                  <div style={{position:'relative', width:'100%', height:180, borderRadius:12, overflow:'hidden', border:'1px solid #e2e8f0', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <img src={form.banner} alt="Event Banner Template" style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain'}} />
                    <button
                      type="button"
                      onClick={removeBanner}
                      style={{position:'absolute', top:8, right:8, background:'rgba(239,68,68,0.9)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#fff', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}
                    >✕</button>
                  </div>
                ) : (
                  <div
                    style={s.dropZone(dragOverBanner)}
                    onDragOver={(e)=>{e.preventDefault();setDragOverBanner(true)}}
                    onDragLeave={()=>setDragOverBanner(false)}
                    onDrop={handleBannerDrop}
                    onClick={()=>!uploading && bannerFileRef.current?.click()}
                  >
                    {uploading ? (
                      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 0'}}>
                        <div className="spin-ring" />
                        <div style={{fontWeight:600,color:'#334155',marginTop:12}}>Uploading Banner...</div>
                        <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>Please wait, processing file</div>
                      </div>
                    ) : (
                      <>
                        <div style={{fontSize:32,marginBottom:8}}>🖼️</div>
                        <div style={{fontWeight:600,color:'#334155',marginBottom:4}}>
                          {dragOverBanner ? 'Drop banner here!' : 'Click to select Event Banner (Single Image)'}
                        </div>
                        <div style={{fontSize:12,color:'#94a3b8'}}>PNG, JPG, WEBP</div>
                      </>
                    )}
                    <input ref={bannerFileRef} type="file" accept="image/*"
                      style={{display:'none'}} onChange={handleBannerFileInput} disabled={uploading} />
                  </div>
                )}
              </div>

              {/* Drag & Drop Media Upload */}
              <div style={{marginBottom:20}}>
                <label style={s.label}>
                  Event Media Gallery <span style={{color: '#2563eb', fontWeight: 'bold'}}>(Multiple Photos & Videos Allowed)</span>
                </label>
                <div style={{fontSize:11, color:'#64748b', marginBottom:6}}>
                  Select or drag-and-drop multiple photos/videos at once to create a media gallery.
                </div>
                <div
                  style={{...s.dropZone(dragOver), border: `2px dashed #2563eb`, background: dragOver ? '#eff6ff' : '#f0f7ff'}}
                  onDragOver={(e)=>{e.preventDefault();setDragOver(true)}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={()=>!uploading && fileRef.current?.click()}
                >
                  {uploading ? (
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 0'}}>
                      <div className="spin-ring" />
                      <div style={{fontWeight:600,color:'#334155',marginTop:12}}>Uploading Media...</div>
                      <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>Please wait, processing files</div>
                    </div>
                  ) : (
                    <>
                      <div style={{fontSize:32,marginBottom:8}}>🎥</div>
                      <div style={{fontWeight:600,color:'#1e40af',marginBottom:4}}>
                        {dragOver ? 'Drop files here!' : 'Click here to select multiple Photos & Videos'}
                      </div>
                      <div style={{fontSize:12,color:'#64748b'}}>You can select and upload multiple files at once</div>
                    </>
                  )}
                  <input ref={fileRef} type="file" multiple accept="image/*,video/*"
                    style={{display:'none'}} onChange={handleFileInput} disabled={uploading} />
                </div>

                {/* Image Previews */}
                {form.images.length > 0 && (
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:13, fontWeight:700, color:'#334155', marginBottom:8}}>
                      Gallery Media ({form.images.length} items):
                      <span style={{fontWeight:'normal', fontSize:11, color:'#64748b', marginLeft:8}}>
                        (Drag to reorder · Star ⭐ to set as event banner)
                      </span>
                    </div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                      {form.images.map((img, idx) => {
                        const isCurrentBanner = form.banner === img;
                        return (
                          <div key={idx}
                            style={{...s.imgThumb, width:110, height:85, border: isCurrentBanner ? '2px solid #2563eb' : '1px solid #e2e8f0', boxShadow: isCurrentBanner ? '0 0 8px rgba(37,99,235,0.3)' : 'none'}}
                            draggable
                            onDragStart={(e)=>handleThumbDragStart(e, idx)}
                            onDragOver={(e)=>handleThumbDragOver(e)}
                            onDrop={(e)=>handleThumbDrop(e, idx)}
                          >
                            {isVideoUrl(img) ? (
                              <video src={img} muted style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            ) : (
                              <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            )}
                            
                            {/* Star as Banner button */}
                            {!isVideoUrl(img) && (
                              <button
                                type="button"
                                title={isCurrentBanner ? "This is the current event banner" : "Set as event banner"}
                                onClick={(e) => { e.stopPropagation(); setForm(p => ({ ...p, banner: img })); }}
                                style={{
                                  position:'absolute',
                                  bottom:2,
                                  left:2,
                                  background: isCurrentBanner ? '#2563eb' : 'rgba(15,23,42,0.75)',
                                  border:'none',
                                  borderRadius:4,
                                  padding:'2px 5px',
                                  cursor:'pointer',
                                  color:'#fff',
                                  fontSize:9,
                                  fontWeight:700,
                                  display:'flex',
                                  alignItems:'center',
                                  gap:2
                                }}
                              >
                                {isCurrentBanner ? '⭐ Banner' : '⭐ Set Banner'}
                              </button>
                            )}

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e)=>{ e.stopPropagation(); removeImage(idx); }}
                              style={{position:'absolute',top:2,right:2,background:'rgba(239,68,68,0.9)',border:'none',borderRadius:'50%',width:20,height:20,cursor:'pointer',color:'#fff',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}
                            >✕</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editing ? '💾 Update Event' : '🚀 Create Event'}
              </button>
              <button style={s.cancelBtn} onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
