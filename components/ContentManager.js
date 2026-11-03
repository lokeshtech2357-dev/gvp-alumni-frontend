import { useEffect, useState } from 'react';
import { getAllContent, updateContentSection } from '../services/api';
import RoleNotice from './RoleNotice';

export default function ContentManager({ token, userRole }) {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await getAllContent();
        const data = res.data?.data || [];
        setSections(data);
        setSelectedSection(data[0] || null);
        setFormData({ title: data[0]?.title || '', body: data[0]?.body || '' });
      } catch (err) {
        console.error('Failed to load content sections', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      setFormData({ title: selectedSection.title || '', body: selectedSection.body || '' });
    }
  }, [selectedSection]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedSection || !token) {
      setMessage('Admin access required to save content.');
      setIsError(true);
      return;
    }

    setSaving(true);
    try {
      await updateContentSection(selectedSection.sectionId, formData, token);
      const res = await getAllContent();
      const data = res.data?.data || [];
      setSections(data);
      const updated = data.find((item) => item.sectionId === selectedSection.sectionId);
      setSelectedSection(updated);
      setMessage('Content saved successfully');
      setIsError(false);
    } catch (err) {
      console.error('Content save failed', err);
      setMessage('Unable to save section.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center border border-gray-200 rounded-3xl bg-white p-8">
        <div className="text-gray-500">Loading content sections...</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <p className="text-sm text-gray-600">Edit the website content sections from a single dashboard panel.</p>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['editor', 'manager', 'super-admin']} feature="website content" />

      {message && (
        <div className={`rounded-2xl px-4 py-3 mb-5 ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-gray-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.sectionId}
                type="button"
                onClick={() => handleSectionChange(section)}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${selectedSection?.sectionId === section.sectionId ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Body</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows="10"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500">Make sure the section content is concise and website-friendly.</span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
