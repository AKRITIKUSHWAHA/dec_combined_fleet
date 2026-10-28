# DEC Integrated Fleet, Dispatch & Workforce Platform (UK v1.4)

A responsive, high-fidelity UI prototype built with **React 18 + TypeScript + Tailwind CSS + React Router v6** for UK private hire, airport transfers, executive chauffeur, and council school transport fleets.

---

## 🌟 Key Features & Architectural Highlights

### 1. Multi-Tenant Sub-Company Architecture (`ORG-01` & `SYS-01`)
- **Group Head Office:** Single owner dashboard with group-wide oversight.
- **Unlimited Sub-Companies:** Switch seamlessly in the top header:
  - `DEC Group Head Office` (DEC-HQ)
  - `DEC Luton Airport Transfers Ltd` (DEC-LTN)
  - `DEC Central Beds School Transport` (DEC-SCH)
  - `DEC Executive & Chauffeur Services` (DEC-EXEC)

### 2. Role-Based Permissions & Protected Route Guards
- **Strict Role Masking:** Controllers can see operational clearance (`Cleared / Pending / Restricted`), but sensitive criminal record details (DBS certificate numbers, Update Service status, medical histories, and safeguarding cases) are **strictly hidden and restricted to HR/Vetting and Admin** (`DBS-04`, `PEO-06`).
- **Route Guards on Every Page:** Navigating to an unauthorized screen displays a clear, accessible permission gate with the ability to switch to an authorized persona.

### 3. Safety Gate Allocation Engine (`VEH-08`, `DEF-04`)
- Attempting to dispatch a vehicle marked **VOR (Vehicle Off-Road)** due to an open critical safety defect (e.g. `CB22 WPR` front brake failure) triggers an immediate, unskippable **Safety Gate Block**.
- Vehicles can only be released back to the dispatch pool after **2-person independent verification** in the Workshop Portal (`DEF-04`).

### 4. Dual Independent MOT Deadlines (`VEH-02`, `VEH-04`)
- Tracks **Annual DVSA MOT** separately from local **Council 6-Month Inspections** (e.g. Central Bedfordshire designated depot requirement).
- Automated **1-Calendar-Month advance reminders** (`LT73 XKL` due on 28/11/2026).

### 5. Mandatory School Transport End-of-Run Sweep (`CHK-05`, `AT-C10`)
- Passenger Assistants (PAs) and drivers must complete a physical walkaround confirming no pupil or belongings remain on board before the vehicle's availability is unlocked.

---

## 👥 Mock Accounts & Personas (Switchable via Header Pill)

You can switch between any of these roles instantly using the **Role Switcher** in the top navigation header:

| Role Persona | Mock User Name / ID | Allowed Screens / Access Scope | Key Behaviors to Test |
|---|---|---|---|
| **Owner / Head Office Admin** | `DEC Operations Director` | Full Group Access (All 11 Modules) | Edit Tariffs, Create Sub-Companies, View All Ledgers & Vetting. |
| **Dispatcher / Controller** | `Senior Dispatch Controller` | Dashboard, Live Map, Bookings, Schools, Fleet, Checks, Maintenance, Workforce, Finance | **DBS & Safeguarding Hidden.** Can assign jobs, track stale GPS drivers (>60s warning). |
| **Driver (Staff Mobile App)** | `Tariq Mahmood` (`DEC-DRV-01`) | Driver Mobile Cockpit (`/driver-cockpit`), Dashboard | Large touch buttons: `En Route` &rarr; `Arrived` &rarr; `POB` &rarr; `Job Clear`. GPS freshness & offline queue toggle. |
| **Passenger Assistant (PA)** | `Sarah Jenkins` (`DEC-PA-01`) | PA School Cockpit (`/pa-cockpit`), Schools, Dashboard | **No driving licence required.** Pupil attendance manifest & End-of-Run Vehicle Sweep sign-off. |
| **Dual Role (Driver + PA)** | `Marcus Bell` (`DEC-DRV-02`) | Driver & PA Views, Dashboard | Single person identity with linked driving licence (6 penalty points) + SEN Council Escort approval. |
| **Mechanic / Garage Staff** | `John Miller` (Master Tech) | Maintenance (`/maintenance`), Fleet, Checks, Dashboard | Enters parts, labour hours, uploads invoices, and performs **2nd-person safety verification** to release VOR vehicles. |
| **HR / Vetting / Compliance** | `Eleanor Vance` (Compliance Lead) | Compliance (`/compliance`), Workforce, Fleet, Schools, Dashboard | Full access to raw DBS certificate numbers, Update Service verification, DVLA points lookup, and confidential Safeguarding Cases. |

---

## 📱 Responsive Breakpoint Audit

The platform is designed mobile-first and tested rigorously across standard viewports:

- **360px (Mobile Phone):**
  - Thumb-accessible **Bottom Navigation Bar** (Dashboard, Live Map, Bookings, Fleet, Staff App).
  - Off-canvas slideover navigation drawer.
  - Large touch targets (minimum 44px height).
  - Full-width stacked cards without horizontal overflow.
- **768px (Tablet):**
  - Collapsible slideover drawer with sub-company switcher.
  - 2-column KPI and dispatch grid layouts.
- **1280px - 1440px (Desktop):**
  - Persistent left sidebar with live unallocated job counters, VOR indicators, and MOT badges.
  - 6-column full Kanban dispatch board.
  - Multi-pane telemetry inspector and live SVG road network map.

---

## ♿ Accessibility & UK Conventions (WCAG AA)

- **Contrast:** Strict WCAG 2.1 AA compliant color ratios in both Light and Dark modes.
- **Keyboard Navigation:** High-visibility focus rings (`focus:ring-2 focus:ring-blue-500`).
- **Semantic HTML & ARIA:** Proper `role`, `aria-label`, and screen-reader headings.
- **UK Formats:**
  - **Currency:** GBP (£) formatted with two decimals.
  - **Distance / Speed:** Miles and miles per hour (mph).
  - **Dates & Times:** `DD/MM/YYYY` in 24-hour / 12-hour UK time (`Europe/London`).
  - **Postcodes:** UK postcodes validated (`LU1`, `LU2 9QT`, `MK42`, `AL5`, `W1K`).

---

## 🚀 How to Run Locally

```bash
# 1. Clone repository
git clone https://github.com/AKRITIKUSHWAHA/dec_combined_fleet.git
cd dec_combined_fleet

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173/
```

### Production Build
```bash
npm run build
```
Build output is optimized and verified with TypeScript zero-error compilation.
