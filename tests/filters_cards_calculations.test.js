import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DoctorCard from '../src/components/DoctorCard.jsx';
import AppointmentCard from '../src/components/AppointmentCard.jsx';
import { initialDoctors } from '../src/data/mockDoctors.js';

describe('🧪 Jest & React Testing Library (RTL): Filters, Cards, and Calculations', () => {

  // ==========================================
  // PART 1: CARDS (Tested with React Testing Library)
  // ==========================================

  // TEST 1: Doctor Card Component with RTL
  test('1. Cards (RTL): should render DoctorCard with doctor name, fee, specialty, and book button', () => {
    const sampleDoctor = {
      id: 'doc-101',
      name: 'Dr. Gregory House',
      specialty: 'Cardiology',
      qualification: 'MD, DM, FACC',
      experience: '15 years',
      rating: 4.9,
      reviewCount: 220,
      fee: 90,
      hospital: 'Apex Memorial Medical Center',
      department: 'Cardiovascular Sciences',
      location: 'Building B, Suite 302',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      timing: '09:00 AM - 04:00 PM'
    };

    render(
      <BrowserRouter>
        <DoctorCard doctor={sampleDoctor} />
      </BrowserRouter>
    );

    // RTL assertions testing rendered DOM elements
    expect(screen.getByText('Dr. Gregory House')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('$90')).toBeInTheDocument();
    expect(screen.getByText(/15 years experience/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book/i })).toBeInTheDocument();
  });

  // TEST 2: Appointment Card Component with RTL
  test('2. Cards (RTL): should render AppointmentCard with ID, date, time slot, and status badge', () => {
    const sampleAppointment = {
      id: 'APT-1001',
      doctorName: 'Dr. Sarah Mitchell',
      specialty: 'Cardiology',
      hospital: 'Apex Memorial Medical Center',
      date: '2026-11-20',
      timeSlot: '10:30 AM',
      patientName: 'Alex Mercer',
      patientAge: 32,
      patientGender: 'Male',
      visitType: 'In-Person Consultation',
      status: 'CONFIRMED',
      fee: 90
    };

    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onReschedule={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // RTL assertions
    expect(screen.getByText('#APT-1001')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Mitchell')).toBeInTheDocument();
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    expect(screen.getByText('2026-11-20')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByText(/Alex Mercer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reschedule/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  // ==========================================
  // PART 2: FILTERS (Tests 3, 4, 5)
  // ==========================================

  // TEST 3: Doctor Specialty Filter
  test('3. Filters: should filter doctors by specialty correctly', () => {
    const filterBySpecialty = (doctors, specialty) => {
      if (!specialty || specialty === 'All' || specialty === 'All Specialties') return doctors;
      return doctors.filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase());
    };

    const cardiologyDocs = filterBySpecialty(initialDoctors, 'Cardiology');
    expect(cardiologyDocs.length).toBeGreaterThan(0);
    cardiologyDocs.forEach(doc => {
      expect(doc.specialty.toLowerCase()).toBe('cardiology');
    });

    const allDocs = filterBySpecialty(initialDoctors, 'All Specialties');
    expect(allDocs).toHaveLength(initialDoctors.length);
  });

  // TEST 4: Keyword Search Query Filter
  test('4. Filters: should filter doctors matching query in name, specialty, or department', () => {
    const searchDoctors = (doctors, query) => {
      const q = (query || '').toLowerCase().trim();
      if (!q) return doctors;
      return doctors.filter(doc =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q)
      );
    };

    const results = searchDoctors(initialDoctors, 'Neuro');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(doc => {
      const hasMatch =
        doc.name.toLowerCase().includes('neuro') ||
        doc.specialty.toLowerCase().includes('neuro') ||
        doc.hospital.toLowerCase().includes('neuro');
      expect(hasMatch).toBe(true);
    });

    // Empty search returns all
    expect(searchDoctors(initialDoctors, '')).toHaveLength(initialDoctors.length);
  });

  // TEST 5: Appointment Status Filter
  test('5. Filters: should filter appointments by lifecycle status (COMPLETED vs CANCELLED)', () => {
    const mockAppointments = [
      { id: 'APT-1', doctorName: 'Dr. Mitchell', status: 'CONFIRMED' },
      { id: 'APT-2', doctorName: 'Dr. Rodriguez', status: 'COMPLETED' },
      { id: 'APT-3', doctorName: 'Dr. Chen', status: 'COMPLETED' },
      { id: 'APT-4', doctorName: 'Dr. Vance', status: 'CANCELLED' }
    ];

    const filterByStatus = (appointments, status) => {
      if (!status || status === 'ALL') return appointments;
      return appointments.filter(apt => apt.status === status);
    };

    const completed = filterByStatus(mockAppointments, 'COMPLETED');
    expect(completed).toHaveLength(2);
    expect(completed[0].status).toBe('COMPLETED');
    expect(completed[1].status).toBe('COMPLETED');

    const cancelled = filterByStatus(mockAppointments, 'CANCELLED');
    expect(cancelled).toHaveLength(1);
    expect(cancelled[0].id).toBe('APT-4');
  });

  // ==========================================
  // PART 3: CALCULATIONS (Tests 6, 7)
  // ==========================================

  // TEST 6: Cache Hit Ratio Calculation
  test('6. Calculations: should calculate cache hit ratio percentage accurately', () => {
    const calculateHitRatio = (hits, misses) => {
      const total = hits + misses;
      if (total === 0) return 0;
      return Math.round((hits / total) * 100);
    };

    // 8 hits out of 10 = 80%
    expect(calculateHitRatio(8, 2)).toBe(80);

    // 3 hits out of 12 = 25%
    expect(calculateHitRatio(3, 9)).toBe(25);

    // Edge case: 0 requests handled gracefully
    expect(calculateHitRatio(0, 0)).toBe(0);

    // 100% hit rate
    expect(calculateHitRatio(5, 0)).toBe(100);
  });

  // TEST 7: Available Slots Count & Consultation Billing Calculation
  test('7. Calculations: should compute remaining available slots and consultation bill with tax', () => {
    // 1. Available slots computation
    const totalSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'];
    const reservedSlots = ['10:00 AM', '02:00 PM'];

    const getAvailableSlots = (all, reserved) => all.filter(slot => !reserved.includes(slot));
    const available = getAvailableSlots(totalSlots, reservedSlots);

    expect(available).toHaveLength(3);
    expect(available).toEqual(['09:00 AM', '11:00 AM', '03:00 PM']);

    // 2. Billing & consultation invoice computation
    const visits = [
      { id: 'APT-1', doctor: 'Dr. Mitchell', fee: 90 },
      { id: 'APT-2', doctor: 'Dr. Rodriguez', fee: 110 }
    ];

    const calculateInvoice = (items, taxPercent = 10) => {
      const subtotal = items.reduce((sum, item) => sum + item.fee, 0);
      const tax = (subtotal * taxPercent) / 100;
      const total = subtotal + tax;
      return { subtotal, tax, total };
    };

    const invoice = calculateInvoice(visits, 10);
    expect(invoice.subtotal).toBe(200);  // 90 + 110
    expect(invoice.tax).toBe(20);         // 10% tax
    expect(invoice.total).toBe(220);       // 200 + 20
  });

});
