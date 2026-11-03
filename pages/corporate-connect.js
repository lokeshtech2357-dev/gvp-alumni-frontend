import { useEffect, useState } from 'react';
import { getEntrepreneurs } from '../services/api';

const GRADIENT_MAP = {
  green:  'bg-gradient-to-br from-green-400 to-teal-300',
  purple: 'bg-gradient-to-br from-indigo-500 to-pink-400',
  blue:   'bg-gradient-to-br from-blue-400 to-indigo-500',
  orange: 'bg-gradient-to-br from-orange-400 to-amber-400',
};

const ANIMATE_CLASS = ['animate-card-left', 'animate-card-right', 'animate-card-left', 'animate-card-right'];

export default function CorporateConnect() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // inject card animations
    const style = document.createElement('style');
    style.innerHTML = `
      .animate-card-left  { animation: cardMoveLeft  6s ease-in-out infinite alternate; }
      .animate-card-right { animation: cardMoveRight 6s ease-in-out infinite alternate; }
      @keyframes cardMoveLeft  { from { transform: translateX(0); } to { transform: translateX(-10px); } }
      @keyframes cardMoveRight { from { transform: translateX(0); } to { transform: translateX(10px); } }
      .animate-card-left:hover, .animate-card-right:hover { animation-play-state: paused; transform: none; }
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch (_) {} };
  }, []);

  useEffect(() => {
    getEntrepreneurs()
      .then(res => setItems(res.data.data || []))
      .catch(err => console.error('Failed to load entrepreneurs', err))
      .finally(() => setLoading(false));
  }, []);

  const getImgSrc = (item) => item.imageUrl || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
          Our Proud Alumni Entrepreneurs.
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-lg">No entrepreneurs added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {items.map((item, idx) => {
              const gradientClass = GRADIENT_MAP[item.gradient] || GRADIENT_MAP.green;
              const animClass     = ANIMATE_CLASS[idx % ANIMATE_CLASS.length];
              const imgSrc        = getImgSrc(item);
              const displayUrl    = item.websiteUrl
                ? item.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')
                : '';

              return (
                <a
                  key={item._id}
                  href={item.websiteUrl || '#'}
                  target={item.websiteUrl ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`rounded-xl shadow-lg overflow-hidden transition transform hover:shadow-xl hover:-translate-y-1 block h-full ${animClass} ${gradientClass} text-white`}
                >
                  <div className="h-36 md:h-44 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="h-20 md:h-24 w-auto object-contain"
                        onError={e => { e.target.style.opacity = '0.3'; }}
                      />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                    {displayUrl && (
                      <p className="mt-2 text-white/90">{displayUrl}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
