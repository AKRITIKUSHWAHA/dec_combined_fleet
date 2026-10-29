import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  CalendarCheck, 
  PlusCircle, 
  Search, 
  AlertTriangle, 
  UserCheck, 
  Car, 
  Clock, 
  Plane, 
  GraduationCap, 
  X, 
  Check, 
  ArrowRight,
  PoundSterling,
  ShieldAlert,
  Filter,
  SlidersHorizontal,
  MoveRight,
  ChevronDown,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Booking, JobStatus } from '../types';

export const BookingsPage: React.FC = () => {
  const { bookings, vehicles, staff, assignBooking, updateJobStatus } = useData();
  const { selectedCompany } = useCompany();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [moveMenuBookingId, setMoveMenuBookingId] = useState<string | null>(null);
  const [filterVehicleCategory, setFilterVehicleCategory] = useState<string>('all');
  
  // Modals
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<Booking | null>(null);

  // Assignment selection state
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);

  // New Booking form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newPickup, setNewPickup] = useState('');
  const [newPickupPostcode, setNewPickupPostcode] = useState('');
  const [newDropoff, setNewDropoff] = useState('');
  const [newDropoffPostcode, setNewDropoffPostcode] = useState('');
  const [newVehicleCategory, setNewVehicleCategory] = useState<'Saloon' | 'Executive' | 'MPV' | 'Wheelchair Accessible (WAV)'>('Saloon');
  const [newFareGbp, setNewFareGbp] = useState('45.00');

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (selectedCompany && b.companyId !== selectedCompany.id) return false;
    if (filterVehicleCategory !== 'all' && b.vehicleCategory !== filterVehicleCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = b.bookingRef.toLowerCase().includes(q);
      const matchCustomer = b.customerName.toLowerCase().includes(q);
      const matchPostcode = b.pickupPostcode.toLowerCase().includes(q) || b.destinationPostcode.toLowerCase().includes(q);
      if (!matchRef && !matchCustomer && !matchPostcode) return false;
    }
    return true;
  });

  const columns: { status: JobStatus; title: string; chipStyle: string }[] = [
    { status: 'unallocated', title: 'Unallocated', chipStyle: 'border-[#FF5D6C]/40 bg-[#FF5D6C]/5' },
    { status: 'allocated', title: 'Allocated', chipStyle: 'border-[#FF9F6B]/40 bg-[#FF9F6B]/5' },
    { status: 'en_route', title: 'En Route', chipStyle: 'border-[#3FE0C5]/40 bg-[#3FE0C5]/5' },
    { status: 'arrived', title: 'Arrived', chipStyle: 'border-[#FFC24B]/40 bg-[#FFC24B]/5' },
    { status: 'pob', title: 'POB (On Board)', chipStyle: 'border-[#34D399]/40 bg-[#34D399]/5' },
    { status: 'completed', title: 'Completed', chipStyle: 'border-[#B6F23C]/40 bg-[#B6F23C]/5' },
  ];

  const handleOpenAssignModal = (b: Booking) => {
    setSelectedBookingForAssign(b);
    setSelectedDriverId('');
    setSelectedVehicleId('');
    setAssignError(null);
  };

  const handleExecuteAssign = () => {
    if (!selectedBookingForAssign) return;
    if (!selectedDriverId || !selectedVehicleId) {
      setAssignError('Please select both a driver and a vehicle to clear safety gate verification.');
      return;
    }

    const result = assignBooking(selectedBookingForAssign.id, selectedDriverId, selectedVehicleId);
    if (!result.success) {
      setAssignError(result.error || 'Assignment blocked by safety check.');
    } else {
      setSelectedBookingForAssign(null);
      setAssignError(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Bookings &amp; Dispatch Board</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
              {filteredBookings.length} Active
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Lifecycle: Unallocated &rarr; Allocated &rarr; En Route &rarr; Arrived &rarr; POB &rarr; Completed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search (Desktop) */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search ref, postcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[42px] !pl-9 !text-xs w-44 lg:w-56"
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 h-[42px] px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-heading font-bold text-[var(--text)] active:scale-95 transition"
          >
            <Filter className="w-4 h-4 text-[#3FE0C5]" />
            <span>Filters</span>
            {(searchQuery || filterVehicleCategory !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[#B6F23C]" />
            )}
          </button>

          {/* New Booking Button */}
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[42px] flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Warning Callout */}
      <div className="bg-[#B6F23C]/10 border border-[#B6F23C]/30 p-3.5 rounded-[16px] flex items-center justify-between text-xs text-[var(--text)]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#B6F23C] shrink-0" />
          <span>
            <strong className="font-heading">Safety Gate Automation:</strong> System actively checks vehicle VOR/MOT status and DVLA licence points before permitting any driver/vehicle allocation.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#B6F23C] uppercase hidden sm:inline">
          UK Standard
        </span>
      </div>

      {/* Mobile Status Tab Selector (One column at a time OR horizontal swipe) */}
      <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setActiveMobileColumn('all')}
          className={`h-9 px-3 rounded-full text-xs font-heading font-bold whitespace-nowrap transition shrink-0 ${
            activeMobileColumn === 'all'
              ? 'bg-[#B6F23C] text-[#08201C] shadow-sm'
              : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
          }`}
        >
          All (Swipe Mode)
        </button>
        {columns.map(col => {
          const count = filteredBookings.filter(b => b.status === col.status).length;
          const isSelected = activeMobileColumn === col.status;
          return (
            <button
              key={col.status}
              type="button"
              onClick={() => setActiveMobileColumn(col.status)}
              className={`h-9 px-3 rounded-full text-xs font-heading font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-sm'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
              }`}
            >
              <span>{col.title}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-[var(--bg)] text-[var(--text)] font-black' : 'bg-[var(--surface)] text-[var(--text-muted)]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Container (Snap scrolling on mobile & tablet) */}
      <div className="kanban-snap-container min-h-[500px]">
        {columns
          .filter(col => activeMobileColumn === 'all' || activeMobileColumn === col.status)
          .map(col => {
            const colBookings = filteredBookings.filter(b => b.status === col.status);
            return (
              <div 
                key={col.status}
                className={`kanban-snap-col rounded-[20px] border p-3.5 flex flex-col ${col.chipStyle}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
                  <span className="text-xs font-heading font-bold text-[var(--text)] uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-xs">
                    {colBookings.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[640px]">
                  {colBookings.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-[14px]">
                      No bookings in {col.title}
                    </div>
                  ) : (
                    colBookings.map(b => (
                      <div
                        key={b.id}
                        className="nr-card p-3.5 space-y-2 text-xs relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#3FE0C5]">
                            {b.bookingRef}
                          </span>
                          <span className="font-mono font-bold text-[var(--text)] tabular-nums">
                            £{b.totalGbp.toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <p className="font-heading font-bold text-[var(--text)] text-sm">{b.customerName}</p>
                          <p className="text-xs text-[var(--text-muted)] font-mono">{b.scheduledTime} &bull; {b.vehicleCategory}</p>
                        </div>

                        {/* Postcodes */}
                        <div className="text-xs text-[var(--text-muted)] space-y-0.5 border-t border-[var(--border)] pt-1.5 font-mono">
                          <div className="truncate"><span className="text-[var(--text)] font-semibold">From:</span> {b.pickupAddress} ({b.pickupPostcode})</div>
                          <div className="truncate"><span className="text-[var(--text)] font-semibold">To:</span> {b.destinationAddress} ({b.destinationPostcode})</div>
                        </div>

                        {/* Flight / School Tags */}
                        {b.isAirportRun && (
                          <div className="px-2 py-0.5 rounded-full bg-[#3FE0C5]/15 text-[#0B2B26] dark:text-[#3FE0C5] text-[10px] font-semibold flex items-center gap-1 border border-[#3FE0C5]/30">
                            <Plane className="w-3 h-3" /> Flight {b.flightDetails?.flightNumber} ({b.flightDetails?.flightStatus})
                          </div>
                        )}

                        {b.isSchoolRun && (
                          <div className="px-2 py-0.5 rounded-full bg-[#8B9CFF]/15 text-[#3730A3] dark:text-[#8B9CFF] text-[10px] font-semibold flex items-center gap-1 border border-[#8B9CFF]/30">
                            <GraduationCap className="w-3 h-3" /> {b.schoolRunDetails?.contractName}
                          </div>
                        )}

                        {/* Driver/Vehicle Info or Assign Trigger */}
                        {b.assignedDriverId ? (
                          <div className="bg-[var(--surface-2)] p-2 rounded-[10px] flex items-center justify-between text-xs border border-[var(--border)]">
                            <span className="text-[var(--text)] font-medium truncate mr-2">
                              {staff.find(s => s.id === b.assignedDriverId)?.name}
                            </span>
                            <span className="font-mono font-bold text-[#B6F23C] shrink-0">
                              {vehicles.find(v => v.id === b.assignedVehicleId)?.registration}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(b)}
                            className="btn-danger w-full !text-xs !py-2 !min-h-[44px] shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Assign Driver &amp; Vehicle</span>
                          </button>
                        )}

                        {/* Tap-Based Drag-Drop Alternative: "Move to..." & Advance */}
                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-1 text-xs">
                          {/* Tap-based Stage Menu Alternative */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setMoveMenuBookingId(moveMenuBookingId === b.id ? null : b.id)}
                              className="px-2 py-1 rounded-[8px] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] font-semibold flex items-center gap-1 text-[11px] transition active:scale-95"
                              title="Move booking to another stage (tap-based alternative to drag-and-drop)"
                            >
                              <span>Move to...</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {/* Dropdown Options */}
                            {moveMenuBookingId === b.id && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={() => setMoveMenuBookingId(null)} />
                                <div className="absolute left-0 bottom-full mb-1 w-44 bg-[var(--surface)] text-[var(--text)] rounded-[14px] shadow-2xl border border-[var(--border)] py-1.5 z-40 text-left animate-in fade-in duration-150">
                                  <div className="px-2.5 py-1 text-[10px] font-mono text-[var(--text-muted)] uppercase border-b border-[var(--border)]">
                                    Change Stage
                                  </div>
                                  {(['unallocated', 'allocated', 'en_route', 'arrived', 'pob', 'completed'] as JobStatus[]).map(st => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        updateJobStatus(b.id, st);
                                        setMoveMenuBookingId(null);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-[var(--surface-2)] flex items-center justify-between ${
                                        b.status === st ? 'text-[#3FE0C5] font-bold' : ''
                                      }`}
                                    >
                                      <span className="capitalize">{st.replace('_', ' ')}</span>
                                      {b.status === st && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick 1-tap Next Step */}
                          <div className="font-heading font-bold">
                            {b.status === 'allocated' && (
                              <button onClick={() => updateJobStatus(b.id, 'en_route')} className="text-[#3FE0C5] hover:underline p-1">
                                En Route &rarr;
                              </button>
                            )}
                            {b.status === 'en_route' && (
                              <button onClick={() => updateJobStatus(b.id, 'arrived')} className="text-[#FF9F6B] hover:underline p-1">
                                Arrived &rarr;
                              </button>
                            )}
                            {b.status === 'arrived' && (
                              <button onClick={() => updateJobStatus(b.id, 'pob')} className="text-[#FFC24B] hover:underline p-1">
                                POB &rarr;
                              </button>
                            )}
                            {b.status === 'pob' && (
                              <button onClick={() => updateJobStatus(b.id, 'completed')} className="text-[#34D399] hover:underline p-1">
                                Clear Job &rarr;
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
          <div className="nr-card w-full rounded-t-[28px] p-5 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#3FE0C5]" />
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Filter Bookings
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                  Search Reference / Postcode
                </label>
                <input
                  type="text"
                  placeholder="e.g. DEC-881, LU1 3JW..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="nr-input text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                  Vehicle Category
                </label>
                <select
                  value={filterVehicleCategory}
                  onChange={e => setFilterVehicleCategory(e.target.value)}
                  className="nr-input text-base sm:text-xs cursor-pointer"
                >
                  <option value="all">All Vehicle Types</option>
                  <option value="Saloon">Saloon</option>
                  <option value="Executive">Executive</option>
                  <option value="MPV">MPV</option>
                  <option value="Wheelchair Accessible (WAV)">Wheelchair Accessible (WAV)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterVehicleCategory('all');
                  setShowMobileFilters(false);
                }}
                className="btn-ghost flex-1 !h-[48px] !text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary flex-1 !h-[48px] !text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Gate Allocation Modal */}
      {selectedBookingForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3FE0C5] block">
                  Dispatch Allocation Gate
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--text)] mt-0.5">
                  Assign {selectedBookingForAssign.bookingRef}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {selectedBookingForAssign.pickupPostcode} &rarr; {selectedBookingForAssign.destinationPostcode}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBookingForAssign(null)}
                className="p-1 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Blocking Banner */}
            {assignError && (
              <div className="p-3.5 rounded-[14px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-xs text-[#FF5D6C] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-heading font-bold">ALLOCATION BLOCKED (Safety Gate)</p>
                  <p className="text-[11px] mt-0.5 opacity-90">{assignError}</p>
                </div>
              </div>
            )}

            {/* Select Driver */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-[var(--text)]">
                Select Authorized Driver:
              </label>
              <select
                value={selectedDriverId}
                onChange={e => setSelectedDriverId(e.target.value)}
                className="nr-input !h-[44px] !px-3 !text-xs"
              >
                <option value="">-- Choose Driver --</option>
                {staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa').map(drv => (
                  <option key={drv.id} value={drv.id} className="bg-[var(--surface)] text-[var(--text)]">
                    {drv.name} ({drv.operationalClearance.toUpperCase()} - {drv.drivingLicence?.penaltyPoints ?? 0} pts)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[var(--text-muted)]">
                Tip: Marcus Bell has 6 penalty points (Restricted). Selecting him will trigger the clearance warning.
              </p>
            </div>

            {/* Select Vehicle */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-[var(--text)]">
                Select Fleet Vehicle:
              </label>
              <select
                value={selectedVehicleId}
                onChange={e => setSelectedVehicleId(e.target.value)}
                className="nr-input !h-[44px] !px-3 !text-xs font-mono"
              >
                <option value="">-- Choose Vehicle --</option>
                {vehicles.map(veh => (
                  <option key={veh.id} value={veh.id} className="bg-[var(--surface)] text-[var(--text)]">
                    {veh.registration} - {veh.make} {veh.model} ({veh.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[var(--text-muted)]">
                Tip: CB22 WPR is marked VOR Off-Road. Selecting it will trigger the safety gate block.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-[var(--border)] flex gap-2">
              <button
                onClick={() => setSelectedBookingForAssign(null)}
                className="btn-ghost flex-1 !text-xs !min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAssign}
                className="btn-primary flex-1 !text-xs !min-h-[44px]"
              >
                Verify &amp; Dispatch
              </button>
            </div>

          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="nr-card p-5 sm:p-6 w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-heading font-black text-base text-[var(--text)]">
                Create New UK Booking
              </h3>
              <button 
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">
                  Customer / Passenger Name <span className="text-[#FF5D6C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Catherine Howard"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  className="nr-input text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Pickup Address</label>
                  <input
                    type="text"
                    placeholder="Luton Airport Terminal"
                    value={newPickup}
                    onChange={e => setNewPickup(e.target.value)}
                    className="nr-input text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Pickup Postcode</label>
                  <input
                    type="text"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    placeholder="LU2 9QT"
                    value={newPickupPostcode}
                    onChange={e => setNewPickupPostcode(e.target.value.toUpperCase())}
                    className="nr-input font-mono font-bold uppercase text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Destination</label>
                  <input
                    type="text"
                    placeholder="Mayfair, London"
                    value={newDropoff}
                    onChange={e => setNewDropoff(e.target.value)}
                    className="nr-input text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Destination Postcode</label>
                  <input
                    type="text"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    placeholder="W1K 2AL"
                    value={newDropoffPostcode}
                    onChange={e => setNewDropoffPostcode(e.target.value.toUpperCase())}
                    className="nr-input font-mono font-bold uppercase text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Vehicle Category</label>
                  <select
                    value={newVehicleCategory}
                    onChange={e => setNewVehicleCategory(e.target.value as any)}
                    className="nr-input text-base sm:text-xs cursor-pointer"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Executive">Executive</option>
                    <option value="MPV">MPV</option>
                    <option value="Wheelchair Accessible (WAV)">Wheelchair Accessible (WAV)</option>
                  </select>
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Quoted Fare (GBP £)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newFareGbp}
                    onChange={e => setNewFareGbp(e.target.value)}
                    className="nr-input font-mono font-bold text-base sm:text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="btn-ghost flex-1 !h-[50px] !text-xs order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('New booking logged to dispatch queue!');
                  setIsNewBookingModalOpen(false);
                }}
                className="btn-primary flex-1 !h-[50px] !text-xs font-bold order-1 sm:order-2"
              >
                Save &amp; Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
