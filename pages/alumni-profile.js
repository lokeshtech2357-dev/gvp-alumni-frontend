import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getMyAlumniRecord, getStoredAuthToken, saveMyAlumniRecord, uploadMyAlumniPhoto } from '../services/api';

const technologyOptions = [
  'IT / Software',
  'Programming Languages',
  'Web Development',
  'Mobile App Development',
  'Data Analytics',
  'Business Analytics',
  'Artificial Intelligence / Machine Learning',
  'Data Engineering',
  'Database Management',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Electronics',
  'Embedded Systems',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Education / Research',
  'Banking / Finance',
  'Healthcare',
  'Healthcare Technology',
  'Government / Public Sector',
  'Entrepreneurship / Business',
  'Other',
];
const graduationYears = Array.from(
  { length: new Date().getFullYear() - 1989 + 1 },
  (_, index) => String(1989 + index),
);
const degreeOptions = [
  'BSc', 'BA', 'BCA', 'B.Com', 'BBM', 'BBA', 'B.Tech', 'MCA', 'MBA',
  'MSc (Computer Science)', 'MSc (Organic Chemistry)',
];
const engineeringBranches = [
  'Computer Science and Engineering',
  'Artificial Intelligence and Machine Learning',
  'Mechanical Engineering',
  'Electronics and Communication Engineering',
  'Civil Engineering',
];

const initialForm = (email = '') => ({
  fullName: '',
  graduationName: '',
  degree: '',
  branch: '',
  graduationYear: '',
  mobile: '',
  email,
  linkedinUrl: '',
  employmentStatus: '',
  companyName: '',
  jobTitle: '',
  industry: '',
  workLocation: '',
  country: '',
  professionalAreas: [],
  professionalOther: '',
});

const textFields = [
  ['fullName', 'Full Name', true],
  ['graduationName', 'Name at the time of graduation', false],
  ['degree', 'Course / Degree', true],
  ['branch', 'Branch / Department', true],
  ['graduationYear', 'Batch / Start Graduation Year', true],
  ['mobile', 'Mobile Number', true, 'tel'],
  ['email', 'Email Address', true, 'email'],
  ['linkedinUrl', 'LinkedIn Profile URL', false, 'url'],
  ['companyName', 'Company / Organization Name', false],
  ['jobTitle', 'Job Title / Designation', false],
  ['industry', 'Industry', false],
  ['workLocation', 'Current Work Location', false],
  ['country', 'Country', false],
];

const inputClass = 'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#9c4a31] focus:ring-2 focus:ring-rose-100';

const profileForm = (profile, email) => {
  const form = initialForm(email);
  for (const field of Object.keys(form)) {
    if (profile?.[field] !== undefined) form[field] = profile[field];
  }
  form.professionalAreas = Array.isArray(form.professionalAreas) ? form.professionalAreas : [];
  form.graduationYear = String(form.graduationYear || '');
  return form;
};

