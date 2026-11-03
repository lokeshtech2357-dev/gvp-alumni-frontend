import { useState, useEffect } from 'react';
import { getGalleryImages } from '../services/api';

export default function AlumniGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Alumni Gallery</h1>
          <div className="mx-auto mb-6 h-1 w-28 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            Explore memorable moments from our alumni community.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center">
            <svg className="w-20 h-20 mx-auto text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No photos are available yet</h3>
            <p className="text-slate-500">
              Please visit again later to see new alumni memories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {images.map((img) => (
              <div key={img._id || img} className="group relative bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="w-full bg-gray-100 relative">
                  <img
                    src={img.imageUrl || `/images/gallery/${img}`}
                    alt={img.title || `Alumni event photo`}
                    className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-semibold">{img.title}</h4>
                      {img.description && <p className="text-sm">{img.description}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
