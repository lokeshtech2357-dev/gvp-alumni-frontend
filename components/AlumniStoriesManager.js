import { useEffect, useState } from 'react';
import {
  getAllAlumniStoriesAdmin,
  createAlumniStory,
  updateAlumniStory,
  deleteAlumniStory,
  hardDeleteAlumniStory,
} from '../services/api';
import RoleNotice from './RoleNotice';

const emptyStory = {
  name: '',
  batch: '',
  branch: '',
  currentRole: '',
  company: '',
  summary: '',
  story: '',
  imageUrl: '',
  isActive: true,
};

export default function AlumniStoriesManager({ token, userRole }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyStory);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getAllAlumniStoriesAdmin(token);
      setStories(res.data.data || []);
    } catch (err) {
      console.error(err);
      notify('Unable to load alumni stories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchStories();
  }, [token]);

  const resetForm = () => {
    setForm(emptyStory);
    setEditingId(null);
  };

  const handleEdit = (story) => {
    setEditingId(story._id);
    setForm({
      name: story.name || '',
      batch: story.batch || '',
      branch: story.branch || '',
      currentRole: story.currentRole || '',
      company: story.company || '',
      summary: story.summary || '',
      story: story.story || '',
      imageUrl: story.imageUrl || '',
      isActive: story.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.summary || !form.story) {
      notify('Name, summary and story are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateAlumniStory(editingId, form, token);
        notify('Story updated successfully.');
      } else {
        await createAlumniStory(form, token);
        notify('Story added successfully.');
      }
      resetForm();
      fetchStories();
    } catch (err) {
      console.error(err);
      notify('Failed to save story.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      await deleteAlumniStory(id, token);
      notify('Story archived successfully.');
      fetchStories();
    } catch (err) {
      console.error(err);
      notify('Failed to archive story.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      await hardDeleteAlumniStory(id, token);
      notify('Story deleted permanently.');
      fetchStories();
    } catch (err) {
      console.error(err);
      notify('Failed to delete story permanently.', 'error');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alumni Stories</h2>
          <p className="text-sm text-gray-600">Add, edit, archive, or remove published alumni success stories.</p>
        </div>
        <button
          onClick={resetForm}
          className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          New Story
        </button>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="alumni stories" />

      {message && (
        <div className={`mb-4 rounded-lg p-4 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Story details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Full name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Batch / Year</label>
                <input
                  value={form.batch}
                  onChange={e => handleChange('batch', e.target.value)}
                  className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. 2018-2022"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <input
                  value={form.branch}
                  onChange={e => handleChange('branch', e.target.value)}
                  className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. CSE"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current role</label>
                <input
                  value={form.currentRole}
                  onChange={e => handleChange('currentRole', e.target.value)}
                  className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  value={form.company}
                  onChange={e => handleChange('company', e.target.value)}
                  className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. ABC Corp"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Summary</label>
              <textarea
                value={form.summary}
                onChange={e => handleChange('summary', e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Short headline for the story"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full story</label>
              <textarea
                value={form.story}
                onChange={e => handleChange('story', e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Write the full alumni story here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={e => handleChange('imageUrl', e.target.value)}
                className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Optional image URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Active on public page
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {editingId ? 'Update Story' : 'Save Story'}
              </button>
              <button
                onClick={resetForm}
                type="button"
                className="rounded-full border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Published stories</h3>
          {loading ? (
            <div className="text-gray-500">Loading stories...</div>
          ) : stories.length === 0 ? (
            <div className="text-gray-500">No stories yet.</div>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div key={story._id} className="rounded-2xl border border-gray-200 p-4 bg-slate-50">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{story.batch || 'Batch not set'} · {story.branch || 'Branch not set'}</p>
                      <h4 className="text-lg font-semibold text-gray-900">{story.name}</h4>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${story.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {story.isActive ? 'Active' : 'Archived'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{story.summary}</p>
                  <p className="mt-1 text-xs text-gray-500">{story.currentRole || 'No role set'}{story.company ? ` · ${story.company}` : ''}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(story)}
                      className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(story._id)}
                      className="rounded-full bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
