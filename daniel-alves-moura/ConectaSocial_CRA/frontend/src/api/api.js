import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error) {
  const data = error.response?.data;
  if (typeof data?.message === 'string') return data.message;
  if (data && typeof data === 'object') {
    const values = Object.values(data).filter((v) => typeof v === 'string');
    if (values.length) return values.join(' · ');
  }
  return error.message || 'Erro inesperado';
}
