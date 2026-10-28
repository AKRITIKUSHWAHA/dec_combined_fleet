import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { Vehicle } from '../types';
import { 
  Car, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  FileText, 
  CheckCircle2, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  Wrench, 
  User, 
  Layers, 
  ExternalLink,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const FleetPage: React.FC = () => {
  const { vehicles, staff, defects, toggleVehicleVor } = useData();
  const { subCompanies, selectedCompanyId } = useCompany();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>(selectedCompanyId);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'due_soon' | 'blocked' | 'verification_pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected Vehicle for Drawer
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vorModalOpen, setVorModalOpen] = useState(false);
  const [vorReason, setVorReason] = useState('Critical safety defect identified during inspection');

  // Helper to determine status chip: Ready / Due soon / Blocked / Verification pending
  const getVehicleComplianceStatus = (v: Vehicle): {
    status: 'ready' | 'due_soon' | 'blocked' | 'verification_pending';
    label: string;
    bgClass: string;
    textClass: string;
    badgeIcon: any;
  } => {
    if (v.status === 'blocked_off_road' || v.criticalDefectsCount > 0) {
      return {
        status: 'blocked',
        label: 'Blocked (VOR)',
        bgClass: 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-900',
        textClass: 'text-rose-700 dark:text-rose-300',
        badgeIcon: ShieldAlert
      };
    }

    if (v.todayCheckStatus === 'missing' || v.todayCheckStatus === 'failed') {
      return {
        status: 'verification_pending',
        label: 'Verification Pending',
        bgClass: 'bg-blue-100 dark:bg-blue-950/80 border-blue-300 dark:border-blue-900',
        textClass: 'text-blue-700 dark:text-blue-300',
        badgeIcon: Clock
      };
    }

    if (
      v.annualDvsaMot.status === 'due_soon' || 
      v.councilSixMonthInspection.status === 'due_soon' || 
      v.insurancePolicy?.status === 'due_soon' ||
      v.councilPlate?.status === 'due_soon'
    ) {
      return {
        status: 'due_soon',
        label: 'Due Soon (<30d)',
        bgClass: 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-900',
        textClass: 'text-amber-800 dark:text-amber-300',
        badgeIcon: AlertTriangle
      };
    }

    return {
      status: 'ready',
      label: 'Ready / Compliant',
      bgClass: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-900',
      textClass: 'text-emerald-800 dark:text-emerald-300',
      badgeIcon: CheckCircle2
    };
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchReg = v.registration.toLowerCase().includes(q);
      const matchMake = v.make.toLowerCase().includes(q);
      const matchModel = v.model.toLowerCase().includes(q);
      const matchVin = v.vin.toLowerCase().includes(q);
      if (!matchReg && !matchMake && !matchModel && !matchVin) return false;
    }

    if (companyFilter !== 'all' && v.companyId !== companyFilter) return false;

    if (categoryFilter !== 'all') {
      const cat = v.vehicleCategory || (
        v.hasRampOrLift ? 'Wheelchair Accessible (WAV)' :
        v.seatingCapacity >= 8 ? 'Minibus' :
        v.model.toLowerCase().includes('executive') ? 'Executive' : 'Saloon'
      );
      if (cat !== categoryFilter) return false;
    }

    if (statusFilter !== 'all') {
      const compliance = getVehicleComplianceStatus(v);
      if (compliance.status !== statusFilter) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Car className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Fleet Compliance & Dual Deadlines
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independent UK compliance tracking: Annual DVSA MOT vs Council 6-Month Inspection, insurance, private hire plates, and service schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {filteredVehicles.length} of {vehicles.length} Vehicles
          </span>
        </div>
      </div>

      {/* KPI Overview Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Compliant & Ready', count: vehicles.filter(v => getVehicleComplianceStatus(v).status === 'ready').length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60' },
          { label: 'Expiries Due (<30d)', count: vehicles.filter(v => getVehicleComplianceStatus(v).status === 'due_soon').length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60' },
          { label: 'Blocked Off-Road (VOR)', count: vehicles.filter(v => getVehicleComplianceStatus(v).status === 'blocked').length, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' },
          { label: 'Verification Pending', count: vehicles.filter(v => getVehicleComplianceStatus(v).status === 'verification_pending').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60' }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-3.5 rounded-2xl border ${kpi.bg} flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {kpi.label}
              </span>
              <span className={`text-2xl font-black ${kpi.color} font-mono mt-0.5 block`}>
                {kpi.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registration, make, model, VIN..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">🏢 All Sub-Companies</option>
            {subCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'ready', label: 'Ready' },
            { id: 'due_soon', label: 'Due Soon' },
            { id: 'blocked', label: 'Blocked (VOR)' },
            { id: 'verification_pending', label: 'Pending Check' }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                statusFilter === st.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Vehicles Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Vehicle Reg & Specs</th>
                <th className="py-3.5 px-4">Annual DVSA MOT</th>
                <th className="py-3.5 px-4">Council 6-Mo Inspection</th>
                <th className="py-3.5 px-4">Insurance & Plate</th>
                <th className="py-3.5 px-4">Next Service</th>
                <th className="py-3.5 px-4">Compliance Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVehicles.map(veh => {
                const compliance = getVehicleComplianceStatus(veh);
                const StatusIcon = compliance.badgeIcon;
                const assignedDriver = staff.find(s => s.id === veh.assignedDriverId);

                return (
                  <tr 
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    {/* Vehicle Registration & Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {veh.registration}
                            </span>
                            {veh.hasRampOrLift && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                WAV RAMP
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                            {veh.make} {veh.model}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {veh.seatingCapacity} seats • {veh.currentMileage.toLocaleString()} mi
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Annual DVSA MOT (Independent Deadline #1) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {veh.annualDvsaMot.expiryDate}
                          </span>
                          {veh.annualDvsaMot.status === 'due_soon' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              DUE SOON
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Last Tested: {veh.annualDvsaMot.lastTestDate}
                        </p>
                      </div>
                    </td>

                    {/* Council 6-Month Inspection (Independent Deadline #2) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {veh.councilSixMonthInspection.dueDate}
                          </span>
                          {veh.councilSixMonthInspection.designatedDepotRequired && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" title="Central Bedfordshire Council rule: Designated MOT depot required">
                              CENTRAL BEDS DEPOT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {veh.councilSixMonthInspection.council}
                        </p>
                      </div>
                    </td>

                    {/* Insurance & Council Private Hire Plate */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {veh.insurancePolicy?.provider || 'Aviva Commercial Fleet'}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">
                          Plate: <strong className="text-slate-700 dark:text-slate-300">{veh.councilPlate?.plateNumber || 'LBC-PHV-1049'}</strong>
                        </p>
                      </div>
                    </td>

                    {/* Service Due */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 font-mono">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {veh.nextServiceDueDate}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          At {veh.nextServiceDueMileage.toLocaleString()} mi
                        </p>
                      </div>
                    </td>

                    {/* Compliance Status Chip */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${compliance.bgClass} ${compliance.textClass}`}>
                        <StatusIcon className="w-3 h-3 shrink-0" />
                        <span>{compliance.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicle(veh);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold text-xs transition"
                      >
                        Inspect &rarr;
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VEHICLE DETAIL DRAWER (OFFICE SLIDE-OVER) */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {selectedVehicle.registration}
                    </h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getVehicleComplianceStatus(selectedVehicle).bgClass} ${getVehicleComplianceStatus(selectedVehicle).textClass}`}>
                      {getVehicleComplianceStatus(selectedVehicle).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              
              {/* VOR Safety Gate Warning Banner */}
              {selectedVehicle.status === 'blocked_off_road' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-900 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>VEHICLE OFF ROAD (VOR) — STRICT DISPATCH BLOCK ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                    Reason: <strong>{selectedVehicle.isOffRoadReason}</strong>. Under UK operator compliance, this vehicle is barred from all bookings and passenger transport until workshop sign-off.
                  </p>
                </div>
              )}

              {/* INDEPENDENT DUAL DEADLINES CARDS */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Independent Statutory Deadlines (VEH-02)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Deadline 1: Annual DVSA MOT */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">1. Annual DVSA MOT</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        selectedVehicle.annualDvsaMot.status === 'valid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedVehicle.annualDvsaMot.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {selectedVehicle.annualDvsaMot.expiryDate}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Last tested: {selectedVehicle.annualDvsaMot.lastTestDate} • {selectedVehicle.annualDvsaMot.advisoriesCount} Advisory
                    </p>
                  </div>

                  {/* Deadline 2: Council 6-Month Inspection */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">2. Council 6-Month Test</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        selectedVehicle.councilSixMonthInspection.status === 'valid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedVehicle.councilSixMonthInspection.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {selectedVehicle.councilSixMonthInspection.dueDate}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Council: {selectedVehicle.councilSixMonthInspection.council}
                    </p>
                  </div>

                </div>
              </div>

              {/* Insurance, Council Plate & Service Info */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Fleet Licensing & Insurance Portfolio
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">INSURANCE POLICY</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {selectedVehicle.insurancePolicy?.policyNumber || 'AV-FLT-88910'}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {selectedVehicle.insurancePolicy?.provider || 'Aviva Commercial'} • Exp: {selectedVehicle.insurancePolicy?.expiryDate || '31/03/2027'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">COUNCIL PLATE NUMBER</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {selectedVehicle.councilPlate?.plateNumber || 'LBC-PHV-1049'}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {selectedVehicle.councilPlate?.issuingCouncil || 'Luton Borough'} • Exp: {selectedVehicle.councilPlate?.expiryDate || '30/06/2027'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">NEXT ROUTINE SERVICE</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {selectedVehicle.nextServiceDueDate}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Due at {selectedVehicle.nextServiceDueMileage.toLocaleString()} mi
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">CURRENT ODOMETER</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {selectedVehicle.currentMileage.toLocaleString()} miles
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Daily Check: {selectedVehicle.todayCheckStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Technical Specifications & Accessibility
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SEATS</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedVehicle.seatingCapacity} Passengers</span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">WAV RAMP</span>
                    <span className={`font-bold ${selectedVehicle.hasRampOrLift ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {selectedVehicle.hasRampOrLift ? 'Certified Lift' : 'No Ramp'}
                    </span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">FUEL / EV</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedVehicle.fuelType}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleVehicleVor(selectedVehicle.id, vorReason)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedVehicle.status === 'blocked_off_road'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {selectedVehicle.status === 'blocked_off_road' ? 'Release from VOR' : 'Block Off-Road (VOR)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
