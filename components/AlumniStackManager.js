import { useState, useEffect } from 'react';
import { 
  getAllAlumniStackAdmin, 
  createAlumniStack, 
  updateAlumniStack, 
  deleteAlumniStack,
  hardDeleteAlumniStack 
} from '../services/api';
import RoleNotice from './RoleNotice';

export default function AlumniStackManager({ token, userRole }) {
  const [alumniStack, setAlumniStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    branch: '',
    currentPosition: '',
    company: '',
    location: '',
    linkedinProfile: '',
    image: '',
    achievements: ['']
  });

  useEffect(() => {
    fetchAlumniStack();
  }, []);

  const fetchAlumniStack = async () => {
    try {
      const res = await getAllAlumniStackAdmin(token);
      setAlumniStack(res.data.data);
    } catch (err) {
      console.error('Error fetching alumni stack:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData(prev => ({
      ...prev,
      achievements: newAchievements
    }));
  };

  const addAchievementField = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const removeAchievementField = (index) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      achievements: newAchievements
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        graduationYear: parseInt(formData.graduationYear),
        achievements: formData.achievements.filter(a => a.trim() !== '')
      };

      if (editingItem) {
        await updateAlumniStack(editingItem._id, data, token);
      } else {
        await createAlumniStack(data, token);
      }

      resetForm();
      fetchAlumniStack();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving alumni stack entry:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      graduationYear: item.graduationYear,
      branch: item.branch,
      currentPosition: item.currentPosition,
      company: item.company,
      location: item.location,
      linkedinProfile: item.linkedinProfile || '',
      image: item.image || '',
      achievements: item.achievements && item.achievements.length > 0 ? item.achievements : ['']
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alumni entry?')) {
      try {
        await deleteAlumniStack(id, token);
        fetchAlumniStack();
      } catch (err) {
        console.error('Error deleting alumni stack entry:', err);
      }
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this alumni entry? This action cannot be undone.')) {
      try {
        await hardDeleteAlumniStack(id, token);
        fetchAlumniStack();
      } catch (err) {
        console.error('Error permanently deleting alumni stack entry:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      graduationYear: '',
      branch: '',
      currentPosition: '',
      company: '',
      location: '',
      linkedinProfile: '',
      image: '',
      achievements: ['']
    });
    setEditingItem(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Alumni Stack Management</h3>
        <button
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Add New Alumni
        </button>
      </div>

      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="alumni stack" />

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Alumni Entry' : 'Add New Alumni Entry'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Position *</label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    placeholder="Enter achievement"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formData.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievementField(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAchievementField}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add Achievement
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alumniStack.map((alumni) => (
                <tr key={alumni._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alumni.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumni.graduationYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumni.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumni.currentPosition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumni.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alumni.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {alumni.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(alumni)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(alumni._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    {!alumni.isActive && (
                      <button
                        onClick={() => handleHardDelete(alumni._id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Delete Forever
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
