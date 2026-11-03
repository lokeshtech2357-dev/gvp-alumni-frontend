import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HomeCarousel from '../components/HomeCarousel';
import { getAllContent, getAllHeritageEvents } from '../services/api';

const aboutLinks = [
  { label: 'Overview', sectionId: 'overview' },
  { label: "Messages by GVP's Chief Patrons", sectionId: 'messages' },
  { label: 'Governing body', sectionId: 'governing-body' },
  { label: 'GVP Heritage Center', sectionId: 'heritage-center' },
];

const defaultHeritageEvents = [
  {
    _id: 'default-1',
    campusName: 'Gayatri Vidya Parishad College for Degree and PG Courses (A)',
    location: 'Rushikonda, Visakhapatnam.',
    documentUrl: '/images/invetation/GVP-SriRama-Intivation-1.pdf',
    subEvents: [
      { title: 'Sundarakanda Parayanam and Havanam', dateString: '05/04/2025 at 8.00 AM' },
      { title: 'Sri Seetarama Kalyanam', dateString: '06/04/2025 at 8.00 AM' }
    ]
  },
  {
    _id: 'default-2',
    campusName: 'Gayatri Vidya Parishad College of Engineering (A)',
    location: 'Kommadi, Visakhapatnam.',
    documentUrl: '/images/invetation/GVP-SriRama-Intivation-1.pdf',
    subEvents: [
      { title: 'Ramayana Parayanam and Havanam', dateString: '07/04/2025 to 13/04/2025 from 8 AM' },
      { title: 'Sri Seetarama Kalyanam', dateString: '14/04/2025 at 8.00 AM' }
    ]
  }
];

