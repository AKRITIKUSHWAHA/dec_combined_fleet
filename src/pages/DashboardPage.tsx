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
  CheckCircle2,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { selectedCompany } = useCompany();
  const { currentRole, roleConfig, canViewDBS } = useRole();
  const { vehicles, bookings, defects, dailyChecks } = useData();

  const [isLoadingMock, setIsLoadingMock] = useState(false);

  // Filter based on selected company if not 'all'
  const filteredVehicles = selectedCompany 
    ? vehicles.filter(v => v.companyId === selectedCompany.id)
    : vehicles;

  const filteredBookings = selectedCompany
    ? bookings.filter(b => b.companyId === selectedCompany.id)
    : bookings;

  // KPIs
  const totalVehicles = filteredVehicles.length;
  const vorVehicles = filteredVehicles.filter(v => v.status === 'blocked_off_road').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'available').length;
  const allocatedVehicles = filteredVehicles.filter(v => v.status === 'allocated').length;

  const unallocatedBookings = filteredBookings.filter(b => b.status === 'unallocated').length;
  const activeTrips = filteredBookings.filter(b => b.status === 'en_route' || b.status === 'pob').length;
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
      
      {/* Top Banner: Night Road Hero Gradient & Role Info */}
      <div 
        style={{ background: 'var(--hero-bg)' }}
        className="rounded-[20px] p-5 sm:p-7 text-[#EAF7F2] relative overflow-hidden border border-[var(--border)] shadow-xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B6F23C]/20 text-[#B6F23C] border border-[#B6F23C]/40">
                UK FLEET • DD/MM/YYYY
              </span>
              <span className="text-xs text-[#8FB5AA] font-mono">
                {todayUkFormatted}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
              {selectedCompany ? selectedCompany.name : 'DEC Group Head Office'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8FB5AA] mt-1 max-w-2xl leading-relaxed">
              Unified dispatch, fleet roadworthiness, PA/driver compliance, and school transport operations.
            </p>
          </div>

          {/* Persona Card in Banner */}
          <div className="bg-[#0F2F29]/80 backdrop-blur-md border border-[#24574D] p-3.5 rounded-[16px] flex items-center gap-3 shrink-0">
            <div>
              <p className="text-[10px] font-mono uppercase font-bold text-[#8FB5AA] tracking-wider">
                Viewing As
              </p>
              <p className="text-xs font-heading font-bold text-white">
                {roleConfig.label}
              </p>
              <p className="text-[10px] text-[#8FB5AA] line-clamp-1 max-w-[200px]">
                {roleConfig.description}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" title="Connected" />
          </div>
        </div>

        {/* Quick Tools & Shortcuts */}
        <div className="mt-4 pt-4 border-t border-[#24574D] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8FB5AA]">Theme Mode:</span>
            <Link 
              to="/design-system"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-heading font-bold bg-[#3FE0C5]/20 text-[#3FE0C5] border border-[#3FE0C5]/40 hover:bg-[#3FE0C5]/30 transition"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Explore Night Road Design System</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/driver-cockpit"
              className="btn-primary !min-h-[36px] !py-1 !px-3 !text-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Driver App</span>
            </Link>
            <Link 
              to="/pa-cockpit"
              className="btn-secondary !min-h-[36px] !py-1 !px-3 !text-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch PA App</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Gate Alert Banners (Requirement VEH-08, DEF-06) */}
      {activeCriticalDefects.length > 0 && (
        <div className="bg-[#FF5D6C]/10 border border-[#FF5D6C]/40 rounded-[18px] p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF5D6C] shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h2 className="text-xs sm:text-sm font-heading font-bold text-[#FF5D6C]">
                SAFETY GATE ACTIVE: {activeCriticalDefects.length} Vehicle(s) Blocked Off-Road (VOR)
              </h2>
              <Link to="/maintenance" className="text-xs font-semibold text-[#FF5D6C] underline hover:no-underline font-heading">
                Review Workshop &amp; Release &rarr;
              </Link>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Vehicles with critical safety defects cannot be allocated to any booking or school run until garage repair and second-person sign-off is completed.
            </p>
          </div>
        </div>
      )}

      {/* 1-Month MOT Expiry Notice (Requirement VEH-04) */}
      {motReminders.length > 0 && (
        <div className="bg-[#FFC24B]/10 border border-[#FFC24B]/40 rounded-[18px] p-3.5 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#FFC24B] shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h2 className="text-xs sm:text-sm font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">
                1-Month Calendar Reminder: MOT / Inspection Deadlines Approaching
              </h2>
              <Link to="/fleet" className="text-xs font-semibold text-[#D97706] dark:text-[#FFC24B] underline hover:no-underline font-heading">
                View Fleet Deadlines &rarr;
              </Link>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {motReminders.map(v => `${v.registration} (Expires: ${v.annualDvsaMot.expiryDate})`).join(', ')} - Automated notifications sent to manager &amp; assigned driver.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Vehicles & VOR Status */}
        <div className="nr-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Fleet Status
            </span>
            <div className="w-9 h-9 rounded-[12px] bg-[var(--surface-2)] flex items-center justify-center text-[#B6F23C]">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-[var(--text)]">
              {totalVehicles}
            </span>
            <span className="text-xs text-[var(--text-muted)]">vehicles</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="chip-ready px-2 py-0.5 rounded-full font-bold text-[10px]">
              {availableVehicles} Free
            </span>
            <span className="chip-pending px-2 py-0.5 rounded-full font-bold text-[10px]">
              {allocatedVehicles} On Duty
            </span>
            {vorVehicles > 0 && (
              <span className="chip-blocked px-2 py-0.5 rounded-full font-bold text-[10px]">
                {vorVehicles} VOR
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Dispatch Board Queue */}
        <div className="nr-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Live Dispatch
            </span>
            <div className="w-9 h-9 rounded-[12px] bg-[var(--surface-2)] flex items-center justify-center text-[#FF9F6B]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-[var(--text)]">
              {unallocatedBookings}
            </span>
            <span className="text-xs font-bold text-[#FF5D6C]">
              Unallocated
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
            <span>{activeTrips} Trips In Progress</span>
            <Link to="/bookings" className="text-[#3FE0C5] hover:underline inline-flex items-center font-bold">
              Board <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: School Transport Runs */}
        <div className="nr-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
              School Transport
            </span>
            <div className="w-9 h-9 rounded-[12px] bg-[var(--surface-2)] flex items-center justify-center text-[#8B9CFF]">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-[var(--text)]">
              1
            </span>
            <span className="text-xs text-[#FFC24B] font-bold">
              PM Run Pending Allocation
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
            <span>1 PA Assigned</span>
            <Link to="/schools" className="text-[#3FE0C5] hover:underline inline-flex items-center font-bold">
              Routes <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Daily Revenue (GBP £) */}
        <div className="nr-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Today's Bookings
            </span>
            <div className="w-9 h-9 rounded-[12px] bg-[var(--surface-2)] flex items-center justify-center text-[#34D399]">
              <PoundSterling className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-heading font-bold text-[var(--text)] font-mono tabular-nums">
              £{totalRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">GBP</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
            <span>{completedToday} Settled Jobs</span>
            <Link to="/finance" className="text-[#3FE0C5] hover:underline inline-flex items-center font-bold">
              Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Bookings & Dispatch Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-base font-heading font-bold text-[var(--text)]">
                  Active &amp; Upcoming Dispatches
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Real-time journey states and school SEN runs
                </p>
              </div>

              <Link
                to="/bookings"
                className="text-xs font-heading font-bold text-[#3FE0C5] hover:underline inline-flex items-center"
              >
                Full Dispatch Board &rarr;
              </Link>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-[var(--border)]">
              {filteredBookings.map((b) => (
                <div key={b.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[var(--text)]">
                        {b.bookingRef}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        • {b.scheduledTime}
                      </span>
                      
                      {/* Status Pill */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'unallocated' 
                          ? 'chip-blocked' 
                          : b.status === 'en_route'
                          ? 'chip-pending'
                          : b.status === 'pob'
                          ? 'chip-due-soon'
                          : 'chip-ready'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>

                      {b.isAirportRun && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#3FE0C5]/15 text-[#0B2B26] dark:text-[#3FE0C5] border border-[#3FE0C5]/30 inline-flex items-center gap-1">
                          <Plane className="w-3 h-3" /> Flight {b.flightDetails?.flightNumber}
                        </span>
                      )}

                      {b.isSchoolRun && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8B9CFF]/15 text-[#3730A3] dark:text-[#8B9CFF] border border-[#8B9CFF]/30 inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> School Run
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-[var(--text)] mt-1">
                      {b.customerName} ({b.passengerCount} pax)
                    </p>

                    <div className="text-xs text-[var(--text-muted)] mt-0.5 space-y-0.5">
                      <p className="truncate">
                        <span className="font-medium text-[var(--text)]">From:</span> {b.pickupAddress} ({b.pickupPostcode})
                      </p>
                      <p className="truncate">
                        <span className="font-medium text-[var(--text)]">To:</span> {b.destinationAddress} ({b.destinationPostcode})
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border)]">
                    <span className="text-sm font-bold text-[var(--text)] font-mono tabular-nums">
                      £{b.totalGbp.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] capitalize">
                      {b.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Checks & Roadside Audit Feed */}
          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-base font-heading font-bold text-[var(--text)]">
                  Today's Daily Walkaround Checks
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Pre-shift safety submissions &amp; roadworthiness audits
                </p>
              </div>

              <Link
                to="/checks"
                className="text-xs font-heading font-bold text-[#3FE0C5] hover:underline"
              >
                Checklist Builder &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {dailyChecks.map(chk => (
                <div key={chk.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--text)]">
                        {chk.vehicleReg}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        by {chk.driverName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'passed' ? 'chip-ready' : 'chip-blocked'
                      }`}>
                        {chk.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                      Submitted at {chk.timestamp} • {chk.odometerReading.toLocaleString()} miles
                    </p>
                  </div>

                  <span className="text-[var(--text-muted)] text-[11px]">
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
          <div className="nr-card p-5 space-y-2.5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Quick Operations
            </h2>

            <Link
              to="/bookings"
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-[12px] text-xs font-heading font-bold bg-[#B6F23C]/15 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/30 hover:bg-[#B6F23C]/25 transition"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#B6F23C]" />
                <span>Create Booking / Journey</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/live-map"
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-[12px] text-xs font-heading font-bold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)] transition"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3FE0C5]" />
                <span>Open Live Map &amp; Routing</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/maintenance"
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-[12px] text-xs font-heading font-bold bg-[#FF5D6C]/15 text-[#FF5D6C] border border-[#FF5D6C]/30 hover:bg-[#FF5D6C]/25 transition"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF5D6C]" />
                <span>Log Vehicle Defect / Workshop</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Active Defects Summary */}
          <div className="nr-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Garage &amp; Defect Tracking
              </h2>
              <span className="text-[11px] font-bold text-[#FF5D6C] font-mono">
                {activeCriticalDefects.length} VOR Blocking
              </span>
            </div>

            <div className="space-y-3">
              {defects.map(d => (
                <div key={d.id} className="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[var(--text)]">
                      {d.vehicleReg}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.severity === 'critical_safety' ? 'chip-blocked' : 'chip-due-soon'
                    }`}>
                      {d.severity === 'critical_safety' ? 'CRITICAL' : 'MINOR'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text)] mt-1.5 line-clamp-2">
                    {d.description}
                  </p>
                  <div className="mt-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>{d.reportedByName}</span>
                    <span className="capitalize">{d.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Access Information Note */}
          <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
            <p className="font-heading font-bold text-[var(--text)] mb-1">
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
