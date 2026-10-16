import api from './api';

/**
 * Appointment Service handling CRUD Operations using REST APIs (Experiment 3)
 */
export const appointmentService = {
  /**
   * Retrieve active appointments using GET
   * (Experiment 3a)
   */
  async getActiveAppointments() {
    const response = await api.get('/appointments');
    return response.data;
  },

  /**
   * Retrieve appointment history using GET
   * (Experiment 3e)
   */
  async getAppointmentHistory() {
    const response = await api.get('/appointments/history');
    return response.data;
  },

  /**
   * Create an appointment using POST
   * (Experiment 3b)
   */
  async createAppointment(appointmentPayload) {
    const response = await api.post('/appointments', appointmentPayload);
    return response.data;
  },

  /**
   * Reschedule an appointment using PUT / PATCH
   * (Experiment 3c)
   */
  async rescheduleAppointment(appointmentId, updatedData) {
    const response = await api.patch(`/appointments/${appointmentId}`, updatedData);
    return response.data;
  },

  /**
   * Cancel an appointment using DELETE
   * (Experiment 3d)
   */
  async cancelAppointment(appointmentId, reason = 'Cancelled by patient') {
    const response = await api.delete(`/appointments/${appointmentId}`, {
      data: { reason }
    });
    return response.data;
  }
};
