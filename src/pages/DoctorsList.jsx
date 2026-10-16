import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctors,
  setSearchQuery,
  setSelectedSpecialty,
  clearDoctorError
} from '../store/slices/doctorSlice';
import DoctorCard from '../components/DoctorCard';
import { specialtiesList } from '../data/mockDoctors';
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DoctorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    doctors,
    loading,
    error,
    searchQuery,
    selectedSpecialty,
    isDataFromCache,
    lastFetched
  } = useSelector((state) => state.doctors);

  // Local search input
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchQuery || '');
  const [selectedSpec, setSelectedSpec] = useState(
    searchParams.get('specialty') || selectedSpecialty || 'All Specialties'
  );

  // Sync URL search params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSpec = searchParams.get('specialty') || 'All Specialties';

    setSearchTerm(urlSearch);
    setSelectedSpec(urlSpec);

    dispatch(fetchDoctors({ search: urlSearch, specialty: urlSpec }));
  }, [searchParams, dispatch]);

  const handleApplyFilter = (newSearch, newSpec) => {
    const params = {};
    if (newSearch) params.search = newSearch;
    if (newSpec && newSpec !== 'All' && newSpec !== 'All Specialties') {
      params.specialty = newSpec;
    }
    setSearchParams(params);
    dispatch(fetchDoctors({ search: newSearch, specialty: newSpec }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleApplyFilter(searchTerm, selectedSpec);
  };

  const handleSpecialtyChange = (spec) => {
    setSelectedSpec(spec);
    handleApplyFilter(searchTerm, spec);
  };

  const handleForceRefresh = () => {
    dispatch(fetchDoctors({ search: searchTerm, specialty: selectedSpec, forceRefresh: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Experiment 1 Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 mb-2">
            <span>Experiment 1: REST APIs, Axios & Async Filtering</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultant Doctor Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse hospital physicians, query specialties via REST endpoints, and inspect cached availability.
          </p>
        </div>

        {/* Cache status & force refresh (Exp 2e) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Source:{' '}
              <strong className={isDataFromCache ? 'text-emerald-600' : 'text-sky-600'}>
                {isDataFromCache ? 'State Cache (TTL 5m)' : 'Live REST API'}
              </strong>
            </span>
          </div>

          <button
            onClick={handleForceRefresh}
            disabled={loading}
            title="Bypass Cache & Request Fresh Data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh API</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Controls (Exp 1b) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name, specialty, or medical center..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 shadow-md transition flex items-center justify-center gap-2 shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span>Filter Results</span>
          </button>
        </form>

        {/* Specialty Filter Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter By Specialty
            </span>
            {(searchTerm || (selectedSpec && selectedSpec !== 'All Specialties')) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpec('All Specialties');
                  handleApplyFilter('', 'All Specialties');
                }}
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {specialtiesList.map((spec) => {
              const isSelected = selectedSpec === spec;
              return (
                <button
                  key={spec}
                  onClick={() => handleSpecialtyChange(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading State Skeleton (Exp 1f) */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex gap-4">
                <div className="w-18 h-18 bg-slate-200 rounded-2xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-12 bg-slate-50 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry (Exp 1f) */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Failed to Retrieve Doctors</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
          <button
            onClick={handleForceRefresh}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
          >
            Retry API Request
          </button>
        </div>
      )}

      {/* Empty Search Results */}
      {!loading && !error && doctors.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              We couldn't find any doctor matching your filter criteria. Try searching with different keywords or reset specialty filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpec('All Specialties');
              handleApplyFilter('', 'All Specialties');
            }}
            className="px-4 py-2 bg-primary-50 text-primary-700 text-xs font-semibold rounded-xl hover:bg-primary-100 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && !error && doctors.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
            <span>Showing <strong>{doctors.length}</strong> available specialists</span>
            {lastFetched && (
              <span>Last response @ {new Date(lastFetched).toLocaleTimeString()}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
