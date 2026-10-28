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
  ShieldAlert
} from 'lucide-react';
import { Booking, JobStatus } from '../types';

export const BookingsPage: React.FC = () => {
  const { bookings, vehicles, staff, assignBooking, updateJobStatus } = useData();
  const { selectedCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  
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
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.bookingRef.toLowerCase().includes(q) ||
             b.customerName.toLowerCase().includes(q) ||
             b.pickupPostcode.toLowerCase().includes(q) ||
             b.destinationPostcode.toLowerCase().includes(q);
    }
    return true;
  });

  const columns: { status: JobStatus; title: string; color: string }[] = [
    { status: 'unallocated', title: 'Unallocated', color: 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20' },
    { status: 'allocated', title: 'Allocated', color: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20' },
    { status: 'en_route', title: 'En Route', color: 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20' },
    { status: 'arrived', title: 'Arrived', color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20' },
    { status: 'pob', title: 'Passenger on Board', color: 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20' },
    { status: 'completed', title: 'Completed', color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' }
  ];

  const handleOpenAssignModal = (b: Booking) => {
    setSelectedBookingForAssign(b);
    setSelectedDriverId('');
    setSelectedVehicleId('');
    setAssignError(null);
  };

  const handleExecuteAssign = () => {
    if (!selectedBookingForAssign || !selectedDriverId || !selectedVehicleId) {
      setAssignError('Please select both a driver and a vehicle.');
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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Bookings & Dispatch Board</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              {filteredBookings.length} Active
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Lifecycle tracking: Unallocated &rarr; Allocated &rarr; En Route &rarr; Arrived &rarr; POB &rarr; Completed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ref, postcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none w-40 sm:w-52"
            />
          </div>

          {/* New Booking Button */}
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Warning Callout */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Safety Gate Automation:</strong> System actively checks vehicle VOR/MOT status and DVLA licence points before permitting any driver/vehicle allocation.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
          UK Standard Rule
        </span>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 min-h-[500px]">
        {columns.map(col => {
          const colBookings = filteredBookings.filter(b => b.status === col.status);
          return (
            <div 
              key={col.status}
              className={`rounded-xl border p-2.5 flex flex-col ${col.color} border-slate-200 dark:border-slate-800`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                  {colBookings.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[600px]">
                {colBookings.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    No bookings
                  </div>
                ) : (
                  colBookings.map(b => (
                    <div
                      key={b.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {b.bookingRef}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          £{b.totalGbp.toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{b.customerName}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{b.scheduledTime} • {b.vehicleCategory}</p>
                      </div>

                      {/* Postcodes */}
                      <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                        <div className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">From:</span> {b.pickupPostcode}</div>
                        <div className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">To:</span> {b.destinationPostcode}</div>
                      </div>

                      {/* Flight / School Tags */}
                      {b.isAirportRun && (
                        <div className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-semibold flex items-center gap-1">
                          <Plane className="w-3 h-3" /> Flight {b.flightDetails?.flightNumber} ({b.flightDetails?.flightStatus})
                        </div>
                      )}

                      {b.isSchoolRun && (
                        <div className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> {b.schoolRunDetails?.contractName}
                        </div>
                      )}

                      {/* Driver/Vehicle Info or Assign Trigger */}
                      {b.assignedDriverId ? (
                        <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-300">
                            {staff.find(s => s.id === b.assignedDriverId)?.name}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {vehicles.find(v => v.id === b.assignedVehicleId)?.registration}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(b)}
                          className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign Driver & Car</span>
                        </button>
                      )}

                      {/* Action buttons to simulate driver tapping status */}
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                        <span>Advance:</span>
                        <div className="flex gap-1">
                          {b.status === 'allocated' && (
                            <button onClick={() => updateJobStatus(b.id, 'en_route')} className="text-blue-600 font-bold hover:underline">
                              En Route &rarr;
                            </button>
                          )}
                          {b.status === 'en_route' && (
                            <button onClick={() => updateJobStatus(b.id, 'arrived')} className="text-amber-600 font-bold hover:underline">
                              Arrived &rarr;
                            </button>
                          )}
                          {b.status === 'arrived' && (
                            <button onClick={() => updateJobStatus(b.id, 'pob')} className="text-purple-600 font-bold hover:underline">
                              POB &rarr;
                            </button>
                          )}
                          {b.status === 'pob' && (
                            <button onClick={() => updateJobStatus(b.id, 'completed')} className="text-emerald-600 font-bold hover:underline">
                              Job Clear &rarr;
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

      {/* Safety Gate Allocation Modal */}
      {selectedBookingForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Dispatch Allocation Gate
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assign {selectedBookingForAssign.bookingRef}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBookingForAssign.pickupPostcode} &rarr; {selectedBookingForAssign.destinationPostcode}
                </p>
              </div>
              <button 
                onClick={() => setSelectedBookingForAssign(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Blocking Banner */}
            {assignError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">ALLOCATION BLOCKED (Safety Gate)</p>
                  <p className="text-[11px] mt-0.5">{assignError}</p>
                </div>
              </div>
            )}

            {/* Select Driver */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Authorized Driver:
              </label>
              <select
                value={selectedDriverId}
                onChange={e => setSelectedDriverId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Driver --</option>
                {staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa').map(drv => (
                  <option key={drv.id} value={drv.id}>
                    {drv.name} ({drv.operationalClearance.toUpperCase()} - {drv.drivingLicence?.penaltyPoints ?? 0} pts)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                Tip: Marcus Bell has 6 penalty points (Restricted). Selecting him will trigger the clearance warning.
              </p>
            </div>

            {/* Select Vehicle */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Fleet Vehicle:
              </label>
              <select
                value={selectedVehicleId}
                onChange={e => setSelectedVehicleId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Vehicle --</option>
                {vehicles.map(veh => (
                  <option key={veh.id} value={veh.id}>
                    {veh.registration} - {veh.make} {veh.model} ({veh.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                Tip: CB22 WPR is marked VOR Off-Road. Selecting it will trigger the safety gate block.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setSelectedBookingForAssign(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAssign}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
              >
                Verify & Dispatch
              </button>
            </div>

          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create New UK Booking
              </h3>
              <button onClick={() => setIsNewBookingModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Customer / Passenger Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lady Catherine Howard"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Pickup Address</label>
                  <input
                    type="text"
                    placeholder="Luton Airport Terminal"
                    value={newPickup}
                    onChange={e => setNewPickup(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pickup Postcode</label>
                  <input
                    type="text"
                    placeholder="LU2 9QT"
                    value={newPickupPostcode}
                    onChange={e => setNewPickupPostcode(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Mayfair, London"
                    value={newDropoff}
                    onChange={e => setNewDropoff(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Destination Postcode</label>
                  <input
                    type="text"
                    placeholder="W1K 2AL"
                    value={newDropoffPostcode}
                    onChange={e => setNewDropoffPostcode(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Vehicle Category</label>
                  <select
                    value={newVehicleCategory}
                    onChange={e => setNewVehicleCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Executive">Executive</option>
                    <option value="MPV">MPV</option>
                    <option value="Wheelchair Accessible (WAV)">Wheelchair Accessible (WAV)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Quoted Fare (GBP £)</label>
                  <input
                    type="text"
                    value={newFareGbp}
                    onChange={e => setNewFareGbp(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('New booking logged to dispatch queue!');
                  setIsNewBookingModalOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save & Post to Board
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
