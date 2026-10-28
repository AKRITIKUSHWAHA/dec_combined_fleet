import React, { useState } from 'react';
import { Booking, DriverPAProfile, Vehicle } from '../../types';
import { useData } from '../../context/DataContext';
import { 
  X, 
  User, 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Accessibility, 
  GraduationCap, 
  Plane,
  AlertCircle
} from 'lucide-react';

interface AllocationDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SuitabilityCheckResult {
  isBlocked: boolean;
  reasons: string[];
  etaMinutes: number;
  vehicle: Vehicle | undefined;
}

export const AllocationDrawer: React.FC<AllocationDrawerProps> = ({ booking, isOpen, onClose }) => {
  const { staff, vehicles, bookings, assignBooking } = useData();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [allocationSuccess, setAllocationSuccess] = useState<string | null>(null);
  const [selectedPAId, setSelectedPAId] = useState<string | undefined>(undefined);

  if (!isOpen || !booking) return null;

  // Filter only drivers or dual role staff
  const driverStaff = staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa');
  const paStaff = staff.filter(s => s.role === 'pa' || s.role === 'dual_driver_pa');

  // Evaluate suitability and calculate ETA for each driver
  const evaluateDriverSuitability = (driver: DriverPAProfile): SuitabilityCheckResult => {
    const reasons: string[] = [];
    let isBlocked = false;

    // Find driver's assigned vehicle
    const vehicle = vehicles.find(v => v.registration === driver.currentVehicleReg || v.assignedDriverId === driver.id);

    // 1. Operational Clearance Gate
    if (driver.operationalClearance === 'restricted') {
      isBlocked = true;
      reasons.push(`BLOCKED: Operational clearance restricted. ${driver.clearanceReason || 'Compliance hold'}`);
    }

    // 2. Licence Points Gate (Safety policy: max 6 points)
    if (driver.drivingLicence && driver.drivingLicence.penaltyPoints >= 6) {
      isBlocked = true;
      reasons.push(`BLOCKED: DVLA licence points (${driver.drivingLicence.penaltyPoints} pts) exceed safety threshold.`);
    }

    // 3. Licence Validity Gate
    if (driver.drivingLicence && driver.drivingLicence.dvlaStatus !== 'valid') {
      isBlocked = true;
      reasons.push(`BLOCKED: DVLA licence status is ${driver.drivingLicence.dvlaStatus.toUpperCase()}. Road use prohibited.`);
    }

    // 4. Vehicle Availability & Off-Road Gate
    if (!vehicle) {
      isBlocked = true;
      reasons.push('BLOCKED: No vehicle assigned to this driver.');
    } else {
      if (vehicle.status === 'blocked_off_road') {
        isBlocked = true;
        reasons.push(`BLOCKED: Assigned vehicle (${vehicle.registration}) is VOR Off-Road. Reason: ${vehicle.isOffRoadReason || 'Critical defect'}.`);
      }
      if (vehicle.annualDvsaMot.status === 'expired') {
        isBlocked = true;
        reasons.push(`BLOCKED: Annual DVSA MOT expired on ${vehicle.annualDvsaMot.expiryDate}.`);
      }
      if (vehicle.councilSixMonthInspection.status === 'expired') {
        isBlocked = true;
        reasons.push(`BLOCKED: Council 6-month inspection test expired on ${vehicle.councilSixMonthInspection.dueDate}.`);
      }

      // 5. Wheelchair Requirement Gate
      if (booking.requiresWheelchair && !vehicle.hasRampOrLift) {
        isBlocked = true;
        reasons.push(`BLOCKED: Booking requires Wheelchair Ramp / Tail Lift, but ${vehicle.model} lacks ramp.`);
      }

      // 6. Capacity Check
      if (booking.passengerCount > vehicle.seatingCapacity) {
        isBlocked = true;
        reasons.push(`BLOCKED: Booking requires ${booking.passengerCount} seats; vehicle has only ${vehicle.seatingCapacity} seats.`);
      }

      // 7. Daily Check Verification Gate
      if (vehicle.todayCheckStatus === 'missing') {
        reasons.push(`WARNING: Pre-use daily walkaround check has NOT been completed today for ${vehicle.registration}.`);
      }
    }

    // 8. Schedule Clash Check
    const activeDriverJobs = bookings.filter(b => 
      b.id !== booking.id && 
      b.assignedDriverId === driver.id && 
      (b.status === 'allocated' || b.status === 'en_route' || b.status === 'arrived' || b.status === 'pob')
    );
    if (activeDriverJobs.length > 0) {
      const clash = activeDriverJobs[0];
      if (clash.scheduledTime === booking.scheduledTime) {
        isBlocked = true;
        reasons.push(`BLOCKED: Schedule clash with active booking ${clash.bookingRef} scheduled at ${clash.scheduledTime}.`);
      } else {
        reasons.push(`INFO: Driver currently assigned to ${clash.bookingRef} (${clash.status}) at ${clash.scheduledTime}.`);
      }
    }

    // 9. PA Certification if booking requires PA
    if (booking.requiresPA && !selectedPAId && driver.role !== 'dual_driver_pa') {
      reasons.push('NOTE: Booking requires Passenger Assistant (PA). Select a qualified PA below or assign a dual-qualified driver.');
    }

    // Calculate approximate ETA in minutes based on location or default
    let etaMinutes = 8;
    if (driver.currentLocation) {
      if (driver.dutyStatus === 'available') etaMinutes = 6;
      else if (driver.dutyStatus === 'on_job') etaMinutes = 14;
      else etaMinutes = 25;
    } else {
      etaMinutes = driver.onDuty ? 12 : 30;
    }

    return {
      isBlocked,
      reasons,
      etaMinutes,
      vehicle
    };
  };

  const handleAllocate = (driverId: string) => {
    const driver = staff.find(s => s.id === driverId);
    if (!driver) return;

    const vehicle = vehicles.find(v => v.registration === driver.currentVehicleReg || v.assignedDriverId === driver.id);
    if (!vehicle) return;

    const res = assignBooking(booking.id, driver.id, vehicle.id, selectedPAId);
    if (res.success) {
      setAllocationSuccess(`Successfully allocated ${driver.name} with vehicle ${vehicle.registration}`);
      setTimeout(() => {
        setAllocationSuccess(null);
        onClose();
      }, 1200);
    } else {
      alert(`Allocation Failed: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {booking.bookingRef}
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {booking.scheduledTime}
              </span>
              {booking.isAirportRun && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Plane className="w-3 h-3" /> Airport Run
                </span>
              )}
              {booking.isSchoolRun && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> SEN School
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Dispatch Allocation Drawer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {booking.customerName} • £{booking.totalGbp.toFixed(2)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Journey Summary Strip */}
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Pickup:</span>
              <p className="font-semibold text-slate-900 dark:text-white">{booking.pickupAddress} ({booking.pickupPostcode})</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Drop-off:</span>
              <p className="font-semibold text-slate-900 dark:text-white">{booking.destinationAddress} ({booking.destinationPostcode})</p>
            </div>
          </div>

          {/* Special Requirements Pill Bar */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Category: {booking.vehicleCategory}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Passengers: {booking.passengerCount} (Luggage: {booking.luggageCount})
            </span>
            {booking.requiresWheelchair && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1 border border-blue-300 dark:border-blue-800">
                <Accessibility className="w-3 h-3" /> Requires WAV Ramp
              </span>
            )}
            {booking.requiresPA && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                <ShieldCheck className="w-3 h-3" /> Requires PA Escort
              </span>
            )}
          </div>
        </div>

        {/* Optional PA Selection if booking requires PA */}
        {booking.requiresPA && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 text-xs space-y-1.5">
            <label className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Select Accompanying Passenger Assistant (PA):</span>
            </label>
            <select
              value={selectedPAId || ''}
              onChange={(e) => setSelectedPAId(e.target.value || undefined)}
              className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="">-- Choose Vetted PA --</option>
              {paStaff.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.assignedDepot}) {p.dbsCheck?.updateServiceRegistered ? '✓ DBS Verified' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Allocation Success Alert */}
        {allocationSuccess && (
          <div className="m-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold">{allocationSuccess}</span>
          </div>
        )}

        {/* Drivers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>SUGGESTED DRIVERS (Ranked by Proximity & Suitability)</span>
            <span>{driverStaff.length} available</span>
          </div>

          {driverStaff.map((driver) => {
            const evalResult = evaluateDriverSuitability(driver);
            const isSelected = selectedDriverId === driver.id;

            return (
              <div
                key={driver.id}
                className={`p-4 rounded-2xl border transition relative space-y-3 ${
                  evalResult.isBlocked
                    ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500'
                }`}
              >
                {/* Driver Profile & ETA Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200">
                      {driver.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {driver.name}
                        </h4>
                        {driver.role === 'dual_driver_pa' && (
                          <span className="text-[9px] font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded">
                            Driver + PA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {driver.assignedDepot} • Badge: {driver.taxiBadge?.badgeNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* ETA Badge */}
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      evalResult.isBlocked
                        ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      <Zap className="w-3 h-3" />
                      ETA ~{evalResult.etaMinutes}m
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Status: {driver.dutyStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Assigned Vehicle details */}
                {evalResult.vehicle && (
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {evalResult.vehicle.registration}
                      </span>
                      <span className="text-slate-400">({evalResult.vehicle.model})</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      {evalResult.vehicle.hasRampOrLift ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ WAV Ramp</span>
                      ) : (
                        <span className="text-slate-400">No Ramp</span>
                      )}
                      <span>Seats: {evalResult.vehicle.seatingCapacity}</span>
                    </div>
                  </div>
                )}

                {/* Unsuitability / Gate Reasons */}
                {evalResult.reasons.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    {evalResult.reasons.map((reason, idx) => {
                      const isBlockReason = reason.startsWith('BLOCKED:');
                      const isWarnReason = reason.startsWith('WARNING:');

                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl flex items-start gap-2 ${
                            isBlockReason
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                              : isWarnReason
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                                : 'bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {isBlockReason ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          ) : isWarnReason ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{reason}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Allocation Action Button: Blocked items cannot be allocated! */}
                <div className="pt-1">
                  {evalResult.isBlocked ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>Allocation Blocked by Safety Gate</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAllocate(driver.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Allocate Driver to Booking</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
