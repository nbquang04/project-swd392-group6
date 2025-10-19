
import axios from 'axios';

const instance = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8080/api'
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  const ustr = localStorage.getItem('user');
  if (ustr) { try { const u = JSON.parse(ustr); if (u?.id) config.headers['X-User-Id'] = u.id } catch {} }
  return config;
});

export default instance