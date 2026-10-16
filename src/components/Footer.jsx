import React from 'react';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-med-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {HOSPITAL_CONFIG.brandName}<span className="text-primary-400">{HOSPITAL_CONFIG.brandHighlight}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern digital hospital appointment scheduling ecosystem providing real-time doctor availability, state management, and protected REST APIs.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Compliant & ISO-27001 Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home Dashboard</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-white transition">Doctor Catalog & Filters</Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-white transition">Manage Appointments (CRUD)</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition">Consultation History</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Patient Portal Sign-In</Link>
              </li>
            </ul>
          </div>

          {/* Lab Experiments Covered */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Lab Syllabus Coverage</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Exp 1:</strong> REST APIs, Axios, Async/Await, Filters</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Exp 2:</strong> Redux Toolkit Store, Middleware, Caching</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Exp 3:</strong> Full CRUD (GET, POST, PATCH, DELETE)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Exp 4:</strong> JWT Token Auth, Headers & 401 Interceptors</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Hospital Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Hospital Support</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>Emergency: {HOSPITAL_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{HOSPITAL_CONFIG.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_CONFIG.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {HOSPITAL_CONFIG.fullName}. Academic Web Technology Lab Project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with React, Redux Toolkit & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
