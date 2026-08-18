import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('exam_ai_token') || 'demo-teacher-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getProfileActivity: () => api.get('/auth/profile/activity')
};

export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  delete: (id) => api.delete(`/subjects/${id}`)
};

export const paperAPI = {
  upload: (formData) => api.post('/papers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getBySubject: (subjectId) => api.get(`/papers/${subjectId}`),
  delete: (id) => api.delete(`/papers/${id}`)
};

export const analysisAPI = {
  runAnalysis: (subjectId) => api.post(`/analysis/${subjectId}`),
  getAnalysis: (subjectId) => api.get(`/analysis/${subjectId}`)
};

export const generatorAPI = {
  generatePaper: (data) => api.post('/papers-gen/generate', data),
  getAllGenerated: (subjectId) => api.get(`/papers-gen${subjectId ? '?subjectId=' + subjectId : ''}`),
  getById: (id) => api.get(`/papers-gen/${id}`),
  updatePaper: (id, data) => api.put(`/papers-gen/${id}`, data),
  delete: (id) => api.delete(`/papers-gen/${id}`)
};

export const testAPI = {
  create: (data) => api.post('/tests', data),
  getAll: () => api.get('/tests'),
  getByCode: (code) => api.get(`/tests/code/${code}`),
  submitAttempt: (data) => api.post('/tests/submit', data),
  delete: (id) => api.delete(`/tests/${id}`)
};

export const evaluationAPI = {
  getAttemptResult: (attemptId) => api.get(`/results/${attemptId}`),
  overrideMarks: (attemptId, data) => api.patch(`/results/${attemptId}/marks`, data),
  reEvaluate: (attemptId) => api.post(`/results/${attemptId}/re-evaluate`),
  getSubmissions: (testId) => api.get(`/results/test/${testId}`),
  deleteSubmission: (id) => api.delete(`/results/${id}`)
};

export const analyticsAPI = {
  getTeacherStats: () => api.get('/analytics/teacher'),
  getStudentStats: () => api.get('/analytics/student'),
  askAIAssistant: (data) => api.post('/analytics/ai-assistant', data)
};

export const demoAPI = {
  seedDemo: () => api.post('/demo/seed')
};

export default api;
