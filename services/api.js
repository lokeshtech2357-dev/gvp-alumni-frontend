import axios from 'axios';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '');

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getStoredAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

const getFormValues = (formData) => Object.fromEntries(
  Array.from(formData.entries()).filter(([, value]) => typeof value === 'string')
);

const uploadToCloudinary = async (file, purpose, token) => {
  if (!file || typeof file.name !== 'string' || typeof file.size !== 'number') {
    throw new Error('Choose a file to upload.');
  }

  const resourceType = purpose === 'event' && file.type.startsWith('video/') ? 'video' : 'image';
  const { data: signedUpload } = await API.post('/uploads/signature', { purpose, resourceType }, {
    headers: { 'x-auth-token': token },
  });

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!signedUpload.allowedFormats.includes(extension)) {
    throw new Error(`Unsupported file format. Allowed formats: ${signedUpload.allowedFormats.join(', ')}.`);
  }
  if (file.size > signedUpload.maxFileSize) {
    throw new Error(`The file exceeds the ${Math.floor(signedUpload.maxFileSize / (1024 * 1024))} MB upload limit.`);
  }

  const payload = new FormData();
  payload.append('file', file);
  payload.append('api_key', signedUpload.apiKey);
  Object.entries(signedUpload.params).forEach(([name, value]) => payload.append(name, String(value)));
  payload.append('signature', signedUpload.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signedUpload.cloudName)}/${resourceType}/upload`,
    { method: 'POST', body: payload }
  );
  const uploadedAsset = await response.json();
  if (!response.ok) {
    throw new Error(uploadedAsset.error?.message || 'Cloudinary upload failed.');
  }

  return {
    imageUrl: uploadedAsset.secure_url,
    filename: uploadedAsset.public_id,
    originalname: file.name,
  };
};

const uploadAndCreate = async (formData, purpose, endpoint, field, token) => {
  const file = formData.get(field);
  const asset = await uploadToCloudinary(file, purpose, token);
  return API.post(endpoint, { ...getFormValues(formData), ...asset }, {
    headers: { 'x-auth-token': token },
  });
};

// Notifications (new unified functions)
export const fetchNotifications = () => API.get('/notifications');
export const createNotification = (data, token) => API.post('/notifications', data, { headers: { 'x-auth-token': token } });
export const updateNotification = (id, data, token) => API.put(`/notifications/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteNotification = (id, token) => API.delete(`/notifications/${id}`, { headers: { 'x-auth-token': token } });

// --- existing API surface kept for app compatibility ---
export const login = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getVerificationCourses = () => API.get('/alumni-verification/courses');
export const getVerificationYears = (course) => API.get('/alumni-verification/years', { params: { course } });
export const requestAlumniVerification = (data) => API.post('/alumni-verification/requests', data);
export const getAlumniVerificationStatus = (sessionToken) => API.post('/alumni-verification/requests/status', { sessionToken });
export const cancelAlumniVerification = (sessionToken) => API.post('/alumni-verification/requests/cancel', { sessionToken });
export const registerVerifiedAlumni = (data) => API.post('/alumni-verification/register', data);
export const getMyOfficialAlumniRecord = (token) => API.get('/alumni-verification/me', { headers: { 'x-auth-token': token } });
export const previewAlumniImport = (formData, token) => API.post('/alumni-verification/admin/import/preview', formData, { headers: { 'x-auth-token': token } });
export const importAlumniWorkbook = (formData, token) => API.post('/alumni-verification/admin/import', formData, { headers: { 'x-auth-token': token } });
export const getAlumniVerificationRequests = (token) => API.get('/alumni-verification/admin/requests', { headers: { 'x-auth-token': token } });
export const approveAlumniVerificationRequest = (id, data, token) => API.post(`/alumni-verification/admin/requests/${id}/approve`, data, { headers: { 'x-auth-token': token } });
export const rejectAlumniVerificationRequest = (id, token) => API.post(`/alumni-verification/admin/requests/${id}/reject`, {}, { headers: { 'x-auth-token': token } });
export const getOfficialAlumniRecords = (params, token) => API.get('/alumni-verification/admin/records', { params, headers: { 'x-auth-token': token } });
export const getOfficialAlumniFields = (token) => API.get('/alumni-verification/admin/records/fields', { headers: { 'x-auth-token': token } });
export const exportOfficialAlumniRecords = (params, token) => API.get('/alumni-verification/admin/records/export', {
  params,
  responseType: 'blob',
  headers: { 'x-auth-token': token },
});
export const getOfficialAlumniRecord = (id, token) => API.get(`/alumni-verification/admin/records/${id}`, { headers: { 'x-auth-token': token } });
export const createOfficialAlumniRecord = (data, token) => API.post('/alumni-verification/admin/records', data, { headers: { 'x-auth-token': token } });
export const updateOfficialAlumniRecord = (id, data, token) => API.put(`/alumni-verification/admin/records/${id}`, data, { headers: { 'x-auth-token': token } });
export const archiveOfficialAlumniRecord = (id, token) => API.delete(`/alumni-verification/admin/records/${id}`, { data: { confirm: true }, headers: { 'x-auth-token': token } });
export const getOfficialAlumniAudits = (id, params, token) => API.get(`/alumni-verification/admin/records/${id}/audit`, { params, headers: { 'x-auth-token': token } });
export const getOfficialAlumniBatches = (params, token) => API.get('/alumni-verification/admin/batches', { params, headers: { 'x-auth-token': token } });
export const getOfficialAlumniBatchArchiveImpact = (data, token) => API.post('/alumni-verification/admin/batches/archive-impact', data, { headers: { 'x-auth-token': token } });
export const archiveOfficialAlumniBatch = (data, token) => API.post('/alumni-verification/admin/batches/archive', data, { headers: { 'x-auth-token': token } });
export const getAlumniImportHistory = (params, token) => API.get('/alumni-verification/admin/imports', { params, headers: { 'x-auth-token': token } });
export const getAlumniImportErrors = (id, token) => API.get(`/alumni-verification/admin/imports/${id}/errors`, {
  responseType: 'blob',
  headers: { 'x-auth-token': token },
});
export const getAlumniImportArchiveImpact = (id, token) => API.get(`/alumni-verification/admin/imports/${id}/archive-impact`, { headers: { 'x-auth-token': token } });
export const archiveAlumniImport = (id, confirm, token) => API.post(`/alumni-verification/admin/imports/${id}/archive`, { confirm }, { headers: { 'x-auth-token': token } });
export const loginUser = (data) => API.post('/auth/user/login', data);
export const logoutUser = (token) => API.post('/auth/logout', {}, { headers: { 'x-auth-token': token } });
export const requestUserPasswordReset = (email) => API.post('/auth/user/forgot-password', { email });
export const resetUserPassword = (data) => API.post('/auth/user/reset-password', data);
export const loginUserWithGoogle = (credential) => API.post('/auth/google/user', { credential });
export const loginAdminWithGoogle = (credential) => API.post('/auth/google/admin', { credential });
export const getCurrentUser = (token) => API.get('/auth/me', {
  headers: { 'x-auth-token': token }
});

