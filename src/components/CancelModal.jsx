import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelAppointment } from '../store/slices/appointmentSlice';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export default function CancelModal({ appointment, onClose }) {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.appointments);
  const [reason, setReason] = useState('Personal schedule conflict');

  const cancellationReasons = [
    'Personal schedule conflict',
    'Symptoms have resolved',
    'Found another doctor/specialist',
    'Doctor asked to reschedule',
    'Transportation/travel issue',
    'Other'
  ];

  const handleConfirmCancel = async () => {
    const result = await dispatch(
      cancelAppointment({
        id: appointment.id,
        reason
      })
    );

    if (!result.error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                Experiment 3d: DELETE Request
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Cancel Appointment #{appointment.id}?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to cancel your scheduled consultation with{' '}
            <strong className="text-slate-900">{appointment.doctorName}</strong> on{' '}
            <span className="font-semibold text-slate-800">{appointment.date}</span> at{' '}
            <span className="font-semibold text-slate-800">{appointment.timeSlot}</span>?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select Cancellation Reason
            </span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {cancellationReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-slate-400">
            * This action will send an authenticated <code className="text-rose-600 font-mono">DELETE /api/appointments/{appointment.id}</code> call. The slot will become available for other patients, and this appointment will be archived into History.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirmCancel}
            disabled={actionLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Cancelling (DELETE)...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Confirm Cancellation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
