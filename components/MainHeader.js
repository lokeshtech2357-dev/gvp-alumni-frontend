import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications } from '../services/api';

export default function MainHeader({ onToggleSidebar }) {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch real notifications from the database
  useEffect(() => {
    let isMounted = true;
    fetchNotifications()
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || res.data || [];
        setNotifications(Array.isArray(data) ? data.filter(n => n.isActive !== false) : []);
      })
      .catch(() => {
        // Silent catch for network hiccups
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
    await router.push('/login-selection');
  };

  const isAdmin = ['admin', 'editor', 'manager', 'super-admin'].includes(user?.role);
  const dashboardHref = isAdmin ? '/dashboard' : '/user-dashboard';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a192f] text-white border-b border-[#1e3458] shadow-md backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile Toggle + Official Logos & Branding */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile / Tablet Sidebar Toggle Button */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#132743] hover:bg-[#1a365d] text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Official College & Alumni Logos with Original Assets & Proportions */}
            <Link
              href="/"
              className="flex items-center gap-3 sm:gap-4 group focus:outline-none"
            >
              {/* College Seal */}
              <div className="relative flex-shrink-0">
                <img
                  src="/images/logos/gvp-college-seal.jpg"
                  alt="GVPIHLR seal"
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#d4af37] object-cover shadow-sm transition group-hover:scale-105"
                />
              </div>

              {/* Gayatri Grads Association Logo */}
              <div className="relative flex-shrink-0">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#d4af37] bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden transition group-hover:scale-105">
                  <img
                    src="/images/logos/WhatsApp-Image-2023-11-20-at-2.36.06-PM.webp"
                    alt="Gayatri Grads Association"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
              </div>

              {/* Title, Branding, Subtitle */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-black tracking-[0.22em] text-cyan-400 uppercase">
                    GVPIHLR
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#d4af37]" />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300 truncate">
                    Gayatri Vidya Parishad
                  </span>
                </div>
                <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight text-white leading-tight truncate">
                  Gayatri Grads Association
                </h1>
                <p className="hidden xs:block sm:block text-[10px] sm:text-xs font-medium text-slate-300 truncate">
                  Gayatri Grads Association | Voyage into the Future
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Notification Center + User Profile Menu / Auth Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Notification Icon & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-[#132743] hover:bg-[#1a365d] text-slate-200 hover:text-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="View notifications"
                aria-expanded={showNotifications}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#1e3458] bg-[#0c1f3d] p-4 text-slate-200 shadow-2xl z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1e3458]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Notifications</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-semibold border border-cyan-800">
                        {notifications.length} Active
                      </span>
                    </div>
                    <Link
                      href="/upcoming-events"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-cyan-400 transition"
                    >
                      Events
                    </Link>
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">
                        No new notifications right now.
                      </p>
                    ) : (
                      notifications.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="p-3 rounded-xl bg-[#11284d] hover:bg-[#16335f] border border-[#1e3458] transition"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white">{item.title}</p>
                              {item.message && (
                                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                                  {item.message}
                                </p>
                              )}
                              {item.link && (
                                <Link
                                  href={item.link}
                                  onClick={() => setShowNotifications(false)}
                                  className="mt-1.5 inline-block text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
                                >
                                  View details →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Menu or Auth Links */}
            {!isLoading && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-[#132743] hover:bg-[#1a365d] border border-[#1e3458] transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-expanded={showProfileMenu}
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#d4af37]">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-100 max-w-28 truncate leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                      {user.role}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Popover Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#1e3458] bg-[#0c1f3d] p-3 text-slate-200 shadow-2xl z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#1e3458]">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-800 uppercase tracking-wider">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#132743] transition"
                      >
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        href="/alumni-profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#132743] transition"
                      >
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Alumni Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#132743] transition"
                      >
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#1e3458]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-900/40 transition"
                      >
                        <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login-selection"
                  className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:from-cyan-500 hover:to-blue-500 transition"
                >
                  Sign In
                </Link>
              </div>
            ) : null}

            {/* Direct Sign Out Button for easy one-click access */}
            {!isLoading && user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/80 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
