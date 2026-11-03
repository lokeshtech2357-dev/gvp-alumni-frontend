import { useEffect, useState } from 'react';
import {
  deleteAlumniRecord,
  exportAlumniRecords,
  getAlumniRecordSummary,
  searchAlumniRecords,
  updateAlumniRecord,
} from '../services/api';

const employmentStatuses = ['Employed', 'Self-Employed', 'Entrepreneur', 'Student', 'Unemployed', 'Other'];
const technologyOptions = [
  'IT / Software', 'Programming Languages', 'Web Development', 'Mobile App Development',
  'Data Analytics', 'Business Analytics', 'Artificial Intelligence / Machine Learning',
  'Data Engineering', 'Database Management', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'Electronics', 'Embedded Systems', 'Electrical Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Education / Research', 'Banking / Finance', 'Healthcare',
  'Healthcare Technology', 'Government / Public Sector', 'Entrepreneurship / Business', 'Other',
];
const filterFields = [
  ['name', 'Name'], ['degree', 'Course / degree'], ['branch', 'Branch / department'],
  ['graduationYear', 'Graduation year'], ['employmentStatus', 'Employment status'],
  ['company', 'Company'], ['jobTitle', 'Job title'], ['industry', 'Industry'],
  ['country', 'Country'], ['workLocation', 'Work location'],
];
const textFields = [
  ['fullName', 'Full Name'], ['graduationName', 'Name at graduation'],
  ['degree', 'Course / Degree'], ['branch', 'Branch / Department'], ['mobile', 'Mobile Number'],
  ['linkedinUrl', 'LinkedIn Profile URL'], ['companyName', 'Company / Organization'],
  ['jobTitle', 'Job Title / Designation'], ['industry', 'Industry'], ['workLocation', 'Current Work Location'],
  ['country', 'Country'],
];
const blankFilters = Object.fromEntries(filterFields.map(([key]) => [key, '']).concat([['professionalArea', '']]));
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#9c4a31] focus:ring-2 focus:ring-rose-100';
const buttonClass = 'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';
const primaryButtonClass = 'inline-flex items-center justify-center rounded-lg bg-[#4c111b] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#701e2b] disabled:cursor-not-allowed disabled:opacity-50';

const readableError = (error, fallback) => error.response?.data?.message || fallback;

function Distribution({ title, items = [] }) {
  return (
    <section className="min-w-0 border-t border-slate-200 pt-3 first:border-0 first:pt-0">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length ? items.slice(0, 8).map((item) => (
          <span key={String(item._id)} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
            {item._id || 'Not specified'} <strong className="ml-1">{item.count}</strong>
          </span>
        )) : <span className="text-xs text-slate-400">No records yet</span>}
      </div>
    </section>
  );
}

