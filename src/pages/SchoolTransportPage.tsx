import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { useCompany } from '../context/CompanyContext';
import { SchoolRoute, Pupil } from '../types';
import { 
  GraduationCap, 
  Car, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  ArrowRight, 
  UserCheck, 
  UserX, 
  PenTool, 
  Send, 
  Plus, 
  AlertCircle, 
  Calendar,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

export const SchoolTransportPage: React.FC = () => {
  const { 
    schoolRoutes, 
    staff, 
    vehicles, 
    updatePupilAttendance, 
    completeDriverSweep, 
    countersignPASweep, 
    reassignSchoolRouteTeam 
  } = useData();

  const { currentRole } = useRole();
  const { subCompanies } = useCompany();

  // Active view filters
  const [selectedAmPm, setSelectedAmPm] = useState<'all' | 'AM' | 'PM'>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(schoolRoutes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [councilFilter, setCouncilFilter] = useState('all');

  // Modals state
  const [isSweepModalOpen, setIsSweepModalOpen] = useState(false);
  const [sweepNotes, setSweepNotes] = useState('');
  const [isCountersignModalOpen, setIsCountersignModalOpen] = useState(false);
  const [paSignerName, setPaSignerName] = useState('Sarah Jenkins (Lead PA)');
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  
  // Reassign form state
  const [reassignDriverId, setReassignDriverId] = useState('');
  const [reassignVehicleReg, setReassignVehicleReg] = useState('');
  const [reassignPA1Id, setReassignPA1Id] = useState('');
  const [reassignPA2Id, setReassignPA2Id] = useState('');

  // Pupil Absence Modal
  const [absenceModalPupil, setAbsenceModalPupil] = useState<Pupil | null>(null);
  const [absenceReasonText, setAbsenceReasonText] = useState('Medical appointment');

  // Filter routes
  const filteredRoutes = schoolRoutes.filter(route => {
    if (selectedAmPm !== 'all' && route.amOrPm !== selectedAmPm) return false;
    if (councilFilter !== 'all' && route.contractCouncil !== councilFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = route.routeCode.toLowerCase().includes(q);
      const matchSchool = route.schoolName.toLowerCase().includes(q);
      const matchDriver = route.assignedDriverName.toLowerCase().includes(q);
      const matchVehicle = route.assignedVehicleReg.toLowerCase().includes(q);
      if (!matchCode && !matchSchool && !matchDriver && !matchVehicle) return false;
    }
    return true;
  });

  const activeRoute = schoolRoutes.find(r => r.id === selectedRouteId) || filteredRoutes[0] || schoolRoutes[0];

  // Helper counts
  const totalPupils = schoolRoutes.reduce((acc, r) => acc + r.pupils.length, 0);
  const boardedCount = activeRoute ? activeRoute.pupils.filter(p => p.attendanceStatus === 'boarded').length : 0;
  const deliveredCount = activeRoute ? activeRoute.pupils.filter(p => p.attendanceStatus === 'handed_over').length : 0;
  const absentCount = activeRoute ? activeRoute.pupils.filter(p => p.attendanceStatus === 'absent').length : 0;

  const handleOpenReassignModal = () => {
    if (!activeRoute) return;
    setReassignDriverId(activeRoute.assignedDriverId);
    setReassignVehicleReg(activeRoute.assignedVehicleReg);
    setReassignPA1Id(activeRoute.assignedPA1Id);
    setReassignPA2Id(activeRoute.assignedPA2Id || '');
    setIsReassignModalOpen(true);
  };

  const handleSaveReassignment = () => {
    if (!activeRoute) return;
    reassignSchoolRouteTeam(
      activeRoute.id,
      reassignDriverId,
      reassignVehicleReg,
      reassignPA1Id,
      reassignPA2Id || undefined
    );
    setIsReassignModalOpen(false);
  };

  const handleConfirmSweepDriver = () => {
    if (!activeRoute) return;
    completeDriverSweep(activeRoute.id, sweepNotes);
    setIsSweepModalOpen(false);
  };

  const handleConfirmCountersignPA = () => {
    if (!activeRoute) return;
    countersignPASweep(activeRoute.id, paSignerName);
    setIsCountersignModalOpen(false);
  };

  const handleRecordAbsence = () => {
    if (!activeRoute || !absenceModalPupil) return;
    updatePupilAttendance(activeRoute.id, absenceModalPupil.id, 'absent', absenceReasonText);
    setAbsenceModalPupil(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              SEN School Transport Operations
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Phase 7
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Council SEN frameworks (Central Beds, Luton, Herts), AM/PM runs, dedicated 2-PA safety teams, live attendance handovers, and mandatory post-run child sweeps with PA countersignature.
          </p>
        </div>

        {/* AM / PM Run Switcher */}
        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setSelectedAmPm('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedAmPm === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Runs
          </button>
          <button
            onClick={() => setSelectedAmPm('AM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedAmPm === 'AM'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>AM Run (Morning Inbound)</span>
          </button>
          <button
            onClick={() => setSelectedAmPm('PM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedAmPm === 'PM'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>PM Run (Afternoon Return)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active School Routes</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{schoolRoutes.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Transported Students</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{totalPupils}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">PA Escort Allocations</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {schoolRoutes.reduce((acc, r) => acc + (r.assignedPA2Id ? 2 : 1), 0)}
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                Dual PAs Active
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pending PA Countersign</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                {schoolRoutes.filter(r => r.status === 'sweep_pending_pa').length}
              </p>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                Gate Blocked
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Route Selector, Right Route Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Routes Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search route code, school, driver..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={councilFilter}
              onChange={e => setCouncilFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Sponsoring Councils</option>
              <option value="Central Bedfordshire">Central Bedfordshire Council</option>
              <option value="Luton">Luton Borough Council</option>
              <option value="Hertfordshire">Hertfordshire County Council</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filteredRoutes.map(route => {
              const isSelected = activeRoute?.id === route.id;
              const hasTwoPAs = !!route.assignedPA2Id;
              const isSweepBlocked = route.status === 'sweep_pending_pa';

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {route.routeCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        route.amOrPm === 'AM' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {route.amOrPm} Run
                      </span>
                    </div>

                    {isSweepBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse border border-amber-300">
                        <Lock className="w-3 h-3" />
                        Sweep Pending PA
                      </span>
                    ) : route.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed & Freed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        In Progress
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {route.schoolName}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Vehicle & Driver:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {route.assignedVehicleReg} ΓÇó {route.assignedDriverName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assigned PAs:</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        {hasTwoPAs ? '2 PAs Allocated (WAV High Care)' : '1 Dedicated PA'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Route Deep-Dive (8 cols) */}
        {activeRoute && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Route Banner Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {activeRoute.routeCode}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Contract: {activeRoute.contractRef} ({activeRoute.contractCouncil} Council)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Destination: <strong className="text-slate-800 dark:text-slate-200">{activeRoute.schoolName}</strong> ΓÇó Scheduled {activeRoute.scheduledStartTime} - {activeRoute.scheduledEndTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenReassignModal}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Reassign Team
                  </button>
                </div>
              </div>

              {/* Assigned Crew Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Driver */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Driver</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Car className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{activeRoute.assignedDriverName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Reg: {activeRoute.assignedVehicleReg}</span>
                    </div>
                  </div>
                </div>

                {/* Lead PA */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Passenger Assistant</span>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{activeRoute.assignedPA1Name}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">PAT & First Aid Certified</span>
                    </div>
                  </div>
                </div>

                {/* Second PA (if dual wheelchair / complex care) */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Second Passenger Assistant</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div>
                      {activeRoute.assignedPA2Name ? (
                        <>
                          <p className="text-xs font-black text-slate-900 dark:text-white">{activeRoute.assignedPA2Name}</p>
                          <span className="text-[10px] text-purple-600 font-semibold">Mandated SEN 2nd Escort</span>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Not mandated for this route</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUTORY CHILD SWEEP & PA COUNTERSIGNATURE SAFETY GATE */}
              <div className={`p-4 rounded-xl border-2 transition ${
                activeRoute.sweepDetails?.paCountersigned
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : activeRoute.sweepDetails?.driverCompleted
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {activeRoute.sweepDetails?.paCountersigned ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          End-of-Run Vehicle Sweep & PA Countersignature Gate
                        </h4>
                        {activeRoute.sweepDetails?.paCountersigned ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                            Fully Released
                          </span>
                        ) : activeRoute.sweepDetails?.driverCompleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white animate-pulse">
                            Driver Blocked: Awaiting PA Countersignature
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            Run Incomplete
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        UK statutory council compliance rule: The driver CANNOT be assigned to any subsequent booking until a physical sweep is executed by the driver AND verified with a digital countersignature by the Passenger Assistant.
                      </p>

                      {activeRoute.sweepDetails?.paCountersigned && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                          Γ£ô Sweep verified by PA {activeRoute.sweepDetails.paSignatureName} at {activeRoute.sweepDetails.paTimestamp}. Driver & vehicle released to available pool.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!activeRoute.sweepDetails?.driverCompleted && (
                      <button
                        onClick={() => setIsSweepModalOpen(true)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Driver Sweep Sign-Off
                      </button>
                    )}

                    {activeRoute.sweepDetails?.driverCompleted && !activeRoute.sweepDetails?.paCountersigned && (
                      <button
                        onClick={() => setIsCountersignModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
                      >
                        <PenTool className="w-4 h-4" />
                        PA Countersign & Unlock Driver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Manifest Roll & Handover Tracking */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Pupil Attendance & Handover Manifest ({activeRoute.pupils.length} Students)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Boarded: {boardedCount} ΓÇó Handed Over: {deliveredCount} ΓÇó Absent: {absentCount}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student & Age</th>
                      <th className="py-3 px-4">Pickup Address & Handover</th>
                      <th className="py-3 px-4">SEN Care & Medical Alerts</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Attendance State</th>
                      <th className="py-3 px-4 text-right">Handover Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeRoute.pupils.map(p => {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 dark:text-white text-sm block">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Age: {p.age} years old
                            </span>
                          </td>

                          {/* Pickup */}
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {p.pickupAddress}
                            </p>
                            {p.pickupTimestamp && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                                Boarded at {p.pickupTimestamp} (Signed: {p.handoverPerson})
                              </span>
                            )}
                          </td>

                          {/* Needs & Alerts */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium block">
                                {p.specialNeeds}
                              </span>
                              {p.wheelchairUser && (
                                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                  Wheelchair Clamp Required
                                </span>
                              )}
                              {p.medicalAlert && (
                                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ml-1">
                                  {p.medicalAlert}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Emergency Contact */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {p.emergencyContact.name}
                            </span>
                            <span className="text-slate-400">{p.emergencyContact.phone}</span>
                          </td>

                          {/* Attendance Status */}
                          <td className="py-3.5 px-4">
                            {p.attendanceStatus === 'boarded' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                                On Board Vehicle
                              </span>
                            )}
                            {p.attendanceStatus === 'handed_over' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                                Delivered to School
                              </span>
                            )}
                            {p.attendanceStatus === 'absent' && (
                              <div className="space-y-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                                  Absent
                                </span>
                                <span className="text-[10px] text-slate-400 block line-clamp-1">{p.absenceReason}</span>
                              </div>
                            )}
                            {p.attendanceStatus === 'scheduled' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Scheduled Pickup
                              </span>
                            )}
                          </td>

                          {/* Quick Handover Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.attendanceStatus === 'scheduled' && (
                                <>
                                  <button
                                    onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'boarded', undefined, 'Parent/Guardian')}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                  >
                                    Board
                                  </button>
                                  <button
                                    onClick={() => setAbsenceModalPupil(p)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    Absent
                                  </button>
                                </>
                              )}

                              {p.attendanceStatus === 'boarded' && (
                                <button
                                  onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'handed_over', undefined, 'SEN Reception')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                  Handover to School
                                </button>
                              )}

                              {p.attendanceStatus === 'handed_over' && (
                                <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ======================================================================
          MODAL 1: DRIVER PHYSICAL SWEEP SIGN-OFF
          ====================================================================== */}
      {isSweepModalOpen && activeRoute && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Driver Child Safety Sweep: {activeRoute.routeCode}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Driver declaration under UK Council Private Hire & Education Standards:
              I confirm that I have personally walked through the entire vehicle ({activeRoute.assignedVehicleReg}), inspected every seat, footwell, and wheelchair lock, and verified that no pupil or property remains on board.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Driver Notes / Observations
              </label>
              <textarea
                rows={2}
                value={sweepNotes}
                onChange={e => setSweepNotes(e.target.value)}
                placeholder="e.g. All seats clear, floor dry, no left property..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 font-medium">
              ΓÜá∩╕Å Submitting this will place the run into <strong className="font-bold">Awaiting PA Countersignature</strong>. You will remain blocked from receiving general jobs until the Passenger Assistant countersigns.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSweepModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSweepDriver}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
              >
                Certify Physical Sweep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: PA MANDATORY COUNTERSIGNATURE
          ====================================================================== */}
      {isCountersignModalOpen && activeRoute && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PenTool className="w-5 h-5 text-purple-600" />
              PA Countersignature & Driver Release Gate
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Driver {activeRoute.assignedDriverName} has submitted the physical check. As the designated Passenger Assistant, countersign this statutory declaration to confirm all pupils have safely disembarked into school custody.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Passenger Assistant Signature / Full Name
              </label>
              <input
                type="text"
                value={paSignerName}
                onChange={e => setPaSignerName(e.target.value)}
                className="w-full p-2.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Countersigning instantly releases driver {activeRoute.assignedDriverName} & vehicle {activeRoute.assignedVehicleReg} back to <strong>AVAILABLE</strong> for regular dispatch duties.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCountersignModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCountersignPA}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                Countersign & Free Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: REASSIGN ROUTE CREW (DRIVER + VEHICLE + 2 PAs)
          ====================================================================== */}
      {isReassignModalOpen && activeRoute && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Reassign Route Crew: {activeRoute.routeCode}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Driver */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Assigned Driver</label>
                <select
                  value={reassignDriverId}
                  onChange={e => setReassignDriverId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa').map(drv => (
                    <option key={drv.id} value={drv.id}>
                      {drv.name} ({drv.operationalClearance})
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Vehicle Reg</label>
                <select
                  value={reassignVehicleReg}
                  onChange={e => setReassignVehicleReg(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.registration}>
                      {v.registration} ({v.model} - {v.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead PA 1 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Lead PA (Required)</label>
                <select
                  value={reassignPA1Id}
                  onChange={e => setReassignPA1Id(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {staff.filter(s => s.role === 'pa' || s.role === 'dual_driver_pa').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second PA 2 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Second PA (WAV High Care)</label>
                <select
                  value={reassignPA2Id}
                  onChange={e => setReassignPA2Id(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="">None (Single PA Route)</option>
                  {staff.filter(s => s.role === 'pa' || s.role === 'dual_driver_pa').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReassignment}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Save Crew Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 4: RECORD PUPIL ABSENCE
          ====================================================================== */}
      {absenceModalPupil && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Log Absence: {absenceModalPupil.name}
            </h3>
            <p className="text-xs text-slate-500">
              Absences are logged and synced directly to the local authority transport portal.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reason for Non-Attendance
              </label>
              <select
                value={absenceReasonText}
                onChange={e => setAbsenceReasonText(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <option value="Parent notified: Illness / Flu">Child Ill / Unwell</option>
                <option value="Parent notified: Hospital / Clinic Appointment">Medical Appointment</option>
                <option value="Transported by parent / guardian today">Transported by Parent Privately</option>
                <option value="Unexplained No-Show at doorstep">No-Show at Doorstep</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAbsenceModalPupil(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordAbsence}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white"
              >
                Log Absence
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
