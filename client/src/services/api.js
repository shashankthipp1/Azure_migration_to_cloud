import axios from 'axios';

// Try multiple ports (server might auto-retry to different port)
const getApiBaseUrl = () => {
  // First check env variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Server is running on port 8080 (confirmed by netstat)
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging only in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API Configuration:');
  console.log('  API_BASE_URL:', API_BASE_URL);
  console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL || '(not set)');
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data
      });
    }
    
    // Don't redirect on login page for 401 errors (login failures are expected)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Teachers API
export const teachersAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

// Marks API
export const marksAPI = {
  getAll: (params) => api.get('/marks', { params }),
  create: (data) => api.post('/marks', data),
  update: (id, data) => api.put(`/marks/${id}`, data),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
};

// Departments API
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getSubjects: (params) => api.get('/departments/subjects', { params }),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  createSubject: (data) => api.post('/departments/subjects', data),
  updateSubject: (id, data) => api.put(`/departments/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/departments/subjects/${id}`),
};

export default api;
