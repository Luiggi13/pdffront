// import axios, { type AxiosInstance } from 'axios';

// export type AxiosRequestInterceptor = Parameters<(typeof axios)['interceptors']['request']['use']>[0];

// let axiosInstance: AxiosInstance | undefined;

// export async function useAxios() {
//   if (!axiosInstance) {
//     axiosInstance = axios.create({
//       baseURL: 'http://localhost:1313/api/v1',
//     });
//   }

//   return axiosInstance;
// }

// import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:1313/api/v1',
});

axiosInstance.interceptors.request.use((config) => {
  const apikey = 'b50da29a83137bfdd6501d8a6b0ec37d';
  if (useAuthStore().userLogged.username.toLocaleLowerCase() === 'christian') config.headers['x-rol'] = 'CONO';
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-Api-Key'] = apikey;
  config.headers['route'] = import.meta.env.VITE_API_ROUTE;
  return config;
});

export default axiosInstance;
