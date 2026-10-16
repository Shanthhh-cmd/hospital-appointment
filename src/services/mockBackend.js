import { initialDoctors, standardTimeSlots } from '../data/mockDoctors';

// LocalStorage Keys
const DOCTORS_STORAGE_KEY = 'medicare_doctors_db';
const APPOINTMENTS_STORAGE_KEY = 'medicare_appointments_db';
const AUTH_TOKEN_KEY = 'medicare_auth_token';
const AUTH_USER_KEY = 'medicare_auth_user';

// Initialize LocalStorage Data if not present
export const initializeDatabase = () => {
  if (!localStorage.getItem(DOCTORS_STORAGE_KEY)) {
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(initialDoctors));
  }

  if (!localStorage.getItem(APPOINTMENTS_STORAGE_KEY)) {
    const demoAppointments = [
      {
        id: 'APT-1001',
        patientId: 'usr-1',
        patientName: 'Alex Mercer',
        patientEmail: 'patient@medicare.com',
        patientPhone: '+1 (555) 789-4321',
        patientAge: 32,
        patientGender: 'Male',
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Mitchell',
        specialty: 'Cardiology',
        hospital: 'Apex Memorial Medical Center',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        timeSlot: '10:30 AM',
        status: 'CONFIRMED', // CONFIRMED, RESCHEDULED, CANCELLED, COMPLETED
        visitType: 'In-Person Consultation',
        reason: 'Routine cardiac health review and preventive ECG checkup.',
        fee: 90,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'APT-1002',
        patientId: 'usr-1',
        patientName: 'Alex Mercer',
        patientEmail: 'patient@medicare.com',
        patientPhone: '+1 (555) 789-4321',
        patientAge: 32,
        patientGender: 'Male',
        doctorId: 'doc-3',
        doctorName: 'Dr. Emily Chen',
        specialty: 'Dermatology',
        hospital: 'St. Jude Wellness Clinic',
        date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
        timeSlot: '02:45 PM',
        status: 'CONFIRMED',
        visitType: 'Video Consultation',
        reason: 'Follow-up consultation for mild eczema rash on hands.',
        fee: 75,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'APT-0985',
        patientId: 'usr-1',
        patientName: 'Alex Mercer',
        patientEmail: 'patient@medicare.com',
        patientPhone: '+1 (555) 789-4321',
        patientAge: 32,
        patientGender: 'Male',
        doctorId: 'doc-6',
        doctorName: 'Dr. Robert Hawkins',
        specialty: 'General Medicine',
        hospital: 'Apex Memorial Medical Center',
        date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0], // 14 days ago
        timeSlot: '11:15 AM',
        status: 'COMPLETED',
        visitType: 'In-Person Consultation',
        reason: 'Annual comprehensive preventive health checkup & blood panel.',
        fee: 60,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 14).toISOString()
      }
    ];
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(demoAppointments));
  }
};

// Simulation settings that can be toggled dynamically in the UI
export const simulationConfig = {
  networkDelayMs: 450,
  forceApiError: false, // For testing Experiment 1f / 3f error display
  forceExpiredToken: false, // For testing Experiment 4f token expiration handling
  listeners: []
};

// Subscribers for real-time API traffic inspector
export const subscribeApiTraffic = (callback) => {
  simulationConfig.listeners.push(callback);
  return () => {
    simulationConfig.listeners = simulationConfig.listeners.filter(cb => cb !== callback);
  };
};

const notifyApiTraffic = (entry) => {
  simulationConfig.listeners.forEach(cb => {
    try { cb(entry); } catch (e) { /* ignore */ }
  });
};

// Delay helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Read doctors from mock data
const getDoctorsFromStorage = () => {
  return initialDoctors;
};

// Helper: Read appointments from storage
const getAppointmentsFromStorage = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || '[]');
};

// Helper: Save appointments to storage
const saveAppointmentsToStorage = (appointments) => {
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
};

