import { addAuditLog } from '../slices/inspectorSlice';

/**
 * Appointment Monitor Middleware (Experiment 2d)
 * Intercepts and monitors all appointment-related actions in the Redux store.
 * Logs action lifecycle, payload data, and state transitions.
 */
export const appointmentMonitorMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  // Monitor appointment actions
  if (action.type && (action.type.startsWith('appointments/') || action.type.startsWith('bookingDraft/'))) {
    const currentState = storeAPI.getState();
    const timestamp = new Date().toLocaleTimeString();

    let eventDescription = action.type;
    let category = 'GENERAL';

    if (action.type.endsWith('/pending')) {
      category = 'PENDING';
      eventDescription = `Appointment async operation initiated: ${action.type.split('/')[1]}`;
    } else if (action.type.endsWith('/fulfilled')) {
      category = 'SUCCESS';
      eventDescription = `Appointment action succeeded: ${action.type.split('/')[1]}`;
    } else if (action.type.endsWith('/rejected')) {
      category = 'FAILURE';
      eventDescription = `Appointment action failed: ${action.payload || action.error?.message}`;
    } else if (action.type.includes('Draft')) {
      category = 'DRAFT_UPDATE';
      eventDescription = `Booking draft modified: ${action.type}`;
    }

    // Console logging with styled badges for developers/reviewers
    console.groupCollapsed(
      `%c[Appointment Middleware Monitor] %c${action.type} %c@ ${timestamp}`,
      'color: #0d9488; font-weight: bold;',
      'color: #2563eb; font-weight: bold;',
      'color: #64748b; font-weight: normal;'
    );
    console.log('Action Dispatched:', action);
    console.log('Category:', category);
    console.log('Current Appointments Count:', currentState.appointments.activeAppointments.length);
    console.groupEnd();

    // Push into Redux inspector slice for visual display
    try {
      storeAPI.dispatch(
        addAuditLog({
          id: Math.random().toString(36).substring(2, 9),
          timestamp,
          actionType: action.type,
          category,
          description: eventDescription,
          payload: action.payload || null
        })
      );
    } catch {
      // Prevent circular dispatch recursion
    }
  }

  return result;
};
