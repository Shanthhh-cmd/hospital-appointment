import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { toggleInspector } from '../store/slices/inspectorSlice';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';
import {
  HeartPulse,
  User,
  LogOut,
  LogIn,
  Activity,
  Menu,
  X,
  Calendar,
  Clock,
  Search,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { apiLogs } = useSelector((state) => state.inspector);
  const activeAppointments = useSelector((state) => state.appointments.activeAppointments);

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'text-primary-700 bg-primary-50 font-semibold'
        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-med-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                {HOSPITAL_CONFIG.brandName}<span className="text-primary-600">{HOSPITAL_CONFIG.brandHighlight}</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1">
                {HOSPITAL_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/doctors" className={navLinkClasses}>
              <Search className="w-4 h-4" />
              Find Doctors
            </NavLink>
            <NavLink to="/appointments" className={navLinkClasses}>
              <Calendar className="w-4 h-4" />
              Appointments
              {activeAppointments.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-primary-100 text-primary-700 font-bold rounded-full">
                  {activeAppointments.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/history" className={navLinkClasses}>
              <Clock className="w-4 h-4" />
              History
            </NavLink>
          </nav>

          {/* Actions: Lab Inspector Pill & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Lab Inspector Toggle */}
            <button
              onClick={() => dispatch(toggleInspector())}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-sm transition border border-slate-700"
            >
              <Activity className="w-3.5 h-3.5 text-med-400 animate-pulse" />
              <span>Lab Inspector</span>
              <span className="px-1.5 py-0.2 bg-med-500 text-slate-950 font-bold rounded-full text-[10px]">
                {apiLogs.length}
              </span>
            </button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-semibold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user?.name || 'Patient'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-fade-in">
                    <div className="pb-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Bearer Token Active</span>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/appointments"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        My Consultations
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        Medical History
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out (Exp 4e)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => dispatch(toggleInspector())}
              className="p-2 rounded-lg bg-slate-900 text-white text-xs"
            >
              <Activity className="w-4 h-4 text-med-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Find Doctors
          </Link>
          <Link
            to="/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            My Appointments
          </Link>
          <Link
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Appointment History
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-rose-600 bg-rose-50 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
