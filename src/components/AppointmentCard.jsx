import React from 'react';
import { Calendar, Clock, MapPin, User, FileText, RefreshCw, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AppointmentCard({ appointment, onReschedule, onCancel, onViewSlip, isHistory = false }) {
  if (!appointment) return null;

  const isConfirmed = appointment.status === 'CONFIRMED';
  const isRescheduled = appointment.status === 'RESCHEDULED';
  const isCancelled = appointment.status === 'CANCELLED';
  const isCompleted = appointment.status === 'COMPLETED';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between">
      {/* Top row: Status, ID & Date */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">
              #{appointment.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isConfirmed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isRescheduled
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : isCompleted
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {appointment.visitType}
          </span>
        </div>

        {/* Doctor and specialty */}
        <div className="mb-4">
          <h3 className="font-bold text-base text-slate-900">
            {appointment.doctorName}
          </h3>
          <p className="text-xs text-primary-600 font-medium">
            {appointment.specialty} • {appointment.hospital}
          </p>
        </div>

        {/* Schedule grid */}
        <div className="bg-slate-50 rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs text-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary-600 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Date</span>
              <span className="font-bold">{appointment.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-med-600 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Time Slot</span>
              <span className="font-bold">{appointment.timeSlot}</span>
            </div>
          </div>
        </div>

        {/* Patient Details & Reason */}
        <div className="space-y-1.5 text-xs text-slate-600 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Patient:</strong> {appointment.patientName} ({appointment.patientAge || '30'} yrs, {appointment.patientGender || 'Adult'})
            </span>
          </div>
          {appointment.reason && (
            <div className="flex items-start gap-2 text-slate-500 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                <strong>Reason:</strong> {appointment.reason}
              </span>
            </div>
          )}
          {isCancelled && appointment.cancellationReason && (
            <div className="flex items-start gap-2 text-rose-600 text-[11px] bg-rose-50 p-2 rounded-lg mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Cancelled Reason:</strong> {appointment.cancellationReason}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700">
          Fee: <span className="text-slate-900">${appointment.fee || 80}</span>
        </span>

        <div className="flex items-center gap-2">
          {onViewSlip && (
            <button
              onClick={() => onViewSlip(appointment)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Slip
            </button>
          )}

          {!isHistory && !isCancelled && (
            <>
              <button
                onClick={() => onReschedule(appointment)}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition flex items-center gap-1"
                title="Reschedule Appointment (PUT/PATCH)"
              >
                <RefreshCw className="w-3 h-3" />
                Reschedule
              </button>
              <button
                onClick={() => onCancel(appointment)}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition flex items-center gap-1"
                title="Cancel Appointment (DELETE)"
              >
                <Trash2 className="w-3 h-3" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
