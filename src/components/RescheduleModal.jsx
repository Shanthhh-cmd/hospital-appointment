import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rescheduleAppointment } from '../store/slices/appointmentSlice';
import { doctorService } from '../services/doctorService';
import { Calendar, Clock, X, AlertCircle, Check, Loader2 } from 'lucide-react';

export default function RescheduleModal({ appointment, onClose }) {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.appointments);

  // Form states
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [reason, setReason] = useState(appointment?.reason || '');

  // Fetch available slots when doctor and date change
  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      if (!appointment?.doctorId || !selectedDate) return;
      setSlotsLoading(true);
      setSlotsError(null);
      try {
        const data = await doctorService.getAvailableSlots(appointment.doctorId, selectedDate);
        if (isMounted) {
          setSlots(data.availableSlots || []);
          if (data.availableSlots?.length > 0) {
            setSelectedSlot(data.availableSlots[0]);
          } else {
            setSelectedSlot('');
          }
        }
      } catch (err) {
        if (isMounted) {
          setSlotsError(err.response?.data?.message || 'Failed to load availability slots');
        }
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    fetchSlots();
    return () => { isMounted = false; };
  }, [appointment?.doctorId, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const result = await dispatch(
      rescheduleAppointment({
        id: appointment.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason
      })
    );

    if (!result.error) {
      onClose();
    }
  };

  // Next 10 days for convenient date buttons
  const dateOptions = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide">
              Experiment 3c: PUT / PATCH
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              Reschedule Appointment #{appointment.id}
            </h3>
            <p className="text-xs text-slate-500">
              Doctor: {appointment.doctorName} ({appointment.specialty})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Current schedule banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Currently Booked</span>
              <span className="font-semibold text-slate-800">{appointment.date} at {appointment.timeSlot}</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium">
              {appointment.visitType}
            </span>
          </div>

          {/* Select New Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select New Date
            </label>
            <div className="grid grid-cols-4 gap-2">
              {dateOptions.map((opt) => {
                const isSelected = selectedDate === opt.iso;
                return (
                  <button
                    key={opt.iso}
                    type="button"
                    onClick={() => setSelectedDate(opt.iso)}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
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

          {/* Available Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select New Time Slot
              </label>
              {slotsLoading && (
                <span className="text-[11px] text-primary-600 flex items-center gap-1 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Checking availability...
                </span>
              )}
            </div>

            {slotsError ? (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{slotsError}</span>
              </div>
            ) : slots.length === 0 && !slotsLoading ? (
              <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-2xl border border-amber-200 text-center">
                No slots available on this date. Please pick another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
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
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Rescheduling
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Schedule conflict / preference for morning slot"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || !selectedSlot}
              className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending PATCH...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Confirm Reschedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
