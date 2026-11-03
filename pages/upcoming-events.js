import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL, registerForEvent } from '../services/api';

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) || lowerUrl.includes('data:video/');
};

const parseEventDate = (dateString) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { day: '—', month: 'EVENT' };
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: monthNames[d.getMonth()],
      year: d.getFullYear()
    };
  } catch {
    return { day: '—', month: 'EVENT' };
  }
};

function CardSlider({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-52 bg-slate-900 flex items-center justify-center text-slate-500">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openPreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const closePreview = () => setShowPreview(false);

  return (
    <>
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-950 group/slider">
        {/* Viewport */}
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative bg-slate-950 cursor-pointer" onClick={openPreview}>
              {isVideoUrl(img) ? (
                <video
                  src={img}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-slate-950 select-none"
                />
              ) : (
                <img
                  src={img}
                  alt={`${title} - Preview ${idx + 1}`}
                  className="w-full h-full object-contain bg-slate-950 select-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/0 pointer-events-none" />
              <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                <div className="bg-black/40 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm">Click to view</div>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black text-white hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 z-10"
              aria-label="Previous media"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black text-white hover:scale-105 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100 z-10"
              aria-label="Next media"
            >
              ›
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 px-2.5 py-1.5 rounded-full">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 text-white bg-black/60 rounded-full w-11 h-11 flex items-center justify-center text-xl"
            aria-label="Close preview"
          >
            ×
          </button>
          <div className="max-w-[95vw] max-h-[95vh] w-full overflow-hidden rounded-3xl bg-slate-950 relative shadow-2xl border border-white/10">
            {isVideoUrl(images[currentIndex]) ? (
              <video
                src={images[currentIndex]}
                controls
                autoPlay
                className="w-full h-full max-h-[95vh] object-contain bg-black"
              />
            ) : (
              <img
                src={images[currentIndex]}
                alt={`${title} - Full view ${currentIndex + 1}`}
                className="w-full h-full max-h-[95vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', phone: '', organization: '', message: '' });
  const [registering, setRegistering] = useState(false);
  const [registrationFeedback, setRegistrationFeedback] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);

  const shareEventOnWhatsApp = (event) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const eventUrl = `${baseUrl}/upcoming-events#${event._id}`;
    const message = `*Upcoming Event from GVP Alumni*\n\n*${event.title}*\n${new Date(event.date).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    })}` +
      `${event.location ? `\nLocation: ${event.location}` : ''}` +
      `${event.organizer ? `\nOrganizer: ${event.organizer}` : ''}` +
      `${event.description ? `\n\n${event.description}` : ''}` +
      `\n\nView details: ${eventUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const apiBase = API_BASE_URL;
    fetch(`${apiBase}/api/events`)
      .then(res => res.json())
      .then(result => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const upcoming = (result.data || []).filter((event) => {
          if (!event.isActive) return false;
          const eventDate = new Date(event.date);
          return eventDate >= todayStart;
        });

        // Sort by closest date first
        const sorted = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle hash-based scrolling to event
  const openRegistration = (event) => {
    setRegistrationError(null);
    setRegistrationFeedback(null);
    setRegistrationForm({ name: '', email: '', phone: '', organization: '', message: '' });
    setRegisteringEvent(event);
  };

  const closeRegistration = () => {
    setRegisteringEvent(null);
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!registrationForm.name || !registrationForm.email) {
      setRegistrationError('Please enter your name and email.');
      return;
    }

    setRegistering(true);
    setRegistrationError(null);
    setRegistrationFeedback(null);

    try {
      const response = await registerForEvent(registeringEvent._id, registrationForm);
      const savedRegistration = response.data?.data;
      setRegistrationFeedback(response.data?.message || 'Registration confirmed.');
      setEvents((prevEvents) => prevEvents.map((ev) => {
        if (ev._id !== registeringEvent._id) return ev;
        return {
          ...ev,
          registrations: [...(ev.registrations || []), savedRegistration]
        };
      }));
      setRegistrationForm({ name: '', email: '', phone: '', organization: '', message: '' });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Unable to complete registration. Please try again.';
      setRegistrationError(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    if (events.length === 0) return;

    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.classList.add('highlight');
            setTimeout(() => element.classList.remove('highlight'), 2000);
          }, 100);
        }
      }
    };

    // Handle scroll on mount and when hash changes
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [events]);

  const getEventTypeColor = (type) => {
    const colors = {
      conference: 'bg-blue-50 text-blue-700 border-blue-150',
      workshop: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      seminar: 'bg-violet-50 text-violet-700 border-violet-150',
      cultural: 'bg-rose-50 text-rose-700 border-rose-150',
      sports: 'bg-amber-50 text-amber-700 border-amber-150',
      reunion: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      other: 'bg-slate-50 text-slate-700 border-slate-150'
    };
    return colors[type] || colors.other;
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      conference: '💼',
      workshop: '🛠️',
      seminar: '🎤',
      cultural: '🎭',
      sports: '🏆',
      reunion: '🤝',
      other: '📅'
    };
    return icons[type] || icons.other;
  };

  return (
    <>
      <Head>
        <title>Upcoming Events | GVP Alumni</title>
        <meta name="description" content="Stay updated with upcoming meetings, sports days, cultural activities, and alumni reunions of Gayatri Vidya Parishad." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Decorative Blurred Gradient Shapes */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-16 relative">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 uppercase tracking-widest mb-4">
              Get Involved
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4 font-sans">
              Upcoming Events & Meetups
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Stay connected, learn together, and celebrate milestones. Register for upcoming workshops, reunions, and celebrations.
            </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-24 h-1 bg-indigo-600 rounded-full" />
                <Link href="/notices" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">
                  View Notices
                </Link>
              </div>
            </div>

          {events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 max-w-2xl mx-auto shadow-sm">
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Upcoming Events</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed px-4">
                We&apos;re currently planning next season&apos;s reunions and conferences. Check back soon or visit the dashboard to create one.
              </p>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const dateParts = parseEventDate(event.date);
                const registrationCount = event.registrations?.length || 0;
                const isFull = event.maxParticipants && registrationCount >= event.maxParticipants;
                return (
                  <div
                    key={event._id}
                    id={event._id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Media section (CardSlider containing banner and images) */}
                    <div className="relative">
                      <CardSlider 
                        images={event.banner ? [event.banner, ...(event.images || [])] : (event.images || [])} 
                        title={event.title} 
                      />

                      {/* Date Badge Overlayed on Top-Left */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 shadow-md flex flex-col items-center justify-center min-w-[54px] min-h-[58px] z-10 border border-slate-100/50">
                        <span className="text-xs font-black tracking-wider text-indigo-650 leading-none">
                          {dateParts.month}
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 mt-1.5 leading-none">
                          {dateParts.day}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Event category badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getEventTypeColor(event.type)}`}>
                          <span>{getEventTypeIcon(event.type)}</span>
                          <span className="uppercase tracking-wider font-semibold text-[10px]">
                            {event.type}
                          </span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 font-sans line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Details Box */}
                      <div className="space-y-2 mb-4 mt-auto">
                        {/* Time */}
                        <div className="flex items-center text-xs text-slate-500">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center text-xs text-slate-500">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}

                        {/* Organizer */}
                        <div className="flex items-center text-xs text-slate-500">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Organizer: <strong className="text-slate-600 font-semibold">{event.organizer}</strong></span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Register Button / Capacity details */}
                      <div className="pt-5 border-t border-slate-100 mt-auto flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          {event.maxParticipants && (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 font-semibold">
                              Capacity: {event.maxParticipants}
                            </div>
                          )}
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 font-semibold">
                            Registered: {registrationCount}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openRegistration(event)}
                          disabled={isFull}
                          className={`inline-flex items-center justify-center gap-2 w-full text-center ${isFull ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} font-bold py-3 px-4 rounded-2xl shadow-sm transition-all text-sm`}
                        >
                          {isFull ? 'Fully Booked' : 'RSVP / Register'}
                        </button>

                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl shadow-sm transition-all text-sm"
                          >
                            Register Online
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => shareEventOnWhatsApp(event)}
                          className="inline-flex items-center justify-center gap-2 w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl shadow-sm hover:shadow transition-all text-sm"
                        >
                          Share on WhatsApp
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.75 7.5c-.25-.13-1.48-.72-1.71-.8-.23-.06-.4-.09-.57.09-.18.18-.69.8-.85.97-.16.16-.31.18-.57.06-.25-.13-1.05-.39-2-.21-.73.14-1.35.84-1.56 1.64-.17.61-.02 1.19.43 1.85.3.44.69.95.72 1.15.04.21-.27.87-.87 1.34-.28.2-.57.28-.82.2-.22-.06-.96-.35-1.83-1.12-.67-.62-1.12-1.38-1.25-1.6-.13-.22-.01-.34.09-.44.09-.09.19-.22.28-.33.1-.12.13-.2.2-.34.06-.12.03-.23-.01-.32-.04-.1-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44-.14-.01-.3-.01-.45-.01-.15 0-.39.06-.6.28-.21.22-.82.8-.82 1.95s.84 2.26.96 2.42c.12.18 1.66 2.54 4.03 3.56.56.24 1.01.38 1.36.48.57.17 1.09.14 1.5.08.46-.07 1.48-.6 1.7-1.18.22-.58.22-1.08.15-1.18-.08-.1-.26-.18-.54-.32z" />
                            <path d="M12 2.04C6.48 2.04 2.04 6.5 2.04 12.04c0 1.98.53 3.82 1.45 5.4L2 22l4.77-1.26c1.46.8 3.12 1.24 4.94 1.24 5.52 0 9.96-4.46 9.96-9.96C21.96 6.5 17.52 2.04 12 2.04zM12 20.48c-1.57 0-3.05-.42-4.34-1.15l-.31-.18-2.83.75.76-2.76-.2-.31A8.381 8.381 0 013.6 12.04c0-4.61 3.75-8.35 8.34-8.35 4.61 0 8.36 3.74 8.36 8.35-.01 4.61-3.75 8.35-8.36 8.35z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {registeringEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
              <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden max-h-[calc(100vh-4rem)]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Register for {registeringEvent.title}</h2>
                    <p className="text-sm text-slate-500">Fill your details to RSVP for the event.</p>
                  </div>
                  <button type="button" onClick={closeRegistration} className="text-slate-500 hover:text-slate-900 text-2xl leading-none">×</button>
                </div>
                <form className="space-y-4 px-6 py-6 overflow-y-auto max-h-[calc(100vh-8rem)]" onSubmit={submitRegistration}>
                  {registrationFeedback && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      {registrationFeedback}
                    </div>
                  )}
                  {registrationError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                      {registrationError}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Name*
                      <input
                        type="text"
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
                        placeholder="Your full name"
                        required
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Email*
                      <input
                        type="email"
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
                        placeholder="name@example.com"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Phone
                      <input
                        type="text"
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
                        placeholder="Optional"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Organization
                      <input
                        type="text"
                        value={registrationForm.organization}
                        onChange={(e) => setRegistrationForm((prev) => ({ ...prev, organization: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
                        placeholder="Company / batch / chapter"
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Message
                    <textarea
                      value={registrationForm.message}
                      onChange={(e) => setRegistrationForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="mt-2 w-full min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-200"
                      placeholder="Optional information or questions"
                    />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={closeRegistration}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-indigo-400 sm:w-auto"
                    >
                      {registering ? 'Registering…' : 'Confirm RSVP'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
