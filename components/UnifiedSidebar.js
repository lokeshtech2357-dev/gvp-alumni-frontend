import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UnifiedSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = ['admin', 'manager', 'editor', 'super-admin'].includes(user?.role);
  const dashboardHref = isAdmin ? '/dashboard' : '/user-dashboard';

  // State for expandable submenus
  const [expanded, setExpanded] = useState({
    about: false,
    alumniCorner: false,
    events: false,
  });

  // Automatically expand the section if the user is on one of its subpages
  useEffect(() => {
    const path = router.asPath || '';
    if (path.includes('/about')) {
      setExpanded(prev => ({ ...prev, about: true }));
    }
    if (
      path.includes('/alumni-messages') ||
      path.includes('/alumni-connect') ||
      path.includes('/alumni-registration') ||
      path.includes('/alumni-chapters') ||
      path.includes('/alumni-stories') ||
      path.includes('/alumni-gallery') ||
      path.includes('/alumni-corner')
    ) {
      setExpanded(prev => ({ ...prev, alumniCorner: true }));
    }
    if (
      path.includes('/upcoming-events') ||
      path.includes('/previous-events') ||
      path.includes('/events-sponsors') ||
      path.includes('/events')
    ) {
      setExpanded(prev => ({ ...prev, events: true }));
    }
  }, [router.asPath]);

  const toggleExpand = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isCurrent = (href) => {
    if (!href) return false;
    const currentPath = router.asPath;
    if (href === dashboardHref) {
      return currentPath === '/dashboard' || currentPath === '/user-dashboard';
    }
    return currentPath === href || currentPath.startsWith(`${href}?`) || currentPath.startsWith(`${href}#`);
  };

  const navItemClass = (active) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
      active
        ? 'bg-gradient-to-r from-[#0284c7]/20 to-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400 pl-2.5 shadow-sm shadow-cyan-900/20'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  const subItemClass = (active) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
      active
        ? 'text-cyan-400 font-semibold bg-cyan-950/40 border-l-2 border-cyan-400 pl-2'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Unified Vertical Sidebar */}
      <aside
        id="unified-left-sidebar"
        aria-label="Main Navigation Sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#091528] text-slate-200 border-r border-[#1e3458] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header (Visible mainly on mobile drawer) */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e3458] lg:hidden">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logos/gvp-college-seal.jpg"
              alt="GVPIHLR Seal"
              className="w-9 h-9 rounded-full border border-[#d4af37] object-cover"
            />
            <div>
              <p className="text-xs font-black tracking-widest text-cyan-400 uppercase">GVPIHLR</p>
              <p className="text-xs font-semibold text-slate-200">Gayatri Grads</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {/* SECTION 1: DASHBOARD */}
          <div>
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400/90">
                Dashboard
              </span>
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
            </div>

            <div className="space-y-1">
              {/* 1. Dashboard */}
              <Link
                href={dashboardHref}
                onClick={onClose}
                className={navItemClass(isCurrent(dashboardHref) || router.pathname === '/')}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  <span>Dashboard</span>
                </div>
                {(isCurrent(dashboardHref) || router.pathname === '/') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </Link>

              {/* 2. My Alumni Profile */}
              <Link
                href="/alumni-profile"
                onClick={onClose}
                className={navItemClass(isCurrent('/alumni-profile'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span>My Alumni Profile</span>
                </div>
                {isCurrent('/alumni-profile') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>

              {/* 3. Career Opportunities */}
              <Link
                href="/careers"
                onClick={onClose}
                className={navItemClass(isCurrent('/careers'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>Career Opportunities</span>
                </div>
                {isCurrent('/careers') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>

              {/* 4. Settings */}
              <Link
                href="/settings"
                onClick={onClose}
                className={navItemClass(isCurrent('/settings'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>Settings</span>
                </div>
                {isCurrent('/settings') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
            </div>
          </div>

          {/* SECTION 2: EXPLORE (MAIN WEBSITE NAVIGATION) */}
          <div>
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Explore
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
            </div>

            <div className="space-y-1">
              {/* 5. About Us (Expandable Submenu) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand('about')}
                  aria-expanded={expanded.about}
                  className={`w-full ${navItemClass(router.asPath.includes('/about'))}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span>About Us</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expanded.about ? 'rotate-180 text-cyan-400' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expanded.about && (
                  <div className="mt-1 ml-4 pl-3.5 border-l border-[#1e3458] space-y-1">
                    <Link
                      href="/about?section=overview"
                      onClick={onClose}
                      className={subItemClass(router.asPath === '/about?section=overview' || router.asPath === '/about')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>Overview</span>
                    </Link>
                    <Link
                      href="/about?section=messages"
                      onClick={onClose}
                      className={subItemClass(router.asPath.includes('section=messages'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>Patrons&apos; Messages</span>
                    </Link>
                    <Link
                      href="/about?section=governing-body"
                      onClick={onClose}
                      className={subItemClass(router.asPath.includes('section=governing-body'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>Governing Body</span>
                    </Link>
                    <Link
                      href="/about?section=heritage-center"
                      onClick={onClose}
                      className={subItemClass(router.asPath.includes('section=heritage-center'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>GVP Heritage Center</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 6. Alumni Corner (Expandable Submenu) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand('alumniCorner')}
                  aria-expanded={expanded.alumniCorner}
                  className={`w-full ${navItemClass(
                    router.asPath.includes('/alumni-') && router.asPath !== '/alumni-profile'
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <span>Alumni Corner</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expanded.alumniCorner ? 'rotate-180 text-cyan-400' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expanded.alumniCorner && (
                  <div className="mt-1 ml-4 pl-3.5 border-l border-[#1e3458] space-y-1">
                    <Link
                      href="/alumni-corner"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-corner'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Directory</span>
                    </Link>
                    <Link
                      href="/alumni-messages"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-messages'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Messages</span>
                    </Link>
                    <Link
                      href="/alumni-connect"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-connect'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Connect</span>
                    </Link>
                    <Link
                      href="/alumni-registration"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-registration'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Registration</span>
                    </Link>
                    <Link
                      href="/alumni-chapters"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-chapters'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Chapters</span>
                    </Link>
                    <Link
                      href="/alumni-stories"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-stories'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Stories</span>
                    </Link>
                    <Link
                      href="/alumni-gallery"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/alumni-gallery'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>Alumni Gallery</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 7. Events (Expandable Submenu) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand('events')}
                  aria-expanded={expanded.events}
                  className={`w-full ${navItemClass(
                    router.asPath.includes('events')
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span>Events</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expanded.events ? 'rotate-180 text-cyan-400' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expanded.events && (
                  <div className="mt-1 ml-4 pl-3.5 border-l border-[#1e3458] space-y-1">
                    <Link
                      href="/upcoming-events"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/upcoming-events') || isCurrent('/events'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Upcoming Events</span>
                    </Link>
                    <Link
                      href="/previous-events"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/previous-events'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Previous Events</span>
                    </Link>
                    <Link
                      href="/events-sponsors"
                      onClick={onClose}
                      className={subItemClass(isCurrent('/events-sponsors'))}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Our Events Sponsors</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 8. Giving Back */}
              <Link
                href="/giving-back"
                onClick={onClose}
                className={navItemClass(isCurrent('/giving-back'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                  <span>Giving Back</span>
                </div>
                {isCurrent('/giving-back') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>

              {/* 9. Corporate Connect */}
              <Link
                href="/corporate-connect"
                onClick={onClose}
                className={navItemClass(isCurrent('/corporate-connect'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <span>Corporate Connect</span>
                </div>
                {isCurrent('/corporate-connect') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>

              {/* 10. Contact Us */}
              <Link
                href="/contact-us"
                onClick={onClose}
                className={navItemClass(isCurrent('/contact-us'))}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>Contact Us</span>
                </div>
                {isCurrent('/contact-us') && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer Info Badge */}
        <div className="p-3.5 border-t border-[#1e3458] bg-[#071120]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold ring-1 ring-cyan-500/40">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Gayatri Community'}
              </p>
              <p className="text-[11px] text-cyan-400/80 truncate capitalize">
                {user?.role ? `${user.role} Member` : 'Alumni Network'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

