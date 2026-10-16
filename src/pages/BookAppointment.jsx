import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookAppointment,
  setDraftDoctor,
  setDraftDate,
  setDraftSlot,
  setDraftPatientDetails,
  setDraftStep,
  resetBookingDraft
} from '../store/slices/appointmentSlice';
import { fetchDoctorDetails, fetchAvailableSlots } from '../store/slices/doctorSlice';
import ConsultationSlipModal from '../components/ConsultationSlipModal';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  FileText,
  MapPin,
  HeartPulse,
  Layers,
  Sparkles
} from 'lucide-react';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { bookingDraft, actionLoading, actionError } = useSelector((state) => state.appointments);
  const { selectedDoctor, slots, slotsLoading } = useSelector((state) => state.doctors);

  const [currentStep, setCurrentStep] = useState(bookingDraft.currentStep || 1);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Form field states
  const [patientName, setPatientName] = useState(
    bookingDraft.patientDetails?.name || auth.user?.name || 'Alex Mercer'
  );
  const [patientEmail, setPatientEmail] = useState(
    bookingDraft.patientDetails?.email || auth.user?.email || 'patient@medicare.com'
  );
  const [patientPhone, setPatientPhone] = useState(
    bookingDraft.patientDetails?.phone || auth.user?.phone || '+1 (555) 789-4321'
  );
  const [patientAge, setPatientAge] = useState(bookingDraft.patientDetails?.age || 32);
  const [patientGender, setPatientGender] = useState(bookingDraft.patientDetails?.gender || 'Male');
  const [reason, setReason] = useState(bookingDraft.patientDetails?.reason || '');
  const [visitType, setVisitType] = useState(
    bookingDraft.patientDetails?.visitType || 'In-Person Consultation'
  );

  // Load doctor details if not already in draft or state
  useEffect(() => {
    if (doctorId && (!bookingDraft.doctor || bookingDraft.doctor.id !== doctorId)) {
      dispatch(fetchDoctorDetails(doctorId)).then((res) => {
        if (res.payload) {
          dispatch(setDraftDoctor(res.payload));
        }
      });
    }
  }, [doctorId, bookingDraft.doctor, dispatch]);

  // Load slots for draft date
  useEffect(() => {
    const docId = doctorId || bookingDraft.doctor?.id;
    if (docId && bookingDraft.date) {
      dispatch(fetchAvailableSlots({ doctorId: docId, date: bookingDraft.date }));
    }
  }, [doctorId, bookingDraft.doctor?.id, bookingDraft.date, dispatch]);

  const activeDoctor = bookingDraft.doctor || selectedDoctor;

  const handleNextToPatientInfo = () => {
    if (!bookingDraft.timeSlot) {
      alert('Please select an appointment time slot first.');
      return;
    }
    setCurrentStep(2);
    dispatch(setDraftStep(2));
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !patientPhone) {
      alert('Please complete all required patient contact fields.');
      return;
    }

    dispatch(
      setDraftPatientDetails({
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        age: patientAge,
        gender: patientGender,
        reason,
        visitType
      })
    );

    setCurrentStep(3);
    dispatch(setDraftStep(3));
  };

  const handleExecuteBooking = async () => {
    if (!activeDoctor || !bookingDraft.date || !bookingDraft.timeSlot) return;

    const payload = {
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      specialty: activeDoctor.specialty,
      hospital: activeDoctor.hospital,
      date: bookingDraft.date,
      timeSlot: bookingDraft.timeSlot,
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      reason: reason || 'Standard consultation',
      visitType,
      fee: activeDoctor.fee
    };

    // Experiment 3b: POST /api/appointments
    // Experiment 2d: Monitored by appointmentMonitorMiddleware
    const result = await dispatch(bookAppointment(payload));

    if (!result.error) {
      setConfirmedAppointment(result.payload);
      setCurrentStep(4); // 4 = Success confirmation screen
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
          Experiment 2 (State Management) & 3b (POST CRUD)
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Book Doctor Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Complete the appointment wizard. Global Redux store maintains draft state; actions are logged by audit middleware.
        </p>
      </div>

      {/* Wizard Progress Steps (1 to 3) */}
      {currentStep < 4 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              Doctor & Slot
            </span>
          </div>

          <div className={`h-0.5 w-12 transition ${currentStep >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              Patient Info
            </span>
          </div>

          <div className={`h-0.5 w-12 transition ${currentStep >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              Review & Book
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: DOCTOR & SLOT SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Step 1: Confirm Doctor & Choose Appointment Slot
          </h2>

          {activeDoctor ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={activeDoctor.avatar}
                alt={activeDoctor.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-primary-600 uppercase">
                  {activeDoctor.specialty}
                </span>
                <h3 className="font-bold text-base text-slate-900 truncate">
                  {activeDoctor.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {activeDoctor.hospital} • Fee: <strong>${activeDoctor.fee}</strong>
                </p>
              </div>
              <Link
                to="/doctors"
                className="text-xs text-primary-600 font-semibold hover:underline shrink-0"
              >
                Change Doctor
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-800">
              No doctor selected. <Link to="/doctors" className="font-bold underline">Select a doctor</Link> first.
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              value={bookingDraft.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => dispatch(setDraftDate(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Time Slots for {bookingDraft.date}
              </label>
              {slotsLoading && (
                <span className="text-[11px] text-primary-600 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading slots...
                </span>
              )}
            </div>

            {slots.length === 0 && !slotsLoading ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 text-center">
                No slots available on this date. Please pick another date above.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {slots.map((slot) => {
                  const isSelected = bookingDraft.timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => dispatch(setDraftSlot(slot))}
                      className={`p-3 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 1 Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleNextToPatientInfo}
              disabled={!activeDoctor || !bookingDraft.timeSlot}
              className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              <span>Next: Patient Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PATIENT DETAILS */}
      {currentStep === 2 && (
        <form
          onSubmit={handleNextToReview}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
        >
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Step 2: Patient Information & Visit Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Consultation Type
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="In-Person Consultation">In-Person Consultation (Hospital Clinic)</option>
                <option value="Video Consultation">Video Consultation (Telehealth)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Visit / Symptoms
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chest discomfort, annual screening, prescription renewal"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 shadow-md transition flex items-center gap-2"
            >
              <span>Review Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Step 3: Review & Confirm Appointment
          </h2>

          {actionError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Doctor & Schedule */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Appointment Schedule
              </span>
              <div className="space-y-1">
                <p className="font-bold text-base text-slate-900">{activeDoctor?.name}</p>
                <p className="text-primary-700 font-semibold">{activeDoctor?.specialty}</p>
                <p className="text-slate-500">{activeDoctor?.hospital}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700 font-medium">
                <span>Date: <strong>{bookingDraft.date}</strong></span>
                <span>Time: <strong>{bookingDraft.timeSlot}</strong></span>
              </div>
            </div>

            {/* Right: Patient & Billing */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Patient & Consultation Summary
              </span>
              <div className="space-y-1">
                <p className="font-bold text-slate-900">{patientName} ({patientAge} yrs, {patientGender})</p>
                <p className="text-slate-600">{patientEmail} • {patientPhone}</p>
                <p className="text-slate-500">Visit Type: <strong>{visitType}</strong></p>
                {reason && <p className="text-slate-500">Symptoms: {reason}</p>}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Total Consultation Fee:</span>
                <span className="text-lg font-extrabold text-slate-900">${activeDoctor?.fee || 80}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Experiment 4c Active:</strong> Your session Bearer token is automatically attached to this request via Axios interceptors.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={actionLoading}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleExecuteBooking}
              disabled={actionLoading}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing POST /api/appointments...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CELEBRATION & SUCCESS CONFIRMATION */}
      {currentStep === 4 && confirmedAppointment && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl text-center max-w-xl mx-auto space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Appointment #{confirmedAppointment.id}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Consultation Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Your appointment with <strong>{confirmedAppointment.doctorName}</strong> on{' '}
              <span className="font-semibold text-slate-900">{confirmedAppointment.date}</span> at{' '}
              <span className="font-semibold text-slate-900">{confirmedAppointment.timeSlot}</span> has been confirmed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowSlipModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View / Print Slip</span>
            </button>

            <Link
              to="/appointments"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Go to My Appointments
            </Link>
          </div>
        </div>
      )}

      {/* Slip Modal */}
      {showSlipModal && confirmedAppointment && (
        <ConsultationSlipModal
          appointment={confirmedAppointment}
          onClose={() => setShowSlipModal(false)}
        />
      )}
    </div>
  );
}
