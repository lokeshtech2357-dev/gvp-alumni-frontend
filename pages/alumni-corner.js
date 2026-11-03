import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllContent } from '../services/api';

export default function AlumniCorner() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Use cached prefetched result if available to avoid spinner
        let res = null;
        if (typeof window !== 'undefined' && window.__alumniContentCache) {
          res = window.__alumniContentCache;
        } else {
          res = await getAllContent();
        }

        const alumniCornerContent = res?.data?.data?.find(item => item.sectionId === 'alumni-corner');
        if (alumniCornerContent) setContent(alumniCornerContent);
      } catch (err) {
        console.error('Error fetching alumni corner content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Alumni Corner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 p-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Alumni Corner</h1>
              <p className="text-lg text-slate-600 mb-6">Connect with our distinguished alumni network and explore opportunities.</p>

              <div className="prose max-w-none text-slate-700 leading-7">
                {content ? (
                  <>
                    <h2 className="text-3xl font-semibold text-slate-900">{content.title}</h2>
                    <p className="whitespace-pre-line mt-4">{content.body}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-semibold text-slate-900">Welcome to Alumni Corner</h2>
                    <p className="mt-4">Connect with our distinguished alumni network and explore endless opportunities for collaboration and growth. Our alumni are spread across the globe, making significant contributions in various fields.</p>
                    <p className="mt-4">Stay connected with your alma mater and fellow alumni through our various programs and events.</p>
                    <p className="mt-4">Join us in building a stronger alumni community!</p>
                  </>
                )}
              </div>
            </div>

            <aside className="p-8 bg-gradient-to-b from-cyan-50 to-white border-l border-slate-100">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Alumni Network</h3>
                <p className="text-slate-600 mb-4">Connect with thousands of successful alumni worldwide</p>
                <a href="#" className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Join Network</a>
              </div>

              <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Stay Updated</h4>
                <p className="text-slate-600 text-sm mb-4">Subscribe for events, mentorship programs, and job postings from our alumni.</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">Subscribe</button>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                <strong>Alumni Network</strong>
                <div className="mt-2">Connect with thousands of successful alumni worldwide</div>
              </div>
            </aside>
          </div>
        </div>

        {/* Quick Links Section (pressable cards like the design) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/alumni-chapters" className="group block bg-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center">Networking</h3>
            <p className="text-center text-slate-600 mt-2">Connect with fellow graduates in your area</p>
          </Link>

          <Link href="/career-opportunities" className="group block bg-emerald-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center">Professional Development</h3>
            <p className="text-center text-slate-600 mt-2">Career growth and learning opportunities</p>
          </Link>

          <Link href="/community-impact" className="group block bg-violet-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center">Community Impact</h3>
            <p className="text-center text-slate-600 mt-2">Make a difference in your local community</p>
          </Link>
        </div>
        
        {/* Extra Cards Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
            <p className="text-white/90 text-sm mb-4">Stay informed about reunions, webinars, and campus events.</p>
            <a href="#" className="inline-block mt-2 bg-white text-indigo-600 font-medium text-sm py-2 px-4 rounded-lg">View Events →</a>
          </div>

          <div className="bg-amber-400 text-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h8M4 7h.01M4 11h.01M4 15h.01M20 7h.01M20 11h.01M20 15h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
            <p className="text-slate-900 text-sm mb-4">Sign up to mentor students or find a mentor among our alumni.</p>
            <a href="#" className="inline-block mt-2 bg-white text-amber-500 font-medium text-sm py-2 px-4 rounded-lg">Get Mentored →</a>
          </div>

          <div className="bg-rose-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3zM6 8V6a6 6 0 0112 0v2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Support & Donate</h3>
            <p className="text-white/90 text-sm mb-4">Contribute to scholarships and campus development projects.</p>
            <a href="#" className="inline-block mt-2 bg-white text-rose-600 font-medium text-sm py-2 px-4 rounded-lg">Donate →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
