import Link from 'next/link'

const socialLinks = [
  { label: 'Facebook', shortLabel: 'f', href: 'https://www.facebook.com/people/Gayatri-Gradsassociation/pfbid0by9Ut2stFfGxLDQoa1DQXi2rid75rMXJPW5J7YaUw9XRPN9eVpjyd4RkXnh9CWwXl/?mibextid=ZbWKwL' },
  { label: 'LinkedIn', shortLabel: 'in', href: 'https://www.linkedin.com/company/gayatri-grads-association/' },
  { label: 'YouTube', shortLabel: '▶', href: 'https://www.youtube.com/@GayatriGradsAssociation' },
  { label: 'X', shortLabel: '𝕏', href: 'https://x.com/gayatrigrads?t=0r0W5PdtsIpGOTWvIyCFhw&s=09' },
  { label: 'Instagram', shortLabel: '◎', href: 'https://www.instagram.com/gayatrigradsassociation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
]

const quickLinks = [
  { label: 'About Us', href: '/about?section=overview' },
  { label: 'Alumni Corner', href: '/alumni-corner' },
  { label: 'Events', href: '/upcoming-events' },
  { label: 'Giving Back', href: '/giving-back' },
  { label: 'Corporate Connect', href: '/corporate-connect' },
  { label: 'Contact Us', href: '/contact-us' },
]

const campusMapUrl = 'https://www.google.com/maps/place/Gayatri+Vidya+Parishad+College+for+Degree+%26+P.G.+Courses/@17.77759,83.376192,15z/data=!4m6!3m5!1s0x3a395b1c4627825b:0xaef3bdc65b34e6d5!8m2!3d17.7775896!4d83.376192!16s%2Fg%2F1td4hjxc?hl=en&entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D'
const campusMapEmbedUrl = 'https://www.google.com/maps?q=17.7775896,83.376192&z=15&output=embed'

export default function Footer() {
  return (
    <footer className="gvp-footer relative isolate overflow-hidden border-t border-indigo-300/20 text-white shadow-[0_-8px_40px_rgba(79,70,229,0.18)]">
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-600" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 py-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.65fr_1fr_1.2fr] lg:gap-10">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">GVP Alumni Network</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Gayatri Vidya Parishad</h3>
            </div>
            <p className="max-w-sm text-sm leading-7 text-indigo-100/75">
              Empowering students with quality education and building lifelong alumni connections across the globe.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, shortLabel, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold shadow-sm ring-1 ring-white/15 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:text-white ${
                    label === 'YouTube' ? 'text-[#ff0033]' : label === 'Instagram' ? 'text-pink-400' : 'text-indigo-100'
                  }`}
                >
                  {label === 'YouTube' ? (
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                    </svg>
                  ) : label === 'Instagram' ? (
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  ) : shortLabel}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-white">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm text-indigo-100/75">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition hover:text-violet-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-white">Contact &amp; Visit Us</h4>
            <div className="mt-5 space-y-4 text-sm leading-6 text-indigo-100/75">
              <p className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fuchsia-500" />
                <span>
                  Gayatri Vidya Parishad College for Degree and P.G Courses(A), Rushikonda, Visakhapatnam-530045, Andhra Pradesh.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                +91 891 234 5678 | +91 9849591216 | +91 9440156216 | +91 9912015757
              </p>
              <p className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                <span className="break-all">
                  <a href="mailto:info@gvp.edu.in" className="transition hover:text-violet-300">info@gvp.edu.in</a>
                  <span className="mx-1.5 text-indigo-200/50">|</span>
                  <a href="mailto:secgayatrigrads@gmail.com" className="transition hover:text-violet-300">secgayatrigrads@gmail.com</a>
                </span>
              </p>
            </div>
          </div>

          <section aria-labelledby="campus-map-heading" className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950/35 p-4 shadow-lg shadow-slate-950/10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Find our campus</p>
                <h4 id="campus-map-heading" className="mt-1 text-base font-bold text-white">College Location</h4>
              </div>
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300/10 text-lg text-amber-300">⌖</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/15 bg-slate-800">
              <iframe
                title="Gayatri Vidya Parishad College campus map"
                src={campusMapEmbedUrl}
                className="h-52 w-full border-0 sm:h-60"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={campusMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Open in Google Maps
              <span aria-hidden="true">↗</span>
            </a>
          </section>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-indigo-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Gayatri Vidya Parishad. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="#" className="transition hover:text-violet-300">Privacy Policy</Link>
            <Link href="#" className="transition hover:text-violet-300">Terms of Service</Link>
            <Link href="#" className="transition hover:text-violet-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
