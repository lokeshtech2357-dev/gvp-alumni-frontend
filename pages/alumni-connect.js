import Link from 'next/link';

export default function AlumniConnect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 pb-20 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4 border border-teal-200 shadow-sm">
            Networking
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600 mb-6 drop-shadow-sm tracking-tight relative inline-block">
            Alumni Connect
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Introduction Card */}
          <section className="rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-50 rounded-full mix-blend-multiply opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium relative z-10">
              <span className="font-bold text-teal-800">Gayatri Grads Association</span> is an alumni association that brings former students together to maintain a connection with their college and fellow graduates. 
              <br /><br />
              Being a part of an association can open many doors for you and allow you to reap a lot of different benefits.
            </p>
          </section>

          {/* Platform Details Card */}
          <section className="rounded-[2.5rem] bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-8 md:p-12 shadow-[0_20px_40px_rgb(0,0,0,0.15)] relative overflow-hidden group">
            <svg className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-500 opacity-30 group-hover:scale-110 transition-transform duration-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
            </svg>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0">
                <svg className="w-16 h-16 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-100 mb-4 capitalize tracking-wide">
                  Direct Interaction Platform
                </h2>
                <p className="text-lg leading-relaxed text-teal-50">
                  <span className="font-bold text-white">Alumni Connect</span> is a platform for students who can directly interact and chat with their college alumni&apos;s &amp; seniors to take guidance and discuss their challenges about their professional goals and learnings throughout their journey.
                </p>
              </div>
            </div>
          </section>

          {/* Action Call & Coming Soon */}
          <div className="flex flex-col items-center justify-center pt-8">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-5 rounded-full shadow-lg border border-teal-100 mb-8 transform hover:-translate-y-1 transition-transform">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
              <p className="font-bold text-teal-900 text-lg">
                We at Gayatri Grads Association working to make the connect happen soon!
              </p>
            </div>
            
            <Link href="/" className="bg-white border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-700 font-bold py-3.5 px-8 rounded-full transition-all flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
