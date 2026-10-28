import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { Booking, JobStatus } from '../types';
import { AllocationDrawer } from '../components/dispatch/AllocationDrawer';
import { NewBookingModal } from '../components/dispatch/NewBookingModal';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Zap, 
  Plane, 
  GraduationCap, 
  Accessibility, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  ChevronRight,
  ShieldCheck,
  Building2,
  XCircle,
  Car
} from 'lucide-react';

const COLUMNS: { id: JobStatus; title: string; color: string; badgeBg: string }[] = [
  { id: 'unallocated', title: 'Unallocated', color: 'border-rose-400 text-rose-600 dark:text-rose-400', badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
  { id: 'allocated', title: 'Allocated', color: 'border-blue-400 text-blue-600 dark:text-blue-400', badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'en_route', title: 'En route', color: 'border-amber-400 text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'arrived', title: 'Arrived', color: 'border-indigo-400 text-indigo-600 dark:text-indigo-400', badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  { id: 'pob', title: 'POB (On Board)', color: 'border-purple-400 text-purple-600 dark:text-purple-400', badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-400 text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'cancelled', title: 'Cancelled', color: 'border-slate-400 text-slate-500', badgeBg: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  { id: 'no_show', title: 'No-show', color: 'border-orange-400 text-orange-600', badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
];

export const BookingsPage: React.FC = () => {
  const { bookings, staff, vehicles, updateJobStatus, cancelBooking, markNoShow } = useData();
  const { subCompanies, selectedCompanyId } = useCompany();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCompany, setSelectedFilterCompany] = useState<string>(selectedCompanyId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [specialFilter, setSpecialFilter] = useState<'all' | 'airport' | 'school'>('all');

  // Modals & Drawers
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedBookingForAllocation, setSelectedBookingForAllocation] = useState<Booking | null>(null);

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchRef = b.bookingRef.toLowerCase().includes(q);
      const matchCustomer = b.customerName.toLowerCase().includes(q);
      const matchPickup = b.pickupAddress.toLowerCase().includes(q);
      const matchDest = b.destinationAddress.toLowerCase().includes(q);
      if (!matchRef && !matchCustomer && !matchPickup && !matchDest) return false;
    }

    // Company filter
    if (selectedFilterCompany !== 'all' && b.companyId !== selectedFilterCompany) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && b.vehicleCategory !== selectedCategory) {
      return false;
    }

    // Special type filter
    if (specialFilter === 'airport' && !b.isAirportRun) return false;
    if (specialFilter === 'school' && !b.isSchoolRun) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bookings & Dispatch Board
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {filteredBookings.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-column board tracking lifecycle from Unallocated to Job Clear.
          </p>
        </div>

        {/* Action Button: New Booking */}
        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Dispatch Booking</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ref, customer, postcode, address..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company Filter */}
        <select
          value={selectedFilterCompany}
          onChange={(e) => setSelectedFilterCompany(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">🏢 All Sub-Companies</option>
          {subCompanies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Vehicle Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">🚗 All Categories</option>
          <option value="Saloon">Saloon</option>
          <option value="Executive">Executive VIP</option>
          <option value="MPV">MPV (6-Seat)</option>
          <option value="Wheelchair Accessible (WAV)">WAV Ramp</option>
          <option value="Minibus">Minibus (8-16)</option>
        </select>

        {/* Special Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSpecialFilter('all')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
              specialFilter === 'all' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Runs
          </button>
          <button
            type="button"
            onClick={() => setSpecialFilter('airport')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              specialFilter === 'airport' 
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plane className="w-3 h-3 text-amber-500" />
            <span>Airports</span>
          </button>
          <button
            type="button"
            onClick={() => setSpecialFilter('school')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              specialFilter === 'school' 
                ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-purple-500" />
            <span>School SEN</span>
          </button>
        </div>

      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
        {COLUMNS.map((col) => {
          const columnJobs = filteredBookings.filter(b => b.status === col.id);

          return (
            <div
              key={col.id}
              className="w-72 sm:w-80 shrink-0 bg-slate-100/70 dark:bg-slate-900/40 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800/80 flex flex-col max-h-[75vh]"
            >
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    col.id === 'unallocated' ? 'bg-rose-500' :
                    col.id === 'en_route' ? 'bg-amber-500 animate-ping' :
                    col.id === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {col.title}
                  </h3>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {columnJobs.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto pt-3 space-y-3 pr-1">
                {columnJobs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-600 italic">
                    No {col.title.toLowerCase()} jobs
                  </div>
                ) : (
                  columnJobs.map((job) => {
                    const assignedDriver = staff.find(s => s.id === job.assignedDriverId);
                    const assignedVehicle = vehicles.find(v => v.id === job.assignedVehicleId || v.registration === job.assignedVehicleId);

                    return (
                      <div
                        key={job.id}
                        className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition space-y-2.5"
                      >
                        {/* Reference & Time */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                              {job.bookingRef}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {job.vehicleCategory}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {job.scheduledTime}
                            </span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                              £{job.totalGbp.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {job.customerName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {job.customerPhone}
                          </p>
                        </div>

                        {/* Route Summary */}
                        <div className="space-y-1 text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                            <p className="text-slate-700 dark:text-slate-300 truncate">
                              {job.pickupAddress}
                            </p>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                            <p className="text-slate-700 dark:text-slate-300 truncate">
                              {job.destinationAddress}
                            </p>
                          </div>
                        </div>

                        {/* Badges bar */}
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          {job.isAirportRun && job.flightDetails && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold flex items-center gap-0.5">
                              <Plane className="w-2.5 h-2.5" />
                              {job.flightDetails.flightNumber}
                              {job.flightDetails.flightStatus === 'Delayed' && ' (+20m)'}
                            </span>
                          )}

                          {job.isSchoolRun && job.schoolRunDetails && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold flex items-center gap-0.5">
                              <GraduationCap className="w-2.5 h-2.5" />
                              {job.schoolRunDetails.routeNumber}
                            </span>
                          )}

                          {job.requiresWheelchair && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold flex items-center gap-0.5">
                              <Accessibility className="w-2.5 h-2.5" /> WAV
                            </span>
                          )}

                          {job.requiresPA && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> PA Escort
                            </span>
                          )}
                        </div>

                        {/* Assigned Driver details if allocated */}
                        {assignedDriver && (
                          <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                                  {assignedDriver.name}
                                </span>
                                {assignedVehicle && (
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {assignedVehicle.registration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-1 flex items-center gap-1.5">
                          {job.status === 'unallocated' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForAllocation(job)}
                              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Allocate Driver</span>
                            </button>
                          ) : job.status === 'allocated' ? (
                            <button
                              type="button"
                              onClick={() => updateJobStatus(job.id, 'en_route')}
                              className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                            >
                              <span>Start En Route</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : job.status === 'en_route' ? (
                            <button
                              type="button"
                              onClick={() => updateJobStatus(job.id, 'arrived')}
                              className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                            >
                              <span>Mark Arrived</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : job.status === 'arrived' ? (
                            <button
                              type="button"
                              onClick={() => updateJobStatus(job.id, 'pob')}
                              className="w-full py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                            >
                              <span>Passenger On Board (POB)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : job.status === 'pob' ? (
                            <button
                              type="button"
                              onClick={() => updateJobStatus(job.id, 'completed')}
                              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete Trip</span>
                            </button>
                          ) : null}

                          {/* Options dropdown / Cancel / No show */}
                          {job.status !== 'completed' && job.status !== 'cancelled' && job.status !== 'no_show' && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => cancelBooking(job.id)}
                                title="Cancel Booking"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => markNoShow(job.id)}
                                title="Passenger No-Show"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Allocation Drawer Modal */}
      <AllocationDrawer
        booking={selectedBookingForAllocation}
        isOpen={!!selectedBookingForAllocation}
        onClose={() => setSelectedBookingForAllocation(null)}
      />

      {/* New Booking Stepper Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />

    </div>
  );
};
