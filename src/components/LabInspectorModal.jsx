import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setInspectorOpen,
  setInspectorTab,
  clearLogs
} from '../store/slices/inspectorSlice';
import { invalidateDoctorsCache, invalidateAvailabilityCache } from '../store/slices/doctorSlice';
import { setSimulateExpiredToken } from '../store/slices/authSlice';
import { simulationConfig } from '../services/mockBackend';
import { runAllAutomatedTests } from '../utils/browserTestRunner';
import {
  Activity,
  X,
  Server,
  Database,
  Layers,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Cpu,
  Trash2,
  Clock,
  Play,
  CheckCheck,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

export default function LabInspectorModal() {
  const dispatch = useDispatch();
  const { isOpen, activeTab, apiLogs, auditLogs, cacheStats } = useSelector(
    (state) => state.inspector
  );
  const auth = useSelector((state) => state.auth);
  const appointmentsCount = useSelector((state) => state.appointments.activeAppointments.length);
  const bookingDraft = useSelector((state) => state.appointments.bookingDraft);

  // In-browser test runner state
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  if (!isOpen) return null;

  const totalCacheRequests = cacheStats.hits + cacheStats.misses;
  const hitRatio = totalCacheRequests > 0 ? Math.round((cacheStats.hits / totalCacheRequests) * 100) : 0;

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    try {
      const results = await runAllAutomatedTests((progress) => {
        setTestResults(progress);
      });
      setTestResults(results);
    } catch (e) {
      console.error('Test execution error:', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const passedTests = testResults.filter((t) => t.status === 'PASS').length;
  const failedTests = testResults.filter((t) => t.status === 'FAIL').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 text-slate-100 h-full shadow-2xl flex flex-col border-l border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-med-500/20 text-med-400 rounded-lg border border-med-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Experiment Lab Inspector
                <span className="text-xs bg-med-950 text-med-400 px-2 py-0.5 rounded-full border border-med-800">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual verification & test runner for Experiments 1, 2, 3 & 4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(clearLogs())}
              title="Clear Inspector Logs"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setInspectorOpen(false))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 overflow-x-auto">
          <button
            onClick={() => dispatch(setInspectorTab('api'))}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-med-400 text-med-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            API Traffic ({apiLogs.length})
          </button>
          <button
            onClick={() => dispatch(setInspectorTab('middleware'))}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'middleware'
                ? 'border-med-400 text-med-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Middleware Audit ({auditLogs.length})
          </button>
          <button
            onClick={() => dispatch(setInspectorTab('cache'))}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'cache'
                ? 'border-med-400 text-med-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Caching Diagnostics
          </button>
          <button
            onClick={() => dispatch(setInspectorTab('tests'))}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'tests'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            Automated Tests {testResults.length > 0 && `(${passedTests}/${testResults.length})`}
          </button>
          <button
            onClick={() => dispatch(setInspectorTab('experiments'))}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'experiments'
                ? 'border-med-400 text-med-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Test Sandbox & Checklist
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: API TRAFFIC (Experiment 1 & 3) */}
          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
                <span>Recent REST HTTP Requests (Axios + Interceptors)</span>
                <span>Count: {apiLogs.length}</span>
              </div>

              {apiLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <Terminal className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  No REST API traffic recorded yet. Browse doctors or book an appointment to see live network logs.
                </div>
              ) : (
                apiLogs.map((log) => {
                  const isSuccess = log.status >= 200 && log.status < 300;
                  const isUnauthorized = log.status === 401;

                  return (
                    <div
                      key={log.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs font-mono transition hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              log.method === 'GET'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : log.method === 'POST'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : log.method === 'PATCH' || log.method === 'PUT'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {log.method}
                          </span>
                          <span className="text-slate-200 truncate max-w-xs">{log.url}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSuccess
                                ? 'bg-emerald-950 text-emerald-400'
                                : isUnauthorized
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {log.status} {log.statusText}
                          </span>
                          <span className="text-[10px] text-slate-500">{log.durationMs}ms</span>
                        </div>
                      </div>

                      {log.requestHeaders?.Authorization && (
                        <div className="bg-slate-900/90 rounded p-1.5 mb-2 text-[11px] text-emerald-300 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">Authorization:</span>
                          <span className="truncate max-w-[280px]">
                            {log.requestHeaders.Authorization}
                          </span>
                        </div>
                      )}

                      {log.requestPayload && Object.keys(log.requestPayload).length > 0 && (
                        <div className="mt-2 bg-slate-900 p-2 rounded text-[11px] text-slate-300">
                          <p className="text-slate-500 text-[10px] mb-1 font-sans">Payload:</p>
                          <pre className="overflow-x-auto whitespace-pre-wrap max-h-28">
                            {JSON.stringify(log.requestPayload, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.responsePayload && (
                        <div className="mt-2 bg-slate-900/60 p-2 rounded text-[11px] text-slate-300">
                          <p className="text-slate-500 text-[10px] mb-1 font-sans">Response:</p>
                          <pre className="overflow-x-auto whitespace-pre-wrap max-h-28">
                            {JSON.stringify(log.responsePayload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: MIDDLEWARE AUDIT (Experiment 2d) */}
          {activeTab === 'middleware' && (
            <div className="space-y-3">
              <div className="p-3 bg-med-950/30 border border-med-800/50 rounded-xl text-xs text-med-300 leading-relaxed">
                <strong>Experiment 2d Active:</strong> Custom Redux Middleware (
                <code className="text-med-200">appointmentMonitorMiddleware</code>) intercepts every appointment lifecycle action, auditing state transitions and payloads in real time.
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Active Appointments</span>
                  <span className="text-xl font-bold text-white">{appointmentsCount}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Draft Booking Step</span>
                  <span className="text-xl font-bold text-white">Step {bookingDraft.currentStep}</span>
                </div>
              </div>

              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  No appointment middleware events yet. Book, reschedule, or cancel an appointment to view real-time interception logs.
                </div>
              ) : (
                auditLogs.map((audit) => (
                  <div
                    key={audit.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-semibold text-sky-400 text-[11px]">
                        {audit.actionType}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {audit.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] mb-2">{audit.description}</p>
                    {audit.payload && (
                      <pre className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 overflow-x-auto max-h-24">
                        {JSON.stringify(audit.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CACHING DIAGNOSTICS (Experiment 2e) */}
          {activeTab === 'cache' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-indigo-300 leading-relaxed">
                <strong>Experiment 2e Active:</strong> In-memory state caching stores Doctor records (TTL: 5 min) and slot schedules (TTL: 3 min) to minimize redundant network bandwidth.
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Cache Hits</span>
                  <span className="text-2xl font-bold text-emerald-400">{cacheStats.hits}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Network Fetches</span>
                  <span className="text-2xl font-bold text-amber-400">{cacheStats.misses}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Hit Ratio</span>
                  <span className="text-2xl font-bold text-sky-400">{hitRatio}%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-200 text-xs">Cache Invalidation Controls</h4>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => dispatch(invalidateDoctorsCache())}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear Doctors Cache
                  </button>
                  <button
                    onClick={() => dispatch(invalidateAvailabilityCache())}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear Slots Cache
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATED IN-BROWSER TEST RUNNER (ALL EXPERIMENTS) */}
          {activeTab === 'tests' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    Automated Test Suite (Experiments 1 to 4)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Execute live assertions across REST APIs, Redux store, CRUD actions & JWT tokens.
                  </p>
                </div>

                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {isRunningTests ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Running Tests...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Run All Test Suites</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Summary Cards */}
              {testResults.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Total Tests</span>
                    <span className="text-xl font-bold text-white">{testResults.length}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Passed</span>
                    <span className="text-xl font-bold text-emerald-400">{passedTests}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">Failed</span>
                    <span className={`text-xl font-bold ${failedTests > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {failedTests}
                    </span>
                  </div>
                </div>
              )}

              {/* Test List Output */}
              {testResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm bg-slate-950/50 rounded-2xl border border-slate-800">
                  <CheckCheck className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400" />
                  Click <strong>"Run All Test Suites"</strong> above to execute all 18 automated test assertions covering Experiments 1, 2, 3, and 4!
                </div>
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {testResults.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2 transition hover:border-slate-700"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {t.exp}
                          </span>
                          <span className="font-semibold text-slate-200 text-xs">{t.title}</span>
                        </div>
                        {t.message && (
                          <p className="text-[11px] text-slate-400 font-mono">{t.message}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {t.durationMs > 0 && (
                          <span className="text-[10px] text-slate-500">{t.durationMs}ms</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                            t.status === 'PASS'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {t.status === 'PASS' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TEST SANDBOX & CHECKLIST */}
          {activeTab === 'experiments' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Quick Diagnostic Simulations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      simulationConfig.forceApiError = !simulationConfig.forceApiError;
                      alert(`Simulation: Force 500 Network Error is now ${simulationConfig.forceApiError ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-rose-300 text-left transition"
                  >
                    <div className="font-semibold">Simulate 500 API Error</div>
                    <div className="text-[10px] text-rose-400/80">Tests Exp 1f & 3f error display</div>
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setSimulateExpiredToken());
                      alert('Simulated Expired Token set in LocalStorage. Now attempt to create, reschedule, or cancel an appointment to test Axios 401 response interceptor and auto-logout!');
                    }}
                    className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 text-purple-300 text-left transition"
                  >
                    <div className="font-semibold">Simulate 401 Expired Token</div>
                    <div className="text-[10px] text-purple-400/80">Tests Exp 4f token expiration handling</div>
                  </button>
                </div>
              </div>

              {/* Academic Syllabus Verification Checklist */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="font-semibold text-slate-200 text-xs">Academic Syllabus Verification Checklist</h4>
                <div className="space-y-2">
                  <div className="border border-slate-800 p-2.5 rounded-lg">
                    <p className="font-bold text-sky-400 text-[11px] mb-1">Experiment 1: REST APIs & Async Data</p>
                    <p className="text-slate-400 text-[10px]">✓ Axios GET /doctors, Search & Specialty filter, dynamic /doctors/:id, availability slots, async/await, loading skeletons & error handling.</p>
                  </div>

                  <div className="border border-slate-800 p-2.5 rounded-lg">
                    <p className="font-bold text-emerald-400 text-[11px] mb-1">Experiment 2: Redux Toolkit State Management</p>
                    <p className="text-slate-400 text-[10px]">✓ Global appointment store, doctor/slot/patient draft management, booking/reschedule/cancel actions, custom middleware monitoring, in-memory caching.</p>
                  </div>

                  <div className="border border-slate-800 p-2.5 rounded-lg">
                    <p className="font-bold text-amber-400 text-[11px] mb-1">Experiment 3: Appointment CRUD Operations</p>
                    <p className="text-slate-400 text-[10px]">✓ GET (active & history), POST (book appointment), PUT/PATCH (reschedule appointment), DELETE (cancel appointment), loading states.</p>
                  </div>

                  <div className="border border-slate-800 p-2.5 rounded-lg">
                    <p className="font-bold text-purple-400 text-[11px] mb-1">Experiment 4: Hospital Authentication & Token Management</p>
                    <p className="text-slate-400 text-[10px]">✓ Patient login API, token localStorage storage, Axios Authorization Bearer header injection, ProtectedRoute guards, logout, and 401 token expiration interceptor.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Auth: {auth.isAuthenticated ? `Logged in (${auth.user?.name})` : 'Guest / Not Authenticated'}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">MediCare System v2.0</span>
        </div>
      </div>
    </div>
  );
}
