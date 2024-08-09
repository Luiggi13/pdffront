import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

axiosInstance.interceptors.request.use((config) => {
  if (useAuthStore().userLogged.username.toLocaleLowerCase() === import.meta.env.VITE_APP_CONO)
    config.headers['x-rol'] = 'CONO';
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-Api-Key'] = import.meta.env.VITE_APP_APIKEY;
  return config;
});

export default axiosInstance;
