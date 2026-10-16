import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Lock, LogIn, ArrowRight } from 'lucide-react';

/**
 * Protected Route Guard (Experiment 4d)
 * Protects booking, rescheduling, cancellation, and history operations from unauthenticated access.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            This operation is protected under <strong>Hospital Security & Token Management (Experiment 4)</strong>. Please log in with your patient account to access appointments, reschedule, or book a consultation.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              state={{ from: location }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 shadow-md transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </Link>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
