import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointmentService';

// ==========================================
// ASYNC THUNKS (Experiment 3 CRUD via REST APIs)
// ==========================================

/**
 * GET: Retrieve active appointments (Experiment 3a)
 */
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getActiveAppointments();
      return response.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointments');
    }
  }
);

/**
 * GET: Retrieve appointment history (Experiment 3e)
 */
export const fetchAppointmentHistory = createAsyncThunk(
  'appointments/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentHistory();
      return response.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointment history');
    }
  }
);

/**
 * POST: Create an appointment (Experiment 3b, 2c)
 */
export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentPayload, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(appointmentPayload);
      return response.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to book appointment');
    }
  }
);

/**
 * PUT/PATCH: Reschedule an appointment (Experiment 3c, 2c)
 */
export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ id, date, timeSlot, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.rescheduleAppointment(id, { date, timeSlot, reason });
      return response.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to reschedule appointment');
    }
  }
);

/**
 * DELETE: Cancel an appointment (Experiment 3d, 2c)
 */
export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(id, reason);
      return response.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to cancel appointment');
    }
  }
);

// Initial Booking Draft State (Experiment 2b: Manage doctor, date, time slot, patient details, and appointment status)
const initialBookingDraft = {
  doctor: null, // Selected doctor object
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Default tomorrow
  timeSlot: '',
  patientDetails: {
    name: 'Alex Mercer',
    email: 'patient@medicare.com',
    phone: '+1 (555) 789-4321',
    age: 32,
    gender: 'Male',
    reason: '',
    visitType: 'In-Person Consultation'
  },
  currentStep: 1 // 1: Doctor & Slot, 2: Patient Info, 3: Review & Confirm
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    activeAppointments: [],
    history: [],
    bookingDraft: initialBookingDraft,
    loading: false,
    historyLoading: false,
    actionLoading: false, // for book, reschedule, cancel
    error: null,
    historyError: null,
    actionError: null,
    successNotification: null
  },
  reducers: {
    // Experiment 2b Draft Management
    setDraftDoctor: (state, action) => {
      state.bookingDraft.doctor = action.payload;
    },
    setDraftDate: (state, action) => {
      state.bookingDraft.date = action.payload;
      state.bookingDraft.timeSlot = ''; // reset slot when date changes
    },
    setDraftSlot: (state, action) => {
      state.bookingDraft.timeSlot = action.payload;
    },
    setDraftPatientDetails: (state, action) => {
      state.bookingDraft.patientDetails = {
        ...state.bookingDraft.patientDetails,
        ...action.payload
      };
    },
    setDraftStep: (state, action) => {
      state.bookingDraft.currentStep = action.payload;
    },
    resetBookingDraft: (state) => {
      state.bookingDraft = {
        ...initialBookingDraft,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      };
    },
    clearAppointmentNotifications: (state) => {
      state.error = null;
      state.actionError = null;
      state.successNotification = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAppointments (GET)
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.activeAppointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchAppointmentHistory (GET)
      .addCase(fetchAppointmentHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchAppointmentHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchAppointmentHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      // bookAppointment (POST)
      .addCase(bookAppointment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.activeAppointments.unshift(action.payload);
        state.successNotification = `Appointment ${action.payload.id} successfully scheduled!`;
        // Reset draft
        state.bookingDraft = initialBookingDraft;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // rescheduleAppointment (PUT/PATCH)
      .addCase(rescheduleAppointment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.activeAppointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.activeAppointments[index] = action.payload;
        }
        state.successNotification = `Appointment ${action.payload.id} successfully rescheduled!`;
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // cancelAppointment (DELETE)
      .addCase(cancelAppointment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove from active appointments
        state.activeAppointments = state.activeAppointments.filter(apt => apt.id !== action.payload.id);
        // Add to history
        state.history.unshift(action.payload);
        state.successNotification = `Appointment ${action.payload.id} was cancelled.`;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  }
});

export const {
  setDraftDoctor,
  setDraftDate,
  setDraftSlot,
  setDraftPatientDetails,
  setDraftStep,
  resetBookingDraft,
  clearAppointmentNotifications
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
