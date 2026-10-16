import { configureStore } from '@reduxjs/toolkit';
import authReducer, { handleSessionExpired } from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import inspectorReducer, { addApiLog } from './slices/inspectorSlice';
import { appointmentMonitorMiddleware } from './middleware/appointmentMonitorMiddleware';
import { setOnUnauthorizedCallback } from '../services/api';
import { subscribeApiTraffic } from '../services/mockBackend';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    inspector: inspectorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(appointmentMonitorMiddleware)
});

// Connect Axios 401 Interceptor to dispatch session expiry (Experiment 4f)
setOnUnauthorizedCallback((reason) => {
  store.dispatch(handleSessionExpired(reason));
});

// Connect API mock traffic logger to Inspector Redux slice
subscribeApiTraffic((trafficEntry) => {
  store.dispatch(addApiLog(trafficEntry));
});

export default store;
