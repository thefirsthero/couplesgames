import axios from 'axios';
import { getAuth } from 'firebase/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
