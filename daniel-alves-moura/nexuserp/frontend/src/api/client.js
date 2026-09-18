import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexuserp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('nexuserp_token');
      localStorage.removeItem('nexuserp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(error) {
  const data = error.response?.data;
  if (data?.validationErrors) return Object.values(data.validationErrors).join(' • ');
  return data?.message || error.message || 'Erro inesperado';
}

export default api;
