import { useEffect, useRef, useState } from 'react';
import { fetchNotifications } from '../services/api';

const getNoticeType = (title = '') => {
  const normalizedTitle = title.toLowerCase();
  if (/exam|result|revaluation|time table/.test(normalizedTitle)) {
    return { label: 'Examination', badge: 'EXAM' };
  }
  if (/circular|notification/.test(normalizedTitle)) {
    return { label: 'Circular', badge: 'NEW' };
  }
  if (/event|meet|workshop|seminar|celebration/.test(normalizedTitle)) {
    return { label: 'Event', badge: 'NEW' };
  }
  return { label: 'Announcement', badge: 'NEW' };
};

export default function NotificationTicker() {
  const [items, setItems] = useState([]);
  const listRef = useRef(null);
  const firstGroupRef = useRef(null);
  const secondGroupRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetchNotifications();
        if (active) {
          setItems((response.data || []).filter((item) => item.visible !== false));
        }
      } catch (error) {
        console.error('Unable to load latest notices:', error);
      }
    };

    load();
    const intervalId = window.setInterval(load, 60_000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (items.length === 0 || !listRef.current) return undefined;
    let animationFrame;
    let previousFrame = 0;
    const scroll = (timestamp) => {
      const list = listRef.current;
      const firstGroup = firstGroupRef.current;
      const secondGroup = secondGroupRef.current;
      if (!list || !firstGroup || !secondGroup) return;
      if (previousFrame && !pausedRef.current) {
        const elapsed = Math.min(timestamp - previousFrame, 50);
        const cycleHeight = secondGroup.offsetTop - firstGroup.offsetTop;
        if (cycleHeight > 0) {
          list.scrollTop += elapsed * 0.035;
          if (list.scrollTop >= cycleHeight) list.scrollTop -= cycleHeight;
        }
      }
      previousFrame = timestamp;
      animationFrame = window.requestAnimationFrame(scroll);
    };

    animationFrame = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [items]);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="latest-news-heading">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-[#f4f6fb] shadow-[0_18px_50px_rgba(30,58,138,0.12)]">
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#263d7b] to-[#3559a8] px-5 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-2xl" aria-hidden="true">🔔</span>
            <div className="min-w-0">
              <h2 id="latest-news-heading" className="truncate text-lg font-extrabold tracking-tight">Latest News</h2>
              <p className="text-xs text-blue-100">Announcements &amp; Updates</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-950">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-900/50" aria-hidden="true" />
            Live
          </span>
        </header>

        <div
          ref={listRef}
          className="h-[34rem] overflow-hidden px-3 py-4 sm:px-4"
          style={{ scrollbarWidth: 'none' }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onFocusCapture={() => { pausedRef.current = true; }}
          onBlurCapture={() => { pausedRef.current = false; }}
          aria-live="polite"
        >
          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
              No announcements are available right now.
            </div>
          ) : [0, 1].map((group) => (
            <div
              key={`notice-group-${group}`}
              ref={group === 0 ? firstGroupRef : secondGroupRef}
              className="flex min-h-[32rem] flex-col justify-around gap-3"
            >
              {items.map((item) => {
                const type = getNoticeType(item.title);
                const cardClass = 'group flex min-h-[88px] cursor-default items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 text-left shadow-[0_5px_16px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md';

                return (
                  <div key={`${group}-${item._id}`} className={cardClass}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-[10px] font-extrabold text-[#293f7b]">
                      {type.badge}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#a51f58]">
                        {item.important ? 'Important · ' : ''}{type.label}
                      </span>
                      <span className="mt-1 block text-sm font-bold leading-5 text-[#253665] group-hover:text-[#3559a8]">
                        {item.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-xl font-bold text-[#3559a8]" aria-hidden="true">›</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
          <span className="font-semibold text-[#3559a8]">View all notices</span>
          <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
          Hover over an announcement to pause
        </footer>
      </div>
    </section>
  );
}
