import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL, deleteEvent, hardDeleteEvent, getStoredAuthToken } from '../services/api';

const eventTypeStyles = {
  conference: 'bg-blue-100 text-blue-700 border-blue-200',
  workshop: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  seminar: 'bg-violet-100 text-violet-700 border-violet-200',
  cultural: 'bg-rose-100 text-rose-700 border-rose-200',
  sports: 'bg-amber-100 text-amber-700 border-amber-200',
  reunion: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const eventTypeIcons = {
  conference: '💼',
  workshop: '🛠️',
  seminar: '🎤',
  cultural: '🎭',
  sports: '🏆',
  reunion: '🤝',
  other: '📅',
};

const parseDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: '--', month: 'DATE', year: '' };
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
  };
};

const isVideoUrl = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'].some((ext) => lower.endsWith(ext)) || lower.includes('data:video/');
};

function MediaCarousel({ images, title }) {
  const activeImages = (images || []).filter(Boolean);
  if (!activeImages.length) {
    return (
      <div className="w-full h-72 bg-slate-900 rounded-3xl border border-slate-200/60 flex items-center justify-center text-slate-500">
        <span>No preview available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-72 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950">
      <img
        src={activeImages[0]}
        alt={`${title} preview`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      {activeImages.length > 1 && (
        <div className="absolute bottom-4 left-4 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-100 px-3 py-1 shadow-lg">
          {activeImages.length} media
        </div>
      )}
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getStoredAuthToken();
    setAdminToken(token || null);
  }, []);

  const fetchEvents = async () => {
    const apiBase = API_BASE_URL;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/events`);
      const result = await res.json();
      const data = result.data || result;
      setEvents(Array.isArray(data) ? data.filter((item) => item.isActive) : []);
    } catch (error) {
      console.error('Failed to load events', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeactivate = async (id) => {
    if (!adminToken) return;
    if (!window.confirm('Deactivate this event? It will be hidden from the public Events list.')) return;
    try {
      setActionLoading(id);
      await deleteEvent(id, adminToken);
      setMessage('Event deactivated successfully.');
      await fetchEvents();
    } catch (error) {
      console.error(error);
      setMessage('Unable to deactivate event.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleHardDelete = async (id) => {
    if (!adminToken) return;
    if (!window.confirm('Permanently delete this event? This cannot be undone.')) return;
    try {
      setActionLoading(id);
      await hardDeleteEvent(id, adminToken);
      setMessage('Event permanently deleted.');
      await fetchEvents();
    } catch (error) {
      console.error(error);
      setMessage('Unable to delete event.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Head>
        <title>Events | GVP Alumni</title>
        <meta
          name="description"
          content="Discover upcoming alumni events, cultural programs, workshops, reunions and meetups at Gayatri Vidya Parishad."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-900 via-slate-900/0 to-transparent pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-slate-100 uppercase shadow-sm shadow-slate-950/10">
              Events & Announcements
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
              Be a part of the next big GVP alumni gathering.
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-8">
              Browse the latest event schedule and membership meetups with photo previews and details designed for the alumni community.
            </p>
          </div>

          {adminToken && (
            <div className="mb-10 rounded-3xl border border-slate-200 bg-slate-100 px-6 py-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Admin Access Enabled</div>
                <p className="text-sm text-slate-600">Use the dashboard to edit or delete events, or manage them directly from here.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <a className="inline-flex items-center justify-center rounded-full border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                    Open Admin Dashboard
                  </a>
                </Link>
                <button
                  type="button"
                  onClick={fetchEvents}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Refresh Events
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
              {message}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 animate-spin text-slate-500">
                <span className="text-lg">⏳</span>
              </div>
              <p className="mt-4 text-slate-500">Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400 mb-3">No events yet</p>
              <h2 className="text-2xl font-semibold text-slate-900">We are preparing something special.</h2>
              <p className="mt-3 text-slate-500 max-w-xl mx-auto">Once the next alumni meetups and cultural experiences are scheduled, they will appear here with full details and photo preview cards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event) => {
                const date = parseDate(event.date);
                const badgeClass = eventTypeStyles[event.type] || eventTypeStyles.other;
                return (
                  <article key={event._id} className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative">
                      <MediaCarousel images={[event.banner, ...(event.images || [])].filter(Boolean)} title={event.title} />
                      <div className="absolute left-5 top-5 rounded-3xl border border-white/40 bg-white/90 px-4 py-3 shadow-lg">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{date.month}</div>
                        <div className="mt-1 text-3xl font-black text-slate-900">{date.day}</div>
                        <div className="text-xs text-slate-500 mt-1">{date.year}</div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.24em] ${badgeClass}`}>
                        <span>{eventTypeIcons[event.type] || '📅'}</span>
                        <span>{event.type || 'Other'}</span>
                      </div>
                      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{event.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-slate-600 min-h-[5.5rem]">{event.description}</p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{event.location || 'TBA'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Organizer</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{event.organizer || 'GVP Alumni'}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            Register / Details
                          </a>
                        )}
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
                          {event.images?.length || 0} photos
                        </span>
                      </div>

                      {adminToken && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link href="/dashboard">
                            <a className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                              ✏️ Edit in Dashboard
                            </a>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeactivate(event._id)}
                            disabled={actionLoading === event._id}
                            className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === event._id ? 'Processing…' : 'Deactivate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHardDelete(event._id)}
                            disabled={actionLoading === event._id}
                            className="inline-flex items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === event._id ? 'Processing…' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
