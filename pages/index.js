import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prefetchAllContent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import NotificationTicker from '../components/NotificationTicker';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [modalSrc, setModalSrc] = useState('');

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login-selection');
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!user) return undefined;

    const t = setTimeout(() => {
      prefetchAllContent().catch(() => {});
    }, 700);

    return () => clearTimeout(t);
  }, [user]);

  if (isLoading) {
    return (
      <main className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f7f4ef]" aria-busy="true">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadbd2] border-t-[#731d2b]" />
          <p className="mt-4 text-sm font-medium text-slate-600">Checking your account…</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 overflow-x-hidden">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes logoStampEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .logo-stamp-enter {
          animation: logoStampEnter 700ms ease-out both;
        }
      `}</style>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-white border-y border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.35),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.2),_transparent_24%),linear-gradient(135deg,_rgba(239,246,255,0.9)_0%,_rgba(255,255,255,0.96)_40%,_rgba(224,242,254,0.91)_100%)]" />
        <div className="absolute -left-10 top-12 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-200/25 via-blue-100/25 to-indigo-200/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="animate-fade-in">
            <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/40 px-4 py-6 backdrop-blur-sm sm:px-8 lg:px-12 lg:py-10">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center rounded-full border border-cyan-200 bg-white/70 px-4 py-2 shadow-sm shadow-cyan-100/80 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.34em] text-cyan-700">GVPIHLR</span>
                </div>

                <p className="text-[10px] uppercase tracking-[0.38em] font-black text-cyan-700 sm:text-xs">
                  Gayatri Vidya Parishad &amp; Gayatri Grads Association
                </p>

                <h1 className="mx-auto max-w-5xl text-[clamp(1.35rem,3vw,3rem)] font-black leading-[1.08] tracking-[-0.05em] text-slate-900">
                  Welcome to <span className="bg-gradient-to-r from-blue-700 via-cyan-700 to-indigo-700 bg-clip-text text-transparent">Gayatri Vidya Parishad &amp; Gayatri Grads Association</span>
                </h1>

                <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  Empowering students with quality education and fostering lifelong connections through our vibrant alumni community.
                </p>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
                  <Link
                    href={['admin', 'editor', 'manager', 'super-admin'].includes(user?.role) ? '/dashboard' : '/user-dashboard'}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/35 whitespace-nowrap"
                  >
                    Alumni Dashboard →
                  </Link>
                  <Link
                    href="/about?section=overview"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 whitespace-nowrap"
                    onMouseEnter={() => prefetchAllContent().catch(() => {})}
                    onFocus={() => prefetchAllContent().catch(() => {})}
                  >
                    About Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-8 pt-2 sm:flex-row sm:gap-16">
              <figure className="logo-stamp-enter group flex flex-col items-center gap-3">
                <div className="relative aspect-square w-[clamp(7.5rem,20vw,11rem)] rounded-full bg-gradient-to-br from-cyan-200 via-white to-blue-300 p-[3px] shadow-lg shadow-cyan-200/50 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-cyan-300/60">
                  <div className="absolute inset-[7%] rounded-full border border-cyan-200/80 transition-transform duration-700 group-hover:rotate-12" />
                  <div className="absolute inset-[13%] flex items-center justify-center rounded-full bg-white/95 shadow-inner">
                    <img src="/images/logos/img-gga.webp" alt="Gayatri Grads Association logo" className="h-[78%] w-[78%] object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="absolute right-[13%] top-[15%] h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-white" />
                </div>
                <figcaption className="text-center text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">Gayatri Grads Association</figcaption>
              </figure>

              <figure className="logo-stamp-enter group flex flex-col items-center gap-3" style={{ animationDelay: '180ms' }}>
                <div className="relative aspect-square w-[clamp(7.5rem,20vw,11rem)] rounded-full bg-gradient-to-br from-purple-200 via-white to-pink-300 p-[3px] shadow-lg shadow-purple-200/50 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-purple-300/60">
                  <div className="absolute inset-[7%] rounded-full border border-purple-200/80 transition-transform duration-700 group-hover:rotate-12" />
                  <div className="absolute inset-[13%] flex items-center justify-center rounded-full bg-white/95 shadow-inner">
                    <img src="/images/logos/cropped-Gayatri_Logo-removebg-preview.webp" alt="Gayatri Vidya Parishad logo" className="h-[78%] w-[78%] object-contain transition-transform duration-500 group-hover:scale-105" loading="eager" />
                  </div>
                  <span className="absolute right-[13%] top-[15%] h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-white" />
                </div>
                <figcaption className="text-center text-xs font-semibold tracking-wide text-slate-600 sm:text-sm">Gayatri Vidya Parishad</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* GVP Alumni Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">#GVP Alumni</h2>
          <h3 className="text-3xl md:text-4xl font-semibold text-slate-700 mb-6">A Network of 3 Decades Connecting 30000 Students across the Globe</h3>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            GVP alumni are changing the world. Find stories that showcase the big things happening across our community.
          </p>
        </div>
      </div>

      {/* President's Message Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Message by Prof. Dr. Ing. P. Srinivasa Rao</h2>
            <p className="text-lg text-blue-600 font-semibold mb-8">President, Gayatri Vidya Parishad</p>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-gray-700 leading-relaxed text-lg italic">
                &quot;Welcome to our esteemed institution. At Gayatri Vidya Parishad, we are committed to fostering excellence in education and nurturing the next generation of leaders. Our alumni network stands as a testament to the quality of education and values we instill in our students.&quot;
              </p>
            </div>
            
            {/* President's Video */}
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    type="button"
                    onClick={() => setModalSrc('https://www.youtube.com/embed/7plLRnDc8No?autoplay=1')}
                    className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-transparent hover:bg-black/10 transition cursor-pointer"
                    aria-label="Play President's message"
                  >
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl flex items-center justify-center transform transition-transform duration-200 hover:scale-105">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  <img src="https://img.youtube.com/vi/7plLRnDc8No/maxresdefault.jpg" alt="President video" className="w-full h-full object-cover z-0 transform transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vice President's Message Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Message by Sri D. Dakshina Murthy</h2>
            <p className="text-lg text-green-600 font-semibold mb-8">Vice President of Gayatri Vidya Parishad</p>
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    type="button"
                    onClick={() => setModalSrc('https://www.youtube.com/embed/kIMEA4mseAo?autoplay=1')}
                    className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-transparent hover:bg-black/10 transition cursor-pointer"
                    aria-label="Play Vice President's message"
                  >
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl flex items-center justify-center transform transition-transform duration-200 hover:scale-105">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  <img src="https://img.youtube.com/vi/kIMEA4mseAo/maxresdefault.jpg" alt="Vice President video" className="w-full h-full object-cover z-0 transform transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secretary's Message Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Message by Prof. P. Somaraju</h2>
            <p className="text-lg text-purple-600 font-semibold mb-8">Secretary of Gayatri Vidya Parishad</p>
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    type="button"
                    onClick={() => setModalSrc('https://www.youtube.com/embed/9yO_RvkoscE?autoplay=1')}
                    className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-transparent hover:bg-black/10 transition cursor-pointer"
                    aria-label="Play Secretary's message"
                  >
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl flex items-center justify-center transform transition-transform duration-200 hover:scale-105">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  <img src="https://img.youtube.com/vi/9yO_RvkoscE/maxresdefault.jpg" alt="Secretary video" className="w-full h-full object-cover z-0 transform transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GVPCOE (Autonomous) Overview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 bg-white/70 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">GVPCOE (Autonomous)</h2>
            <p className="text-base text-orange-600 font-semibold mb-4">Gayatri Vidya Parishad</p>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed text-base italic">
                &quot;GVPCOE (Autonomous) is a premier engineering institution dedicated to providing quality technical education and fostering innovation in engineering and technology. We prepare students to become industry-ready professionals with strong technical foundations and practical skills.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GVP Institute of Healthcare and Medical Technology Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">GVP Institute of Healthcare and Medical Technology</h2>
            <p className="text-lg text-teal-600 font-semibold mb-8">Healthcare Education Excellence</p>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-gray-700 leading-relaxed text-lg italic">
                &quot;GVP Institute of Healthcare and Medical Technology is dedicated to providing world-class education in healthcare and medical sciences. We prepare healthcare professionals with cutting-edge knowledge and practical skills to serve the community with compassion and excellence.&quot;
              </p>
            </div>
            
            {/* Healthcare Institute Video */}
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    type="button"
                    onClick={() => setModalSrc('https://www.youtube.com/embed/uLAD6prYrUw?autoplay=1')}
                    className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-10 transition cursor-pointer"
                    aria-label="Play Healthcare Institute video"
                  >
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl flex items-center justify-center transform transition-transform duration-200 hover:scale-105">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  <img src="https://img.youtube.com/vi/uLAD6prYrUw/hqdefault.jpg" alt="Healthcare video" className="w-full h-full object-cover brightness-75 z-0 rounded-2xl transform transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GVPCOE for Women (Autonomous) Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">GVPCOE for Women (Autonomous)</h2>
            <p className="text-lg text-pink-600 font-semibold mb-8">Empowering Women in Engineering</p>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-gray-700 leading-relaxed text-lg italic">
                &quot;GVPCOE for Women (Autonomous) is committed to empowering women in engineering and technology. We provide a supportive environment that fosters innovation, leadership, and excellence in technical education for women.&quot;
              </p>
            </div>
            
            {/* GVPCOE for Women Video */}
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <button
                    type="button"
                    onClick={() => setModalSrc('https://www.youtube.com/embed/uLAD6prYrUw?autoplay=1')}
                    className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-10 transition cursor-pointer"
                    aria-label="Play GVPCOE for Women video"
                  >
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl flex items-center justify-center transform transition-transform duration-200 hover:scale-105">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  <img src="https://img.youtube.com/vi/uLAD6prYrUw/hqdefault.jpg" alt="GVPCOE for Women video" className="w-full h-full object-cover brightness-75 z-0 rounded-2xl transform transition-transform duration-300 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus video, Latest News, and Our Community sit at the end of Home content. */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-800">
            <span className="h-2 w-2 rounded-full bg-cyan-600 animate-pulse" />
            Campus Video &amp; Highlights
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Gayatri Vidya Parishad Campus Video
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Experience our academic infrastructure, engineering excellence, and vibrant campus life.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200 bg-black aspect-video group">
            <button
              type="button"
              onClick={() => setModalSrc('https://www.youtube.com/embed/37yEg4J9TXs?autoplay=1')}
              className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-black/25 hover:bg-black/15 transition-colors cursor-pointer group focus:outline-none focus:ring-4 focus:ring-cyan-400"
              aria-label="Play Gayatri Vidya Parishad campus video"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
            <img
              src="https://img.youtube.com/vi/37yEg4J9TXs/maxresdefault.jpg"
              alt="Gayatri Vidya Parishad Campus Video"
              className="w-full h-full object-cover z-0 transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      <NotificationTicker />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider mb-2">
            GVP Community
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Our Community</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Empowering students, fostering global connections, and driving professional excellence across generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.523 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Excellence</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Providing quality education and fostering innovation in engineering and technology.</p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Alumni Network</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Building strong connections with our successful alumni worldwide.</p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Opportunities</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Connecting students with career opportunities through our alumni network.</p>
          </div>
        </div>
      </section>

      {/* Video Playback Modal */}
      {modalSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalSrc('')}></div>
          <div className="relative w-full max-w-4xl mx-4">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={modalSrc}
                title="Video player"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setModalSrc('')}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition"
              aria-label="Close video"
            >
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
