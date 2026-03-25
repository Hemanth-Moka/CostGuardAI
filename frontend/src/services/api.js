import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const dataAPI = {
  upload: (formData) => {
    return api.post('/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getData: (params) => api.get('/data', { params }),
};

export const insightsAPI = {
  analyze: () => api.post('/insights/analyze'),
  getInsights: (params) => api.get('/insights', { params }),
};

export const recommendationsAPI = {
  getRecommendations: (params) => api.get('/recommendations', { params }),
  getById: (id) => api.get(`/recommendations/${id}`),
};

export const actionsAPI = {
  request: (data) => api.post('/actions/request', data),
  approve: (actionId, approved) => api.post(`/actions/${actionId}/approve`, { approved }),
  execute: (actionId) => api.post(`/actions/${actionId}/execute`),
  getActions: (params) => api.get('/actions', { params }),
};

export const impactAPI = {
  getMetrics: (params) => api.get('/impact/metrics', { params }),
  getLogs: () => api.get('/impact/logs'),
  getLogById: (id) => api.get(`/impact/logs/${id}`),
};

export default api;
