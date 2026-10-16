# 🏥 MediCare Hub — Smart Hospital Appointment Booking Web Application

A full-stack, production-grade **Hospital Appointment Booking Web Application** built in **React**, **Redux Toolkit**, **Axios**, and **Tailwind CSS**. Designed specifically to fulfill and exceed all requirements across **Experiments 1, 2, 3, and 4**.

---

## 📋 Comprehensive Lab Syllabus & Feature Coverage

### 🧪 Experiment 1: Develop Hospital Appointment Application with REST APIs
> **Topics:** REST API, Axios, Fetch, Async Data

- **a) Fetch doctor information using REST APIs:**
  - Implemented via `doctorService.getDoctors()` using `api.get('/doctors')`.
  - Dispatches Redux Thunk `fetchDoctors()` handling asynchronous promises.
- **b) Implement doctor search and specialty filtering:**
  - Real-time search query matching doctor names, departments, and hospital locations.
  - Multi-specialty filter pills (*Cardiology, Neurology, Dermatology, Orthopedics, Pediatrics, General Medicine, Gastroenterology, Psychiatry*).
- **c) Retrieve available dates and time slots using API requests:**
  - Dynamic route queries `api.get('/doctors/:id/availability?date=YYYY-MM-DD')`.
  - Interactive date carousel calculates booked vs open consultation slots in real time.
- **d) Fetch individual doctor details dynamically:**
  - Dynamic React Router page at `/doctors/:id` executing `doctorService.getDoctorById(id)`.
  - Displays physician bio, credentials, clinic location, fees, and patient reviews.
- **e) Handle asynchronous data using async/await:**
  - Standardized modern async/await patterns with `try / catch / finally` across all services and Redux Thunks.
- **f) Display loading and error states:**
  - Polished Tailwind pulse skeleton screens during network retrieval.
  - Informative error banners with one-click **"Retry API Request"** buttons.

---

### 🧪 Experiment 2: Implement Appointment State Management
> **Topics:** Redux Toolkit, Middleware, Caching

- **a) Create a global appointment store:**
  - Configured with Redux Toolkit `configureStore()` in `src/store/index.js`.
  - Slices: `authSlice`, `doctorSlice`, `appointmentSlice`, and `inspectorSlice`.
- **b) Manage doctor, date, time slot, patient details, and appointment status:**
  - Dedicated `bookingDraft` state managing the complete multi-step wizard:
    - Selected doctor object
    - Selected appointment date
    - Selected time slot
    - Patient details (*Name, Email, Phone, Age, Gender, Reason, Visit Type*)
    - Lifecycle status (*CONFIRMED, RESCHEDULED, CANCELLED, COMPLETED*)
- **c) Implement booking, rescheduling, and cancellation actions:**
  - Redux slice reducers and extraReducers handling `bookAppointment`, `rescheduleAppointment`, and `cancelAppointment`.
- **d) Use middleware to monitor appointment actions:**
  - Custom Redux middleware `appointmentMonitorMiddleware.js` intercepts every appointment dispatch.
  - Automatically records audit timestamps, action types, payload summaries, and logs them to the console and to the **Lab Inspector Panel**.
- **e) Cache doctor and availability data:**
  - In-memory state caching with time-to-live (TTL: 5 mins for doctors, 3 mins for availability slots).
  - Skips redundant network calls when cache is fresh; logs cache hits and misses with visual ratio indicators.
- **f) Display loading and error states:**
  - Per-action loading states (`actionLoading`) for granular button spinners and disable states.

---

### 🧪 Experiment 3: Implement Appointment CRUD Operations using REST APIs
> **Topics:** CRUD, Axios/Fetch, Async Operations

- **a) Retrieve doctors and appointments using GET:**
  - `GET /api/doctors` -> Catalog retrieval.
  - `GET /api/appointments` -> Active scheduled consultations.
- **b) Create an appointment using POST:**
  - `POST /api/appointments` -> Sends full booking payload, checks slot collision, and persists record.
- **c) Reschedule an appointment using PUT / PATCH:**
  - `PATCH /api/appointments/:id` -> Modal interface allows selecting new date and open time slot.
- **d) Cancel an appointment using DELETE:**
  - `DELETE /api/appointments/:id` -> Cancels booking, releases the time slot, and archives into medical history.
- **e) Retrieve appointment history using GET:**
  - `GET /api/appointments/history` -> Displays past completed consultations and cancelled records.
  - Includes printable **Consultation Voucher Slip** with barcode and hospital instructions.
- **f) Implement loading and error handling:**
  - Granular mutation loading spinners and centralized floating toast notifications.

---

### 🧪 Experiment 4: Implement Hospital Authentication and Token Management
> **Topics:** Authentication, Token Management, Protected APIs

- **a) Implement patient authentication using a login API:**
  - `POST /api/auth/login` verifies credentials and issues signed JWT Bearer session tokens.
  - One-click **Demo Patient Login** button provided for instant evaluation.
- **b) Store and manage the authentication token:**
  - Token persisted in `localStorage` under key `medicare_auth_token` and synchronized with Redux `authSlice`.
- **c) Attach the token to appointment API requests:**
  - **Axios Request Interceptor** automatically extracts token and injects header:
    ```http
    Authorization: Bearer <token>
    ```
- **d) Protect booking, rescheduling, cancellation, and history operations:**
  - `ProtectedRoute.jsx` route guard redirects unauthenticated users to `/login`.
  - Backend API verifies Authorization Bearer headers before allowing CRUD mutations.
- **e) Implement logout functionality:**
  - Clears `localStorage`, flushes Redux state, and redirects to login portal.
- **f) Handle unauthorized and expired-token responses:**
  - **Axios Response Interceptor** catches `HTTP 401 Unauthorized`.
  - Clears expired tokens and dispatches `handleSessionExpired` displaying a prominent session alert.
  - Built-in **"Simulate 401 Expired Token"** button to demonstrate this flow instantly!

---

## 🚀 Running the Project in Visual Studio Code

### Step 1: Open the Project in VS Code
Open VS Code, press `Ctrl + O` (or `File -> Open Folder...`), and select:
```
c:\Users\rajar\OneDrive\Desktop\hospital-appointment-system
```

### Step 2: Open Integrated Terminal
Press `Ctrl + ~` (or `Terminal -> New Terminal`).

### Step 3: Run the Development Server
```bash
npm run dev
```

The Vite dev server will start instantly at:
👉 **`http://localhost:5173`** (or next available port). Open this URL in your web browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Quick Login |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medicare.com` | `password123` | Click **"One-Click Demo Patient Login"** on `/login` |

---

## 🛠️ Tech Stack & Key Libraries

- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **HTTP Client:** Axios (with custom Request & Response Interceptors)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Persistence:** LocalStorage Mock REST Backend with JSON headers & error simulation

---

## 🔬 Built-In "Lab Inspector" Drawer

Click the **"Lab Inspector"** pill in the top navigation bar to open the live laboratory verification panel:
1. **API Traffic Tab:** Inspects all live REST requests (`GET`, `POST`, `PATCH`, `DELETE`), status codes, headers, and payloads.
2. **Middleware Audit Tab:** Watches the custom `appointmentMonitorMiddleware` in action.
3. **Caching Diagnostics Tab:** Displays cache hits vs misses and TTL status with invalidation buttons.
4. **Test Sandbox & Checklist:** Buttons to simulate `500 Server Error` or `401 Expired Token` on demand.

---

© 2026 MediCare Hospital Appointment System — Developed with clean pair programming architecture.
