import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '../store/slices/doctorSlice';
import { toggleInspector } from '../store/slices/inspectorSlice';
import DoctorCard from '../components/DoctorCard';
import { specialtiesList } from '../data/mockDoctors';
import {
  Search,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Activity,
  HeartPulse,
  Users,
  CheckCircle2,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, loading } = useSelector((state) => state.doctors);

  useEffect(() => {
    // Initial fetch of doctors (Exp 1a)
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleSpecialtyClick = (spec) => {
    navigate(`/doctors?specialty=${encodeURIComponent(spec)}`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold border border-primary-200 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>Full-Stack Hospital Appointment Ecosystem • 4 Experiments Covered</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Compassionate Care, <br />
              <span className="bg-gradient-to-r from-primary-600 via-med-600 to-primary-800 bg-clip-text text-transparent">
                Seamless Scheduling.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Book consultations with certified medical specialists in real time. Powered by REST APIs, Redux Toolkit State Management, full CRUD operations, and secure Token Authentication.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-primary-950/5 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-4 py-2 w-full flex-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by doctor name, specialty (e.g. Cardiology), or hospital..."
                  className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 shadow-md shadow-primary-600/25 transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Highlights row */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Slot Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>HIPAA & Token Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus / Experiments Highlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-1">
            Academic Lab Curriculum Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Experiments 1 through 4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Each laboratory experiment has dedicated implementation modules, middleware hooks, and live diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Exp 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 font-bold text-sm border border-sky-100">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                REST APIs & Async Data
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Axios API clients, doctor search, specialty filtering, dynamic time slot retrieval, and asynchronous loading & error states.
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
            >
              <span>Explore Doctors API</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Exp 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold text-sm border border-emerald-100">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Redux State & Middleware
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Redux Toolkit store managing doctors, booking drafts, and status. Custom middleware audits appointment actions and caches doctor/availability data.
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleInspector())}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group text-left"
            >
              <span>Inspect Redux Middleware</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Exp 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold text-sm border border-amber-100">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Appointment CRUD Operations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Complete REST CRUD cycle: GET (active/history), POST (booking), PUT/PATCH (rescheduling), and DELETE (cancellation).
              </p>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>Manage Appointments (CRUD)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Exp 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-bold text-sm border border-purple-100">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Authentication & Tokens
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Patient authentication, Bearer token storage, Axios request interceptors, ProtectedRoute guards, and 401 expired-token response handling.
              </p>
            </div>
            <Link
              to="/login"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>Test Token Auth</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Medical Departments
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Browse by Clinical Specialty
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {specialtiesList.filter(s => s !== 'All Specialties').map((specialty) => (
            <button
              key={specialty}
              onClick={() => handleSpecialtyClick(specialty)}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary-400 hover:shadow-md transition text-center flex flex-col items-center justify-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary-700 truncate w-full">
                {specialty}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Doctors (Experiment 1 Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Leading Physicians
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Featured Medical Consultants
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>See All ({doctors.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 3).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white rounded-3xl max-w-7xl mx-4 sm:mx-6 lg:mx-auto p-8 sm:p-12 overflow-hidden relative">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="text-xs font-bold text-med-400 uppercase tracking-widest block">
            Digital Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How The Appointment Booking System Operates
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From discovering available doctors via REST APIs to dispatching Redux state mutations monitored by custom middleware and verified with JWT Bearer tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-mono font-bold text-med-400">Step 01</span>
            <h4 className="font-bold text-sm text-white">Find Doctor & Dynamic Slots</h4>
            <p className="text-xs text-slate-400">
              Filter by medical specialty and retrieve real-time availability dates and time slots via asynchronous REST API calls.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-mono font-bold text-med-400">Step 02</span>
            <h4 className="font-bold text-sm text-white">Redux Draft & Patient Details</h4>
            <p className="text-xs text-slate-400">
              The booking draft is stored in global Redux state. Custom middleware logs the action pipeline for state transitions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-mono font-bold text-med-400">Step 03</span>
            <h4 className="font-bold text-sm text-white">Token Protected Booking</h4>
            <p className="text-xs text-slate-400">
              Axios automatically injects the JWT Bearer token into HTTP headers. Full CRUD support allows rescheduling and cancellation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
