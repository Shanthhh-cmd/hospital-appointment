import api from './api';

const TOKEN_KEY = 'medicare_auth_token';
const USER_KEY = 'medicare_auth_user';

/**
 * Authentication Service (Experiment 4)
 */
export const authService = {
  /**
   * Patient authentication using login API (Experiment 4a)
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Patient registration using register API
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Fetch authenticated patient profile
   */
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Clear authentication token and user session (Experiment 4e)
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    const user = localStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};
