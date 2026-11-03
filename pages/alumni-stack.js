import { useEffect, useState } from 'react';
import { getAllAlumniStack } from '../services/api';

export default function AlumniStack() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', batch: '', year: '', company: '', position: '', location: '' });
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchAlumni = async (queryParams = {}) => {
    setLoading(true);
    try {
      const response = await getAllAlumniStack(queryParams);
      setAlumni(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(appliedFilters);
  }, [appliedFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    const empty = { search: '', batch: '', year: '', company: '', position: '', location: '' };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Alumni Stack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Alumni Stack</h1>
          <p className="mt-3 text-slate-600">Meet our successful alumni who are making waves in their respective fields.</p>
        </div>

        {/* Alumni Stack Description */}
        <div className="mb-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">We gather</h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              The building of relationships is a critical part of what it means to be a GVP. From the first day on the Hill to a 60th Decades, GVP is an integral part of maintaining relationships for alumni and friends of the College.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">We Connect</h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              A connection to GVP and the resources offered by the College and College Alumni is a critical part of navigating the world after time on the Hill. GVP is committed to connecting graduates old and new so that they may fully utilize the College and the resources it offers.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">We Give</h2>
            <p className="text-slate-700 leading-relaxed">
              The gift of a GVP experience is made possible through the time, talents, and resources of the Gayatrians community. Financial gifts ensure student access to the finest faculty and opportunities the College can provide.
            </p>
          </div>
        </div>

        <div className="mb-10 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Search Alumni</h2>
              <p className="text-sm text-slate-600 mt-1">Filter by name, batch, year, company, role or location.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-slate-900 text-white py-2 px-4 text-sm font-medium hover:bg-slate-800 transition"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full bg-slate-100 text-slate-700 py-2 px-4 text-sm font-medium hover:bg-slate-200 transition"
              >
                Clear
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Search</span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Name, company, position or location"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Batch</span>
              <input
                type="text"
                value={filters.batch}
                onChange={(e) => setFilters((prev) => ({ ...prev, batch: e.target.value }))}
                placeholder="e.g. 2020"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Graduation Year</span>
              <input
                type="text"
                value={filters.year}
                onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="e.g. 2021"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Company</span>
              <input
                type="text"
                value={filters.company}
                onChange={(e) => setFilters((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. Google"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Position</span>
              <input
                type="text"
                value={filters.position}
                onChange={(e) => setFilters((prev) => ({ ...prev, position: e.target.value }))}
                placeholder="e.g. Software Engineer"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Hyderabad"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </label>
          </form>
        </div>

        {alumni.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">No alumni entries available at the moment.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((item) => (
              <div key={item._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mr-4">
                      <span className="text-slate-500 text-xl font-semibold">
                        {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-600">Batch: {item.batch}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Iappudu:</span>
                    <span className="text-sm text-slate-600 ml-2">{item.iappudu}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Year:</span>
                    <span className="text-sm text-slate-600 ml-2">{item.year}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Company:</span>
                    <span className="text-sm text-slate-600 ml-2">{item.company}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Position:</span>
                    <span className="text-sm text-slate-600 ml-2">{item.position}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Location:</span>
                    <span className="text-sm text-slate-600 ml-2">{item.location}</span>
                  </div>
                </div>

                {item.achievements && item.achievements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Achievements:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {item.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.linkedinProfile && (
                  <div className="mt-4">
                    <a
                      href={item.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      LinkedIn Profile
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
