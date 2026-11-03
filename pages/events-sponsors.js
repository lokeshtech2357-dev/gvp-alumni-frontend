import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getSponsors } from '../services/api';

const SPEED = 0.8; // px per frame

export default function EventsSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef  = useRef(null);
  const rafRef    = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);

  /* ── fetch all sponsors ── */
  useEffect(() => {
    getSponsors()
      .then(res => setSponsors(res?.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── JS scroll loop (bypasses CSS animation restrictions) ── */
  useEffect(() => {
    if (!trackRef.current || sponsors.length === 0) return;

    const tick = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += SPEED;
        const half = trackRef.current.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sponsors]);

  /* ── render one set of logos ── */
  const renderLogos = (prefix) =>
    sponsors.map((s, i) => (
      <div
        key={`${prefix}-${i}`}
        style={styles.logoCard}
      >
        {s.url ? (
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            <img src={s.imageUrl} alt={s.title || `sponsor-${i}`} style={styles.logoImg} />
          </a>
        ) : (
          <img src={s.imageUrl} alt={s.title || `sponsor-${i}`} style={styles.logoImg} />
        )}
      </div>
    ));

  return (
    <>
      <Head>
        <title>Our Event Sponsors – Gayatri Grads</title>
        <meta name="description" content="Meet the proud sponsors of Gayatri Vidya Parishad events." />
      </Head>

      {/* ── Page wrapper ── */}
      <main style={styles.page}>

        {/* ── Header ── */}
        <div style={styles.headerSection}>
          <h1 style={styles.heading}>Our Event Sponsors</h1>
          <p style={styles.subText}>
            We are grateful to our sponsors for supporting Gayatri Vidya Parishad events and initiatives.
          </p>
        </div>

        {/* ── Sponsor ticker strip ── */}
        <div style={styles.stripOuter}>
          <div style={styles.stripLabel}>SPONSORS</div>

          {loading ? (
            <div style={styles.loadingText}>Loading sponsors…</div>
          ) : sponsors.length === 0 ? (
            <div style={styles.emptyText}>No sponsors added yet.</div>
          ) : (
            <div
              style={styles.stripTrackWrap}
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={() => { pausedRef.current = false; }}
            >
              {/* Left fade */}
              <div style={{ ...styles.fade, left: 0, background: 'linear-gradient(to right, #0f172a, transparent)' }} />
              {/* Right fade */}
              <div style={{ ...styles.fade, right: 0, background: 'linear-gradient(to left, #0f172a, transparent)' }} />

              {/* Scrolling track — items duplicated for seamless loop */}
              <div ref={trackRef} style={styles.track}>
                {renderLogos('a')}
                {renderLogos('b')}
              </div>
            </div>
          )}
        </div>

        {/* ── Static grid (all logos visible at once too) ── */}
        {!loading && sponsors.length > 0 && (
          <div style={styles.gridSection}>
            <h2 style={styles.gridHeading}>All Sponsors</h2>
            <div style={styles.grid}>
              {sponsors.map((s, i) => {
                const CardWrapper = s.url ? 'a' : 'div';
                const linkProps = s.url
                  ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {};
                let domain = '';
                try { domain = s.url ? new URL(s.url).hostname.replace('www.', '') : ''; } catch {}
                return (
                  <CardWrapper
                    key={i}
                    {...linkProps}
                    style={{
                      ...styles.gridCard,
                      textDecoration: 'none',
                      cursor: s.url ? 'pointer' : 'default',
                    }}
                    title={s.url ? `Visit ${domain}` : s.title}
                  >
                    {/* Logo */}
                    <div style={styles.gridImgWrap}>
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        style={styles.gridImg}
                        onError={e => { e.target.style.opacity = 0.3; }}
                      />
                    </div>

                    {/* Sponsor name */}
                    {s.title && (
                      <p style={styles.gridTitle}>{s.title}</p>
                    )}

                    {/* Website link badge */}
                    {domain ? (
                      <div style={styles.urlBadge}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4, flexShrink: 0 }}>
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {domain}
                      </div>
                    ) : (
                      <div style={{ ...styles.urlBadge, background: '#f1f5f9', color: '#94a3b8' }}>
                        No website
                      </div>
                    )}
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Back link ── */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/upcoming-events" style={styles.backLink}>
            ← Back to Events
          </Link>
        </div>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: '60vh',
    background: '#f8fafc',
    paddingBottom: 60,
  },

  /* Header */
  headerSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    padding: '48px 24px 40px',
    textAlign: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 12px',
    letterSpacing: '-0.5px',
  },
  subText: {
    fontSize: 15,
    color: '#94a3b8',
    maxWidth: 560,
    margin: '0 auto',
  },

  /* Scrolling strip */
  stripOuter: {
    display: 'flex',
    alignItems: 'center',
    background: '#0f172a',
    borderBottom: '2px solid #e94560',
    height: 90,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 3px 14px rgba(233,69,96,0.15)',
  },
  stripLabel: {
    background: '#e94560',
    color: '#fff',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    padding: '0 18px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    borderRight: '3px solid rgba(0,0,0,0.15)',
    textTransform: 'uppercase',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    padding: '0 24px',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    padding: '0 24px',
  },
  stripTrackWrap: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  fade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 3,
    pointerEvents: 'none',
  },
  track: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0,
    willChange: 'transform',
  },
  logoCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 28px',
    flexShrink: 0,
    background: '#ffffff',
    margin: '0 12px',
    borderRadius: 8,
    height: 68,
    minWidth: 120,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  logoImg: {
    maxWidth: 130,
    maxHeight: 52,
    objectFit: 'contain',
    display: 'block',
  },

  /* Static grid */
  gridSection: {
    maxWidth: 900,
    margin: '48px auto 0',
    padding: '0 24px',
  },
  gridHeading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  gridCard: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    minWidth: 160,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    color: 'inherit',
  },
  gridImgWrap: {
    width: '100%',
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    background: '#fff',
    borderBottom: '1px solid #f3f4f6',
  },
  gridImg: {
    maxWidth: '100%',
    maxHeight: 66,
    objectFit: 'contain',
  },
  gridTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 600,
    margin: '10px 12px 4px',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  urlBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#2563eb',
    background: '#eff6ff',
    borderRadius: 6,
    padding: '4px 10px',
    margin: '0 12px 12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 24px)',
  },

  /* Back link */
  backLink: {
    display: 'inline-block',
    color: '#2563eb',
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    padding: '10px 20px',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    background: '#eff6ff',
  },
};
