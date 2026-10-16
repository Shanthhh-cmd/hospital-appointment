import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctorDetails,
  fetchAvailableSlots,
  setSelectedDate
} from '../store/slices/doctorSlice';
import { setDraftDoctor, setDraftDate, setDraftSlot } from '../store/slices/appointmentSlice';
import {
  Star,
  Clock,
  MapPin,
  Calendar,
  Check,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Languages,
  DollarSign,
  AlertCircle,
  Database,
  RefreshCw,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedDoctor: doctor,
    detailLoading,
    detailError,
    slots,
    bookedSlots,
    slotsLoading,
    slotsError,
    isSlotsFromCache
  } = useSelector((state) => state.doctors);

  // Default to tomorrow's date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState('');

  // 1. Fetch Dynamic Doctor Details (Exp 1d)
  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorDetails(id));
    }
  }, [id, dispatch]);

  // 2. Fetch Available Slots for Current Date (Exp 1c)
  useEffect(() => {
    if (id && currentDate) {
      dispatch(fetchAvailableSlots({ doctorId: id, date: currentDate }));
    }
  }, [id, currentDate, dispatch]);

  // Auto-select first slot when slots load
  useEffect(() => {
    if (slots && slots.length > 0) {
      setSelectedSlot(slots[0]);
    } else {
      setSelectedSlot('');
    }
  }, [slots]);

  const handleDateChange = (dateIso) => {
    setCurrentDate(dateIso);
    dispatch(setSelectedDate(dateIso));
  };

  const handleRefreshSlots = () => {
    if (id && currentDate) {
      dispatch(fetchAvailableSlots({ doctorId: id, date: currentDate, forceRefresh: true }));
    }
  };

  const handleProceedToBooking = () => {
    if (!doctor || !selectedSlot) return;

    // Save into Redux draft state (Exp 2b)
    dispatch(setDraftDoctor(doctor));
    dispatch(setDraftDate(currentDate));
    dispatch(setDraftSlot(selectedSlot));

    navigate(`/book/${doctor.id}`);
  };

  // Next 10 days for selection
  const nextDays = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  if (detailLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
        <h3 className="text-base font-bold text-slate-800">
          Loading Dynamic Doctor Profile (REST GET /api/doctors/{id})...
        </h3>
      </div>
    );
  }

  if (detailError || !doctor) {
    return (
      <div className="max-w-md mx-auto my-16 bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Doctor Profile Not Found</h3>
        <p className="text-xs text-rose-700">{detailError || `Doctor with ID ${id} was not found in the database.`}</p>
        <Link
          to="/doctors"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
        >
          Return to Doctor Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/doctors" className="hover:text-primary-600">Doctors</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{doctor.name}</span>
        </div>

        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
          Experiment 1c & 1d: Dynamic Routing & Slot API
        </span>
      </div>

      {/* Main Grid: Left Doctor Bio, Right Slot Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Doctor Profile Bio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border border-slate-100 shadow-md shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
                    {doctor.specialty}
                  </span>
                  <span className="flex items-center text-amber-500 font-bold text-xs gap-1">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                    {doctor.rating}
                    <span className="text-slate-400 font-normal">({doctor.reviewCount} patient reviews)</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {doctor.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {doctor.qualification}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span>{doctor.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span>{doctor.hospital}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Physician Biography & Clinical Focus
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            {/* Quick Details Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Education & Honors
                </span>
                <span className="font-semibold text-slate-800 line-clamp-2">
                  {doctor.education}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Languages Spoken
                </span>
                <span className="font-semibold text-slate-800">
                  {doctor.languages?.join(', ')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Consultation Fee
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  ${doctor.fee}
                </span>
              </div>
            </div>

            {/* Clinic Location */}
            <div className="p-4 bg-primary-50/60 rounded-2xl border border-primary-100 flex items-start gap-3 text-xs text-primary-900">
              <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Hospital Clinic Location:</span>
                <span>{doctor.location} • {doctor.hospital}</span>
                <p className="text-[11px] text-primary-700 mt-1">
                  Operating Hours: {doctor.timing} ({doctor.availableDays?.join(', ')})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Availability Slot Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Consultation Slot
                </h3>
                <p className="text-xs text-slate-500">Experiment 1c: REST Slot Retrieval</p>
              </div>

              {/* Cache status pill */}
              <div className="flex items-center gap-1.5">
                <span
                  title={isSlotsFromCache ? 'Loaded from state cache' : 'Fetched via REST API'}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSlotsFromCache
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}
                >
                  {isSlotsFromCache ? 'Cached (TTL 3m)' : 'Fresh API'}
                </span>
                <button
                  onClick={handleRefreshSlots}
                  disabled={slotsLoading}
                  title="Force re-fetch availability from API"
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${slotsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Step 1: Date Carousel / Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Date
              </label>
              <div className="grid grid-cols-5 gap-2">
                {nextDays.slice(0, 5).map((opt) => {
                  const isSelected = currentDate === opt.iso;
                  return (
                    <button
                      key={opt.iso}
                      type="button"
                      onClick={() => handleDateChange(opt.iso)}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400">{opt.dayName}</span>
                      <span className="text-base font-extrabold">{opt.dateNum}</span>
                      <span className="text-[10px] text-slate-500">{opt.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Choose Available Time Slot
                </label>
                {slotsLoading && (
                  <span className="text-[10px] text-primary-600 flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Querying API...
                  </span>
                )}
              </div>

              {slotsLoading ? (
                <div className="grid grid-cols-3 gap-2 py-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-10 bg-slate-100 rounded-xl"></div>
                  ))}
                </div>
              ) : slotsError ? (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{slotsError}</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-2xl border border-amber-200 text-center">
                  All slots are booked for {currentDate}. Please select another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                            : 'border-slate-200 hover:border-primary-300 text-slate-700 bg-white'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Booked slots indicator */}
              {bookedSlots.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-2">
                  * {bookedSlots.length} slot(s) already reserved on this date.
                </p>
              )}
            </div>

            {/* Selection Summary & Booking Action */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold">Scheduled Time</span>
                  <span className="font-bold text-slate-800">{currentDate} @ {selectedSlot || 'None selected'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-semibold">Total Fee</span>
                  <span className="text-base font-extrabold text-slate-900">${doctor.fee}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToBooking}
                disabled={!selectedSlot || slotsLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Proceed to Book Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
