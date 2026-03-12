import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  register: async (userData) => {
    const response = await axios.post(`${API}/auth/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API}/auth/login`, credentials);
    return response.data;
  },

  // User Profile
  getProfile: async () => {
    const response = await axios.get(`${API}/user/profile`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put(`${API}/user/profile`, profileData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Reports
  getReports: async () => {
    const response = await axios.get(`${API}/reports`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getReport: async (reportId) => {
    const response = await axios.get(`${API}/reports/${reportId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await axios.post(`${API}/reports`, reportData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await axios.delete(`${API}/reports/${reportId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Upload Audio
  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API}/upload-audio`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;