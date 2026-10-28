import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { useCompany } from '../context/CompanyContext';
import { 
  DriverPAProfile, 
  OperationalClearance, 
  RequirementTemplate, 
  ComplianceReminder 
} from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Car, 
  GraduationCap, 
  Award, 
  FileText, 
  Calendar, 
  Smartphone, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  UserCheck, 
  UserX, 
  ChevronRight, 
  Eye, 
  Briefcase, 
  Sparkles,
  Link as LinkIcon,
  BellRing
} from 'lucide-react';

type DirectoryView = 'drivers' | 'pas' | 'reminders_templates';
type ProfileTab = 
  | 'personal' 
  | 'vetting' 
  | 'training' 
  | 'assignments' 
  | 'clearance' 
  | 'app' 
  | 'history';

export const WorkforcePage: React.FC = () => {
  const { 
    staff, 
    requirementTemplates, 
    complianceReminders, 
    updateStaffClearance, 
    sendComplianceReminder, 
    toggleStaffActiveStatus 
  } = useData();

  const { currentRole } = useRole();
  const { subCompanies } = useCompany();

  // Navigation & View state
  const [activeView, setActiveView] = useState<DirectoryView>('drivers');
  const [selectedStaff, setSelectedStaff] = useState<DriverPAProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [depotFilter, setDepotFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, suspended, on_duty, restricted
  const [dualRoleOnly, setDualRoleOnly] = useState(false);

  // Clearance Edit Modal state
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [newClearance, setNewClearance] = useState<OperationalClearance>('cleared');
  const [clearanceReasonText, setClearanceReasonText] = useState('');

  // Role simulation pill (allows toggling view between Controller and HR for testing)
  const isController = currentRole === 'controller';

  // Filter staff by directory view
  const filteredStaff = useMemo(() => {
    return staff.filter(person => {
      // Top-level directory type
      if (activeView === 'drivers') {
        // Driver or Dual Role
        if (person.role === 'pa') return false;
      } else if (activeView === 'pas') {
        // PA or Dual Role
        if (person.role === 'driver') return false;
      }

      // Dual role toggle
      if (dualRoleOnly && person.role !== 'dual_driver_pa') {
        return false;
      }

      // Company filter
      if (companyFilter !== 'all' && person.companyId !== companyFilter) {
        return false;
      }

      // Depot filter
      if (depotFilter !== 'all' && person.assignedDepot !== depotFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && person.personalDetails?.employmentStatus !== 'active') {
        return false;
      }
      if (statusFilter === 'suspended' && person.personalDetails?.employmentStatus !== 'suspended') {
        return false;
      }
      if (statusFilter === 'on_duty' && !person.onDuty) {
        return false;
      }
      if (statusFilter === 'restricted' && person.operationalClearance !== 'restricted') {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = person.name.toLowerCase().includes(q);
        const matchesStaffId = person.staffId.toLowerCase().includes(q);
        const matchesEmail = person.email.toLowerCase().includes(q);
        const matchesPhone = person.phone.toLowerCase().includes(q);
        const matchesLicence = person.drivingLicence?.licenceNumber?.toLowerCase().includes(q);
        const matchesBadge = person.taxiBadge?.badgeNumber?.toLowerCase().includes(q);
        const matchesPaAuth = person.paAuthorisation?.authorisationId?.toLowerCase().includes(q);
        const matchesVehicle = person.currentVehicleReg?.toLowerCase().includes(q);

        if (!matchesName && !matchesStaffId && !matchesEmail && !matchesPhone && !matchesLicence && !matchesBadge && !matchesPaAuth && !matchesVehicle) {
          return false;
        }
      }

      return true;
    });
  }, [staff, activeView, dualRoleOnly, companyFilter, depotFilter, statusFilter, searchQuery]);

  // Counts for summary badges
  const totalDrivers = staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa').length;
  const totalPAs = staff.filter(s => s.role === 'pa' || s.role === 'dual_driver_pa').length;
  const totalDual = staff.filter(s => s.role === 'dual_driver_pa').length;
  const totalRestricted = staff.filter(s => s.operationalClearance === 'restricted').length;
  const activeRemindersCount = complianceReminders.filter(r => r.daysRemaining <= 30).length;

  const handleOpenClearanceModal = (person: DriverPAProfile) => {
    setSelectedStaff(person);
    setNewClearance(person.operationalClearance);
    setClearanceReasonText(person.clearanceReason || '');
    setIsClearanceModalOpen(true);
  };

  const handleSaveClearance = () => {
    if (!selectedStaff) return;
    updateStaffClearance(
      selectedStaff.id,
      newClearance,
      clearanceReasonText || `Clearance status updated to ${newClearance}`,
      currentRole === 'hr_vetting' ? 'Rachel Adams (HR Compliance)' : 'Operations Lead'
    );
    setIsClearanceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Workforce & Personnel
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Phase 6
            </span>
            {isController && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lock className="w-3 h-3" />
                Controller Role: Vetting Tabs Restricted
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dedicated directories for Licensed Private Hire Drivers & Council Passenger Assistants (PAs), linked dual-role records, and statutory vetting compliance.
          </p>
        </div>

        {/* Directory Switcher Tabs */}
        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('drivers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'drivers'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            Drivers Directory
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {totalDrivers}
            </span>
          </button>

          <button
            onClick={() => setActiveView('pas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'pas'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Passenger Assistants (PA)
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              {totalPAs}
            </span>
          </button>

          <button
            onClick={() => setActiveView('reminders_templates')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'reminders_templates'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Templates & Reminders
            {activeRemindersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                {activeRemindersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Workforce</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{staff.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dual-Role Staff</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">{totalDual}</p>
              <span className="text-[10px] text-slate-400 font-medium">Driver + PA</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <LinkIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">On Duty Now</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {staff.filter(s => s.onDuty).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Restricted / Blocked</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">{totalRestricted}</p>
              <span className="text-[10px] text-rose-500 font-semibold">Safety Stop</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ======================================================================
          VIEW 1 & 2: DRIVER OR PA DIRECTORY
          ====================================================================== */}
      {activeView !== 'reminders_templates' && (
        <div className="space-y-4">
          
          {/* Search, Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeView === 'drivers' ? 'drivers' : 'passenger assistants'} by name, staff ID, badge, or licence...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={e => setCompanyFilter(e.target.value)}
                className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Sub-Companies</option>
                {subCompanies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Depot Filter */}
              <select
                value={depotFilter}
                onChange={e => setDepotFilter(e.target.value)}
                className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Depots</option>
                <option value="Luton Central Depot">Luton Central Depot</option>
                <option value="Dunstable Depot">Dunstable Depot</option>
                <option value="Luton Airport Base">Luton Airport Base</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Employed</option>
                <option value="on_duty">On Duty Now</option>
                <option value="restricted">Restricted Clearance</option>
                <option value="suspended">Suspended / Inactive</option>
              </select>

              {/* Dual Role Checkbox */}
              <button
                onClick={() => setDualRoleOnly(!dualRoleOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  dualRoleOnly 
                    ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Dual Role Only
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role & Linked Status</th>
                    <th className="py-3 px-4">Depot & Shift</th>
                    {activeView === 'drivers' ? (
                      <>
                        <th className="py-3 px-4">DVLA Licence & Points</th>
                        <th className="py-3 px-4">Council Taxi Badge</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4">PA Authorisation ID</th>
                        <th className="py-3 px-4">PAT SEN Restraints</th>
                      </>
                    )}
                    <th className="py-3 px-4">Clearance</th>
                    <th className="py-3 px-4">Employment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No workforce members match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(person => {
                      const isDual = person.role === 'dual_driver_pa';
                      const isPAOnly = person.role === 'pa';
                      const isDriverOnly = person.role === 'driver';

                      return (
                        <tr 
                          key={person.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedStaff(person);
                            setActiveTab('personal');
                          }}
                        >
                          {/* Staff Member Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={person.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                                alt={person.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    {person.name}
                                  </span>
                                  {person.onDuty && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="On Duty Now" />
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {person.staffId} • {person.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge & Dual Status */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {isDual ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                                  <LinkIcon className="w-3 h-3" />
                                  Dual: Driver + PA
                                </span>
                              ) : isPAOnly ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                                  <GraduationCap className="w-3 h-3" />
                                  Passenger Assistant Only
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                  <Car className="w-3 h-3" />
                                  Private Hire Driver
                                </span>
                              )}
                              <p className="text-[10px] text-slate-400">
                                {person.assignments?.contractedHoursWeekly || 35}h / week
                              </p>
                            </div>
                          </td>

                          {/* Depot & Shift */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {person.assignedDepot}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {person.assignments?.preferredShift || 'Full Day Split'}
                            </div>
                          </td>

                          {/* Column Set A: For Drivers View */}
                          {activeView === 'drivers' && (
                            <>
                              <td className="py-3.5 px-4">
                                {person.drivingLicence ? (
                                  <div>
                                    <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                                      {person.drivingLicence.licenceNumber}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                        person.drivingLicence.penaltyPoints > 0
                                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                      }`}>
                                        {person.drivingLicence.penaltyPoints} Penalty Pts
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        Exp: {person.drivingLicence.photocardExpiry}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">No licence required (PA)</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                {person.taxiBadge ? (
                                  <div>
                                    <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                                      {person.taxiBadge.badgeNumber}
                                    </span>
                                    <p className="text-[10px] text-slate-400">
                                      {person.taxiBadge.council} (Exp: {person.taxiBadge.expiryDate})
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">N/A</span>
                                )}
                              </td>
                            </>
                          )}

                          {/* Column Set B: For PA View */}
                          {activeView === 'pas' && (
                            <>
                              <td className="py-3.5 px-4">
                                {person.paAuthorisation ? (
                                  <div>
                                    <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400">
                                      {person.paAuthorisation.authorisationId}
                                    </span>
                                    <p className="text-[10px] text-slate-400">
                                      {person.paAuthorisation.councilApproval}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">Pending Authorisation</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  {person.training.pat?.completed ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                      PAT Certified
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                      PAT Pending
                                    </span>
                                  )}
                                  {person.training.wheelchairRestraints?.completed && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                      WAV Restraints
                                    </span>
                                  )}
                                </div>
                              </td>
                            </>
                          )}

                          {/* Operational Clearance */}
                          <td className="py-3.5 px-4">
                            {person.operationalClearance === 'cleared' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Cleared
                              </span>
                            )}
                            {person.operationalClearance === 'restricted' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                                <ShieldAlert className="w-3 h-3 text-rose-600" />
                                Restricted
                              </span>
                            )}
                            {person.operationalClearance === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Employment Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              person.personalDetails?.employmentStatus === 'active'
                                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {person.personalDetails?.employmentStatus || 'Active'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedStaff(person);
                                  setActiveTab('personal');
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                title="View Full Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {!isController && (
                                <button
                                  onClick={() => handleOpenClearanceModal(person)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                                  title="Update Operational Clearance"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          VIEW 3: REQUIREMENT TEMPLATES & REMINDERS UI
          ====================================================================== */}
      {activeView === 'reminders_templates' && (
        <div className="space-y-6">
          
          {/* Statutory Expiry Reminders Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-rose-500" />
                  Upcoming Statutory Document Expiries & Reminders
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Proactive notifications sent to drivers and PAs before statutory document cut-offs.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                {complianceReminders.length} Active Reminders Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Document / Certification</th>
                    <th className="py-3 px-4">Statutory Expiry</th>
                    <th className="py-3 px-4">Days Remaining</th>
                    <th className="py-3 px-4">Urgency Status</th>
                    <th className="py-3 px-4">Last Notification</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complianceReminders.map(rem => {
                    return (
                      <tr key={rem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {rem.staffName}
                          <span className="block text-[10px] text-slate-400 font-normal uppercase">
                            {rem.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {rem.documentType}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {rem.expiryDate}
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {rem.daysRemaining < 0 ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              Expired ({Math.abs(rem.daysRemaining)} days ago)
                            </span>
                          ) : (
                            <span className={rem.daysRemaining <= 20 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                              {rem.daysRemaining} days left
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {rem.status === 'expired' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                              EXPIRED - VOR STOP
                            </span>
                          )}
                          {rem.status === 'critical_urgent' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                              CRITICAL URGENT (&lt;20d)
                            </span>
                          )}
                          {rem.status === 'due_soon' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                              DUE SOON
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {rem.notificationSent ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Dispatched ({rem.lastRemindedDate || 'Today'})
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not yet sent</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => sendComplianceReminder(rem.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Send Expiry Warning
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Requirement Templates Grid */}
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Statutory Role Requirement Templates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Governance templates defining mandatory qualifications, renewal cycles, and automatic dispatch-blocking rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requirementTemplates.map(tpl => {
                return (
                  <div 
                    key={tpl.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tpl.roleType === 'driver' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : tpl.roleType === 'pa'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {tpl.roleType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tpl.mandatoryDocuments.length} Statutory Criteria
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {tpl.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {tpl.mandatoryDocuments.map(doc => (
                          <div 
                            key={doc.code} 
                            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-2"
                          >
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {doc.label}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Renewal: Every {doc.renewalCycleMonths} months ({Math.round(doc.renewalCycleMonths / 12 * 10) / 10} yrs)
                              </p>
                            </div>
                            {doc.hardBlockOnExpiry && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                                Hard Block
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Authority: {tpl.councilScope}</span>
                      <span className="text-emerald-600 font-bold">Active Template</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          SLIDE-OVER PROFILE DRAWER (7 TABS)
          ====================================================================== */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div 
            className="w-full max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStaff.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={selectedStaff.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedStaff.name}
                    </h2>
                    {selectedStaff.role === 'dual_driver_pa' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200">
                        Dual Role (Driver + PA)
                      </span>
                    )}
                    {selectedStaff.role === 'pa' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200">
                        Passenger Assistant (Non-Driving)
                      </span>
                    )}
                    {selectedStaff.role === 'driver' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200">
                        Licensed Driver
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {selectedStaff.staffId}
                    </span>
                    <span>•</span>
                    <span>{selectedStaff.assignedDepot}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Phone className="w-3 h-3 text-slate-400" /> {selectedStaff.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 7 Profile Tabs Header */}
            <div className="flex items-center overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-900 scrollbar-none">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'personal'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Personal
              </button>

              <button
                onClick={() => setActiveTab('vetting')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'vetting'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isController ? (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Lock className="w-3.5 h-3.5" />
                    Documents / Vetting (Restricted)
                  </span>
                ) : (
                  <span>Documents / Vetting</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('training')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'training'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Training & Certs
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'assignments'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Availability & Routes
              </button>

              <button
                onClick={() => setActiveTab('clearance')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'clearance'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Operational Clearance
                {selectedStaff.operationalClearance === 'restricted' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('app')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'app'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                App & Device
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                History Audit
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: PERSONAL */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  {/* Linked Role Notice if Dual Role */}
                  {selectedStaff.role === 'dual_driver_pa' && (
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-start gap-3">
                      <LinkIcon className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                          Linked Dual-Role Record
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                          {selectedStaff.name} holds active accreditation for both private hire driving and passenger assistant child accompaniment. Changes here synchronize seamlessly across both dispatch boards.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PA-Only Specific Notice */}
                  {selectedStaff.role === 'pa' && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                          Passenger Assistant (Non-Driving Role)
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                          In accordance with UK local authority and DfT transport regulations, passenger assistants do not require a DVLA driving licence or council taxi driver badge.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Core Personal Details */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Identity & Contact</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Date of Birth</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStaff.personalDetails?.dob || '14/08/1982'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">National Insurance (NI)</span>
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {isController ? '•• •• •• •• • (Restricted to HR)' : (selectedStaff.personalDetails?.nationalInsuranceNumber || 'JH 42 19 88 C')}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">Residential Address</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStaff.personalDetails?.address || '18 Westbourne Road, Luton, LU4 8JD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Emergency Contact</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedStaff.personalDetails?.emergencyContact.name} ({selectedStaff.personalDetails?.emergencyContact.relation})
                        </span>
                        <span className="block text-[11px] text-slate-400 font-mono">{selectedStaff.personalDetails?.emergencyContact.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Start Date & Tenure</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStaff.personalDetails?.startDate || '12/03/2021'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right to Work Verification */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Right to Work in the UK</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Verified Indefinite
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Home Office Share Code</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {isController ? '••••-••••-•••' : (selectedStaff.rightToWork?.shareCode || 'RTW-9912-GBR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Verification Date</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedStaff.rightToWork?.verifiedAt || '12/03/2021'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Employment Status Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Employment Active State</span>
                      <span className="text-[11px] text-slate-400">Suspended personnel cannot be allocated to duties.</span>
                    </div>
                    <button
                      onClick={() => toggleStaffActiveStatus(selectedStaff.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedStaff.personalDetails?.employmentStatus === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {selectedStaff.personalDetails?.employmentStatus === 'active' ? 'Suspend Employee' : 'Activate Employee'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENTS / VETTING (RESTRICTED FOR CONTROLLER) */}
              {activeTab === 'vetting' && (
                <div className="space-y-6">
                  {/* Access Restriction Guard for Controller */}
                  {isController ? (
                    <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/30 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-800 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div className="max-w-md mx-auto">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          Access Restricted: HR Vetting Confidentiality
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          Under UK Data Protection Act 2018 and DBS Code of Practice, disclosure certificates, barred list checks, and safeguarding case notes are confidential to HR and Compliance officers.
                        </p>
                        <div className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-900 text-left text-xs border border-amber-200 dark:border-amber-900 space-y-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">Operational Clearance Summary:</span>
                          <p className="text-slate-500">
                            Clearance State: <strong className="text-slate-900 dark:text-white uppercase">{selectedStaff.operationalClearance}</strong>
                          </p>
                          <p className="text-slate-500">
                            Reason: {selectedStaff.clearanceReason || 'Standard operational clearance granted by HR.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Unrestricted HR / Admin View */
                    <div className="space-y-6 animate-in fade-in">
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                          <div>
                            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                              Authorised HR Compliance View
                            </h4>
                            <p className="text-[11px] text-blue-700 dark:text-blue-300">
                              Access logged under Data Protection Audit ID #HR-AUD-2026-992
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                          HR & Admin Clear
                        </span>
                      </div>

                      {/* Enhanced DBS Check Card */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Enhanced Disclosure & Barring Service (DBS)
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                            Child & Adult Barred List Checked
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block">Certificate Number</span>
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                              {selectedStaff.dbsCheck?.certificateNumber || '001598234120'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">DBS Issue Date</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {selectedStaff.dbsCheck?.issueDate || '15/05/2025'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">DBS Update Service Subscription</span>
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active (Automated Periodic Check)
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Last Update Service Poll</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {selectedStaff.dbsCheck?.lastCheckedDate || '15/10/2026'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block">Suitability Determination</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 mt-1">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              Cleared for Unsupervised Child & Vulnerable Adult Transportation
                            </span>
                          </div>
                          {selectedStaff.dbsCheck?.confidentialNotes && (
                            <div className="col-span-2 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Confidential Vetting Notes
                              </span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                                {selectedStaff.dbsCheck.confidentialNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TRAINING */}
              {activeTab === 'training' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Statutory Training Matrix
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Accreditations required for SEN school runs, wheelchair vehicles, and passenger safety.
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      5 Standard Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Safeguarding */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Safeguarding Children & Vulnerable Adults
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Cert: {selectedStaff.training.safeguarding.certNumber || 'SG-2024-8891'} • Valid until {selectedStaff.training.safeguarding.expiryDate}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Verified Valid
                      </span>
                    </div>

                    {/* First Aid */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Emergency First Aid at Work (EFAW / Paediatric)
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Cert: {selectedStaff.training.firstAid.certNumber || 'FA-2024-1102'} • Expiry: {selectedStaff.training.firstAid.expiryDate}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Verified Valid
                      </span>
                    </div>

                    {/* PAT (Passenger Assistant Training Scheme) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            PAT (Passenger Assistant Training Scheme)
                          </p>
                          <p className="text-[10px] text-slate-400">
                            National CTA standard for assisting disabled & SEN passengers. Expiry: {selectedStaff.training.pat?.expiryDate || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {selectedStaff.training.pat?.completed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          CTA Certified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                          Not Required / Pending
                        </span>
                      )}
                    </div>

                    {/* Wheelchair Restraints */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Wheelchair Restraints & Clamp Safety (WAV)
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Unwin / Q'Straint tie-down and 4-point occupant harness cert. Expiry: {selectedStaff.training.wheelchairRestraints?.expiryDate || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {selectedStaff.training.wheelchairRestraints?.completed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          WAV Authorised
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                          Non-WAV Only
                        </span>
                      )}
                    </div>

                    {/* MiDAS (Driver Only) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            MiDAS (Minibus Driver Assessment Scheme)
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {selectedStaff.role === 'pa' 
                              ? 'Statutory Exemption: PAs do not drive vehicles and do not require MiDAS.'
                              : `Cert: ${selectedStaff.training.midas?.certificateNo || 'MIDAS-2024-991'} • Expiry: ${selectedStaff.training.midas?.expiryDate}`
                            }
                          </p>
                        </div>
                      </div>
                      {selectedStaff.role === 'pa' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                          N/A (Non-Driving)
                        </span>
                      ) : selectedStaff.training.midas?.completed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Active MiDAS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AVAILABILITY & ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Roster & Dispatch Configuration
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Assigned Operating Depot</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedStaff.assignedDepot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Contracted Weekly Hours</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedStaff.assignments?.contractedHoursWeekly || 40} hours / week</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Default Dedicated Vehicle</span>
                        {selectedStaff.assignments?.assignedDefaultVehicleReg ? (
                          <span className="inline-flex items-center gap-1 font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                            <Car className="w-4 h-4" />
                            {selectedStaff.assignments.assignedDefaultVehicleReg}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Floating Pool / Non-Assigned</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block">Regular School SEN Route</span>
                        {selectedStaff.assignments?.regularSchoolRoute ? (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                            <GraduationCap className="w-4 h-4" />
                            {selectedStaff.assignments.regularSchoolRoute}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No Fixed School Run</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block">Shift Preference</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedStaff.assignments?.preferredShift || 'Full Day Split'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Working Days</span>
                        <div className="flex gap-1 mt-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                            const isWorking = (selectedStaff.assignments?.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).includes(day);
                            return (
                              <span
                                key={day}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  isWorking
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                }`}
                              >
                                {day}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OPERATIONAL CLEARANCE */}
              {activeTab === 'clearance' && (
                <div className="space-y-6">
                  {/* Current Clearance Hero Card */}
                  <div className={`p-6 rounded-2xl border-2 ${
                    selectedStaff.operationalClearance === 'cleared'
                      ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                      : selectedStaff.operationalClearance === 'restricted'
                      ? 'bg-rose-50/60 border-rose-400 dark:bg-rose-950/20 dark:border-rose-800'
                      : 'bg-amber-50/60 border-amber-300 dark:bg-amber-950/20 dark:border-amber-800'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {selectedStaff.operationalClearance === 'cleared' && (
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                        )}
                        {selectedStaff.operationalClearance === 'restricted' && (
                          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 flex items-center justify-center animate-pulse">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                        )}
                        {selectedStaff.operationalClearance === 'pending' && (
                          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Operational Dispatch Gate
                          </span>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                            Clearance Status: {selectedStaff.operationalClearance}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            {selectedStaff.clearanceReason || 'Personnel has satisfied all council licensing and safeguarding criteria.'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            Last reviewed: {selectedStaff.clearanceDetails?.lastReviewedDate || '25/10/2026'} by {selectedStaff.clearanceDetails?.reviewedBy || 'Rachel Adams (HR Compliance)'}
                          </p>
                        </div>
                      </div>

                      {!isController && (
                        <button
                          onClick={() => handleOpenClearanceModal(selectedStaff)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm transition-all"
                        >
                          Change Status
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Clearance Decision Audit Trail
                    </h4>
                    <div className="space-y-2">
                      {(selectedStaff.clearanceDetails?.auditTrail || [
                        { id: '1', timestamp: '2026-10-25 09:30', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'System (DVLA Gateway)', reason: 'Automated 6-month check confirmed clean record.' }
                      ]).map(log => (
                        <div key={log.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {log.changedBy}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono">
                                {log.previousStatus} → {log.newStatus}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{log.reason}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: APP & ACKNOWLEDGEMENTS */}
              {activeTab === 'app' && (
                <div className="space-y-6">
                  {/* Device State */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      Mobile Device & Staff App Health
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Registered Device</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {selectedStaff.appDetails?.deviceModel || 'Samsung Galaxy S23 (Knox Enterprise)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">OS Version</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedStaff.appDetails?.osVersion || 'Android 14'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">App Release Version</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {selectedStaff.appDetails?.appVersion || 'v2.4.1 (Build 412)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Push Notifications</span>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (FCM Token Active)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Last Active Heartbeat</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedStaff.appDetails?.lastLoginTimestamp || '2026-10-28 07:15'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Offline Sync Status</span>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <RefreshCw className="w-3.5 h-3.5" /> Fully Synchronised (0 drafts)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Policy Acknowledgements */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Digital Policy Sign-Offs & Declarations
                    </h3>
                    <div className="space-y-2">
                      {(selectedStaff.appDetails?.policySignoffs || [
                        { id: '1', policyName: 'DEC Driver & Staff Operations Handbook 2026', version: 'v3.2', signedAt: '15/01/2026' },
                        { id: '2', policyName: 'Safeguarding Children & Vulnerable Adults Policy', version: 'v4.0', signedAt: '15/05/2025' }
                      ]).map(pol => (
                        <div key={pol.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{pol.policyName}</p>
                            <p className="text-[10px] text-slate-400">Signed Version: {pol.version}</p>
                          </div>
                          <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Signed {pol.signedAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: HISTORY AUDIT */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Complete Lifecycle Audit Trail
                  </h3>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {(selectedStaff.historyTimeline || [
                      { id: '1', timestamp: '2026-10-28 07:15', action: 'Daily Inspection Sign-Off', actor: selectedStaff.name, details: 'Completed walkaround check with 0 defects reported.', category: 'app' },
                      { id: '2', timestamp: '2026-10-25 09:30', action: 'DVLA Electronic Check', actor: 'DVLA Gateway', details: 'Clean photocard licence confirmed.', category: 'clearance' },
                      { id: '3', timestamp: '2026-09-12 11:20', action: 'First Aid Recertification', actor: 'Rachel Adams', details: '3-Year Emergency First Aid cert logged.', category: 'training' }
                    ]).map(item => (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.action}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {item.details}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Logged by: <strong className="text-slate-700 dark:text-slate-300">{item.actor}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
              <span>DEC Staff ID: {selectedStaff.staffId}</span>
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-slate-800 dark:text-white transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          CHANGE CLEARANCE MODAL
          ====================================================================== */}
      {isClearanceModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Update Operational Clearance: {selectedStaff.name}
            </h3>
            <p className="text-xs text-slate-500">
              Restricted personnel are immediately gated and barred from receiving or accepting passenger bookings.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Clearance Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewClearance('cleared')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      newClearance === 'cleared'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Cleared
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClearance('pending')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      newClearance === 'pending'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClearance('restricted')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      newClearance === 'restricted'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Restricted
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason / Regulatory Justification
                </label>
                <textarea
                  rows={3}
                  value={clearanceReasonText}
                  onChange={e => setClearanceReasonText(e.target.value)}
                  placeholder="e.g. DVLA penalty points review, expired badge, or safeguarding enquiry..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearanceModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClearance}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Save Decision & Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
