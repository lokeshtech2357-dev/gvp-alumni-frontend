import { useEffect, useState, useRef } from 'react';
import { uploadSponsor, getSponsors, deleteSponsor, getStoredAuthToken } from '../../services/api';

export default function AdminSponsors() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsors, setSponsors] = useState([]);
  const dropRef = useRef();

  const fetchSponsors = async () => {
    try {
      const res = await getSponsors();
      if (res && res.data && res.data.data) setSponsors(res.data.data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  // drag-drop handlers
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    };
    const handleDragOver = (e) => { e.preventDefault(); };

    el.addEventListener('drop', handleDrop);
    el.addEventListener('dragover', handleDragOver);

    return () => {
      el.removeEventListener('drop', handleDrop);
      el.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!file) return setMessage('Please choose an image');

    setLoading(true);
    setMessage('Uploading...');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('url', url);

    const token = getStoredAuthToken();

    try {
      const res = await uploadSponsor(formData, token);
      if (res && res.data && res.data.success) {
        setMessage('Uploaded successfully');
        setFile(null);
        setUrl('');
        await fetchSponsors();
      } else {
        setMessage('Upload failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = getStoredAuthToken();
    if (!confirm('Delete this sponsor?')) return;
    try {
      await deleteSponsor(id, token);
      setSponsors(sponsors.filter(s => s._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin - Sponsors</h1>

      <div ref={dropRef} className="border-dashed border-2 border-slate-300 p-6 rounded mb-4 text-center">
        <p className="mb-2">Drag & drop an image here, or</p>
        <input type="file" accept="image/*" onChange={handleFile} />
        {file && <div className="mt-3">Selected: {file.name}</div>}
      </div>

      <div className="mb-4">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Optional sponsor URL" className="w-full border rounded px-3 py-2" />
      </div>

      <div className="mb-6">
        <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Uploading...' : 'Upload Sponsor'}</button>
      </div>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      <h2 className="text-lg font-semibold mb-2">Existing sponsors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sponsors.map(s => (
          <div key={s._id} className="p-2 border rounded text-center">
            <img src={s.imageUrl} alt={s.title} className="mx-auto mb-2 max-h-24 object-contain" />
            <div className="text-xs mb-2 break-all">{s.url || <em>No link</em>}</div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => handleDelete(s._id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
