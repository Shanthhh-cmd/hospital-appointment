import React from 'react';
import { X, Printer, HeartPulse, CheckCircle2, MapPin, Calendar, Clock, User, ShieldCheck } from 'lucide-react';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

export default function ConsultationSlipModal({ appointment, onClose }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Consultation Pass & Booking Slip
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 overflow-y-auto space-y-5 print:p-0">
          {/* Hospital Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 leading-tight">
                  {HOSPITAL_CONFIG.fullName}
                </h2>
                <p className="text-[11px] text-slate-500">Outpatient Consultation Voucher</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-primary-700 block">
                #{appointment.id}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Schedule Info Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Appointment Date</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Calendar className="w-3.5 h-3.5 text-primary-600" />
                <span>{appointment.date}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Assigned Time Slot</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-med-600" />
                <span>{appointment.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Doctor & Location Details */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-slate-400">
              Doctor & Hospital Information
            </h4>
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <p className="font-bold text-sm text-slate-900">{appointment.doctorName}</p>
              <p className="text-primary-600 font-medium text-xs">{appointment.specialty}</p>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{appointment.hospital}</span>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-slate-400">
              Patient Details
            </h4>
            <div className="p-3 bg-white rounded-xl border border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Name:</span>
                <span className="font-semibold text-slate-800">{appointment.patientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Contact Phone:</span>
                <span className="font-semibold text-slate-800">{appointment.patientPhone || 'On File'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Consultation Type:</span>
                <span className="font-semibold text-slate-800">{appointment.visitType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Consultation Fee:</span>
                <span className="font-extrabold text-slate-900">${appointment.fee || 80} (Paid/Authorized)</span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Patient Instructions:
            </p>
            <p>• Please arrive 15 minutes before your time slot for preliminary vitals check.</p>
            <p>• Carry this slip or show your digital appointment ID #{appointment.id} at reception Desk A.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
