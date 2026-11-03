import { useEffect, useState, useRef } from 'react';
import { getGalleryImages, uploadGalleryImage, updateGalleryImage, deleteGalleryImage, getStoredAuthToken } from '../../services/api';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) setSelectedFile(file);
    };

    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('drop', handleDrop);

    return () => {
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('dragleave', handleDragLeave);
      el.removeEventListener('drop', handleDrop);
    };
  }, []);

  const fetchImages = async () => {
    try {
      const res = await getGalleryImages();
      if (res?.data?.data) setImages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const token = getStoredAuthToken();

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setEditing(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !editing) {
      setMessage('Please add an image before uploading.');
      return;
    }

    setLoading(true);
    setMessage('Saving...');

    try {
      if (editing) {
        const data = { title, description };
        await updateGalleryImage(editing._id, data, token);
        setMessage('Image details updated successfully.');
      } else {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', title);
        formData.append('description', description);
        await uploadGalleryImage(formData, token);
        setMessage('Image uploaded successfully.');
      }
      await fetchImages();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setEditing(image);
    setTitle(image.title || '');
    setDescription(image.description || '');
    setSelectedFile(null);
    setMessage('Editing image details.');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    setLoading(true);
    try {
      await deleteGalleryImage(id, token);
      setImages(images.filter((item) => item._id !== id));
      setMessage('Image removed successfully.');
    } catch (err) {
      setMessage('Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-cyan-700 px-8 py-10 text-white">
          <h1 className="text-4xl font-extrabold mb-3">Admin Gallery Manager</h1>
          <p className="text-slate-200 max-w-2xl leading-relaxed">
            Add, edit, delete and reorder homepage/gallery images with a polished drag & drop upload interface. The first active image will appear on the homepage hero section automatically.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div ref={dropRef} className={`rounded-3xl border-2 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-100'} p-8 text-center transition`}> 
              <p className="text-lg font-semibold text-slate-700 mb-2">Drag & drop an image here</p>
              <p className="text-sm text-slate-500 mb-4">or click to select from your files</p>
              <input
                type="file"
                accept="image/*"
                className="mx-auto block cursor-pointer"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <p className="mt-4 text-slate-700">Selected image: {selectedFile.name}</p>}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full rounded-3xl border border-slate-300 px-5 py-4 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-3xl border border-slate-300 px-5 py-4 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-white font-semibold shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {editing ? 'Save Image Details' : 'Upload Image'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">
                Reset
              </button>
            </div>

            {message && <div className="rounded-2xl bg-slate-100 px-5 py-4 text-slate-700">{message}</div>}
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Uploaded Images</h2>
                <p className="text-sm text-slate-500">Click edit to update title/description or delete images you no longer need.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{images.length} images</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((image) => (
                <div key={image._id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                  <div className="relative overflow-hidden">
                    <img src={image.imageUrl} alt={image.title || 'gallery image'} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 shadow-sm">
                      {image.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-4 min-h-[3rem]">{image.description || 'No description added yet.'}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(image)}
                        className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
