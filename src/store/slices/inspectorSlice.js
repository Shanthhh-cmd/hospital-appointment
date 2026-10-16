import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  activeTab: 'api', // 'api' | 'middleware' | 'cache' | 'experiments'
  apiLogs: [],
  auditLogs: [],
  cacheStats: {
    hits: 0,
    misses: 0,
    cachedKeys: []
  }
};

export const inspectorSlice = createSlice({
  name: 'inspector',
  initialState,
  reducers: {
    toggleInspector: (state) => {
      state.isOpen = !state.isOpen;
    },
    setInspectorOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setInspectorTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addApiLog: (state, action) => {
      state.apiLogs.unshift(action.payload);
      if (state.apiLogs.length > 50) state.apiLogs.pop();
    },
    addAuditLog: (state, action) => {
      state.auditLogs.unshift(action.payload);
      if (state.auditLogs.length > 50) state.auditLogs.pop();
    },
    recordCacheHit: (state, action) => {
      state.cacheStats.hits += 1;
      const key = action.payload || 'General Data';
      if (!state.cacheStats.cachedKeys.includes(key)) {
        state.cacheStats.cachedKeys.push(key);
      }
    },
    recordCacheMiss: (state, action) => {
      state.cacheStats.misses += 1;
      const key = action.payload || 'General Data';
      if (!state.cacheStats.cachedKeys.includes(key)) {
        state.cacheStats.cachedKeys.push(key);
      }
    },
    clearLogs: (state) => {
      state.apiLogs = [];
      state.auditLogs = [];
    }
  }
});

export const {
  toggleInspector,
  setInspectorOpen,
  setInspectorTab,
  addApiLog,
  addAuditLog,
  recordCacheHit,
  recordCacheMiss,
  clearLogs
} = inspectorSlice.actions;

export default inspectorSlice.reducer;
