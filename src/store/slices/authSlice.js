import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

/**
 * Async Thunk: Patient Login (Experiment 4a)
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

/**
 * Async Thunk: Patient Registration
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
  }
);

// Initial state loads stored token and user if available (Experiment 4b)
const initialToken = authService.getStoredToken();
const initialUser = authService.getStoredUser();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isAuthenticated: Boolean(initialToken),
    loading: false,
    error: null,
    sessionExpiredNotice: null
  },
  reducers: {
    // Experiment 4e: Logout
    logoutUser: (state) => {
      authService.logout();
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessionExpiredNotice = null;
    },
    // Experiment 4f: Handle unauthorized & expired token
    handleSessionExpired: (state, action) => {
      authService.logout();
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpiredNotice = action.payload || 'Your session has expired. Please sign in again.';
    },
    clearAuthErrors: (state) => {
      state.error = null;
      state.sessionExpiredNotice = null;
    },
    setSimulateExpiredToken: (state) => {
      // Store an invalid/expired token deliberately to test 401 handling
      localStorage.setItem('medicare_auth_token', 'EXPIRED_TOKEN_SIMULATION');
      state.token = 'EXPIRED_TOKEN_SIMULATION';
    }
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionExpiredNotice = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  logoutUser,
  handleSessionExpired,
  clearAuthErrors,
  setSimulateExpiredToken
} = authSlice.actions;

export default authSlice.reducer;
