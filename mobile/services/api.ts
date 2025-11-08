import axios from 'axios';

// Backend API URL - change this to your Railway deployment URL when deployed
const API_URL = __DEV__ 
  ? 'http://localhost:3000' // Local development
  : 'https://your-app.railway.app'; // Production (update after deployment)

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging in dev
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