export const getDashboard = (token) => API.get('/auth/dashboard', {
  headers: { 'x-auth-token': token }
});

export const getMyAlumniRecord = (token) => API.get('/alumni-records/me', { headers: { 'x-auth-token': token } });
export const saveMyAlumniRecord = (data, token) => API.put('/alumni-records/me', data, { headers: { 'x-auth-token': token } });
export const uploadMyAlumniPhoto = async (formData, token) => {
  const asset = await uploadToCloudinary(formData.get('photo'), 'alumni-profile', token);
  return API.post('/alumni-records/me/photo', asset, { headers: { 'x-auth-token': token } });
};
export const getAlumniRecordSummary = (token) => API.get('/alumni-records/admin/summary', { headers: { 'x-auth-token': token } });
export const getAlumniSummary = (token) => API.get('/alumni-records/summary', { headers: { 'x-auth-token': token } });
export const searchAlumniRecords = (params, token) => API.get('/alumni-records/admin', {
  params,
  headers: { 'x-auth-token': token }
});
export const updateAlumniRecord = (id, data, token) => API.put(`/alumni-records/admin/${id}`, data, {
  headers: { 'x-auth-token': token }
});
export const deleteAlumniRecord = (id, token) => API.delete(`/alumni-records/admin/${id}`, {
  headers: { 'x-auth-token': token }
});
export const exportAlumniRecords = (params, token) => API.get('/alumni-records/admin/export', {
  params,
  responseType: 'blob',
  headers: { 'x-auth-token': token }
});

