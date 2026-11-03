import Link from 'next/link';

export default function AlumniMessages() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-white p-10 md:p-16 text-center relative z-10 transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Construction Icon Animation Container */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-25"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12 duration-300">
            <svg className="w-16 h-16 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-6 drop-shadow-sm">
          Page Under Construction
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
          The <span className="font-bold text-slate-800">Alumni Messages</span> portal is currently being revamped and built by our team. Check back soon for exciting updates!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center transform hover:-translate-y-1 w-full sm:w-auto justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Return to Homepage
          </Link>
          
          <button onClick={() => window.history.back()} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center w-full sm:w-auto shadow-sm hover:-translate-y-1">
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
