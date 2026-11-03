import { useState, useEffect } from 'react';
import { getAllHeritageEvents, createHeritageEvent, updateHeritageEvent, deleteHeritageEvent } from '../services/api';
import RoleNotice from './RoleNotice';

export default function HeritageManager({ token, userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    campusName: '',
    location: '',
    documentUrl: '',
    subEvents: [{ title: '', dateString: '' }]
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await getAllHeritageEvents();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching heritage events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubEventChange = (index, field, value) => {
    const updatedSubEvents = [...currentEvent.subEvents];
    updatedSubEvents[index][field] = value;
    setCurrentEvent({ ...currentEvent, subEvents: updatedSubEvents });
  };

  const addSubEvent = () => {
    setCurrentEvent({
      ...currentEvent,
      subEvents: [...currentEvent.subEvents, { title: '', dateString: '' }]
    });
  };

  const removeSubEvent = (index) => {
    const updatedSubEvents = currentEvent.subEvents.filter((_, i) => i !== index);
    setCurrentEvent({ ...currentEvent, subEvents: updatedSubEvents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentEvent._id) {
        await updateHeritageEvent(currentEvent._id, currentEvent, token);
      } else {
        await createHeritageEvent(currentEvent, token);
      }
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving heritage event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event location?')) {
      try {
        await deleteHeritageEvent(id, token);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting heritage event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentEvent({ campusName: '', location: '', documentUrl: '', subEvents: [{ title: '', dateString: '' }] });
    setIsEditing(false);
  };

  if (loading) return <div className="p-4 text-center">Loading Heritage Events...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Heritage Center</h2>
      <RoleNotice userRole={userRole} allowedRoles={['manager', 'super-admin']} feature="heritage events" />
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Heritage Location' : 'Add New Heritage Location'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus Name *</label>
            <input 
              type="text" required
              value={currentEvent.campusName} 
              onChange={(e) => setCurrentEvent({...currentEvent, campusName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. College for Degree and PG Courses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Details *</label>
            <input 
              type="text" required
              value={currentEvent.location} 
              onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. Rushikonda, Visakhapatnam."
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Document URL (PDF Link)</label>
          <input 
            type="text" 
            value={currentEvent.documentUrl} 
            onChange={(e) => setCurrentEvent({...currentEvent, documentUrl: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            placeholder="/images/invetation/GVP-SriRama-Intivation-1.pdf"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Sub-events (Schedule)</label>
            <button type="button" onClick={addSubEvent} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200">+ Add Sub-event</button>
          </div>
          
          {currentEvent.subEvents.map((sub, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center bg-white p-3 border border-gray-200 rounded">
              <input 
                type="text" required placeholder="Event Title (e.g. Sundarakanda Parayanam)"
                value={sub.title} onChange={(e) => handleSubEventChange(index, 'title', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
              <input 
                type="text" required placeholder="Date/Time (e.g. 05/04/2025 at 8.00 AM)"
                value={sub.dateString} onChange={(e) => handleSubEventChange(index, 'dateString', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
              {currentEvent.subEvents.length > 1 && (
                <button type="button" onClick={() => removeSubEvent(index)} className="text-red-500 hover:text-red-700 p-2">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-medium hover:bg-purple-700">
            {isEditing ? 'Update Location' : 'Save New Location'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-800 px-6 py-2 rounded font-medium hover:bg-gray-400">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div>
        <h3 className="text-xl font-bold mb-4">Existing Heritage Locations</h3>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No Heritage events found. Build some above!</p>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event._id} className="border border-gray-200 rounded-lg p-5 flex justify-between items-start bg-white hover:border-purple-300 transition-colors">
                <div>
                  <h4 className="font-bold text-lg text-purple-800">{event.campusName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {event.subEvents.map((sub, i) => (
                      <li key={i}><strong>{sub.title}</strong> - {sub.dateString}</li>
                    ))}
                  </ul>
                  {event.documentUrl && <p className="text-xs text-blue-500 mt-3 break-all">Doc: {event.documentUrl}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(event)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(event._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
