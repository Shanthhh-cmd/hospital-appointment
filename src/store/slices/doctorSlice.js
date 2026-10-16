import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorService } from '../../services/doctorService';
import { recordCacheHit, recordCacheMiss } from './inspectorSlice';

const DOCTORS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SLOTS_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

/**
 * Async Thunk: Fetch doctors with search and specialty filters (Experiment 1a, 1b, 1e)
 * Supports Caching (Experiment 2e)
 */
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async ({ search = '', specialty = '', forceRefresh = false } = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().doctors;
      const isFilterActive = Boolean(search || (specialty && specialty !== 'All' && specialty !== 'All Specialties'));
      const now = Date.now();

      // Check Cache (Experiment 2e)
      if (!forceRefresh && !isFilterActive && state.doctorsCache.data.length > 0) {
        const isFresh = now - state.doctorsCache.timestamp < DOCTORS_CACHE_TTL_MS;
        if (isFresh) {
          dispatch(recordCacheHit('Doctors Catalog'));
          return {
            doctors: state.doctorsCache.data,
            isFromCache: true,
            cachedAt: state.doctorsCache.timestamp
          };
        }
      }

      // Cache miss or filter active or forceRefresh
      dispatch(recordCacheMiss('Doctors Catalog'));
      const data = await doctorService.getDoctors(search, specialty);

      return {
        doctors: data.doctors || [],
        isFromCache: false,
        cachedAt: now,
        isDefaultList: !isFilterActive
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch doctors');
    }
  }
);

/**
 * Async Thunk: Fetch individual doctor details dynamically (Experiment 1d, 1e)
 */
export const fetchDoctorDetails = createAsyncThunk(
  'doctors/fetchDoctorDetails',
  async (doctorId, { rejectWithValue }) => {
    try {
      const data = await doctorService.getDoctorById(doctorId);
      return data.doctor;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load doctor details');
    }
  }
);

/**
 * Async Thunk: Fetch available dates & time slots (Experiment 1c, 1e)
 * Supports Caching (Experiment 2e)
 */
export const fetchAvailableSlots = createAsyncThunk(
  'doctors/fetchAvailableSlots',
  async ({ doctorId, date, forceRefresh = false }, { getState, dispatch, rejectWithValue }) => {
    try {
      const cacheKey = `${doctorId}_${date}`;
      const state = getState().doctors;
      const cached = state.availabilityCache[cacheKey];
      const now = Date.now();

      if (!forceRefresh && cached && (now - cached.timestamp < SLOTS_CACHE_TTL_MS)) {
        dispatch(recordCacheHit(`Slots: ${doctorId} (${date})`));
        return {
          ...cached.data,
          isFromCache: true,
          cachedAt: cached.timestamp
        };
      }

      dispatch(recordCacheMiss(`Slots: ${doctorId} (${date})`));
      const data = await doctorService.getAvailableSlots(doctorId, date);

      return {
        ...data,
        cacheKey,
        isFromCache: false,
        cachedAt: now
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch availability slots');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    selectedDoctor: null,
    searchQuery: '',
    selectedSpecialty: 'All Specialties',
    loading: false,
    error: null,
    lastFetched: null,
    isDataFromCache: false,

    // Dynamic Doctor Detail
    detailLoading: false,
    detailError: null,

    // Availability Slots
    slots: [],
    bookedSlots: [],
    slotsLoading: false,
    slotsError: null,
    isSlotsFromCache: false,
    selectedDate: new Date().toISOString().split('T')[0],

    // Caching state (Experiment 2e)
    doctorsCache: {
      data: [],
      timestamp: 0
    },
    availabilityCache: {}
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearDoctorError: (state) => {
      state.error = null;
      state.detailError = null;
      state.slotsError = null;
    },
    invalidateDoctorsCache: (state) => {
      state.doctorsCache = { data: [], timestamp: 0 };
    },
    invalidateAvailabilityCache: (state) => {
      state.availabilityCache = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDoctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.isDataFromCache = action.payload.isFromCache;
        state.lastFetched = action.payload.cachedAt;

        // If this was an unfiltered fetch, update the doctors cache
        if (action.payload.isDefaultList && !action.payload.isFromCache) {
          state.doctorsCache = {
            data: action.payload.doctors,
            timestamp: action.payload.cachedAt
          };
        }
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to retrieve doctors';
      })

      // fetchDoctorDetails
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || 'Failed to load doctor profile';
      })

      // fetchAvailableSlots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.slotsLoading = true;
        state.slotsError = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.slots = action.payload.availableSlots || [];
        state.bookedSlots = action.payload.bookedSlots || [];
        state.isSlotsFromCache = action.payload.isFromCache;

        // Store into cache if fresh
        if (!action.payload.isFromCache && action.payload.cacheKey) {
          state.availabilityCache[action.payload.cacheKey] = {
            data: action.payload,
            timestamp: action.payload.cachedAt
          };
        }
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.slotsLoading = false;
        state.slotsError = action.payload || 'Failed to retrieve available slots';
      });
  }
});

export const {
  setSearchQuery,
  setSelectedSpecialty,
  setSelectedDate,
  clearDoctorError,
  invalidateDoctorsCache,
  invalidateAvailabilityCache
} = doctorSlice.actions;

export default doctorSlice.reducer;
