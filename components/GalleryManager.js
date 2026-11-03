import { useState, useEffect, useRef } from 'react';
import {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage
} from '../services/api';
import RoleNotice from './RoleNotice';

export default function GalleryManager({ token, userRole }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await getGalleryImages();
      setImages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
        formData.append('description', '');

        await uploadGalleryImage(formData, token);
      }
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteGalleryImage(id, token);
      fetchImages();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleEdit = (image) => {
    setEditing(image._id);
    setEditTitle(image.title);
    setEditDescription(image.description || '');
  };

  const handleSaveEdit = async () => {
    try {
      await updateGalleryImage(editing, {
        title: editTitle,
        description: editDescription
      }, token);
      setEditing(null);
      fetchImages();
    } catch (error) {
      console.error('Edit error:', error);
      alert('Edit failed. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditTitle('');
    setEditDescription('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery Management</h3>
      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="gallery" />
      
      {/* Upload Section */}
      <div className="mb-8">
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
          </h3>
          <p className="text-gray-500">Supports JPG, PNG, GIF, WebP (max 5MB each)</p>
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Images Yet</h3>
          <p className="text-gray-500">Upload some images using the area above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {editing === img._id ? (
                <div className="p-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"
                    placeholder="Title"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 text-sm"
                    placeholder="Description"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{img.title}</h4>
                  {img.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{img.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(img)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}