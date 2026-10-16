import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { authService } from '../services/authService';
import store from '../store';
import {
  setDraftDoctor,
  setDraftDate,
  setDraftSlot,
  resetBookingDraft
} from '../store/slices/appointmentSlice';
import { fetchDoctors } from '../store/slices/doctorSlice';
import { simulationConfig } from '../services/mockBackend';

/**
 * In-Browser Automated Test Suite for Experiments 1 through 4
 * Allows students, examiners, and evaluators to run assertions directly in the browser UI.
 */
export async function runAllAutomatedTests(onProgress) {
  const results = [];
  const log = (id, exp, title, status, message = '', durationMs = 0) => {
    const entry = { id, exp, title, status, message, durationMs };
    results.push(entry);
    if (onProgress) onProgress([...results]);
  };

  // ==========================================
  // EXPERIMENT 1: REST APIS & ASYNC DATA
  // ==========================================
  try {
    const t0 = performance.now();
    const data = await doctorService.getDoctors();
    const ok = data.success && Array.isArray(data.doctors) && data.doctors.length > 0;
    log('1a', 'Exp 1', 'Fetch doctors using REST API (GET /api/doctors)', ok ? 'PASS' : 'FAIL', `Retrieved ${data.doctors?.length} doctors via Axios`, Math.round(performance.now() - t0));
  } catch (e) {
    log('1a', 'Exp 1', 'Fetch doctors using REST API', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const data = await doctorService.getDoctors('', 'Cardiology');
    const ok = data.success && data.doctors.every(d => d.specialty.toLowerCase() === 'cardiology');
    log('1b-1', 'Exp 1', 'Filter doctors by Specialty (Cardiology)', ok ? 'PASS' : 'FAIL', `Found ${data.doctors?.length} Cardiology doctors`, Math.round(performance.now() - t0));
  } catch (e) {
    log('1b-1', 'Exp 1', 'Filter doctors by Specialty', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const data = await doctorService.getDoctors('Shin');
    const ok = data.success && data.doctors.length > 0;
    log('1b-2', 'Exp 1', 'Search doctors by keyword query ("Shin")', ok ? 'PASS' : 'FAIL', `Matched ${data.doctors?.length} doctor record(s)`, Math.round(performance.now() - t0));
  } catch (e) {
    log('1b-2', 'Exp 1', 'Search doctors by query', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const date = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];
    const data = await doctorService.getAvailableSlots('doc-1', date);
    const ok = data.success && Array.isArray(data.availableSlots) && data.availableSlots.length > 0;
    log('1c', 'Exp 1', 'Retrieve available time slots via API request', ok ? 'PASS' : 'FAIL', `${data.availableSlots?.length} open slots for date ${date}`, Math.round(performance.now() - t0));
  } catch (e) {
    log('1c', 'Exp 1', 'Retrieve available time slots', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const data = await doctorService.getDoctorById('doc-1');
    const ok = data.success && data.doctor && data.doctor.id === 'doc-1';
    log('1d', 'Exp 1', 'Fetch individual doctor details dynamically by ID', ok ? 'PASS' : 'FAIL', `Loaded profile for ${data.doctor?.name}`, Math.round(performance.now() - t0));
  } catch (e) {
    log('1d', 'Exp 1', 'Fetch doctor details dynamically', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    try {
      await doctorService.getDoctorById('doc-invalid-999');
      log('1f', 'Exp 1', 'Display loading and error states (404 rejection)', 'FAIL', 'Expected 404 error');
    } catch (err) {
      const ok = err.response?.status === 404 || err.message.includes('not found');
      log('1f', 'Exp 1', 'Display loading and error states (404 rejection)', ok ? 'PASS' : 'FAIL', 'Successfully rejected non-existent doctor with 404 status', Math.round(performance.now() - t0));
    }
  } catch (e) {
    log('1f', 'Exp 1', 'Error states', 'FAIL', e.message);
  }

  // ==========================================
  // EXPERIMENT 2: STATE MANAGEMENT & CACHING
  // ==========================================
  try {
    const t0 = performance.now();
    const state = store.getState();
    const ok = Boolean(state.auth && state.doctors && state.appointments && state.inspector);
    log('2a', 'Exp 2', 'Create global Redux appointment store', ok ? 'PASS' : 'FAIL', 'Root store configured with auth, doctors, appointments, inspector slices', Math.round(performance.now() - t0));
  } catch (e) {
    log('2a', 'Exp 2', 'Create global appointment store', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    store.dispatch(setDraftDoctor({ id: 'doc-1', name: 'Dr. Test' }));
    store.dispatch(setDraftDate('2026-12-01'));
    store.dispatch(setDraftSlot('10:00 AM'));
    const draft = store.getState().appointments.bookingDraft;
    const ok = draft.doctor?.id === 'doc-1' && draft.date === '2026-12-01' && draft.timeSlot === '10:00 AM';
    log('2b', 'Exp 2', 'Manage doctor, date, slot & patient details in draft state', ok ? 'PASS' : 'FAIL', 'Booking draft state updated correctly in Redux', Math.round(performance.now() - t0));
  } catch (e) {
    log('2b', 'Exp 2', 'Manage booking draft state', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    store.dispatch(resetBookingDraft());
    const auditLogs = store.getState().inspector.auditLogs;
    const ok = Array.isArray(auditLogs) && auditLogs.length > 0;
    log('2d', 'Exp 2', 'Use middleware to monitor appointment actions', ok ? 'PASS' : 'FAIL', `Middleware recorded ${auditLogs.length} intercepted action audits`, Math.round(performance.now() - t0));
  } catch (e) {
    log('2d', 'Exp 2', 'Middleware action monitoring', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    await store.dispatch(fetchDoctors({ forceRefresh: true }));
    const hitsBefore = store.getState().inspector.cacheStats.hits;
    await store.dispatch(fetchDoctors()); // Should hit cache
    const stateAfter = store.getState().doctors;
    const ok = stateAfter.isDataFromCache === true;
    log('2e', 'Exp 2', 'Cache doctor and availability data (In-memory TTL)', ok ? 'PASS' : 'FAIL', `Cached catalog returned instantly (Hits: ${store.getState().inspector.cacheStats.hits})`, Math.round(performance.now() - t0));
  } catch (e) {
    log('2e', 'Exp 2', 'Cache doctor data', 'FAIL', e.message);
  }

  // ==========================================
  // EXPERIMENT 3: APPOINTMENT CRUD OPERATIONS
  // ==========================================
  let createdAptId = null;
  const testAptDate = new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0];

  try {
    const t0 = performance.now();
    const loginRes = await authService.login('patient@medicare.com', 'password123');
    const ok = Boolean(loginRes.token);
    log('4a-pre', 'Exp 3/4', 'Authenticate session with Bearer Token', ok ? 'PASS' : 'FAIL', 'Obtained valid JWT session token', Math.round(performance.now() - t0));
  } catch (e) {
    log('4a-pre', 'Exp 3/4', 'Authenticate session', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const data = await appointmentService.getActiveAppointments();
    const ok = data.success && Array.isArray(data.appointments);
    log('3a', 'Exp 3', 'Retrieve appointments using GET (/api/appointments)', ok ? 'PASS' : 'FAIL', `Retrieved ${data.appointments?.length} active appointments`, Math.round(performance.now() - t0));
  } catch (e) {
    log('3a', 'Exp 3', 'Retrieve appointments using GET', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    const newApt = {
      doctorId: 'doc-3',
      doctorName: 'Dr. Chotta Bheem',
      specialty: 'Dermatology',
      hospital: 'St. Jude Wellness Clinic',
      date: testAptDate,
      timeSlot: '03:30 PM',
      patientName: 'Automated Test Runner',
      patientEmail: 'patient@medicare.com',
      reason: 'Automated test suite check',
      fee: 75
    };
    const data = await appointmentService.createAppointment(newApt);
    const ok = data.success && data.appointment?.id && data.appointment.status === 'CONFIRMED';
    createdAptId = data.appointment?.id;
    log('3b', 'Exp 3', 'Create an appointment using POST (/api/appointments)', ok ? 'PASS' : 'FAIL', `Created appointment #${createdAptId}`, Math.round(performance.now() - t0));
  } catch (e) {
    log('3b', 'Exp 3', 'Create appointment using POST', 'FAIL', e.message);
  }

  if (createdAptId) {
    try {
      const t0 = performance.now();
      const data = await appointmentService.rescheduleAppointment(createdAptId, {
        date: testAptDate,
        timeSlot: '04:15 PM',
        reason: 'Updated slot via test'
      });
      const ok = data.success && data.appointment.timeSlot === '04:15 PM' && data.appointment.status === 'RESCHEDULED';
      log('3c', 'Exp 3', 'Reschedule an appointment using PATCH (/api/appointments/:id)', ok ? 'PASS' : 'FAIL', `Rescheduled #${createdAptId} to 04:15 PM`, Math.round(performance.now() - t0));
    } catch (e) {
      log('3c', 'Exp 3', 'Reschedule appointment using PATCH', 'FAIL', e.message);
    }

    try {
      const t0 = performance.now();
      const data = await appointmentService.cancelAppointment(createdAptId, 'Cancelled in automated test');
      const ok = data.success && data.appointment.status === 'CANCELLED';
      log('3d', 'Exp 3', 'Cancel an appointment using DELETE (/api/appointments/:id)', ok ? 'PASS' : 'FAIL', `Cancelled #${createdAptId} and released time slot`, Math.round(performance.now() - t0));
    } catch (e) {
      log('3d', 'Exp 3', 'Cancel appointment using DELETE', 'FAIL', e.message);
    }
  }

  try {
    const t0 = performance.now();
    const data = await appointmentService.getAppointmentHistory();
    const ok = data.success && Array.isArray(data.appointments);
    log('3e', 'Exp 3', 'Retrieve appointment history using GET (/api/appointments/history)', ok ? 'PASS' : 'FAIL', `Retrieved ${data.appointments?.length} historical records`, Math.round(performance.now() - t0));
  } catch (e) {
    log('3e', 'Exp 3', 'Retrieve appointment history using GET', 'FAIL', e.message);
  }

  // ==========================================
  // EXPERIMENT 4: AUTHENTICATION & TOKENS
  // ==========================================
  try {
    const t0 = performance.now();
    const token = authService.getStoredToken();
    const user = authService.getStoredUser();
    const ok = Boolean(token && user);
    log('4b', 'Exp 4', 'Store and manage authentication token in localStorage', ok ? 'PASS' : 'FAIL', `Active Token: ${token?.slice(0, 24)}...`, Math.round(performance.now() - t0));
  } catch (e) {
    log('4b', 'Exp 4', 'Store authentication token', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    // Temporarily logout
    authService.logout();
    try {
      await appointmentService.getActiveAppointments();
      log('4d', 'Exp 4', 'Protect operations (Missing token rejected with 401)', 'FAIL', 'Unauthenticated request should have failed');
    } catch (err) {
      const ok = err.response?.status === 401;
      log('4d', 'Exp 4', 'Protect operations (Missing token rejected with 401)', ok ? 'PASS' : 'FAIL', 'Rejected unauthenticated call with HTTP 401 Unauthorized', Math.round(performance.now() - t0));
    }
    // Re-login
    await authService.login('patient@medicare.com', 'password123');
  } catch (e) {
    log('4d', 'Exp 4', 'Protect operations', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    authService.logout();
    const clearedToken = authService.getStoredToken();
    const ok = clearedToken === null;
    log('4e', 'Exp 4', 'Implement logout functionality', ok ? 'PASS' : 'FAIL', 'LocalStorage tokens and user session cleared', Math.round(performance.now() - t0));
    // Restore login
    await authService.login('patient@medicare.com', 'password123');
  } catch (e) {
    log('4e', 'Exp 4', 'Implement logout', 'FAIL', e.message);
  }

  try {
    const t0 = performance.now();
    simulationConfig.forceExpiredToken = true;
    try {
      await appointmentService.getActiveAppointments();
      log('4f', 'Exp 4', 'Handle unauthorized & expired-token responses (401 Interceptor)', 'FAIL', 'Expected 401 response');
    } catch (err) {
      const ok = err.response?.status === 401;
      log('4f', 'Exp 4', 'Handle unauthorized & expired-token responses (401 Interceptor)', ok ? 'PASS' : 'FAIL', 'Axios interceptor caught HTTP 401 and cleared session', Math.round(performance.now() - t0));
    } finally {
      simulationConfig.forceExpiredToken = false;
    }
  } catch (e) {
    log('4f', 'Exp 4', 'Handle expired-token response', 'FAIL', e.message);
  }

  return results;
}
