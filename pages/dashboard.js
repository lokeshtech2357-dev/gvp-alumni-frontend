import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, getStoredAuthToken, getAllAlumniStackAdmin, getAllEventsAdmin, getAllContactsAdmin } from '../services/api';
import AlumniAnalyticsDashboard from '../components/AlumniAnalyticsDashboard';
import AlumniStackManager from '../components/AlumniStackManager';
import HeritageManager from '../components/HeritageManager';
import GalleryManager from '../components/GalleryManager';
import EventManager from '../components/EventManager';
import UpcomingEventsManager from '../components/UpcomingEventsManager';
import NotificationManager from '../components/NotificationManager';
import SponsorManager from '../components/SponsorManager';
import EntrepreneurManager from '../components/EntrepreneurManager';
import ContactManager from '../components/ContactManager';
import AlumniStoriesManager from '../components/AlumniStoriesManager';
import SubscribersManager from '../components/SubscribersManager';
import AdminUsersManager from '../components/AdminUsersManager';
import ContentManager from '../components/ContentManager';
import AlumniRecordManager from '../components/AlumniRecordManager';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'management'
  const [adminSection, setAdminSection] = useState('overview');
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const storedToken = getStoredAuthToken();
    if (!storedToken) {
      router.push('/login-selection');
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await getCurrentUser(token);
        if (!['admin', 'editor', 'manager', 'super-admin'].includes(res.data.role)) {
          await router.replace('/');
          return;
        }
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          await router.replace('/');
        } else {
          signOut();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router, signOut, token]);

  useEffect(() => {
    if (!token || !user) return;

    const fetchDashboardData = async () => {
      try {
        const [alumniRes, eventsRes, contactsRes] = await Promise.all([
          getAllAlumniStackAdmin(token),
          getAllEventsAdmin(token),
          getAllContactsAdmin(token),
        ]);
        setAlumni(alumniRes.data?.data || []);
        setEvents(eventsRes.data?.data || []);
        setContacts(contactsRes.data?.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, [router, token, user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-200 border-t-[#0284c7] mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user || !['admin', 'editor', 'manager', 'super-admin'].includes(user.role)) {
    return null;
  }

  const canEditContent = ['editor', 'manager', 'super-admin', 'admin'].includes(user?.role);
  const canManageSite = ['manager', 'super-admin', 'admin'].includes(user?.role);
  const canManageAdminUsers = ['admin', 'super-admin'].includes(user?.role);

  return (
    <div className="w-full">
      {/* Top Admin Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500">
              Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.role})
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-lg transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-cyan-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Alumni Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('management')}
              className={`px-4 py-1.5 rounded-lg transition ${
                activeTab === 'management'
                  ? 'bg-white text-cyan-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛠️ Site Management Tools
            </button>
            {canManageSite && (
              <button
                type="button"
                onClick={() => setActiveTab('alumni-data')}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'alumni-data'
                    ? 'bg-white text-cyan-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alumni Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW A: ANALYTICS DASHBOARD (PRIMARY DASHBOARD REQUESTED) */}
      {activeTab === 'analytics' && (
        <div>
          <AlumniAnalyticsDashboard />
        </div>
      )}

      {activeTab === 'alumni-data' && canManageSite && (
        <AlumniRecordManager token={token} />
      )}

      {/* VIEW B: SITE MANAGEMENT TOOLS (PRESERVED FUNCTIONALITY) */}
      {activeTab === 'management' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Quick Filter Menu for Admin Subsections */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
            {['overview', 'content', 'events', 'notifications', 'contacts', 'gallery', 'stories', 'alumniStack', 'users', 'sponsors', 'subscribers', 'entrepreneurs', 'heritage'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setAdminSection(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  adminSection === sec
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sec === 'overview' ? 'Overview Stats' : sec}
              </button>
            ))}
          </div>

          {adminSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Directory Profiles</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{alumni.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Published Events</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{events.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Submissions</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{contacts.length}</p>
                </div>
              </div>

            </div>
          )}

          {/* Section Managers */}
          {adminSection === 'content' && canEditContent && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ContentManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'notifications' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <NotificationManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'contacts' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ContactManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'events' && canManageSite && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <EventManager token={token} userRole={user?.role} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <UpcomingEventsManager token={token} userRole={user?.role} />
              </div>
            </div>
          )}
          {adminSection === 'gallery' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <GalleryManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'sponsors' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <SponsorManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'stories' && canEditContent && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <AlumniStoriesManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'alumniStack' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <AlumniStackManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'users' && canManageAdminUsers && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <AdminUsersManager token={token} userRole={user?.role} currentUserId={user?.id || user?._id} />
            </div>
          )}
          {adminSection === 'subscribers' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <SubscribersManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'entrepreneurs' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <EntrepreneurManager token={token} userRole={user?.role} />
            </div>
          )}
          {adminSection === 'heritage' && canManageSite && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <HeritageManager token={token} userRole={user?.role} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
