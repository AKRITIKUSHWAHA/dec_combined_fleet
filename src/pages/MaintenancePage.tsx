import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { VehicleDefect, WorkshopSlot } from '../types';
import { 
  Wrench, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  X, 
  Building2, 
  User, 
  Car, 
  Layers, 
  AlertCircle,
  FileText,
  Upload,
  Check,
  ChevronRight,
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { 
    defects, 
    vehicles, 
    bookings, 
    workshopSlots, 
    addWorkshopSlot, 
    triageDefect, 
    acknowledgeGarageAction, 
    verifyAndReleaseVehicle,
    reportDefect,
    assignBooking
  } = useData();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'defects' | 'planner'>('defects');

  // Defect review filter
  const [defectFilter, setDefectFilter] = useState<'all' | 'critical' | 'triaged' | 'booked' | 'released'>('all');

  // Modals state
  const [selectedDefectForTriage, setSelectedDefectForTriage] = useState<VehicleDefect | null>(null);
  const [triageDecision, setTriageDecision] = useState<'stop_use' | 'garage_before_next_duty' | 'book_by_date' | 'monitor'>('stop_use');
  const [triageBookByDate, setTriageBookByDate] = useState('2026-10-30');
  const [triageNotes, setTriageNotes] = useState('Critical brake fluid weeping requires workshop caliper bleed and pad renewal.');
  
  // New Defect Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReg, setReportReg] = useState(vehicles[0]?.registration || 'LT73 XKL');
  const [reportSeverity, setReportSeverity] = useState<'minor' | 'critical_safety'>('critical_safety');
  const [reportCategory, setReportCategory] = useState<'Brakes' | 'Tyres/Wheels' | 'Lights' | 'Steering' | 'Glass/Mirrors' | 'Ramp/Lift' | 'Bodywork' | 'Fluids'>('Brakes');
  const [reportDesc, setReportDesc] = useState('');
  const [reportPhoto, setReportPhoto] = useState(true);

  // Workshop Planner State
  const [plannerViewMode, setPlannerViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [isBookSlotOpen, setIsBookSlotOpen] = useState(false);
  const [newSlotReg, setNewSlotReg] = useState('LT73 XKL');
  const [newSlotBay, setNewSlotBay] = useState(1);
  const [newSlotStartTime, setNewSlotStartTime] = useState('10:00');
  const [newSlotEndTime, setNewSlotEndTime] = useState('13:00');
  const [newSlotType, setNewSlotType] = useState('Front suspension bush renewal');
  const [newSlotTech, setNewSlotTech] = useState('Dave Reynolds (Master Tech)');

  // Reallocate conflict modal
  const [conflictResolvedMsg, setConflictResolvedMsg] = useState<string | null>(null);

  // Filtered defects
  const filteredDefects = defects.filter(d => {
    if (defectFilter === 'critical') return d.severity === 'critical_safety';
    if (defectFilter === 'triaged') return d.status === 'triaged';
    if (defectFilter === 'booked') return d.status === 'booked_garage';
    if (defectFilter === 'released') return d.status === 'verified_released';
    return true;
  });

  // DISPATCH CONFLICT DETECTOR
  // Checks if any vehicle with a workshop downtime slot on selectedDate has an active booking overlapping
  const getDispatchConflicts = () => {
    const conflicts: {
      slot: WorkshopSlot;
      booking: any;
      vehicle: any;
    }[] = [];

    workshopSlots.forEach(slot => {
      // Find bookings on this vehicle
      const matchingVehicle = vehicles.find(v => v.registration === slot.vehicleReg);
      if (!matchingVehicle) return;

      const conflictingBooking = bookings.find(b => 
        b.assignedVehicleId === matchingVehicle.id &&
        (b.status === 'allocated' || b.status === 'en_route' || b.status === 'arrived' || b.status === 'pob')
      );

      if (conflictingBooking) {
        conflicts.push({
          slot,
          booking: conflictingBooking,
          vehicle: matchingVehicle
        });
      }
    });

    return conflicts;
  };

  const dispatchConflicts = getDispatchConflicts();

  const handleResolveConflict = (bookingId: string) => {
    // Find an alternative ready vehicle
    const altVeh = vehicles.find(v => v.status === 'available' && !v.isOffRoadReason);
    if (altVeh) {
      assignBooking(bookingId, 'drv-01', altVeh.id);
      setConflictResolvedMsg(`Booking reallocated to available vehicle ${altVeh.registration} (${altVeh.model}). Dispatch conflict cleared.`);
      setTimeout(() => setConflictResolvedMsg(null), 5000);
    }
  };

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefectForTriage) return;

    triageDefect(selectedDefectForTriage.id, triageDecision, triageBookByDate, triageNotes);
    setSelectedDefectForTriage(null);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    reportDefect({
      vehicleReg: reportReg,
      reportedByStaffId: 'DEC-DRV-01',
      reportedByName: 'Tariq Mahmood',
      severity: reportSeverity,
      category: reportCategory,
      description: reportDesc.trim(),
      photoUrl: reportPhoto ? 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=400' : undefined,
      status: 'reported'
    });

    setIsReportModalOpen(false);
    setReportDesc('');
  };

  const handleCreateWorkshopSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkshopSlot({
      vehicleReg: newSlotReg,
      bayNumber: newSlotBay,
      date: selectedDate,
      startTime: newSlotStartTime,
      endTime: newSlotEndTime,
      repairType: newSlotType,
      technician: newSlotTech,
      status: 'scheduled'
    });
    setIsBookSlotOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Defects, Garage Triage & Workshop Planner
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Defect triage decisions (Stop Use / Garage / Book by Date / Monitor), garage acknowledgment, 2-person release verification, and bay downtime planning.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('defects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'defects'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Defects & Triage Review ({defects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Workshop Planner ({workshopSlots.length})</span>
            {dispatchConflicts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* DISPATCH CONFLICT WARNING BANNER */}
      {dispatchConflicts.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 rounded-3xl shadow-lg space-y-2 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                  DISPATCH CONFLICT DETECTED: {dispatchConflicts.length} Vehicle(s) Scheduled for Workshop During Active Bookings!
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed mt-0.5">
                  Vehicles undergoing workshop downtime cannot fulfill passenger or school contract runs. Reallocate bookings immediately to prevent service failure.
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-mono font-bold text-xs uppercase shadow-xs shrink-0">
              High Priority
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {dispatchConflicts.map((conf, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {conf.slot.vehicleReg}
                    </span>
                    <span className="text-slate-500">
                      Bay {conf.slot.bayNumber} ({conf.slot.startTime} - {conf.slot.endTime}): <strong>{conf.slot.repairType}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    Clash Booking: {conf.booking.bookingRef} ({conf.booking.scheduledTime}) • Customer: {conf.booking.customerName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleResolveConflict(conf.booking.id)}
                  className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
                >
                  Auto-Substitute Available Vehicle
                </button>
              </div>
            ))}
          </div>

          {conflictResolvedMsg && (
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{conflictResolvedMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         TAB 1: DEFECTS REVIEW & TRIAGE SCREEN
         ========================================================================= */}
      {activeTab === 'defects' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Defects' },
                { id: 'critical', label: 'Critical Safety (VOR)' },
                { id: 'triaged', label: 'Triaged' },
                { id: 'booked', label: 'In Garage' },
                { id: 'released', label: 'Released (Signed-Off)' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDefectFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    defectFilter === f.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Vehicle Defect</span>
            </button>
          </div>

          {/* Defects Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDefects.map(defect => {
              const isCritical = defect.severity === 'critical_safety';

              return (
                <div
                  key={defect.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 shadow-sm space-y-4 text-xs transition ${
                    isCritical 
                      ? 'border-rose-300 dark:border-rose-900/80 ring-1 ring-rose-500/10' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Defect Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          {defect.defectRef}
                        </span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {defect.vehicleReg}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isCritical ? 'CRITICAL SAFETY (VOR)' : 'Minor Defect'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Reported by {defect.reportedByName} on {defect.reportedAt}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase text-[10px]">
                      {defect.category}
                    </span>
                  </div>

                  {/* Defect Description & Photo Thumbnail */}
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {defect.description}
                    </p>

                    {defect.photoUrl && (
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span className="text-[11px] text-slate-500">Inspection photo attached:</span>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          defect_evidence_01.jpg
                        </span>
                      </div>
                    )}
                  </div>

                  {/* DEFECT LIFECYCLE TIMELINE (5 STAGES) */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Defect Lifecycle Timeline
                    </span>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                      {[
                        { step: 1, label: 'Reported', active: true },
                        { step: 2, label: 'Triaged', active: defect.status !== 'reported' },
                        { step: 3, label: 'In Garage', active: defect.status === 'booked_garage' || defect.status === 'inspected_repaired' || defect.status === 'verified_released' },
                        { step: 4, label: 'Repaired', active: defect.status === 'inspected_repaired' || defect.status === 'verified_released' },
                        { step: 5, label: 'Released', active: defect.status === 'verified_released' }
                      ].map((st, i) => (
                        <div key={st.step} className="flex items-center gap-1">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            st.active 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            {st.active ? '✓' : st.step}
                          </span>
                          <span className={st.active ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GARAGE ACTION CARD WITH ACKNOWLEDGE BUTTON */}
                  {defect.garageAction && (
                    <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          Workshop Booking & Garage Action
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          Est: £{defect.garageAction.costEstimateGbp.toFixed(2)}
                        </span>
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white">
                        {defect.garageAction.garageName}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Appointment: <strong>{defect.garageAction.appointmentDate}</strong></span>
                        <span>Tech: {defect.garageAction.repairedBy || 'Lead Mechanic'}</span>
                      </div>

                      {/* Garage Acknowledge Button */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        {defect.acknowledgedByGarage ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Acknowledged by Workshop ({defect.acknowledgedAt || 'Today 08:30'})</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => acknowledgeGarageAction(defect.id)}
                            className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Acknowledge Defect & Intake to Bay</span>
                          </button>
                        )}

                        {/* Second Person Sign-off Release Verification */}
                        {defect.status !== 'verified_released' && (
                          <button
                            type="button"
                            onClick={() => verifyAndReleaseVehicle(defect.id, 'Alan Cooper (Fleet Compliance Lead)')}
                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Sign-Off & Release to Service</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Decision Actions Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Current Decision: <strong className="uppercase text-slate-700 dark:text-slate-300">{defect.triageDecision || 'Pending Triage'}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDefectForTriage(defect);
                        setTriageDecision(defect.triageDecision || 'stop_use');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Triage Decision Options &rarr;
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 2: WORKSHOP PLANNER (DAY / WEEK VIEW)
         ========================================================================= */}
      {activeTab === 'planner' && (
        <div className="space-y-4">
          
          {/* Planner Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('day')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    plannerViewMode === 'day' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-500'
                  }`}
                >
                  Day View
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('week')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    plannerViewMode === 'week' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-500'
                  }`}
                >
                  Week View
                </button>
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsBookSlotOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Workshop Downtime Slot</span>
            </button>
          </div>

          {/* Workshop Service Bays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(bayNumber => {
              const baySlots = workshopSlots.filter(s => s.bayNumber === bayNumber);

              return (
                <div key={bayNumber} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>Service Bay #{bayNumber}</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {baySlots.length} Booked Slot{baySlots.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {baySlots.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      Bay is available for maintenance bookings.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {baySlots.map(slot => (
                        <div
                          key={slot.id}
                          className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              {slot.vehicleReg}
                            </span>
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>

                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {slot.repairType}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span>Tech: {slot.technician}</span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] uppercase">
                              {slot.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TRIAGE DECISION MODAL */}
      {selectedDefectForTriage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <form onSubmit={handleTriageSubmit} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Triage Decision Review: {selectedDefectForTriage.defectRef}
                </h3>
                <p className="text-xs text-slate-500">
                  Vehicle: {selectedDefectForTriage.vehicleReg} • {selectedDefectForTriage.category}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedDefectForTriage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Select Safety & Workshop Action:
              </label>

              {/* 4 Required Decision Options */}
              {[
                { id: 'stop_use', title: '1. Stop Use Immediately (VOR Block)', desc: 'Enforces vehicle off-road block immediately. Prohibited from all dispatch.', color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200' },
                { id: 'garage_before_next_duty', title: '2. Garage Before Next Duty', desc: 'Can complete current shift but barred from subsequent runs until inspected.', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200' },
                { id: 'book_by_date', title: '3. Book by Date', desc: 'Non-critical advisory repair with a scheduled garage appointment deadline.', color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200' },
                { id: 'monitor', title: '4. Monitor', desc: 'Cosmetic or minor advisory. Checked during routine daily walkaround inspections.', color: 'border-slate-400 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-2xl border-2 block cursor-pointer transition ${
                    triageDecision === opt.id ? `${opt.color} ring-2 ring-blue-500/30` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="decision"
                      value={opt.id}
                      checked={triageDecision === opt.id}
                      onChange={() => setTriageDecision(opt.id as any)}
                      className="text-blue-600"
                    />
                    <span className="font-bold">{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                    {opt.desc}
                  </p>
                </label>
              ))}

              {triageDecision === 'book_by_date' && (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Booking Deadline Date:
                  </label>
                  <input
                    type="date"
                    value={triageBookByDate}
                    onChange={(e) => setTriageBookByDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mechanic / Controller Notes:
                </label>
                <textarea
                  rows={2}
                  value={triageNotes}
                  onChange={(e) => setTriageNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDefectForTriage(null)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Apply Triage Decision
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPORT DEFECT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <form onSubmit={handleCreateReport} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Log New Vehicle Defect
              </h3>
              <button type="button" onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Vehicle Registration:
                  </label>
                  <select
                    value={reportReg}
                    onChange={(e) => setReportReg(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.registration}>{v.registration} ({v.model})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Severity:
                  </label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="critical_safety">CRITICAL SAFETY (VOR)</option>
                    <option value="minor">Minor Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Defect Category:
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                >
                  <option value="Brakes">Brakes & Hydraulics</option>
                  <option value="Tyres/Wheels">Tyres & Wheel Nuts</option>
                  <option value="Lights">Exterior Lights & Indicators</option>
                  <option value="Steering">Steering & Suspension</option>
                  <option value="Ramp/Lift">Wheelchair Ramp / Hydraulic Lift</option>
                  <option value="Glass/Mirrors">Glass & Mirrors</option>
                  <option value="Fluids">Fluids & Leaks</option>
                  <option value="Bodywork">Bodywork</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description of Fault:
                </label>
                <textarea
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe exact defect, noise, warning lamp, or damage..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportPhoto}
                  onChange={(e) => setReportPhoto(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Attach photographic evidence</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Submit Defect Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOOK WORKSHOP SLOT MODAL */}
      {isBookSlotOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <form onSubmit={handleCreateWorkshopSlot} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule Workshop Bay Slot
              </h3>
              <button type="button" onClick={() => setIsBookSlotOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Vehicle:
                </label>
                <select
                  value={newSlotReg}
                  onChange={(e) => setNewSlotReg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.registration}>{v.registration} ({v.model})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bay #:
                  </label>
                  <select
                    value={newSlotBay}
                    onChange={(e) => setNewSlotBay(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                  >
                    <option value={1}>Bay 1</option>
                    <option value={2}>Bay 2</option>
                    <option value={3}>Bay 3</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Start:
                  </label>
                  <input
                    type="time"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    End:
                  </label>
                  <input
                    type="time"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Repair Task / Maintenance Operation:
                </label>
                <input
                  type="text"
                  value={newSlotType}
                  onChange={(e) => setNewSlotType(e.target.value)}
                  placeholder="e.g. 6-Month Council Inspection Preparation"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Technician:
                </label>
                <input
                  type="text"
                  value={newSlotTech}
                  onChange={(e) => setNewSlotTech(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBookSlotOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Book Slot
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
