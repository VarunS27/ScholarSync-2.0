import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  deleteAccount: () => api.delete('/auth/account'),
};

// Notes API
export const notesAPI = {
  getAllNotes: (params) => api.get('/notes', { params }),
  getNoteById: (id, params) => api.get(`/notes/${id}`, { params }),
  uploadNote: (data) => api.post('/notes', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  getDownloadUrl: (id) => api.get(`/notes/${id}/download`),
  getSubjects: () => api.get('/subjects'),
};

// Reactions API
export const reactionsAPI = {
  toggleLike: (noteId) => api.post(`/reactions/like/${noteId}`),
  toggleDislike: (noteId) => api.post(`/reactions/dislike/${noteId}`),
  getReactionStatus: (noteId) => api.get(`/reactions/status/${noteId}`),
};

// Comments API
export const commentsAPI = {
  getComments: (noteId) => api.get(`/comments/${noteId}`),
  addComment: (noteId, data) => api.post(`/comments/${noteId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  banUser: (userId) => api.put(`/admin/users/${userId}/ban`),
  unbanUser: (userId) => api.put(`/admin/users/${userId}/unban`),
  deleteNote: (noteId) => api.delete(`/admin/notes/${noteId}`),
  getReports: () => api.get('/admin/reports'),
};

export default api;
