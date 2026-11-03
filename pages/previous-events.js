import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { API_BASE_URL } from '../services/api';

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) || lowerUrl.includes('data:video/');
};

function MediaGallery({ images, title, duration = 35 }) {
  const marqueeRef = useRef(null);
  const [effectiveDuration, setEffectiveDuration] = useState(Number(duration) || 35);

  const photos = (images || []).filter(img => !isVideoUrl(img));
  const videos = (images || []).filter(img => isVideoUrl(img));

  useEffect(() => {
    const updateDuration = () => {
      if (!marqueeRef.current) return;
      const width = marqueeRef.current.scrollWidth || 0;
      const baseSeconds = Number(duration) || 35;
      const widthFactor = Math.max(1, width / 2200);
      setEffectiveDuration(Math.max(18, Math.round(baseSeconds * widthFactor)));
    };

    updateDuration();
    window.addEventListener('resize', updateDuration);
    return () => window.removeEventListener('resize', updateDuration);
  }, [duration, photos.length]);

  if (!photos.length && !videos.length) return null;

  const marqueeImages = [...photos, ...photos];

  return (
    <div className="space-y-10">
      {/* Photos Marquee */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>📷</span> Photos
              </h4>
            </div>
            <div className="text-sm text-slate-500">{photos.length} images</div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 shadow-xl bg-slate-950">
            <div
              ref={marqueeRef}
              className="marquee flex flex-nowrap items-center gap-3 px-4 py-5 w-max will-change-transform"
              style={{ animation: `scrollRightToLeft ${effectiveDuration}s linear infinite` }}
            >
              {marqueeImages.map((src, idx) => {
                const scaleValue = 1 - ((idx % 6) * 0.02);
                return (
                  <div
                    key={`${src}-${idx}`}
                    className="min-w-[220px] flex-shrink-0 overflow-hidden rounded-[26px] border border-white/10 shadow-2xl bg-slate-900 relative transition-transform duration-500 hover:scale-105"
                    style={{ transform: `scale(${scaleValue})` }}
                  >
                    <img
                      src={src}
                      alt={`${title} - Photo ${idx + 1}`}
                      className="w-full h-[220px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-3 py-2 text-xs font-semibold text-white">
                      {title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <style jsx>{`
            @keyframes scrollRightToLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee {
              animation: scrollRightToLeft ${effectiveDuration}s linear infinite;
            }
            .marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🎥</span> Videos ({videos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((vid, idx) => (
              <div
                key={idx}
                className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg aspect-video"
              >
                <video
                  src={vid}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreviousEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = API_BASE_URL;
    fetch(`${apiBase}/api/events`)
      .then(r => r.json())
      .then(res => {
        // Show active past events from database, sorted by date (newest first)
        const fetched = (res.data || []).filter(
          ev => ev.isActive && new Date(ev.date) < new Date()
        );
        const sorted = fetched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sorted);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Previous Events | GVP Alumni</title>
        <meta name="description" content="Explore past events and milestones of Gayatri Vidya Parishad Alumni." />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Inter:wght@400;500;600;700;850&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-violet-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 -z-10"></div>
        <div className="absolute bottom-6 left-6 w-[520px] h-[520px] bg-cyan-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-50 -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_25%)] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-violet-500/15 text-violet-200 border border-violet-500/30 uppercase tracking-widest mb-4">
              Memory Lane
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 font-sans text-white">
              Previous Events & Milestones
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Relive the memorable moments, cultural celebrations, reunions, and sports days that unite our GVP alumni family.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <div className="w-16 h-1 rounded-full bg-violet-400/80" />
              <div className="w-8 h-1 rounded-full bg-cyan-300/80" />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-cyan-400/90 border-l-transparent border-slate-700"></div>
              <p className="mt-4 text-slate-300 font-medium">Loading historical events...</p>
            </div>
          ) : events.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-slate-900/85 rounded-[32px] border border-slate-800 max-w-2xl mx-auto shadow-2xl shadow-slate-950/20">
              <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Past Events Found</h3>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed px-4">
                Events added via the Admin Dashboard with past dates will automatically display here as scrolling picture sliders.
              </p>
            </div>
          ) : (
            /* Events Vertical List */
            <div className="space-y-24">
              {events.map((event, idx) => (
                <div key={event._id} className="group relative">
                  <div className="relative overflow-hidden rounded-[32px] border border-slate-700/70 bg-slate-950/95 shadow-[0_32px_100px_rgba(15,23,42,0.55)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_44px_140px_rgba(15,23,42,0.65)]">
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-indigo-400 opacity-90" />
                    <div className="relative p-6 sm:p-10">
                      {/* Event Title Block */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/85 border border-slate-700/80 text-sm font-semibold text-cyan-200 mb-4">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
                          {event.type}
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
                          {event.title}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-sm text-slate-400 font-medium">
                          <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span>📍 {event.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Banner Image (if present) */}
                      {event.banner && (
                        <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-slate-800/75 bg-slate-950 mb-8 max-h-[520px] relative shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
                          <img
                            src={event.banner}
                            alt={`${event.title} Banner`}
                            className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/95 to-transparent" />
                        </div>
                      )}

                      {/* Description Box */}
                      <div className="max-w-4xl mx-auto bg-slate-900/95 border border-slate-800/80 rounded-[28px] p-6 mb-8 shadow-inner shadow-slate-950/20">
                        <h4 className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-3">Event Highlights</h4>
                        <p className="text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                          {event.description}
                        </p>
                      </div>

                      {/* Media Gallery (if present) */}
                      {event.images && event.images.length > 0 && (
                        <div className="max-w-4xl mx-auto border-t border-slate-800/70 pt-8 mb-8">
                          <MediaGallery images={event.images} title={event.title} duration={event.galleryScrollDuration || 35} />
                        </div>
                      )}

                      {/* Footer Details */}
                      <div className="max-w-4xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 mt-6 border-t border-slate-800/70 pt-4">
                        <span>Organized by: <strong className="text-slate-200">{event.organizer}</strong></span>
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-cyan-200 transition hover:bg-cyan-400/15"
                          >
                            Details Link
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
