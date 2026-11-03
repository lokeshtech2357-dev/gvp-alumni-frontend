import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  getStoredAuthToken,
  getAlumniSummary,
  getAlumniRecordSummary,
  getAllEvents,
  getAllAlumniStack,
  getAllAlumniStories,
} from '../services/api';

export default function AlumniAnalyticsDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [recentStories, setRecentStories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const token = getStoredAuthToken();

    const loadData = async () => {
      try {
        // Fetch summary metrics (trying user summary, fallback to admin summary if admin)
        let summaryData = null;
        if (token) {
          try {
            const summaryRes = await getAlumniSummary(token);
            summaryData = summaryRes.data;
          } catch (err) {
            if (['admin', 'manager', 'super-admin'].includes(user?.role)) {
              try {
                const adminSummaryRes = await getAlumniRecordSummary(token);
                summaryData = adminSummaryRes.data;
              } catch (_) {}
            }
          }
        }

        // Fetch upcoming events from DB
        let eventsData = [];
        try {
          const eventsRes = await getAllEvents();
          eventsData = eventsRes.data?.data || eventsRes.data || [];
        } catch (_) {}

        // Fetch public alumni stack records from DB for recent activity
        let alumniData = [];
        try {
          const alumniRes = await getAllAlumniStack();
          alumniData = alumniRes.data?.data || alumniRes.data || [];
        } catch (_) {}

        // Fetch alumni stories from DB
        let storiesData = [];
        try {
          const storiesRes = await getAllAlumniStories();
          storiesData = storiesRes.data?.data || storiesRes.data || [];
        } catch (_) {}

        if (isMounted) {
          setSummary(summaryData);
          setEvents(Array.isArray(eventsData) ? eventsData : []);
          setRecentAlumni(Array.isArray(alumniData) ? alumniData.slice(0, 5) : []);
          setRecentStories(Array.isArray(storiesData) ? storiesData.slice(0, 3) : []);
        }
      } catch (err) {
        console.error('Error loading dashboard statistics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Derived metrics from actual database
  const totalRegistered = summary?.total ?? recentAlumni.length;
  const employedCount = summary?.employed ?? 0;
  const selfEmployedCount = summary?.selfEmployed ?? 0;
  const entrepreneurCount = summary?.entrepreneurs ?? 0;
  const studentCount = summary?.students ?? 0;
  const totalInWorkforce = employedCount + selfEmployedCount + entrepreneurCount;

  // Actual distributions
  const byYear = summary?.byGraduationYear || [];
  const byDept = summary?.byBranch || summary?.byDegree || [];
  const byIndustry = summary?.byIndustry || [];

  // Filter upcoming events (future or recent)
  const upcomingEventsList = events
    .filter(ev => ev.isActive !== false)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-[#0284c7]" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading GVPIHLR Alumni Dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#091e3a] via-[#0f2d57] to-[#154378] p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-cyan-500/20">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-32 -bottom-16 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>GVPIHLR ALUMNI PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome to GVPIHLR
            </h1>
            <p className="text-sm sm:text-base font-medium text-cyan-100/90 max-w-2xl leading-relaxed">
              Connecting generations of Gayatri Vidya Parishad alumni.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/alumni-profile"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              My Alumni Profile
            </Link>
            <Link
              href="/alumni-corner"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Alumni
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Alumni */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Alumni Network</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">30,000+</h3>
            <p className="mt-1 text-xs text-slate-500">
              Across 3 decades globally
            </p>
          </div>
        </div>

        {/* Registered Alumni */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">Registered Alumni</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-cyan-700">
              {totalRegistered > 0 ? totalRegistered : 'Verified Members'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Active profiles in database
            </p>
          </div>
        </div>

        {/* Employed Alumni */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Employed Alumni</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-700">
              {totalInWorkforce > 0 ? totalInWorkforce : 'Industry Leaders'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Employed &amp; Entrepreneurs
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Upcoming Events</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-700">
              {events.length}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Scheduled college reunions &amp; meets
            </p>
          </div>
        </div>
      </div>

      {/* 3. CHARTS GRID (ACTUAL DATABASE AGGREGATIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Distribution by Graduation Year */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Alumni Distribution by Graduation Year</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recorded batches and graduation cohorts</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
              Batches
            </span>
          </div>

          <div className="mt-6">
            {byYear.length > 0 ? (
              <div className="space-y-3.5">
                {byYear.slice(0, 6).map((item) => {
                  const maxCount = Math.max(...byYear.map(y => y.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item._id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Batch {item._id || 'Unknown'}</span>
                        <span className="text-slate-900">{item.count} alumni</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <svg className="mx-auto h-8 w-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-xs">Graduation cohorts will display as alumni complete their profiles.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart B: Distribution by Department */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Alumni Distribution by Department</h2>
              <p className="text-xs text-slate-500 mt-0.5">Academic disciplines and branches</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold">
              Departments
            </span>
          </div>

          <div className="mt-6">
            {byDept.length > 0 ? (
              <div className="space-y-3.5">
                {byDept.slice(0, 6).map((item, index) => {
                  const maxCount = Math.max(...byDept.map(d => d.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  const colors = [
                    'from-teal-600 to-emerald-400',
                    'from-cyan-600 to-sky-400',
                    'from-blue-600 to-indigo-400',
                    'from-purple-600 to-pink-400',
                    'from-amber-600 to-yellow-400',
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <div key={item._id || index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[70%]">{item._id || 'Engineering / General'}</span>
                        <span className="text-slate-900 font-bold">{item.count}</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                          style={{ width: `${Math.max(pct, 10)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <svg className="mx-auto h-8 w-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xs">Department breakdowns update with registered profiles.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart C: Employment Status Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Employment Status Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Professional engagement across alumni</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
              Status
            </span>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3">
                <p className="text-lg font-black text-emerald-700">{employedCount}</p>
                <p className="text-[11px] font-semibold text-emerald-900 mt-0.5">Employed</p>
              </div>
              <div className="rounded-xl bg-cyan-50/70 border border-cyan-100 p-3">
                <p className="text-lg font-black text-cyan-700">{selfEmployedCount}</p>
                <p className="text-[11px] font-semibold text-cyan-900 mt-0.5">Self-Employed</p>
              </div>
              <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3">
                <p className="text-lg font-black text-amber-700">{entrepreneurCount}</p>
                <p className="text-[11px] font-semibold text-amber-900 mt-0.5">Entrepreneurs</p>
              </div>
              <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-3">
                <p className="text-lg font-black text-purple-700">{studentCount}</p>
                <p className="text-[11px] font-semibold text-purple-900 mt-0.5">Higher Studies</p>
              </div>
            </div>

            {/* Employment Status Bar Representation */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Workforce Proportion</span>
                <span>{totalRegistered > 0 ? `${Math.round((totalInWorkforce / totalRegistered) * 100)}% active` : 'Active'}</span>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${totalInWorkforce > 0 ? (employedCount / totalInWorkforce) * 100 : 50}%` }}
                  title={`Employed: ${employedCount}`}
                />
                <div
                  className="bg-cyan-500 transition-all duration-500"
                  style={{ width: `${totalInWorkforce > 0 ? (selfEmployedCount / totalInWorkforce) * 100 : 25}%` }}
                  title={`Self-Employed: ${selfEmployedCount}`}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{ width: `${totalInWorkforce > 0 ? (entrepreneurCount / totalInWorkforce) * 100 : 25}%` }}
                  title={`Entrepreneurs: ${entrepreneurCount}`}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Employed</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Self-Employed</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Entrepreneur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart D: Distribution by Industry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Alumni Distribution by Industry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top sectors and industry domains</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
              Industries
            </span>
          </div>

          <div className="mt-6">
            {byIndustry.length > 0 ? (
              <div className="space-y-3.5">
                {byIndustry.slice(0, 5).map((item, index) => {
                  const maxCount = Math.max(...byIndustry.map(i => i.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item._id || index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[70%]">{item._id}</span>
                        <span className="text-slate-900 font-bold">{item.count}</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.max(pct, 10)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <svg className="mx-auto h-8 w-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Industry breakdown is populated from alumni profile records.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. RECENT ACTIVITY & UPCOMING EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Alumni Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Alumni Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest community contributions &amp; members</p>
              </div>
              <Link
                href="/alumni-corner"
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition"
              >
                View all →
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentAlumni.length > 0 ? (
                recentAlumni.map((alumnus) => (
                  <div
                    key={alumnus._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm overflow-hidden">
                        {alumnus.image ? (
                          <img
                            src={alumnus.image.startsWith('http') ? alumnus.image : alumnus.image}
                            alt={alumnus.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          alumnus.name?.charAt(0) || 'A'
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{alumnus.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {alumnus.position ? `${alumnus.position}` : 'Alumni Member'}
                          {alumnus.company ? ` at ${alumnus.company}` : ''}
                        </p>
                      </div>
                    </div>
                    {alumnus.batch && (
                      <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        Batch {alumnus.batch}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No recent alumni activity recorded yet.
                </div>
              )}

              {/* Recent Stories Preview */}
              {recentStories.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Featured Alumni Stories</p>
                  {recentStories.map((story) => (
                    <Link
                      key={story._id}
                      href="/alumni-stories"
                      className="block p-2.5 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
                    >
                      <span className="text-cyan-600 font-bold mr-1.5">★</span>
                      <span className="font-semibold text-slate-900">{story.title}</span>
                      {story.author && <span className="text-slate-500 ml-1">— {story.author}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/alumni-stories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800"
            >
              Share your alumni story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Alumni Events */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Alumni Events</h2>
                <p className="text-xs text-slate-500 mt-0.5">Meetups, webinars &amp; annual celebrations</p>
              </div>
              <Link
                href="/upcoming-events"
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition"
              >
                All events →
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingEventsList.length > 0 ? (
                upcomingEventsList.map((event) => {
                  const eventDate = event.date ? new Date(event.date) : null;
                  const formattedDate = eventDate && !isNaN(eventDate)
                    ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Upcoming';

                  return (
                    <div
                      key={event._id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100 transition flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                            {formattedDate}
                          </span>
                          {event.location && (
                            <span className="text-[11px] text-slate-500 truncate">
                              📍 {event.location}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 truncate">{event.title}</h3>
                        {event.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-1">{event.description}</p>
                        )}
                      </div>

                      <Link
                        href={`/upcoming-events#${event._id}`}
                        className="flex-shrink-0 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
                      >
                        Register
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <svg className="mx-auto h-8 w-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-medium">No upcoming events scheduled right now.</p>
                  <Link
                    href="/previous-events"
                    className="mt-2 inline-block text-xs font-bold text-cyan-600 hover:underline"
                  >
                    View previous event recaps →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/previous-events"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Previous Event Highlights
            </Link>
            <Link
              href="/events-sponsors"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Event Sponsors →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

