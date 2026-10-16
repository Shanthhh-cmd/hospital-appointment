import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Calendar, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top: Avatar & Basic Info */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-inner group-hover:scale-105 transition duration-300"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                {doctor.specialty}
              </span>
              <span className="flex items-center text-amber-500 font-bold text-xs gap-1 ml-auto shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                {doctor.rating}
                <span className="text-slate-400 font-normal text-[11px]">({doctor.reviewCount})</span>
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 group-hover:text-primary-600 transition truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 truncate">{doctor.qualification}</p>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.experience} experience</span>
            </div>
          </div>
        </div>

        {/* Middle: Hospital & Department */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.department}</span>
          </div>
        </div>

        {/* Available Schedule Tag */}
        <div className="mt-3 bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-med-600" />
            <span className="text-[11px] font-medium">{doctor.timing}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            Available Slots
          </span>
        </div>
      </div>

      {/* Card Footer: Fee & Action */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Consultation Fee</span>
          <span className="text-base font-extrabold text-slate-900">${doctor.fee}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition"
          >
            Details (Exp 1d)
          </Link>
          <Link
            to={`/book/${doctor.id}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition flex items-center gap-1"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
