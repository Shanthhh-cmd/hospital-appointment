import api from './api';

/**
 * Doctor Service handling REST API interactions (Experiment 1)
 */
export const doctorService = {
  /**
   * Fetch doctors list with optional search query and specialty filter
   * (Experiment 1a, 1b, 1e)
   */
  async getDoctors(search = '', specialty = '') {
    const params = {};
    if (search) params.search = search;
    if (specialty && specialty !== 'All' && specialty !== 'All Specialties') {
      params.specialty = specialty;
    }
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  /**
   * Fetch individual doctor details dynamically by ID
   * (Experiment 1d, 1e)
   */
  async getDoctorById(id) {
    if (!id) throw new Error('Doctor ID is required');
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  /**
   * Retrieve available dates and time slots using API request
   * (Experiment 1c, 1e)
   */
  async getAvailableSlots(doctorId, date) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/doctors/${doctorId}/availability`, {
      params: { date }
    });
    return response.data;
  }
};
