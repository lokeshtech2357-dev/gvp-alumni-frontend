import { useState } from 'react';

export default function GivingBack() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('secgayatrigrads@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-indigo-50/50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest mb-4">
            Support Alma Mater
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 tracking-tight mb-4">
            Giving Back to GVP
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your contributions empower the next generation of leaders, fund scholarships, and help build a stronger, more connected alumni network.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Info / Impact (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Why Your Support Matters</h2>
              <p className="text-slate-600 leading-relaxed">
                The Gayatri Grads Association is run by alumni, for alumni and students. Every contribution, big or small, directly impacts lives and sustains our mission.
              </p>

              {/* Impact Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Scholarships</h3>
                  <p className="text-sm text-slate-500">Provide financial aid to deserving students who face economic hardships.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Alumni Network</h3>
                  <p className="text-sm text-slate-500">Support the organization of meetups, reunions, and networking chapters worldwide.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Global Initiatives</h3>
                  <p className="text-sm text-slate-500">Fund digital platforms, directories, and mentorship programs matching grads and students.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Infrastructure</h3>
                  <p className="text-sm text-slate-500">Contribute to state-of-the-art incubation, cultural, and spiritual value centers at GVP.</p>
                </div>
              </div>
            </div>

            {/* Quote/Testimonial Card */}
            <div className="bg-gradient-to-r from-slate-850 to-slate-900 bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden mt-6 lg:mt-0">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
              <blockquote className="relative z-10">
                <p className="text-lg italic font-medium mb-4 leading-relaxed">
                  &quot;Education is the most powerful weapon which you can use to change the world. Giving back to where it all began is our duty and privilege.&quot;
                </p>
                <cite className="not-italic font-bold text-cyan-400">— Gayatri Grads Executive Committee</cite>
              </blockquote>
            </div>
          </div>

          {/* Right: Payment / QR Code (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center flex flex-col justify-between h-full relative overflow-hidden">
              {/* Premium Top Highlight */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Scan & Support</h3>
                <p className="text-sm text-slate-500 mb-6">Scan the UPI QR code below with any UPI app (GPay, PhonePe, Paytm, BHIM) to contribute.</p>

                {/* QR Code Container */}
                <div className="relative inline-block bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 mb-6 shadow-inner group">
                  <img
                    src="/images/Qr.webp"
                    alt="UPI Payment QR Code"
                    className="w-64 h-64 mx-auto rounded-2xl object-contain shadow-md"
                  />
                  
                  <span className="inline-block mt-3 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                    Secure UPI Payment
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-left text-sm text-slate-600 bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                  <div className="font-semibold text-slate-800 text-center mb-1">Verify payment details:</div>
                  <div className="flex justify-between">
                    <span>Payee:</span>
                    <span className="font-medium text-slate-900">Gayatri Grads Association</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UPI ID:</span>
                    <span className="font-medium text-slate-900">secgayatrigrads@gmail.com</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 leading-normal">
                    Important: Please email a screenshot of your transaction confirmation to report your contribution.
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all"
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h6m-6 4h6m-2 4h4" />
                          </svg>
                          Copy Email
                        </>
                      )}
                    </button>
                    
                    <a
                      href="mailto:secgayatrigrads@gmail.com?subject=GVP%20Grads%20Contribution%20Receipt&body=Dear%20Gayatri%20Grads%20Association%2C%0D%0A%0D%0AI%20have%20successfully%20made%20a%20contribution%20to%20support%20the%20GVP%20Alumni%20Association.%20Please%20find%20my%20payment%20details%20below%3A%0D%0A%0D%0A-%20Full%20Name%3A%0D%0A-%20Graduation%20Year%20%2F%20Batch%3A%0D%0A-%20Branch%2FDepartment%3A%0D%0A-%20Amount%20Contributed%20(INR)%3A%0D%0A-%20Transaction%20ID%20%2F%20UPI%20Ref%20No%3A%0D%0A%0D%0A*Note%3A%20I%20have%20attached%20a%20screenshot%20of%20my%20payment%20confirmation%20to%20this%20email.*%0D%0A%0D%0AThank%20you%2C%0D%0A%5BYour%20Name%5D"
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                      </svg>
                      Email Receipt
                    </a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
