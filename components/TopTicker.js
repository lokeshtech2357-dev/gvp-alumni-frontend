import React, { useEffect, useState, useRef } from 'react';
import { fetchNotifications } from '../services/api';

export default function TopTicker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      const data = res.data || [];
      // only visible
      setItems(data.filter(n => n.visible));
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 10000);
    return () => clearInterval(iv);
  }, []);

  if (loading) return (
    <div className="bg-gray-900 text-white py-2 px-4">Loading notifications...</div>
  );

  if (!items.length) return (
    <div className="bg-gray-900 text-white py-2 px-4">No notifications</div>
  );

  // build the scrolling content (duplicate to create infinite effect)
  const content = items.map(it => (
    <div key={it._id} className="inline-flex items-center space-x-3 mr-8">
      {it.important && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">IMPORTANT</span>}
      <span className="text-sm">{it.title}</span>
    </div>
  ));

  return (
    <div className="w-full bg-gray-900 text-white overflow-hidden" onMouseEnter={() => {
      containerRef.current && (containerRef.current.style.animationPlayState = 'paused');
    }} onMouseLeave={() => {
      containerRef.current && (containerRef.current.style.animationPlayState = 'running');
    }}>
      <div className="py-2">
        <div className="ticker-track whitespace-nowrap flex items-center" ref={containerRef} style={{ animation: 'ticker 18s linear infinite' }}>
          {content}
          {content}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { display: inline-flex; align-items: center; }
      `}</style>
    </div>
  );
}
