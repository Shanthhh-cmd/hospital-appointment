import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentHistory } from '../store/slices/appointmentSlice';
import AppointmentCard from '../components/AppointmentCard';
import ConsultationSlipModal from '../components/ConsultationSlipModal';
import {
  Clock,
  History,
  RefreshCw,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export default function AppointmentHistory() {
  const dispatch = useDispatch();
  const { history, historyLoading, historyError } = useSelector((state) => state.appointments);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Experiment 3e: Retrieve appointment history using GET
  useEffect(() => {
    dispatch(fetchAppointmentHistory());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAppointmentHistory());
  };

  const filteredHistory = history.filter((apt) => {
    if (statusFilter === 'COMPLETED') return apt.status === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return apt.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 mb-2">
            <span>Experiment 3e: Retrieve Appointment History (GET)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultation & Visit History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Archived record of all completed medical consultations and cancelled appointments.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={historyLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary-600 ${historyLoading ? 'animate-spin' : ''}`} />
          <span>Reload History (GET)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Records ({history.length})
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'COMPLETED'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed ({history.filter(a => a.status === 'COMPLETED').length})
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'CANCELLED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Cancelled ({history.filter(a => a.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Loading Skeleton */}
      {historyLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-14 bg-slate-100 rounded-2xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!historyLoading && historyError && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Failed to Retrieve History</h3>
            <p className="text-xs text-rose-700 mt-1">{historyError}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
          >
            Retry History Request
          </button>
        </div>
      )}

      {/* Empty State */}
      {!historyLoading && !historyError && filteredHistory.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No History Records</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no {statusFilter.toLowerCase()} consultations recorded in your medical history file.
            </p>
          </div>
        </div>
      )}

      {/* History Grid */}
      {!historyLoading && !historyError && filteredHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isHistory={true}
              onViewSlip={(apt) => setSelectedSlip(apt)}
            />
          ))}
        </div>
      )}

      {/* Slip Modal */}
      {selectedSlip && (
        <ConsultationSlipModal
          appointment={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}
    </div>
  );
}