export const getAdminUsers = (token) => API.get('/auth/users', { headers: { 'x-auth-token': token } });
export const createAdminUser = (data, token) => API.post('/auth/users', data, { headers: { 'x-auth-token': token } });
export const updateAdminUser = (id, data, token) => API.put(`/auth/users/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteAdminUser = (id, token) => API.delete(`/auth/users/${id}`, { headers: { 'x-auth-token': token } });
export const getPasswordAdminAccounts = (token) => API.get('/auth/users/password-accounts', { headers: { 'x-auth-token': token } });
export const createPasswordAdminAccount = (data, token) => API.post('/auth/users/password-accounts', data, { headers: { 'x-auth-token': token } });
export const updatePasswordAdminAccount = (id, data, token) => API.put(`/auth/users/password-accounts/${id}`, data, { headers: { 'x-auth-token': token } });
export const deletePasswordAdminAccount = (id, token) => API.delete(`/auth/users/password-accounts/${id}`, { headers: { 'x-auth-token': token } });

export const getAllContent = () => API.get('/content');
export const getContentSection = (sectionId) => API.get(`/content/${sectionId}`);
export const updateContentSection = (sectionId, data, token) => API.put(`/content/${sectionId}`, data, {
  headers: { 'x-auth-token': token }
});

export const getAllAlumniStories = () => API.get('/stories');
export const getAllAlumniStoriesAdmin = (token) => API.get('/stories/admin/all', { headers: { 'x-auth-token': token } });
export const createAlumniStory = (data, token) => API.post('/stories', data, { headers: { 'x-auth-token': token } });
export const updateAlumniStory = (id, data, token) => API.put(`/stories/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteAlumniStory = (id, token) => API.delete(`/stories/${id}`, { headers: { 'x-auth-token': token } });
export const hardDeleteAlumniStory = (id, token) => API.delete(`/stories/${id}/hard`, { headers: { 'x-auth-token': token } });

export const prefetchAllContent = async () => {
  if (typeof window !== 'undefined' && window.__alumniContentCache) return window.__alumniContentCache;
  const res = await getAllContent();
  if (typeof window !== 'undefined') window.__alumniContentCache = res;
  return res;
};

// Subscribers (newsletter)
export const subscribeEmail = (data) => API.post('/subscribers', data);
export const getAllSubscribersAdmin = (token) => API.get('/subscribers/admin/all', { headers: { 'x-auth-token': token } });
export const deleteSubscriber = (id, token) => API.delete(`/subscribers/${id}`, { headers: { 'x-auth-token': token } });

// other endpoints preserved (alumni, events, contacts, gallery, sponsors)
export const getAllAlumniStack = (params = {}) => API.get('/alumni', { params });
export const getAlumniStackById = (id) => API.get(`/alumni/${id}`);
export const getAllAlumniStackAdmin = (token) => API.get('/alumni/admin/all', { headers: { 'x-auth-token': token } });
export const createAlumniStack = (data, token) => API.post('/alumni', data, { headers: { 'x-auth-token': token } });
export const updateAlumniStack = (id, data, token) => API.put(`/alumni/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteAlumniStack = (id, token) => API.delete(`/alumni/${id}`, { headers: { 'x-auth-token': token } });
export const hardDeleteAlumniStack = (id, token) => API.delete(`/alumni/${id}/hard`, { headers: { 'x-auth-token': token } });

export const getAllEvents = () => API.get('/events');
export const getEventById = (id) => API.get(`/events/${id}`);
export const registerForEvent = (id, data) => API.post(`/events/${id}/register`, data);
export const getEventRegistrations = (id, token) => API.get(`/events/${id}/registrations`, { headers: { 'x-auth-token': token } });
export const getAllEventsAdmin = (token) => API.get('/events/admin/all', { headers: { 'x-auth-token': token } });
export const createEvent = (data, token) => API.post('/events', data, { headers: { 'x-auth-token': token } });
export const updateEvent = (id, data, token) => API.put(`/events/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteEvent = (id, token) => API.delete(`/events/${id}`, { headers: { 'x-auth-token': token } });
export const hardDeleteEvent = (id, token) => API.delete(`/events/${id}/hard`, { headers: { 'x-auth-token': token } });

export const getAllContacts = () => API.get('/contacts');
export const getContactById = (id) => API.get(`/contacts/${id}`);
export const getAllContactsAdmin = (token) => API.get('/contacts/admin/all', { headers: { 'x-auth-token': token } });
export const createContact = (data) => API.post('/contacts', data);
export const updateContact = (id, data, token) => API.put(`/contacts/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteContact = (id, token) => API.delete(`/contacts/${id}`, { headers: { 'x-auth-token': token } });
export const hardDeleteContact = (id, token) => API.delete(`/contacts/${id}/hard`, { headers: { 'x-auth-token': token } });

export const getAllHeritageEvents = () => API.get('/heritage');
export const createHeritageEvent = (data, token) => API.post('/heritage', data, { headers: { 'x-auth-token': token } });
export const updateHeritageEvent = (id, data, token) => API.put(`/heritage/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteHeritageEvent = (id, token) => API.delete(`/heritage/${id}`, { headers: { 'x-auth-token': token } });

export const getGalleryImages = () => API.get('/gallery');
export const uploadGalleryImage = (formData, token) => uploadAndCreate(formData, 'gallery', '/gallery', 'image', token);
export const updateGalleryImage = (id, data, token) => API.put(`/gallery/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteGalleryImage = (id, token) => API.delete(`/gallery/${id}`, { headers: { 'x-auth-token': token } });

export const uploadEventImage = async (formData, token) => {
  const asset = await uploadToCloudinary(formData.get('image'), 'event', token);
  return { data: { success: true, imageUrl: asset.imageUrl, filename: asset.filename } };
};

export const getSponsors = () => API.get('/sponsors');
export const uploadSponsor = (formData, token) => uploadAndCreate(formData, 'sponsor', '/sponsors', 'image', token);
export const deleteSponsor = (id, token) => API.delete(`/sponsors/${id}`, { headers: { 'x-auth-token': token } });

// Entrepreneurs (Corporate Connect)
export const getEntrepreneurs = () => API.get('/entrepreneurs');
export const uploadEntrepreneur = (formData, token) => uploadAndCreate(formData, 'entrepreneur', '/entrepreneurs', 'image', token);
export const updateEntrepreneur = (id, data, token) => API.put(`/entrepreneurs/${id}`, data, { headers: { 'x-auth-token': token } });
export const deleteEntrepreneur = (id, token) => API.delete(`/entrepreneurs/${id}`, { headers: { 'x-auth-token': token } });