export default function About() {
  const router = useRouter();
  const sectionId = router.query.section || 'overview';
  const [sections, setSections] = useState([]);
  const [heritageEvents, setHeritageEvents] = useState([]);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const [contentRes, heritageRes] = await Promise.all([
          getAllContent(),
          getAllHeritageEvents().catch(e => ({ data: { data: [] } }))
        ]);
        setSections(contentRes?.data?.data || []);
        if (heritageRes?.data?.data) {
          setHeritageEvents(heritageRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const current = sections.find((item) => item.sectionId === sectionId) || sections[0];
    setSection(current);
  }, [sections, sectionId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pb-20 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
            {sectionId !== 'messages' && (
              <>
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-6 drop-shadow-sm tracking-tight">
                  About Us
                </h1>
                <p className="mt-4 text-xl text-indigo-900/80 max-w-2xl mx-auto font-medium">
                  Learn more about the Gayatri Grads Association, our heritage, and our mission to unite alumni worldwide.
                </p>
              </>
            )}
          </div>

        <div className="max-w-4xl mx-auto">

          <section className="space-y-14 p-0 md:p-0">
            {sectionId === 'overview' ? (
              <div className="animation-fade-in space-y-12">
                {/* Overview content (card removed as requested) */}
                <div className="space-y-4">
                  <div>
                    <span className="inline-block text-sm font-semibold tracking-wide text-slate-500 uppercase">Est. August 2021</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Gayatri Grads Association
                  </h2>

                  <div className="mt-8">
                    <div className="w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white bg-white border border-white/80 p-2">
                      <HomeCarousel />
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-lg text-slate-700 mb-6 leading-relaxed">Established in August 2021, Gayatri Grads Association bridges the Gayatri Vidya Parishad institutions and their graduates — carrying the legacy of the past, embodying the spirit of the present, and paving the way for a brighter future.</p>

                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 inline-flex items-center justify-center text-white shadow-md">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                          </div>
                        </div>
                        <p className="text-slate-700 text-lg">We contribute to the personal and professional growth of alumni, supporting GVP&apos;s vision and helping create a vibrant community.</p>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 rounded-full bg-emerald-600 inline-flex items-center justify-center text-white shadow-md">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                          </div>
                        </div>
                        <p className="text-slate-700 text-lg">Our alumni network flies the flag of GVP across the globe, creating meaningful connections and opportunities worldwide.</p>
                      </div>

                      <div>
                        <p className="text-slate-700 mb-3 font-semibold">The Gayatri Grads Association covers four GVP institutions:</p>
                        <ul className="ml-6 list-disc space-y-2 text-slate-700">
                          <li>Gayatri Vidya Parishad College for Degree and PG Courses (Autonomous)</li>
                          <li>Gayatri Vidya Parishad College of Engineering (Autonomous)</li>
                          <li>Gayatri Vidya Parishad College of Engineering for Women (Autonomous)</li>
                          <li>Gayatri Vidya Parishad College Institute of Healthcare and Medical Technology</li>
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <Link href="/alumni-corner" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 whitespace-nowrap">
                          Explore Alumni Corner
                        </Link>
                        <Link href="/alumni-chapters" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 whitespace-nowrap">
                          Alumni Chapters
                        </Link>
                        <a
                          href="https://youtu.be/N5BNUYHmUQc?si=aeNGrk0xUiaKcCVW"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35 whitespace-nowrap"
                        >
                          CAMPUS TOUR
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Growth & Development</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Contributes to the personal and professional growth of alumni, supports the institution&apos;s overall vision and development, and helps create a strong, vibrant community.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Global Alumni Network</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Gayatri Vidya Parishad has an excellent alumni army striving hard to fly the flag of GVP across the globe, creating meaningful connections worldwide.
                    </p>
                  </div>
                </div>

                {/* Four Pillars */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 whitespace-nowrap">
                      GVP <span className="text-indigo-600">Institutions</span>
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      {
                        name: 'Gayatri Vidya Parishad Institute of Higher Learning and Research (GVPIHLR)',
                        color: 'from-blue-500 to-cyan-500',
                        href: 'https://www.gvpcdpgc.edu.in/#gsc.tab=0'
                      },
                      {
                        name: 'GVP Institute of Healthcare & Medical Tech',
                        color: 'from-rose-500 to-orange-500',
                        href: 'https://gvpihcmt.in/'
                      }
                    ].map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block bg-white rounded-2xl p-6 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${item.color}`}></div>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-slate-700 text-base leading-snug">{item.name}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : sectionId === 'messages' ? (
              <div className="animation-fade-in">
                <div className="text-center mb-16">
                  <span className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4">
                    Leadership
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 relative inline-block">
                    Messages by GVP&apos;s Patrons
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"></div>
                  </h2>
                </div>
                
                <div className="flex flex-col gap-16 mt-12">
                  {/* President */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden relative group transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5 transition-opacity"></div>
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-5/12 flex-shrink-0">
                          <div className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white relative z-10 aspect-video bg-slate-900 group-hover:scale-[1.02] transition-transform duration-500">
                            <iframe
                              className="w-full h-full"
                              src="https://www.youtube.com/embed/7plLRnDc8No"
                              title="Message by President"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full lg:w-7/12 relative z-10">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-blue-100 shadow-sm">
                            President
                          </span>
                          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 drop-shadow-sm">Prof. Dr. Ing. P. Srinivasa Rao</h3>
                          <p className="text-indigo-600 text-xl font-semibold mb-6">Gayatri Vidya Parishad</p>
                          
                          <blockquote className="relative">
                            <svg className="absolute -top-4 -left-4 w-10 h-10 text-blue-100 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
                            <p className="italic text-slate-600 text-lg md:text-xl leading-relaxed pl-8">
                              &quot;Welcome to our esteemed institution. At Gayatri Vidya Parishad, we are committed to fostering excellence in education and nurturing the next generation of leaders. Our alumni network stands as a testament to the quality of education and values we instill in our students.&quot;
                            </p>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vice President */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden relative group transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-5 transition-opacity"></div>
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                        <div className="w-full lg:w-5/12 flex-shrink-0">
                          <div className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white relative z-10 aspect-video bg-slate-900 group-hover:scale-[1.02] transition-transform duration-500">
                            <iframe
                              className="w-full h-full"
                              src="https://www.youtube.com/embed/kIMEA4mseAo"
                              title="Message by Vice President"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full lg:w-7/12 relative z-10">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-teal-100 shadow-sm">
                            Vice President
                          </span>
                          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 drop-shadow-sm">Sri D. Dakshina Murthy</h3>
                          <p className="text-teal-600 text-xl font-semibold mb-6">Gayatri Vidya Parishad</p>
                          
                          <blockquote className="relative">
                            <svg className="absolute -top-4 -left-4 w-10 h-10 text-teal-100 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
                            <p className="italic text-slate-600 text-lg md:text-xl leading-relaxed pl-8">
                              &quot;As Vice President, I am proud to lead our institution&apos;s commitment to academic excellence and holistic development. We strive to create an environment where students can thrive and achieve their full potential.&quot;
                            </p>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secretary */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden relative group transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-rose-600 to-pink-600 opacity-5 transition-opacity"></div>
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-5/12 flex-shrink-0">
                          <div className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white relative z-10 aspect-video bg-slate-900 group-hover:scale-[1.02] transition-transform duration-500">
                            <iframe
                              className="w-full h-full"
                              src="https://www.youtube.com/embed/9yO_RvkoscE"
                              title="Message by Secretary"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full lg:w-7/12 relative z-10">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-rose-100 shadow-sm">
                            Secretary
                          </span>
                          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 drop-shadow-sm">Prof. P. Somaraju</h3>
                          <p className="text-rose-600 text-xl font-semibold mb-6">Gayatri Vidya Parishad</p>
                          
                          <blockquote className="relative">
                            <svg className="absolute -top-4 -left-4 w-10 h-10 text-rose-100 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
                            <p className="italic text-slate-600 text-lg md:text-xl leading-relaxed pl-8">
                              &quot;As Secretary, I am dedicated to ensuring smooth administration and fostering an environment of innovation and research. Our commitment to quality education and student welfare remains our highest priority.&quot;
                            </p>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : sectionId === 'governing-body' ? (
              <div className="animation-fade-in">
                <div className="text-center mb-16">
                  <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4">
                    Our Core Team
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 relative inline-block">
                    Governing Body & Founders
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                  </h2>
                  <p className="mt-8 text-slate-600 max-w-2xl mx-auto text-lg">
                    Meet the dedicated individuals who established and continue to guide the Gayatri Grads Association towards excellence.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {[
                    "Smt. E. Radhika", "Sri M.M. Mahesh", "Sri Y. Marthanda Moorty",
                    "Smt. V. Vani Rama", "Smt. P. Jyothishmati", "Sri G. Praveen",
                    "Sri B. Sri Ram Murthy", "Sri B.V.N. Govardhan Rao", "Sri P.L. Prasad",
                    "Sri G.K. Bapi Raju", "Sri N.S.S. Subramanyam", "Sri V. Panakalu Rao",
                    "Sri K. Seshu Kumar", "Sri D.N. Varma", "Sri Varma",
                    "Sri Ch. Ajay Reddy", "Sri K. Kiran Kumar", "Sri Bhaskar Ram Murthy",
                    "Sri. M. Satyanarayana Murthy", "Sri D.V.P.R. Shirdhar", "Smt. V. Anuradha"
                  ].map((name, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-amber-200 transition-all duration-300 flex items-center group">
                      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold text-lg mr-4 group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white group-hover:border-transparent transition-all">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-slate-700 text-base group-hover:text-amber-800 transition-colors">{name}</span>
                    </div>
                  ))}
                </div>

                {/* Executive Committee Section */}
                <div className="mt-28 mb-10">
                  <div className="text-center mb-12">
                    <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4">
                      Current Leadership
                    </span>
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-6 relative inline-block">
                      Executive Committee 2024-2026
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"></div>
                    </h2>
                  </div>

                  <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="py-5 px-8 font-bold text-slate-500 uppercase tracking-wider text-sm w-1/2">Name</th>
                            <th className="py-5 px-8 font-bold text-slate-500 uppercase tracking-wider text-sm w-1/2">Position</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { name: "Sri Y. Marthanda Moorty", role: "President" },
                            { name: "Sri G. Praveen", role: "Vice president" },
                            { name: "Sri Ch. Ashok Chakravarthy", role: "Associate Vice president" },
                            { name: "Er. N. Santosh", role: "Associate Vice president" },
                            { name: "Smt. P. Jyothishmathi", role: "Treasurer" },
                            { name: "Smt. V. Vani Rama", role: "Secretary" },
                            { name: "Sri Seshu Kumar", role: "Joint secretary" },
                            { name: "Smt. E. Radhika", role: "Member" },
                            { name: "Ln. M.M. Mahesh", role: "Member" },
                            { name: "Sri D.V.P.R. Sridhar", role: "Member" },
                            { name: "Sri P. Raghuveer", role: "Member" },
                            { name: "K. Aiswarya", role: "Nominated Member (GVPCEW)" },
                            { name: "KVS Mounika", role: "Nominated Member (GVPCEW)" },
                            { name: "Sri G.K.V. Bapi Raju", role: "Advisory Board" },
                            { name: "Sri B. Sri Ram Murthy", role: "Advisory Board" },
                            { name: "Dr. M. Srinivas Rao (GVPCOE)", role: "Faculty Coordinator" },
                            { name: "Dr. A. Saibala (GVPCDPGC)", role: "Faculty Coordinator" },
                            { name: "Dr. M. Krishna (GVPCEW)", role: "Faculty Coordinator" },
                          ].map((member, idx) => (
                            <tr key={idx} className="hover:bg-teal-50/50 transition-colors group">
                              <td className="py-5 px-8">
                                <span className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{member.name}</span>
                              </td>
                              <td className="py-5 px-8">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shadow-sm border border-slate-200 group-hover:border-teal-200">
                                  {member.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : sectionId === 'heritage-center' ? (
              <div className="animation-fade-in">
                <div className="text-center mb-16">
                  <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4">
                    Events & Culture
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 relative inline-block">
                    GVP Heritage Center
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </h2>
                  <p className="mt-8 text-xl font-bold text-slate-700 max-w-2xl mx-auto">
                    GVP Center for the Study of Human & Spiritual Values
                  </p>
                </div>
                
                <div className="flex flex-col gap-10 mt-12">
                  {(heritageEvents.length > 0 ? heritageEvents : defaultHeritageEvents).map((event, idx) => {
                    const isEven = idx % 2 === 0;
                    
                    // Theme toggles
                    const gradientTheme = isEven ? "from-purple-500 to-indigo-500" : "from-pink-500 to-rose-500";
                    const hoverBorderTheme = isEven ? "hover:border-purple-200" : "hover:border-pink-200";
                    const iconColor = isEven ? "text-purple-500" : "text-pink-500";
                    const numberBgTheme = isEven ? "bg-purple-100 text-purple-600" : "bg-pink-100 text-pink-600";
                    const textTheme = isEven ? "text-indigo-600" : "text-rose-600";
                    const iconBgTheme = isEven ? "bg-purple-500" : "bg-pink-500";
                    
                    const venueBg = isEven ? "bg-indigo-50/50 border-indigo-100/50" : "bg-rose-50/50 border-rose-100/50";
                    const venueIcon = isEven ? "text-indigo-500" : "text-rose-500";
                    const buttonGradient = isEven ? "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" : "from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600";
                    const outlineButtonTextTheme = isEven ? "hover:border-purple-500 hover:text-purple-600" : "hover:border-pink-500 hover:text-pink-600";
                    const venueBgShadow = isEven ? "text-indigo-100" : "text-rose-100";

                    return (
                      <div key={event._id || idx} className="bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-10 relative overflow-hidden group transition-all duration-500">
                        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${gradientTheme}`}></div>
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                              <svg className={`w-6 h-6 ${iconColor} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              Date & Time
                            </h3>
                            <ul className="space-y-4">
                              {event.subEvents.map((sub, sIdx) => (
                                <li key={sIdx} className={`flex items-start bg-slate-50 p-5 rounded-xl border border-slate-100 ${hoverBorderTheme} transition-colors`}>
                                  {isEven ? (
                                    <div className={`w-3 h-3 mt-1.5 rounded-full ${iconBgTheme} mr-4 flex-shrink-0`}></div>
                                  ) : (
                                    <div className={`w-8 h-8 rounded-full ${numberBgTheme} flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0`}>{sIdx + 1}</div>
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-800 text-lg">{sub.title}</p>
                                    <p className={`${textTheme} font-medium mt-1`}>{sub.dateString}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            
                            {event.documentUrl && (
                              <div className="mt-8 flex flex-wrap gap-4">
                                <a href={event.documentUrl} target="_blank" rel="noopener noreferrer" className={`bg-gradient-to-r ${buttonGradient} text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center transform hover:-translate-y-1`}>
                                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                  View Details
                                </a>
                                <a href={event.documentUrl} download className={`bg-white border-2 border-slate-200 ${outlineButtonTextTheme} text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center shadow-sm hover:-translate-y-1 transform`}>
                                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path></svg>
                                  Download Details
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className={`md:w-1/3 ${venueBg} rounded-2xl p-8 border flex flex-col justify-center relative overflow-hidden`}>
                            <svg className={`absolute -bottom-4 -right-4 w-32 h-32 ${venueBgShadow} opacity-50`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center relative z-10">
                              <svg className={`w-6 h-6 ${venueIcon} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              Venue
                            </h3>
                            <p className="text-slate-800 font-bold leading-relaxed relative z-10">
                              {event.campusName}
                            </p>
                            <p className={`${textTheme} font-medium mt-2 relative z-10`}>{event.location}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animation-fade-in">
                <h2 className="text-4xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">{section?.title}</h2>
                <div className="text-slate-700 leading-loose text-lg whitespace-pre-line font-medium">{section?.body}</div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
