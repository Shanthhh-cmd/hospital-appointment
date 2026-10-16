import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LabInspectorModal from './components/LabInspectorModal';
import ToastNotification from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import AppointmentsDashboard from './pages/AppointmentsDashboard';
import AppointmentHistory from './pages/AppointmentHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import { initializeDatabase } from './services/mockBackend';

export default function App() {
  useEffect(() => {
    // Seed initial mock database if not already present
    initializeDatabase();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />

          {/* Protected Routes (Experiment 4d) */}
          <Route
            path="/book/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppointmentHistory />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Lab Inspector Panel Drawer */}
      <LabInspectorModal />

      {/* Global Toast Notification System */}
      <ToastNotification />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