export default function AlumniRecordManager({ token }) {
  const [filters, setFilters] = useState(blankFilters);
  const [activeFilters, setActiveFilters] = useState(blankFilters);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sort, setSort] = useState('name');
  const [direction, setDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    getAlumniRecordSummary(token)
      .then(({ data }) => setSummary(data))
      .catch((requestError) => setError(readableError(requestError, 'Unable to load alumni statistics.')));
  }, [token, refreshKey]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    searchAlumniRecords({ ...activeFilters, page, limit, sort, direction }, token)
      .then(({ data }) => {
        if (cancelled) return;
        setRecords(data.records || []);
        setTotal(data.total || 0);
      })
      .catch((requestError) => {
        if (!cancelled) setError(readableError(requestError, 'Unable to search alumni records.'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeFilters, direction, limit, page, refreshKey, sort, token]);

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setActiveFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ ...blankFilters });
    setActiveFilters({ ...blankFilters });
    setPage(1);
  };

  const handleExport = async () => {
    setError('');
    setExporting(true);
    try {
      const { data } = await exportAlumniRecords({ ...activeFilters, sort, direction }, token);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'gvp-alumni-records.xlsx';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to export alumni records.'));
    } finally {
      setExporting(false);
    }
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateAlumniRecord(editing._id, {
        ...editing,
        graduationYear: Number(editing.graduationYear),
      }, token);
      setEditing(null);
      setNotice('Alumni record updated.');
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to update this alumni record.'));
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (record) => {
    if (!window.confirm(`Delete the alumni record for ${record.fullName}? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteAlumniRecord(record._id, token);
      setNotice('Alumni record deleted.');
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to delete this alumni record.'));
    }
  };

  const toggleArea = (area) => setEditing((current) => ({
    ...current,
    professionalAreas: current.professionalAreas.includes(area)
      ? current.professionalAreas.filter((item) => item !== area)
      : [...current.professionalAreas, area],
  }));

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="min-h-[70vh] bg-[#f7f4ef] px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b3e31]">Gayatri Grads Association</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">Alumni Data Management</h1>
          </div>
          <button type="button" onClick={handleExport} disabled={exporting || loading} className={primaryButtonClass}>
            {exporting ? 'Preparing Excel…' : 'Export to Excel'}
          </button>
        </header>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

        <section className="border-b border-slate-200 pb-5" aria-label="Alumni statistics">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ['Registered alumni', summary?.total], ['Employed', summary?.employed],
              ['Self-employed', summary?.selfEmployed], ['Entrepreneurs', summary?.entrepreneurs], ['Students', summary?.students],
            ].map(([label, count]) => (
              <div key={label} className="border-l-2 border-[#9c4a31] pl-3">
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{count?.toLocaleString() ?? '—'}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Distribution title="Course / degree" items={summary?.byDegree} />
            <Distribution title="Branch / department" items={summary?.byBranch} />
            <Distribution title="Graduation year" items={summary?.byGraduationYear} />
            <Distribution title="Industry" items={summary?.byIndustry} />
            <Distribution title="Country" items={summary?.byCountry} />
            <Distribution title="Work location" items={summary?.byLocation} />
          </div>
        </section>

        <section className="border-b border-slate-200 pb-5">
          <h2 className="text-base font-bold text-slate-900">Search alumni</h2>
          <form onSubmit={applyFilters} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filterFields.map(([key, label]) => (
              <label key={key} className="text-xs font-semibold text-slate-600">
                {label}
                <input type={key === 'graduationYear' ? 'number' : 'search'} value={filters[key]} onChange={(event) => setFilter(key, event.target.value)} className={`${inputClass} mt-1`} />
              </label>
            ))}
            <label className="text-xs font-semibold text-slate-600">
              Technologies You Have Knowledge Of
              <select multiple value={filters.professionalArea ? filters.professionalArea.split(',') : []} onChange={(event) => setFilter('professionalArea', Array.from(event.target.selectedOptions, (option) => option.value).join(','))} className={`${inputClass} mt-1 min-h-28`}>
                {technologyOptions.map((technology) => <option key={technology} value={technology}>{technology}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Employment status
              <select value={filters.employmentStatus} onChange={(event) => setFilter('employmentStatus', event.target.value)} className={`${inputClass} mt-1`}>
                <option value="">All statuses</option>
                {employmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
              <button type="submit" className={primaryButtonClass}>Search</button>
              <button type="button" onClick={clearFilters} className={buttonClass}>Clear filters</button>
            </div>
          </form>
        </section>

        <section aria-label="Alumni records">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Alumni records</h2>
              <p className="mt-1 text-sm text-slate-500" aria-live="polite">{loading ? 'Updating results…' : `${total.toLocaleString()} matching records`}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
              <label>Sort
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="ml-2 rounded-lg border border-slate-300 bg-white px-2.5 py-2">
                  <option value="name">Name</option><option value="batch">Batch</option><option value="graduationYear">Graduation year</option>
                </select>
              </label>
              <select aria-label="Sort direction" value={direction} onChange={(event) => { setDirection(event.target.value); setPage(1); }} className="rounded-lg border border-slate-300 bg-white px-2.5 py-2">
                <option value="asc">Ascending</option><option value="desc">Descending</option>
              </select>
              <label>Rows
                <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="ml-2 rounded-lg border border-slate-300 bg-white px-2.5 py-2">
                  {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
          </div>

          {loading ? <div className="py-16 text-center text-sm text-slate-500" aria-busy="true">Loading alumni records…</div> : records.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">No matching alumni records.</div>
          ) : (
            <div className="mt-3 overflow-x-auto border-y border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-600">
                  <tr>{['Name', 'Course / branch', 'Batch', 'Status / organization', 'Industry', 'Location', 'Technologies', 'Contact', 'Actions'].map((heading) => <th key={heading} className="whitespace-nowrap px-3 py-3">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr key={record._id} className="align-top text-slate-700 hover:bg-rose-50/30">
                      <td className="min-w-48 px-3 py-3"><p className="font-semibold text-slate-900">{record.fullName}</p><p className="mt-1 text-xs text-slate-500">{record.graduationName || '—'}</p></td>
                      <td className="min-w-40 px-3 py-3">{record.degree}<span className="block text-xs text-slate-500">{record.branch}</span></td>
                      <td className="whitespace-nowrap px-3 py-3">{record.graduationYear}</td>
                      <td className="min-w-44 px-3 py-3">{record.employmentStatus}<span className="block text-xs text-slate-500">{record.companyName || '—'}{record.jobTitle ? ` · ${record.jobTitle}` : ''}</span></td>
                      <td className="px-3 py-3">{record.industry || '—'}</td>
                      <td className="min-w-32 px-3 py-3">{[record.workLocation, record.country].filter(Boolean).join(', ') || '—'}</td>
                      <td className="min-w-56 px-3 py-3">{record.professionalAreas?.join(', ') || '—'}</td>
                      <td className="min-w-48 px-3 py-3"><a className="text-[#7a2731] underline" href={`mailto:${record.email}`}>{record.email}</a><span className="block text-xs text-slate-500">{record.mobile}</span></td>
                      <td className="whitespace-nowrap px-3 py-3"><button type="button" onClick={() => { setEditing({ ...record, professionalAreas: [...(record.professionalAreas || [])] }); setError(''); }} className="mr-3 font-semibold text-[#7a2731] underline">Edit</button><button type="button" onClick={() => removeRecord(record)} className="font-semibold text-red-700 underline">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="flex items-center justify-between gap-3 py-4 text-sm">
            <span className="text-slate-500">Page {page} of {pageCount}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className={buttonClass}>Previous</button>
              <button type="button" disabled={page >= pageCount || loading} onClick={() => setPage((current) => current + 1)} className={buttonClass}>Next</button>
            </div>
          </footer>
        </section>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form onSubmit={saveRecord} className="my-auto max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="alumni-edit-title">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-wide text-[#8b3e31]">Alumni record</p><h2 id="alumni-edit-title" className="mt-1 text-xl font-black text-slate-900">Edit {editing.fullName}</h2></div>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close editor" className="px-2 text-2xl leading-none text-slate-500">×</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {textFields.map(([key, label]) => (
                <label key={key} className="text-xs font-semibold text-slate-600">{label}
                  <input value={editing[key] || ''} onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))} className={`${inputClass} mt-1`} />
                </label>
              ))}
              <label className="text-xs font-semibold text-slate-600">Graduation Year
                <input type="number" min="1950" max={new Date().getFullYear() + 10} required value={editing.graduationYear || ''} onChange={(event) => setEditing((current) => ({ ...current, graduationYear: event.target.value }))} className={`${inputClass} mt-1`} />
              </label>
              <label className="text-xs font-semibold text-slate-600">Email Address
                <input value={editing.email || ''} readOnly className={`${inputClass} mt-1 bg-slate-100`} />
              </label>
              <label className="text-xs font-semibold text-slate-600">Employment Status
                <select value={editing.employmentStatus || ''} onChange={(event) => setEditing((current) => ({ ...current, employmentStatus: event.target.value }))} className={`${inputClass} mt-1`}>
                  {employmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
            </div>
            <fieldset className="mt-5">
              <legend className="text-xs font-semibold text-slate-600">Professional areas</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {technologyOptions.map((technology) => <label key={technology} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2 text-xs text-slate-700"><input type="checkbox" checked={editing.professionalAreas.includes(technology)} onChange={() => toggleArea(technology)} />{technology}</label>)}
              </div>
            </fieldset>
            <label className="mt-4 block text-xs font-semibold text-slate-600">Additional Technologies / Skills
              <textarea rows={3} value={editing.professionalOther || ''} onChange={(event) => setEditing((current) => ({ ...current, professionalOther: event.target.value }))} className={`${inputClass} mt-1`} />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className={buttonClass}>Cancel</button>
              <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}