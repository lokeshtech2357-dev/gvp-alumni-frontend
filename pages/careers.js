import Link from 'next/link';

const careerPaths = [
  {
    title: 'Technology & Software Engineering',
    description: 'Explore opportunities in full-stack development, cloud computing, and DevOps.',
    icon: '💻',
    tags: ['Cloud', 'React', 'Node.js', 'AI'],
  },
  {
    title: 'Data & Artificial Intelligence',
    description: 'Machine learning, data analytics, and intelligence engineering across global enterprises.',
    icon: '🧠',
    tags: ['Machine Learning', 'Data Analytics', 'BI'],
  },
  {
    title: 'Core & Electrical Engineering',
    description: 'Embedded systems, electronics, civil design, and power engineering roles.',
    icon: '⚡',
    tags: ['VLSI', 'IoT', 'Power Systems', 'Robotics'],
  },
  {
    title: 'Entrepreneurship & Startups',
    description: 'Connect with Gayatri alumni founders, secure mentorship, and scale your venture.',
    icon: '🚀',
    tags: ['Founders', 'Incubation', 'Venture'],
  },
];

export default function CareerOpportunities() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a192f] via-[#0f2d57] to-[#1a365d] p-8 text-white shadow-xl border border-cyan-500/20">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 text-xs font-bold border border-cyan-800">
              GVP ALUMNI CAREERS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Career Opportunities &amp; Alumni Network
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Connect with 30,000+ alumni across global industries. Access job referrals, mentorship, and professional growth opportunities through the Gayatri Vidya Parishad network.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerPaths.map((path) => (
            <div
              key={path.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl p-3 rounded-2xl bg-slate-100 flex-shrink-0">
                  {path.icon}
                </span>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900">{path.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {path.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[11px] font-semibold border border-cyan-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Looking to mentor, hire, or refer fellow graduates?
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Update your professional profile and industry area to make yourself discoverable to alumni recruiters.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/alumni-profile"
                className="rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm px-5 py-3 shadow-sm transition"
              >
                Update Career Profile
              </Link>
              <Link
                href="/alumni-connect"
                className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-5 py-3 transition"
              >
                Alumni Connect Platform
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

