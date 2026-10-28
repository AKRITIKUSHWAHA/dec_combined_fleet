import React, { useState } from 'react';
import { useCompany } from '../context/CompanyContext';
import { useRole } from '../context/RoleContext';
import { useData } from '../context/DataContext';
import { 
  Car, 
  AlertTriangle, 
  Clock, 
  PoundSterling, 
  ArrowUpRight, 
  PlusCircle, 
  Calendar, 
  Plane, 
  GraduationCap, 
  Smartphone,
  Users,
  CheckSquare,
  ShieldAlert,
  Zap,
  Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { selectedCompany } = useCompany();
  const { currentRole, roleConfig, canViewDBS } = useRole();
  const { staff, vehicles, bookings, defects, dailyChecks } = useData();

  const [isLoadingMock, setIsLoadingMock] = useState(false);

  // Filter based on selected company if not 'all'
  const filteredVehicles = selectedCompany 
    ? vehicles.filter(v => v.companyId === selectedCompany.id)
    : vehicles;

  const filteredBookings = selectedCompany
    ? bookings.filter(b => b.companyId === selectedCompany.id)
    : bookings;

  // Phase 3 Metrics:
  // 1. On-Duty Drivers
  const onDutyDrivers = staff.filter(s => s.onDuty && (s.role === 'driver' || s.role === 'dual_driver_pa'));
  const availableDrivers = onDutyDrivers.filter(s => s.dutyStatus === 'available').length;
  const onJobDrivers = onDutyDrivers.filter(s => s.dutyStatus === 'on_job').length;

  // 2. Unallocated Jobs
  const unallocatedBookings = filteredBookings.filter(b => b.status === 'unallocated').length;
  const activeTrips = filteredBookings.filter(b => b.status === 'en_route' || b.status === 'pob' || b.status === 'arrived').length;

  // 3. Blocked Vehicles (VOR / blocked off road due to critical defects or expiries)
  const blockedVehicles = filteredVehicles.filter(v => v.status === 'blocked_off_road').length;

  // 4. Missing Checks (Scheduled vehicles with missing or failed daily walkaround checks today)
  const missingChecks = filteredVehicles.filter(v => v.todayCheckStatus === 'missing' || v.todayCheckStatus === 'failed').length;

  // 5. Expiries Due (Annual DVSA MOTs due soon or Council 6-month checks due soon)
  const motExpiriesDue = filteredVehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length;
  const councilExpiriesDue = filteredVehicles.filter(v => v.councilSixMonthInspection.status === 'due_soon').length;
  const totalExpiriesDue = motExpiriesDue + councilExpiriesDue;

  // Overall KPIs
  const totalVehicles = filteredVehicles.length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'available').length;
  const allocatedVehicles = filteredVehicles.filter(v => v.status === 'allocated').length;
  const completedToday = filteredBookings.filter(b => b.status === 'completed').length;
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalGbp, 0);

  // Critical items
  const activeCriticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released');
  const motReminders = filteredVehicles.filter(v => v.annualDvsaMot.status === 'due_soon');


  // UK date format
  const todayUkFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Sub-Company Context & Role Info */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                UK Platform • DD/MM/YYYY
              </span>
              <span className="text-xs text-blue-200">
                {todayUkFormatted}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {selectedCompany ? selectedCompany.name : 'DEC Group Head Office'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
              Unified dispatch, fleet roadworthiness, PA/driver compliance, and school transport operations.
            </p>
          </div>

          {/* Persona Card in Banner */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                Viewing As
              </p>
              <p className="text-xs font-bold text-white">
                {roleConfig.label}
              </p>
              <p className="text-[10px] text-blue-200 line-clamp-1 max-w-[200px]">
                {roleConfig.description}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
          </div>
        </div>

        {/* Simulator / Demo controls */}
        <div className="mt-4 pt-4 border-t border-blue-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Quick Simulation Mode:</span>
            <button
              onClick={() => setIsLoadingMock(!isLoadingMock)}
              className="px-2 py-1 rounded bg-blue-700/60 hover:bg-blue-600/80 text-[11px] transition text-white border border-blue-500/40"
            >
              Toggle Loading State
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/driver-cockpit"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Driver App</span>
            </Link>
            <Link 
              to="/pa-cockpit"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-sm transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch PA App</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Gate Alert Banners (Requirement VEH-08, DEF-06, INT-NEW-01) */}
      {activeCriticalDefects.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h2 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
                SAFETY GATE ACTIVE: {activeCriticalDefects.length} Vehicle(s) Blocked Off-Road (VOR)
              </h2>
              <Link to="/maintenance" className="text-xs font-semibold text-rose-700 dark:text-rose-300 underline hover:no-underline">
                Review Workshop & Release &rarr;
              </Link>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
              Vehicles with critical safety defects cannot be allocated to any booking or school run until garage repair and second-person sign-off is completed.
            </p>
          </div>
        </div>
      )}

      {/* 1-Month MOT Expiry Notice (Requirement VEH-04) */}
      {motReminders.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h2 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                1-Month Calendar Reminder: MOT / Inspection Deadlines Approaching
              </h2>
              <Link to="/fleet" className="text-xs font-semibold text-amber-700 dark:text-amber-300 underline hover:no-underline">
                View Fleet Deadlines &rarr;
              </Link>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              {motReminders.map(v => `${v.registration} (Expires: ${v.annualDvsaMot.expiryDate})`).join(', ')} - Automated notifications sent to manager & assigned driver.
            </p>
          </div>
        </div>
      )}

      {/* 5 Phase 3 Dispatch KPI Cards */}
      {isLoadingMock ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: On-Duty Drivers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  On-Duty Drivers
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {onDutyDrivers.length}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Beacons
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  {availableDrivers} Free
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                  {onJobDrivers} On Trip
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">GPS Tracking</span>
              <Link to="/office/live-map" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>Live Map</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Unallocated Jobs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Unallocated Jobs
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {unallocatedBookings}
                </span>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                  Awaiting Driver
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold">
                  {activeTrips} Trips In Progress
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Dispatch Queue</span>
              <Link to="/office/bookings" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>Allocate</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 3: Blocked Vehicles */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Blocked Vehicles
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {blockedVehicles}
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  VOR Off-Road
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 line-clamp-1">
                {blockedVehicles > 0 ? 'CB22 WPR: Critical Brakes' : 'All fleet roadworthy'}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Garage Tickets</span>
              <Link to="/office/maintenance" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>Workshop</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 4: Missing Checks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Missing Checks
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {missingChecks}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  Walkarounds Pending
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                1 failed • 0 unverified
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Daily Compliance</span>
              <Link to="/office/checks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>Audits</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 5: Expiries Due */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Expiries Due
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalExpiriesDue}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                  &lt; 30 Days Due
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold">
                  {motExpiriesDue} DVSA MOT
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {councilExpiriesDue} Council
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Dual Deadlines</span>
              <Link to="/office/fleet" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5">
                <span>View Expiries</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      )}


      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Bookings & Dispatch Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Active & Upcoming Dispatches
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time journey states and school SEN runs
                </p>
              </div>

              <Link
                to="/bookings"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                Full Dispatch Board &rarr;
              </Link>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((b) => (
                <div key={b.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {b.bookingRef}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {b.scheduledTime}
                      </span>
                      
                      {/* Status Pill */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'unallocated' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                          : b.status === 'en_route'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : b.status === 'pob'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>

                      {b.isAirportRun && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 inline-flex items-center gap-1">
                          <Plane className="w-3 h-3" /> Flight {b.flightDetails?.flightNumber}
                        </span>
                      )}

                      {b.isSchoolRun && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> School Run
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {b.customerName} ({b.passengerCount} pax)
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 space-y-0.5">
                      <p className="truncate">
                        <span className="font-medium text-slate-600 dark:text-slate-300">From:</span> {b.pickupAddress} ({b.pickupPostcode})
                      </p>
                      <p className="truncate">
                        <span className="font-medium text-slate-600 dark:text-slate-300">To:</span> {b.destinationAddress} ({b.destinationPostcode})
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      £{b.totalGbp.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {b.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Checks & Roadside Audit Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Today's Daily Walkaround Checks
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-shift safety submissions & roadworthiness audits
                </p>
              </div>

              <Link
                to="/checks"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Checklist Builder &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {dailyChecks.map(chk => (
                <div key={chk.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {chk.vehicleReg}
                      </span>
                      <span className="text-slate-500">
                        by {chk.driverName}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        chk.status === 'passed' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {chk.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Submitted at {chk.timestamp} • {chk.odometerReading.toLocaleString()} miles
                    </p>
                  </div>

                  <span className="text-slate-500 text-[11px]">
                    {chk.itemsChecked} items verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Vehicle Maintenance & Staff Status */}
        <div className="space-y-6">
          
          {/* Quick Action Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quick Operations
            </h2>

            <Link
              to="/bookings"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Create Booking / Journey</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/live-map"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Open Live Map & Routing</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/maintenance"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Log Vehicle Defect / Workshop</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Active Defects Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Garage & Defect Tracking
              </h2>
              <span className="text-[11px] font-bold text-rose-600">
                {activeCriticalDefects.length} VOR Blocking
              </span>
            </div>

            <div className="space-y-3">
              {defects.map(d => (
                <div key={d.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {d.vehicleReg}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      d.severity === 'critical_safety'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {d.severity === 'critical_safety' ? 'CRITICAL' : 'MINOR'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {d.description}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{d.reportedByName}</span>
                    <span className="capitalize">{d.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Access Information Note */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Role Protection Rules Enforced:
            </p>
            {canViewDBS ? (
              <p className="text-[11px]">
                You are currently in an <strong>Authorized Compliance/Admin</strong> role with permission to view DBS checks and safeguarding records.
              </p>
            ) : (
              <p className="text-[11px]">
                You are currently in an <strong>Operational Controller</strong> role. Sensitive DBS certificate files and safeguarding notes are restricted from your view.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

