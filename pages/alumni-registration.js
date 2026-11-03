import Link from 'next/link';

export default function AlumniRegistration() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Alumni Registration and Membership
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 font-medium">
            Welcome to the registration page for Gayatri Grads Association. Please take a moment to review our membership opportunities.
          </p>
          <a
            href="https://www.gayatrigrads.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-900 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 hover:shadow-xl"
          >
            Click here to Register
            <svg className="ml-3 w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Membership Categories */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </span>
                Membership Categories
              </h2>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                <p className="text-amber-800 font-bold">
                  Note: Whoever opts for the below membership category have to pay the Registration Fee in addition to the Membership Fee.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-700 bg-slate-100 py-2 px-4 rounded-lg inline-block mb-3">One-Time Registration Fee</h3>
                  <p className="text-slate-600 mb-2">Any alumni from the Gayatri Vidya Parishad institutions (UG and PG) are eligible to register.</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-slate-700"><strong>Above Five years</strong> (Passed out before 2020) — <span className="font-bold text-indigo-700">₹500/-</span> (Rupees Five hundred only)</span>
                    </li>
                    <li className="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-slate-700"><strong>Below Five years</strong> (Passed from 2020 onwards) — <span className="font-bold text-indigo-700">₹300/-</span> (Rupees Three hundred only)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-700 bg-emerald-100 py-2 px-4 rounded-lg inline-block mb-3">Optional Membership Fees</h3>
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    <div className="border-2 border-emerald-100 rounded-xl p-5 hover:border-emerald-300 transition-colors bg-emerald-50/30">
                      <h4 className="font-bold text-emerald-800 mb-1">Three (3) Years</h4>
                      <p className="text-2xl font-extrabold text-emerald-600">₹2,000/-</p>
                    </div>
                    <div className="border-2 border-purple-100 rounded-xl p-5 hover:border-purple-300 transition-colors bg-purple-50/30">
                      <h4 className="font-bold text-purple-800 mb-1">Life Membership</h4>
                      <p className="text-2xl font-extrabold text-purple-600">₹5,000/-</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Sections */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Benefits & Privileges
              </h2>

              {/* Tier 1 / Base */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                  <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                  Registered Alumni with GGA
                </h3>
                <p className="text-slate-500 text-sm mb-4">By paying only the respective Registration fees:</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start"><svg className="w-5 h-5 text-blue-400 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> The registrant is part of the alumni of GVP Institutions.</li>
                  <li className="flex items-start"><svg className="w-5 h-5 text-blue-400 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Receive regular invitations / intimations of alumni activities.</li>
                  <li className="flex items-start"><svg className="w-5 h-5 text-blue-400 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Participate in the alumni activities.</li>
                  <li className="flex items-start"><svg className="w-5 h-5 text-blue-400 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Participate in alumni meets by paying respective prevailing event fees.</li>
                  <li className="flex items-start text-slate-400 line-through"><svg className="w-5 h-5 text-red-300 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Voting Rights in GGA.</li>
                </ul>
              </div>

              {/* Tier 2 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-emerald-700 mb-3 flex items-center">
                  <span className="bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  Three Year Membership
                </h3>
                <p className="text-slate-500 text-sm mb-4">By paying Registration + 3-Year Membership fee. (All of the above, plus):</p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start"><svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> The member shall have <strong>Voting Rights</strong> in the Annual General Body meetings of GGA.</li>
                  <li className="flex items-start"><svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Eligible to contest as the committee member, depending upon active participation in GGA activities.</li>
                </ul>
                <div className="mt-4 p-3 bg-slate-50 rounded text-sm text-slate-500 italic">
                  * If a three-year member wishes to become a life member, the difference amount can be paid, and previous membership years will be counted!
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-3 flex items-center">
                  <span className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  Life Membership
                </h3>
                <p className="text-slate-500 text-sm mb-4">Eligible to contest as Executive Committee member if the following criterion is fulfilled:</p>
                
                <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      <tr className="border-b border-purple-100">
                        <td className="py-2 font-bold text-purple-900">President</td>
                        <td className="py-2 text-purple-700">5 years as Alumni <br/>+ 5 years Life Member</td>
                      </tr>
                      <tr className="border-b border-purple-100">
                        <td className="py-2 font-bold text-purple-900">Secretary / Treasurer</td>
                        <td className="py-2 text-purple-700">5 years as Alumni <br/>+ 5 years Life Member</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-purple-900">VP / Joint Secretary</td>
                        <td className="py-2 text-purple-700">5 years as Alumni <br/>+ 3 years Life Member</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-2xl text-white p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center border-b border-slate-600 pb-4">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Mode of Applying
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-blue-300 text-lg mb-2">Option 1: Online</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Online application is available at our official website. You will find the QR code and Bank Details there.
                  </p>
                  <a href="https://www.gayatrigrads.in" target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-colors">
                    Visit gayatrigrads.in
                  </a>
                </div>
                
                <div className="pt-6 border-t border-slate-600">
                  <h4 className="font-bold text-blue-300 text-lg mb-2">Option 2: Offline</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Download the application from the website and physically send it to the secretary’s office along with your valid payment receipt.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex items-start">
              <svg className="w-6 h-6 text-rose-500 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              <p className="text-sm text-rose-800 font-medium">
                All applications are subject to review by the Executive Committee and upon approval shall be intimated to the respective applicants.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
