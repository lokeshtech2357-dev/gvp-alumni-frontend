import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const aboutLinks = [
  { label: 'Overview', href: '/about?section=overview' },
  { label: "Messages by GVP's Chief Patrons", href: '/about?section=messages' },
  { label: 'Governing Body', href: '/about?section=governing-body' },
  { label: 'GVP Heritage Center', href: '/about?section=heritage-center' },
];

const alumniLinks = [
  { label: 'Alumni Messages', href: '/alumni-messages' },
  { label: 'Alumni Connect', href: '/alumni-connect' },
  { label: 'Alumni Registration', href: '/alumni-registration' },
  { label: 'My Alumni Profile', href: '/alumni-profile' },
  { label: 'Alumni Chapters', href: '/alumni-chapters' },
  { label: 'Alumni Stories', href: '/alumni-stories' },
  { label: 'Alumni Gallery', href: '/alumni-gallery' },
];

const eventsLinks = [
  { label: 'Upcoming Events', href: '/upcoming-events' },
  { label: 'Previous Events', href: '/previous-events' },
  { label: 'Our Events Sponsors', href: '/events-sponsors' },
];

const navItems = [
  { label: 'About Us', isDropdown: true },
  { label: 'Alumni Corner', isDropdown: true },
  { label: 'Events', isDropdown: true },
  { label: 'Giving Back', href: '/giving-back' },
  { label: 'Corporate Connect', href: '/corporate-connect' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function TopBar() {
  const [openMap, setOpenMap] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMap({});
        setMobileOpen(false);
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        setOpenMap({});
        setMobileOpen(false);
      }
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const renderDropdownLinks = (label) => {
    const links =
      label === 'About Us' ? aboutLinks :
      label === 'Alumni Corner' ? alumniLinks :
      eventsLinks;

    return links.map((link) => (
      <Link
        key={link.label}
        href={link.href}
        className="block rounded-xl px-4 py-3 text-slate-100 hover:bg-slate-700"
        onClick={() => setMobileOpen(false)}
      >
        {link.label}
      </Link>
    ));
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700 lg:hidden"
          >
            <span className="sr-only">Toggle navigation</span>
            {mobileOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <nav ref={navRef} className="border-t border-slate-700 pt-3 lg:border-t-0 lg:pt-0">
          <div className="hidden lg:flex flex-wrap justify-end items-center gap-4">
            {navItems.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={!!openMap[item.label]}
                    aria-haspopup="menu"
                    onClick={() => setOpenMap((m) => ({ ...m, [item.label]: !m[item.label] }))}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-slate-100 transition hover:bg-slate-800"
                  >
                    <span>{item.label}</span>
                    <svg className="h-4 w-4 text-slate-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div
                    onMouseEnter={() => setOpenMap((m) => ({ ...m, [item.label]: true }))}
                    onMouseLeave={() => setTimeout(() => setOpenMap((m) => ({ ...m, [item.label]: false })), 80)}
                    className={`absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-xl transition-all duration-100 ${
                      openMap[item.label] ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
                    }`}
                  >
                    {renderDropdownLinks(item.label)}
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} className="rounded-md px-3 py-2 text-slate-100 transition hover:bg-slate-800">
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div id="mobile-menu" className={`${mobileOpen ? 'block' : 'hidden'} lg:hidden mt-3 space-y-3`}>
            {navItems.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800 p-3">
                  <button
                    type="button"
                    onClick={() => setOpenMap((m) => ({ ...m, [item.label]: !m[item.label] }))}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-100 transition hover:bg-slate-700"
                  >
                    <span>{item.label}</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {openMap[item.label] && (
                    <div className="mt-2 space-y-2">
                      {renderDropdownLinks(item.label)}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-slate-100 transition hover:bg-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
