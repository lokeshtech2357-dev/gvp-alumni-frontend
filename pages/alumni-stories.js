import { useEffect, useState } from 'react';
import { getAllAlumniStories } from '../services/api';

export default function AlumniStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await getAllAlumniStories();
        setStories(res.data.data || []);
      } catch (err) {
        console.error('Failed to load alumni stories:', err);
        setError('Unable to load stories right now. Please check back later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 mt-10">
            Alumni Stories
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed bg-white/80 p-8 rounded-2xl shadow-sm border border-indigo-50/50 backdrop-blur-sm">
            This page is dedicated to publishing the achievements and success stories of our GVP alumni community. Read about career journeys, leadership milestones, and inspiring transitions from education to professional life.
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Share your story with us</h2>
                <p className="mt-3 text-gray-600">
                  Alumni contributions help everyone stay connected. If you want your story featured, email us with your experience, milestones, and any photos.
                </p>
              </div>
              <a
                href="mailto:secgayatrigrads@gmail.com?subject=Alumni%20Story%20Submission&body=Dear%20Gayatri%20Grads%20Association%2C%0D%0A%0D%0AI%20would%20love%20to%20share%20my%20alumni%20journey%20and%20experience%20to%20be%20featured%20on%20the%20Alumni%20Stories%20page.%0D%0A%0D%0A-%20Full%20Name%3A%0D%0A-%20Graduation%20Year%20%2F%20Batch%3A%0D%0A-%20Branch%2FDepartment%3A%0D%0A-%20Current%20Job%20Title%20%26%20Company%3A%0D%0A-%20My%20Alumni%20Story%3A%0D%0A%0D%0AThank%20you%2C%0D%0A%5BYour%20Name%5D"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Submit Your Story
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-white/95 p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Latest Alumni Journeys</h2>
                <p className="text-gray-600 mt-1">Read verified success stories from our graduates.</p>
              </div>
              <span className="text-sm text-gray-500">Showing {stories.length} stories</span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50 p-10 text-center text-indigo-700">
                Loading stories...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
            ) : stories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
                No stories are available yet. Check back soon.
              </div>
            ) : (
              <div className="space-y-8">
                {stories.map((story) => (
                  <article key={story._id} className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                              {story.batch || 'Batch not set'} · {story.branch || 'Branch not set'}
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold text-gray-900">{story.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{story.currentRole || 'Alumni'}</p>
                            {story.company && <p className="text-sm font-medium text-gray-700">{story.company}</p>}
                          </div>
                        </div>
                        <p className="mt-6 text-lg font-medium text-gray-800">{story.summary}</p>
                        <p className="mt-4 whitespace-pre-line text-gray-700 leading-relaxed">{story.story}</p>
                      </div>
                      {story.imageUrl ? (
                        <div className="min-w-[220px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
                          <img
                            src={story.imageUrl}
                            alt={story.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