export default function AlumniProfile() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm());
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'alumni') {
      router.replace(user ? '/dashboard' : '/user-login');
      return;
    }

    const token = getStoredAuthToken();
    getMyAlumniRecord(token)
      .then(({ data }) => {
        const profile = data.profile;
        if (profile) {
          setForm(profileForm(profile, user.email));
          setPhotoPreview(profile.profilePhoto || '');
        } else {
          setForm(initialForm(user.email));
        }
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load your alumni profile.');
      })
      .finally(() => setIsLoadingProfile(false));
  }, [isLoading, router, user]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const toggleProfessionalArea = (area) => {
    setForm((current) => ({
      ...current,
      professionalAreas: current.professionalAreas.includes(area)
        ? current.professionalAreas.filter((item) => item !== area)
        : [...current.professionalAreas, area],
    }));
  };

  const handlePhotoChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setPhoto(selected);
    if (selected) setPhotoPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    const token = getStoredAuthToken();
    try {
      const { data } = await saveMyAlumniRecord({
        ...form,
        professionalAreas: [...form.professionalAreas],
        graduationYear: Number(form.graduationYear),
      }, token);
      setForm(profileForm(data.profile, user.email));

      if (photo) {
        const photoData = new FormData();
        photoData.append('photo', photo);
        const photoResponse = await uploadMyAlumniPhoto(photoData, token);
        setPhotoPreview(photoResponse.data.profilePhoto);
        setPhoto(null);
      }

      setSuccess('Your alumni profile has been saved.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return <main className="flex min-h-[55vh] items-center justify-center bg-[#f7f4ef] text-slate-600" aria-busy="true">Loading alumni profile…</main>;
  }
  if (!user || user.role !== 'alumni') return null;

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-rose-950/10">
        <header className="bg-gradient-to-r from-[#4c111b] to-[#9c4a31] px-6 py-8 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-100">Gayatri Grads Association</p>
          <h1 className="mt-2 text-3xl font-black">Alumni Profile</h1>
          <p className="mt-2 text-sm text-rose-100">Add or update your professional and academic details.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-10">
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}

          <section>
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Basic and academic information</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {textFields.slice(0, 5).map(([field, label, required, type]) => (
                <label key={field} className="text-sm font-semibold text-slate-700">
                  {label}{required && <span className="text-red-600"> *</span>}
                  {field === 'degree' ? (
                    <select className={inputClass} value={form.degree} required onChange={(event) => {
                      setField('degree', event.target.value);
                      if (event.target.value !== 'B.Tech') setField('branch', '');
                    }}>
                      <option value="">Select course / degree</option>
                      <optgroup label="Undergraduate">
                        {degreeOptions.slice(0, 7).map((degree) => <option key={degree} value={degree}>{degree}</option>)}
                      </optgroup>
                      <optgroup label="Postgraduate">
                        {degreeOptions.slice(7).map((degree) => <option key={degree} value={degree}>{degree}</option>)}
                      </optgroup>
                    </select>
                  ) : field === 'graduationYear' ? (
                    <select className={inputClass} value={form.graduationYear} required onChange={(event) => setField(field, event.target.value)}>
                      <option value="">Select graduation year</option>
                      {graduationYears.map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                  ) : field === 'branch' && form.degree === 'B.Tech' ? (
                    <select className={inputClass} value={form.branch} required onChange={(event) => setField('branch', event.target.value)}>
                      <option value="">Select B.Tech branch</option>
                      {engineeringBranches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                  ) : (
                    <input
                      className={inputClass}
                      type={type || 'text'}
                      value={form[field]}
                      required={required}
                      onChange={(event) => setField(field, event.target.value)}
                      readOnly={field === 'email'}
                      aria-readonly={field === 'email'}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Profile Photo (optional)
                <input className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:font-semibold file:text-[#4c111b]" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
                <span className="mt-1 block text-xs font-normal text-slate-500">JPEG, PNG or WebP; maximum 5 MB.</span>
              </label>
              {photoPreview && <img src={photoPreview} alt="Alumni profile preview" className="h-24 w-24 rounded-full border border-slate-200 object-cover" />}
            </div>
          </section>

          <section>
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Contact information</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {textFields.slice(5, 8).map(([field, label, required, type]) => (
                <label key={field} className="text-sm font-semibold text-slate-700">
                  {label}{required && <span className="text-red-600"> *</span>}
                  <input className={inputClass} type={type || 'text'} value={form[field]} required={required} onChange={(event) => setField(field, event.target.value)} readOnly={field === 'email'} />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Employment information</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm font-semibold text-slate-700">
                Employment Status <span className="text-red-600">*</span>
                <select className={inputClass} value={form.employmentStatus} required onChange={(event) => setField('employmentStatus', event.target.value)}>
                  <option value="">Select status</option>
                  {['Employed', 'Self-Employed', 'Entrepreneur', 'Student', 'Unemployed', 'Other'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              {textFields.slice(8).map(([field, label]) => (
                <label key={field} className="text-sm font-semibold text-slate-700">
                  {label}
                  {field === 'industry' ? (
                    <select className={inputClass} value={form.industry} onChange={(event) => setField('industry', event.target.value)}>
                      <option value="">Select industry</option>
                      <option value="Private Sector">Private Sector</option>
                      <option value="Public Sector">Public Sector</option>
                    </select>
                  ) : (
                    <input className={inputClass} value={form[field]} onChange={(event) => setField(field, event.target.value)} />
                  )}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Technologies You Have Knowledge Of</h2>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">Select all technologies that apply</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {technologyOptions.map((technology) => (
                  <label key={technology} className="flex items-start gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                    <input type="checkbox" className="mt-0.5 accent-[#4c111b]" checked={form.professionalAreas.includes(technology)} onChange={() => toggleProfessionalArea(technology)} />
                    {technology}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Additional Technologies / Skills
              <textarea className={inputClass} rows={3} value={form.professionalOther} onChange={(event) => setField('professionalOther', event.target.value)} />
            </label>
          </section>

          <button type="submit" disabled={isSaving} className="rounded-xl bg-[#4c111b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#731d2b] disabled:cursor-wait disabled:opacity-60">
            {isSaving ? 'Saving profile…' : 'Save Alumni Profile'}
          </button>
        </form>
      </section>
    </main>
  );
}
