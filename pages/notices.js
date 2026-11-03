import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL } from '../services/api';

export default function NoticesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = API_BASE_URL;
    fetch(`${apiBase}/api/notifications`)
      .then((res) => res.json())
      .then((data) => setItems((data || []).filter((item) => item.visible !== false)))
      .catch((err) => {
        console.error('Failed to load notices:', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Notices | GVP Alumni</title>
        <meta name="description" content="Latest notices and announcements for Gayatri Vidya Parishad alumni and campus community." />
      </Head>

      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
            <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-indigo-600 font-semibold">Notices</p>
                <h1 className="text-4xl font-extrabold text-slate-900 mt-4">Important Announcements, Exam Notices & Event Alerts</h1>
                <p className="mt-4 text-slate-500 text-lg leading-8">
                  Stay updated with the latest college announcements, exam schedules, result alerts and event notices for the GVP alumni community. The Latest News panel above the footer links directly to notices for quick access.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Link href="/upcoming-events" className="inline-flex items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                  View Upcoming Events
                </Link>
                <Link href="/notices" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                  See All Notices
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-700 font-semibold">Main Updates</p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">Campus-wide alerts</h2>
                <p className="mt-2 text-sm text-slate-600">General announcements for alumni, college notices and immediate community updates.</p>
              </div>
              <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-rose-700 font-semibold">Exam Notices</p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">Results & schedules</h2>
                <p className="mt-2 text-sm text-slate-600">Exam dates, result announcements, revaluation deadlines and exam-related guidance.</p>
              </div>
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-teal-700 font-semibold">Event Alerts</p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">Meetups & seminars</h2>
                <p className="mt-2 text-sm text-slate-600">Event registration, alumni meetings, workshops and community gatherings announced here.</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10 text-center text-slate-500">
              Loading notices…
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10 text-center text-slate-500">
              No notices are available at the moment.
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item) => (
                <div key={item._id} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-slate-400">{item.important ? 'Important Notice' : 'Notice'}</p>
                      {item.link ? (
                        <Link href={item.link}>
                          <h2 className="mt-3 text-xl font-semibold text-slate-900 leading-tight hover:text-indigo-600 transition cursor-pointer">
                            {item.title}
                          </h2>
                        </Link>
                      ) : (
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 leading-tight">{item.title}</h2>
                      )}
                    </div>
                    {item.link && (
                      <Link href={item.link} className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap">
                        Go
                      </Link>
                    )}
                  </div>
                  {item.link && (
                    <p className="mt-4 text-sm text-slate-500">
                      Direct link: <span className="text-indigo-600">{item.link}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
