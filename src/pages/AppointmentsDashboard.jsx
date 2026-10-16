import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import AppointmentCard from '../components/AppointmentCard';
import RescheduleModal from '../components/RescheduleModal';
import CancelModal from '../components/CancelModal';
import ConsultationSlipModal from '../components/ConsultationSlipModal';
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  Search,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AppointmentsDashboard() {
  const dispatch = useDispatch();
  const { activeAppointments, loading, error } = useSelector((state) => state.appointments);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedForReschedule, setSelectedForReschedule] = useState(null);
  const [selectedForCancel, setSelectedForCancel] = useState(null);
  const [selectedForSlip, setSelectedForSlip] = useState(null);

  // Experiment 3a: Retrieve appointments using GET
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAppointments());
  };

  // Filter appointments by doctor name or specialty
  const filteredAppointments = activeAppointments.filter((apt) => {
    const query = searchFilter.toLowerCase();
    return (
      apt.doctorName.toLowerCase().includes(query) ||
      apt.specialty.toLowerCase().includes(query) ||
      apt.id.toLowerCase().includes(query) ||
      apt.date.includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-2">
            <span>Experiment 3: REST CRUD Operations (GET, POST, PATCH, DELETE)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Appointments Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View active bookings, reschedule dates/slots (PUT/PATCH), or cancel consultations (DELETE).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload (GET)</span>
          </button>

          <Link
            to="/doctors"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter appointments by doctor, specialty, date, or ID (#APT-...)"
          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="text-xs text-slate-400 hover:text-slate-600 mr-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading Skeleton (Exp 3f) */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-16 bg-slate-100 rounded-2xl"></div>
              <div className="h-10 bg-slate-50 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state (Exp 3f) */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Failed to Fetch Appointments</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
          >
            Retry Request
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {searchFilter ? 'No Matching Appointments' : 'No Active Appointments'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchFilter
                ? 'Try adjusting your search criteria.'
                : 'You have no active appointments scheduled at this moment.'}
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Book an Appointment</span>
          </Link>
        </div>
      )}

      {/* Appointments List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onReschedule={(apt) => setSelectedForReschedule(apt)}
              onCancel={(apt) => setSelectedForCancel(apt)}
              onViewSlip={(apt) => setSelectedForSlip(apt)}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal (Exp 3c: PUT/PATCH) */}
      {selectedForReschedule && (
        <RescheduleModal
          appointment={selectedForReschedule}
          onClose={() => setSelectedForReschedule(null)}
        />
      )}

      {/* Cancel Modal (Exp 3d: DELETE) */}
      {selectedForCancel && (
        <CancelModal
          appointment={selectedForCancel}
          onClose={() => setSelectedForCancel(null)}
        />
      )}

      {/* Slip Modal */}
      {selectedForSlip && (
        <ConsultationSlipModal
          appointment={selectedForSlip}
          onClose={() => setSelectedForSlip(null)}
        />
      )}
    </div>
  );
}
