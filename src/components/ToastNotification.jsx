import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAppointmentNotifications } from '../store/slices/appointmentSlice';
import { clearAuthErrors } from '../store/slices/authSlice';
import { CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function ToastNotification() {
  const dispatch = useDispatch();
  const appointmentSuccess = useSelector((state) => state.appointments.successNotification);
  const appointmentError = useSelector((state) => state.appointments.actionError || state.appointments.error);
  const authError = useSelector((state) => state.auth.error);
  const sessionExpired = useSelector((state) => state.auth.sessionExpiredNotice);

  useEffect(() => {
    if (appointmentSuccess || appointmentError || authError) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentNotifications());
        dispatch(clearAuthErrors());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [appointmentSuccess, appointmentError, authError, dispatch]);

  const handleClose = () => {
    dispatch(clearAppointmentNotifications());
    dispatch(clearAuthErrors());
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {/* Session Expired / Unauthorized 401 Toast (Experiment 4f) */}
      {sessionExpired && (
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-start justify-between gap-3 animate-fade-in border border-red-500">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Session Expired (HTTP 401)</p>
              <p className="text-xs text-red-100 mt-0.5">{sessionExpired}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearAuthErrors())}
            className="text-red-200 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Notification */}
      {appointmentSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-start justify-between gap-3 animate-fade-in border border-emerald-500">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Action Successful</p>
              <p className="text-xs text-emerald-100 mt-0.5">{appointmentSuccess}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-emerald-200 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General Error Notification */}
      {(appointmentError || authError) && (
        <div className="bg-rose-600 text-white p-4 rounded-xl shadow-2xl flex items-start justify-between gap-3 animate-fade-in border border-rose-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Request Error</p>
              <p className="text-xs text-rose-100 mt-0.5">{appointmentError || authError}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-rose-200 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
