import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser, clearAuthErrors, setSimulateExpiredToken } from '../store/slices/authSlice';
import {
  LogIn,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Key,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('patient@medicare.com');
  const [password, setPassword] = useState('password123');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, token, user } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/appointments';

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearAuthErrors());
    const result = await dispatch(loginUser({ email, password }));
    if (!result.error) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('patient@medicare.com');
    setPassword('password123');
    dispatch(clearAuthErrors());
    const result = await dispatch(loginUser({ email: 'patient@medicare.com', password: 'password123' }));
    if (!result.error) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto border border-primary-100">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Experiment 4: Hospital Authentication
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Patient Portal Sign In
            </h2>
            <p className="text-xs text-slate-500">
              Authenticate using REST login API and manage your secure Bearer session token.
            </p>
          </div>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-primary-50 to-med-50 border border-primary-200 text-primary-800 text-xs font-semibold hover:from-primary-100 hover:to-med-100 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>One-Click Demo Patient Login</span>
            </div>
            <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-bold">
              Instant
            </span>
          </button>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@medicare.com"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials (POST)...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Generate Token</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Don't have a patient account? </span>
            <Link to="/register" className="text-primary-600 font-bold hover:underline">
              Register Now
            </Link>
          </div>
        </div>

        {/* Experiment 4 Educational Note */}
        <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Key className="w-3.5 h-3.5 text-primary-600" />
            <span>How Experiment 4 Works in this Web App:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            1. Login returns a JWT Bearer token stored in <code className="text-slate-800 font-mono">localStorage</code>.
            <br />
            2. Axios Request Interceptor injects <code className="text-slate-800 font-mono">Authorization: Bearer &lt;token&gt;</code> into every CRUD call.
            <br />
            3. Axios Response Interceptor catches 401 Unauthorized responses and triggers automatic logout.
          </p>
        </div>
      </div>
    </div>
  );
}
