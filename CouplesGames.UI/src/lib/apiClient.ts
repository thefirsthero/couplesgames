import axios from 'axios';
import { getAuth } from 'firebase/auth';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { logger } from '../utils/logger';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Firebase auth token if available
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    logger.error(error, {
      action: 'API Request',
      additionalInfo: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    logger.error(error, {
      action: 'API Response',
      additionalInfo: {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      }
    });
    return Promise.reject(error);
  }
);

export default apiClient;