// Mock REST Router handling requests
export const handleMockRestRequest = async (config) => {
  await sleep(simulationConfig.networkDelayMs);

  const startTime = Date.now();
  const { url = '', method = 'get', data, params, headers = {} } = config;
  const parsedData = typeof data === 'string' ? JSON.parse(data || '{}') : (data || {});
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0];

  // Helper to record traffic
  const recordAndReturn = (status, responseData, statusText = 'OK') => {
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      method: method.toUpperCase(),
      url,
      status,
      statusText,
      durationMs: Date.now() - startTime,
      requestHeaders: headers,
      requestPayload: parsedData,
      responsePayload: responseData
    };
    notifyApiTraffic(entry);

    if (status >= 400) {
      const error = new Error(responseData?.message || 'REST API Error');
      error.response = {
        status,
        statusText,
        data: responseData,
        headers: { 'content-type': 'application/json' },
        config
      };
      throw error;
    }

    return {
      data: responseData,
      status,
      statusText,
      headers: { 'content-type': 'application/json' },
      config
    };
  };

  // Check forced general error
  if (simulationConfig.forceApiError && !url.includes('/auth/')) {
    return recordAndReturn(500, {
      success: false,
      message: 'Simulated 500 Internal Server Error: Diagnostic test mode enabled'
    }, 'Internal Server Error');
  }

  // Token Verification Helper for Protected Endpoints
  const authHeader = headers['Authorization'] || headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const verifyToken = () => {
    if (simulationConfig.forceExpiredToken) {
      return { valid: false, reason: 'Token expired (Simulated 401 for Experiment 4f)' };
    }
    if (!token) {
      return { valid: false, reason: 'Missing Authorization Bearer token' };
    }
    if (token === 'EXPIRED_TOKEN_SIMULATION') {
      return { valid: false, reason: 'Expired session token' };
    }
    // Any valid mock JWT pattern
    return { valid: true, userId: 'usr-1' };
  };

  // ==========================================
  // 1. AUTHENTICATION REST APIS (Experiment 4)
  // ==========================================
  
  // POST /api/auth/login
  if (cleanUrl === '/auth/login' && method.toLowerCase() === 'post') {
    const { email, password } = parsedData;
    if (!email || !password) {
      return recordAndReturn(400, { success: false, message: 'Email and password are required' }, 'Bad Request');
    }

    // Default mock patient
    const mockUser = {
      id: 'usr-1',
      name: email === 'patient@medicare.com' ? 'Alex Mercer' : email.split('@')[0],
      email: email,
      phone: '+1 (555) 789-4321',
      age: 32,
      gender: 'Male',
      bloodGroup: 'O+'
    };

    const mockToken = `medicare_jwt_${btoa(JSON.stringify({ id: mockUser.id, email: mockUser.email, exp: Date.now() + 3600000 }))}`;

    return recordAndReturn(200, {
      success: true,
      message: 'Authentication successful',
      token: mockToken,
      user: mockUser,
      expiresIn: '1 hour'
    });
  }

  // POST /api/auth/register
  if (cleanUrl === '/auth/register' && method.toLowerCase() === 'post') {
    const { name, email, password, phone, age, gender } = parsedData;
    if (!name || !email || !password) {
      return recordAndReturn(400, { success: false, message: 'Please provide name, email, and password' }, 'Bad Request');
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      age: age || 28,
      gender: gender || 'Other'
    };

    const mockToken = `medicare_jwt_${btoa(JSON.stringify({ id: newUser.id, email: newUser.email, exp: Date.now() + 3600000 }))}`;

    return recordAndReturn(201, {
      success: true,
      message: 'Patient account registered successfully',
      token: mockToken,
      user: newUser
    });
  }

  // GET /api/auth/profile
  if (cleanUrl === '/auth/profile' && method.toLowerCase() === 'get') {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const user = userStr ? JSON.parse(userStr) : {
      id: 'usr-1',
      name: 'Alex Mercer',
      email: 'patient@medicare.com',
      phone: '+1 (555) 789-4321',
      age: 32,
      gender: 'Male'
    };
    return recordAndReturn(200, { success: true, user });
  }

  // ==========================================
  // 2. DOCTOR REST APIS (Experiment 1)
  // ==========================================

  // GET /api/doctors (with search & specialty filter support)
  if (cleanUrl === '/doctors' && method.toLowerCase() === 'get') {
    const doctors = getDoctorsFromStorage();
    const search = (params?.search || '').toLowerCase().trim();
    const specialty = params?.specialty || '';

    let filtered = doctors;

    if (specialty && specialty !== 'All' && specialty !== 'All Specialties') {
      filtered = filtered.filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search) ||
        doc.specialty.toLowerCase().includes(search) ||
        doc.hospital.toLowerCase().includes(search) ||
        doc.department.toLowerCase().includes(search)
      );
    }

    return recordAndReturn(200, {
      success: true,
      count: filtered.length,
      doctors: filtered
    });
  }

  // GET /api/doctors/:id/availability?date=...
  const availabilityMatch = cleanUrl.match(/^\/doctors\/([^/]+)\/availability$/);
  if (availabilityMatch && method.toLowerCase() === 'get') {
    const doctorId = availabilityMatch[1];
    const date = params?.date || new Date().toISOString().split('T')[0];
    const doctors = getDoctorsFromStorage();
    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctor) {
      return recordAndReturn(404, { success: false, message: 'Doctor not found' }, 'Not Found');
    }

    // Determine booked slots on this date from appointment DB
    const appointments = getAppointmentsFromStorage();
    const bookedOnDate = appointments
      .filter(apt => apt.doctorId === doctorId && apt.date === date && apt.status !== 'CANCELLED')
      .map(apt => apt.timeSlot);

    // Filter available slots
    const availableSlots = standardTimeSlots.filter(slot => !bookedOnDate.includes(slot));

    return recordAndReturn(200, {
      success: true,
      doctorId,
      date,
      totalSlots: standardTimeSlots.length,
      availableCount: availableSlots.length,
      availableSlots,
      bookedSlots: bookedOnDate,
      cachedAt: new Date().toISOString()
    });
  }

  // GET /api/doctors/:id (dynamic doctor details)
  const doctorDetailMatch = cleanUrl.match(/^\/doctors\/([^/]+)$/);
  if (doctorDetailMatch && method.toLowerCase() === 'get') {
    const doctorId = doctorDetailMatch[1];
    const doctors = getDoctorsFromStorage();
    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctor) {
      return recordAndReturn(404, { success: false, message: `Doctor with ID ${doctorId} not found` }, 'Not Found');
    }

    return recordAndReturn(200, {
      success: true,
      doctor
    });
  }

  // ==========================================
  // 3. APPOINTMENT CRUD REST APIS (Experiment 2 & 3) - PROTECTED
  // ==========================================

  // GET /api/appointments/history
  if (cleanUrl === '/appointments/history' && method.toLowerCase() === 'get') {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }

    const appointments = getAppointmentsFromStorage();
    // Return all past or completed/cancelled records
    const history = appointments.filter(apt => 
      apt.status === 'COMPLETED' || 
      apt.status === 'CANCELLED' || 
      new Date(apt.date) < new Date(new Date().setHours(0,0,0,0))
    );

    return recordAndReturn(200, {
      success: true,
      count: history.length,
      appointments: history
    });
  }

  // GET /api/appointments (Active appointments)
  if (cleanUrl === '/appointments' && method.toLowerCase() === 'get') {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }

    const appointments = getAppointmentsFromStorage();
    // Active / upcoming appointments
    const active = appointments.filter(apt => apt.status === 'CONFIRMED' || apt.status === 'RESCHEDULED');

    return recordAndReturn(200, {
      success: true,
      count: active.length,
      appointments: active
    });
  }

  // POST /api/appointments (Create Appointment)
  if (cleanUrl === '/appointments' && method.toLowerCase() === 'post') {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }

    const {
      doctorId,
      doctorName,
      specialty,
      hospital,
      date,
      timeSlot,
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      reason,
      visitType,
      fee
    } = parsedData;

    if (!doctorId || !date || !timeSlot || !patientName) {
      return recordAndReturn(400, {
        success: false,
        message: 'Missing required appointment parameters (doctorId, date, timeSlot, patientName required)'
      }, 'Bad Request');
    }

    const appointments = getAppointmentsFromStorage();

    // Check slot collision
    const isSlotTaken = appointments.some(
      apt => apt.doctorId === doctorId && apt.date === date && apt.timeSlot === timeSlot && apt.status !== 'CANCELLED'
    );

    if (isSlotTaken) {
      return recordAndReturn(409, {
        success: false,
        message: `The selected slot ${timeSlot} on ${date} is already booked. Please pick another time slot.`
      }, 'Conflict');
    }

    const newAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: authCheck.userId || 'usr-1',
      doctorId,
      doctorName: doctorName || 'Attending Specialist',
      specialty: specialty || 'General Care',
      hospital: hospital || 'Apex Memorial Medical Center',
      date,
      timeSlot,
      patientName,
      patientEmail: patientEmail || 'patient@medicare.com',
      patientPhone: patientPhone || '+1 (555) 123-4567',
      patientAge: patientAge || 30,
      patientGender: patientGender || 'Unspecified',
      reason: reason || 'General medical consultation',
      visitType: visitType || 'In-Person Consultation',
      fee: fee || 80,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    appointments.unshift(newAppointment);
    saveAppointmentsToStorage(appointments);

    return recordAndReturn(201, {
      success: true,
      message: 'Appointment scheduled successfully',
      appointment: newAppointment
    }, 'Created');
  }

  // PUT / PATCH /api/appointments/:id (Reschedule Appointment)
  const appointmentUpdateMatch = cleanUrl.match(/^\/appointments\/([^/]+)$/);
  if (appointmentUpdateMatch && (method.toLowerCase() === 'put' || method.toLowerCase() === 'patch')) {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }

    const appointmentId = appointmentUpdateMatch[1];
    const appointments = getAppointmentsFromStorage();
    const index = appointments.findIndex(apt => apt.id === appointmentId);

    if (index === -1) {
      return recordAndReturn(404, { success: false, message: `Appointment ${appointmentId} not found` }, 'Not Found');
    }

    const targetAppointment = appointments[index];
    const { date, timeSlot, reason } = parsedData;

    // Check slot collision if date or slot changed
    if ((date && date !== targetAppointment.date) || (timeSlot && timeSlot !== targetAppointment.timeSlot)) {
      const checkDate = date || targetAppointment.date;
      const checkSlot = timeSlot || targetAppointment.timeSlot;

      const isTaken = appointments.some(
        apt => apt.id !== appointmentId && apt.doctorId === targetAppointment.doctorId && apt.date === checkDate && apt.timeSlot === checkSlot && apt.status !== 'CANCELLED'
      );

      if (isTaken) {
        return recordAndReturn(409, {
          success: false,
          message: `Slot ${checkSlot} on ${checkDate} is already reserved by another patient.`
        }, 'Conflict');
      }
    }

    const updatedAppointment = {
      ...targetAppointment,
      ...(date ? { date } : {}),
      ...(timeSlot ? { timeSlot } : {}),
      ...(reason ? { reason } : {}),
      status: 'RESCHEDULED',
      updatedAt: new Date().toISOString()
    };

    appointments[index] = updatedAppointment;
    saveAppointmentsToStorage(appointments);

    return recordAndReturn(200, {
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: updatedAppointment
    });
  }

  // DELETE /api/appointments/:id (Cancel Appointment)
  if (appointmentUpdateMatch && method.toLowerCase() === 'delete') {
    const authCheck = verifyToken();
    if (!authCheck.valid) {
      return recordAndReturn(401, { success: false, message: authCheck.reason }, 'Unauthorized');
    }

    const appointmentId = appointmentUpdateMatch[1];
    const appointments = getAppointmentsFromStorage();
    const index = appointments.findIndex(apt => apt.id === appointmentId);

    if (index === -1) {
      return recordAndReturn(404, { success: false, message: `Appointment ${appointmentId} not found` }, 'Not Found');
    }

    const cancelledAppointment = {
      ...appointments[index],
      status: 'CANCELLED',
      cancellationReason: parsedData?.reason || 'Cancelled by patient',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    appointments[index] = cancelledAppointment;
    saveAppointmentsToStorage(appointments);

    return recordAndReturn(200, {
      success: true,
      message: `Appointment ${appointmentId} has been cancelled`,
      appointment: cancelledAppointment
    });
  }

  // 404 for unknown endpoints
  return recordAndReturn(404, {
    success: false,
    message: `API endpoint ${method.toUpperCase()} ${cleanUrl} not found`
  }, 'Not Found');
};
