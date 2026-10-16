import axios from 'axios';
import { handleMockRestRequest } from './mockBackend';

// Base Axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Custom adapter routing through simulated REST backend
  adapter: async (config) => {
    return handleMockRestRequest(config);
  }
});

// Broadcast channel / callback for auth logout on 401
let onUnauthorizedCallback = null;

export const setOnUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

// ==========================================
// REQUEST INTERCEPTOR (Experiment 4c)
// Automatically attach Bearer token to requests
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medicare_auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (Experiment 4f)
// Intercept responses, handle 401 Unauthorized / expired tokens
// ==========================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[Axios Interceptor] 401 Unauthorized detected! Clearing token and notifying state.');
      localStorage.removeItem('medicare_auth_token');
      localStorage.removeItem('medicare_auth_user');

      if (typeof onUnauthorizedCallback === 'function') {
        onUnauthorizedCallback(error.response.data?.message || 'Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
