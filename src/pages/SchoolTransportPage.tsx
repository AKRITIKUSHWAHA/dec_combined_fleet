import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { useCompany } from '../context/CompanyContext';
import { SchoolRoute, Pupil } from '../types';
import { SchoolRoutesExtras } from '../components/schools/SchoolRoutesExtras';
import { 
  mockTermCalendar, 
  mockStudentAbsences, 
  mockReplacementStaffCandidates, 
  mockFailedHandoverCases 
} from '../data/mockDataPhase12';
import { 
  TermCalendarItem, 
  StudentAbsenceRecord, 
  ReplacementStaffCandidate, 
  FailedHandoverCase 
} from '../types/phase12';
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
  Unlock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X
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

  // Timetable View Mode (Day view by default on mobile, swipe between days, week view via toggle)
  const [timetableMode, setTimetableMode] = useState<'day' | 'week'>('day');
  const [selectedSchoolDay, setSelectedSchoolDay] = useState(0); // 0 = Mon 29 Oct
  const schoolDays = [
    { index: 0, label: 'Mon 29 Oct', count: schoolRoutes.length },
    { index: 1, label: 'Tue 30 Oct', count: schoolRoutes.length },
    { index: 2, label: 'Wed 31 Oct', count: schoolRoutes.length },
    { index: 3, label: 'Thu 01 Nov', count: schoolRoutes.length },
    { index: 4, label: 'Fri 02 Nov', count: schoolRoutes.length },
  ];

  // Phase 12 Main Tabs State
  const [mainTab, setMainTab] = useState<'routes' | 'term_calendar' | 'absences' | 'crew_replacement' | 'failed_handover'>('routes');
  const [terms, setTerms] = useState<TermCalendarItem[]>(mockTermCalendar);
  const [absences, setAbsences] = useState<StudentAbsenceRecord[]>(mockStudentAbsences);
  const [candidates, setCandidates] = useState<ReplacementStaffCandidate[]>(mockReplacementStaffCandidates);
  const [failedHandovers, setFailedHandovers] = useState<FailedHandoverCase[]>(mockFailedHandoverCases);

  // Replacement Crew Form Selection
  const [selectedRepDriver, setSelectedRepDriver] = useState<string>('STAFF-REP-01');
  const [selectedRepPA1, setSelectedRepPA1] = useState<string>('STAFF-REP-03');
  const [selectedRepPA2, setSelectedRepPA2] = useState<string>('STAFF-REP-04');
  const [crewAssignedSuccess, setCrewAssignedSuccess] = useState<string | null>(null);

  // Failed Handover Modal
  const [isFailedHandoverModalOpen, setIsFailedHandoverModalOpen] = useState(false);
  const [fhoStudent, setFhoStudent] = useState('Liam Davies');
  const [fhoAddress, setFhoAddress] = useState('14 Hill Rise, Dunstable');
  const [fhoNotes, setFhoNotes] = useState('Driver knocked at door for 5 minutes, phone unanswered.');

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

      {/* Timetable Controls: Day View vs Week View & Date Bar */}
      <div className="nr-card p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Timetable Schedule:</span>
            <span className="font-heading font-black text-sm text-[var(--text)]">{schoolDays[selectedSchoolDay].label}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* View toggle */}
            <div className="flex bg-[var(--surface-2)] p-1 rounded-[10px] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setTimetableMode('day')}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-heading font-bold transition flex items-center gap-1 ${
                  timetableMode === 'day' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day View (Default)</span>
              </button>
              <button
                type="button"
                onClick={() => setTimetableMode('week')}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-heading font-bold transition flex items-center gap-1 ${
                  timetableMode === 'week' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Week View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Day Pills Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={selectedSchoolDay === 0}
            onClick={() => setSelectedSchoolDay(prev => Math.max(0, prev - 1))}
            className="p-2 rounded-[10px] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 pb-1">
            {schoolDays.map(d => (
              <button
                key={d.index}
                type="button"
                onClick={() => setSelectedSchoolDay(d.index)}
                className={`flex-1 min-w-[100px] sm:min-w-0 p-2 rounded-[12px] border text-left transition ${
                  selectedSchoolDay === d.index
                    ? 'bg-[#B6F23C]/15 border-[#B6F23C] text-[var(--text)] shadow-xs'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                }`}
              >
                <span className="text-[10px] font-mono uppercase block font-semibold">{d.label.split(' ')[0]}</span>
                <span className="font-heading font-bold text-xs text-[var(--text)] block">{d.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={selectedSchoolDay === schoolDays.length - 1}
            onClick={() => setSelectedSchoolDay(prev => Math.min(schoolDays.length - 1, prev + 1))}
            className="p-2 rounded-[10px] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase 12: School Routes Extras Tabs */}
      <div className="flex bg-[var(--surface-2)] p-1 rounded-[14px] border border-[var(--border)] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setMainTab('routes')}
          className={`px-4 py-2 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
            mainTab === 'routes' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Daily Routes Directory ({schoolRoutes.length})
        </button>
        <button
          type="button"
          onClick={() => setMainTab('term_calendar')}
          className={`px-4 py-2 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
            mainTab === 'term_calendar' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Academic Term Calendar ({terms.length})
        </button>
        <button
          type="button"
          onClick={() => setMainTab('absences')}
          className={`px-4 py-2 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
            mainTab === 'absences' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Student Absences & Route Skips ({absences.length})
        </button>
        <button
          type="button"
          onClick={() => setMainTab('crew_replacement')}
          className={`px-4 py-2 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
            mainTab === 'crew_replacement' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Replacement Crew Flow (1 Driver + 2 PAs)
        </button>
        <button
          type="button"
          onClick={() => setMainTab('failed_handover')}
          className={`px-4 py-2 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
            mainTab === 'failed_handover' ? 'bg-[#FF5D6C] text-white shadow-coral-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Failed Handover Escalation ({failedHandovers.length})
        </button>
      </div>

      {mainTab === 'routes' ? (
        <>
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
                        {route.assignedVehicleReg} • {route.assignedDriverName}
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
                    Destination: <strong className="text-slate-800 dark:text-slate-200">{activeRoute.schoolName}</strong> • Scheduled {activeRoute.scheduledStartTime} - {activeRoute.scheduledEndTime}
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
                          ✓ Sweep verified by PA {activeRoute.sweepDetails.paSignatureName} at {activeRoute.sweepDetails.paTimestamp}. Driver & vehicle released to available pool.
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

            {/* Student Manifest Roll & Handover Tracking (Requirement: Under 768px stacked card list with large 48px action buttons; over 768px sticky table) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Pupil Attendance &amp; Handover Manifest ({activeRoute.pupils.length} Students)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Boarded: {boardedCount} • Handed Over: {deliveredCount} • Absent: {absentCount}
                  </p>
                </div>
              </div>

              {/* MOBILE: Stacked Pupil Cards (<md) */}
              <div className="md:hidden space-y-3">
                {activeRoute.pupils.map(p => (
                  <div key={p.id} className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="font-heading font-black text-sm text-slate-900 dark:text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Age: {p.age} years old</span>
                      </div>
                      
                      {p.attendanceStatus === 'boarded' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          On Board
                        </span>
                      )}
                      {p.attendanceStatus === 'handed_over' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                          Delivered
                        </span>
                      )}
                      {p.attendanceStatus === 'absent' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                          Absent
                        </span>
                      )}
                      {p.attendanceStatus === 'scheduled' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Scheduled
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup &amp; Handover:</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{p.pickupAddress}</p>
                        {p.pickupTimestamp && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                            Boarded at {p.pickupTimestamp} (Signed: {p.handoverPerson})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {p.specialNeeds}
                        </span>
                        {p.wheelchairUser && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Wheelchair Clamp
                          </span>
                        )}
                        {p.medicalAlert && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            {p.medicalAlert}
                          </span>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Emergency:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{p.emergencyContact.name} ({p.emergencyContact.phone})</span>
                      </div>
                    </div>

                    {/* Action buttons: min 48px touch targets */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2">
                      {p.attendanceStatus === 'scheduled' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'boarded', undefined, 'Parent/Guardian')}
                            className="flex-1 min-h-[48px] rounded-[14px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Board Pupil</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAbsenceModalPupil(p)}
                            className="min-h-[48px] px-4 rounded-[14px] bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs active:scale-95"
                          >
                            <span>Mark Absent</span>
                          </button>
                        </>
                      )}

                      {p.attendanceStatus === 'boarded' && (
                        <button
                          type="button"
                          onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'handed_over', undefined, 'SEN Reception')}
                          className="w-full min-h-[48px] rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>Handover to School</span>
                        </button>
                      )}

                      {p.attendanceStatus === 'handed_over' && (
                        <div className="w-full min-h-[44px] rounded-[14px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Safely Handed Over to School</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP: Table (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto table-sticky-first table-scroll-hint">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student &amp; Age</th>
                      <th className="py-3 px-4">Pickup Address &amp; Handover</th>
                      <th className="py-3 px-4">SEN Care &amp; Medical Alerts</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Attendance State</th>
                      <th className="py-3 px-4 text-right">Handover Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeRoute.pupils.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white text-sm block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Age: {p.age} years old
                          </span>
                        </td>

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

                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {p.emergencyContact.name}
                          </span>
                          <span className="text-slate-400">{p.emergencyContact.phone}</span>
                        </td>

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

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.attendanceStatus === 'scheduled' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'boarded', undefined, 'Parent/Guardian')}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                >
                                  Board
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAbsenceModalPupil(p)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  Absent
                                </button>
                              </>
                            )}

                            {p.attendanceStatus === 'boarded' && (
                              <button
                                type="button"
                                onClick={() => updatePupilAttendance(activeRoute.id, p.id, 'handed_over', undefined, 'SEN Reception')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
        </>
      ) : (
        <SchoolRoutesExtras currentTab={mainTab} />
      )}

      {/* ======================================================================
          MODAL 1: DRIVER PHYSICAL SWEEP SIGN-OFF (nr-modal-sheet)
          ====================================================================== */}
      {isSweepModalOpen && activeRoute && (
        <div className="nr-modal-backdrop" onClick={() => setIsSweepModalOpen(false)}>
          <div className="nr-modal-sheet max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="nr-modal-sheet-header">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>Driver Child Safety Sweep: {activeRoute.routeCode}</span>
                </h3>
                <p className="text-xs text-slate-500">Statutory post-run check</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsSweepModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
              <p className="text-xs text-slate-500 leading-relaxed">
                Driver declaration under UK Council Private Hire &amp; Education Standards:
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
                  className="w-full p-3 text-sm rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-[12px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 font-medium">
                ⚠️ Submitting this will place the run into <strong className="font-bold">Awaiting PA Countersignature</strong>. You will remain blocked from receiving general jobs until the Passenger Assistant countersigns.
              </div>
            </div>

            <div className="nr-modal-sheet-footer">
              <button
                type="button"
                onClick={() => setIsSweepModalOpen(false)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSweepDriver}
                className="flex-1 min-h-[48px] rounded-[14px] bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                Certify Physical Sweep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: PA MANDATORY COUNTERSIGNATURE (nr-modal-sheet)
          ====================================================================== */}
      {isCountersignModalOpen && activeRoute && (
        <div className="nr-modal-backdrop" onClick={() => setIsCountersignModalOpen(false)}>
          <div className="nr-modal-sheet max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="nr-modal-sheet-header">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-purple-600" />
                  <span>PA Countersignature &amp; Driver Release Gate</span>
                </h3>
                <p className="text-xs text-slate-500">Dual-verification statutory gate</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsCountersignModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
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
                  className="w-full p-3 text-sm font-bold rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Countersigning instantly releases driver {activeRoute.assignedDriverName} &amp; vehicle {activeRoute.assignedVehicleReg} back to <strong>AVAILABLE</strong> for regular dispatch duties.</span>
              </div>
            </div>

            <div className="nr-modal-sheet-footer">
              <button
                type="button"
                onClick={() => setIsCountersignModalOpen(false)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCountersignPA}
                className="flex-1 min-h-[48px] rounded-[14px] bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                Countersign &amp; Free Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: REASSIGN ROUTE CREW (DRIVER + VEHICLE + 2 PAs) (nr-modal-sheet)
          ====================================================================== */}
      {isReassignModalOpen && activeRoute && (
        <div className="nr-modal-backdrop" onClick={() => setIsReassignModalOpen(false)}>
          <div className="nr-modal-sheet max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="nr-modal-sheet-header">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Reassign Route Crew: {activeRoute.routeCode}</span>
                </h3>
                <p className="text-xs text-slate-500">Update allocated driver, vehicle, and PAs</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Driver */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Assigned Driver</label>
                  <select
                    value={reassignDriverId}
                    onChange={e => setReassignDriverId(e.target.value)}
                    className="w-full p-3 rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
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
                    className="w-full p-3 rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
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
                    className="w-full p-3 rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
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
                    className="w-full p-3 rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
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
            </div>

            <div className="nr-modal-sheet-footer">
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReassignment}
                className="flex-1 min-h-[48px] rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                Save Crew Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 4: RECORD PUPIL ABSENCE (nr-modal-sheet)
          ====================================================================== */}
      {absenceModalPupil && (
        <div className="nr-modal-backdrop" onClick={() => setAbsenceModalPupil(null)}>
          <div className="nr-modal-sheet max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="nr-modal-sheet-header">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Log Absence: {absenceModalPupil.name}
                </h3>
                <p className="text-xs text-slate-500">Syncs directly to Local Authority</p>
              </div>
              <button 
                type="button"
                onClick={() => setAbsenceModalPupil(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
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
                  className="w-full p-3 rounded-[14px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="Parent notified: Illness / Flu">Child Ill / Unwell</option>
                  <option value="Parent notified: Hospital / Clinic Appointment">Medical Appointment</option>
                  <option value="Transported by parent / guardian today">Transported by Parent Privately</option>
                  <option value="Unexplained No-Show at doorstep">No-Show at Doorstep</option>
                </select>
              </div>
            </div>

            <div className="nr-modal-sheet-footer">
              <button
                type="button"
                onClick={() => setAbsenceModalPupil(null)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordAbsence}
                className="flex-1 min-h-[48px] rounded-[14px] bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
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
