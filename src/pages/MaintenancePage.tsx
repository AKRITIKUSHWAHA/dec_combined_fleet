import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ShieldCheck, 
  FileText, 
  Lock, 
  PoundSterling,
  Calendar,
  Gauge,
  AlertCircle,
  FileSpreadsheet,
  Check,
  Receipt,
  Car,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
  CalendarDays,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VehicleDefect } from '../types';
import { 
  mockServiceSchedules, 
  mockCostLedger 
} from '../data/mockDataPhase10';
import { 
  VehicleServiceSchedule, 
  CostLedgerItem 
} from '../types/phase10';

interface WorkshopBayItem {
  id: string;
  vehicleReg: string;
  makeModel: string;
  bayNumber: 1 | 2 | 3 | 4;
  dayIndex: number;
  timeSlot: string;
  jobType: string;
  technician: string;
  status: 'in_progress' | 'scheduled' | 'pending_signoff';
}

const initialWorkshopAppointments: WorkshopBayItem[] = [
  { id: 'WB-1', vehicleReg: 'BD24 TYU', makeModel: 'Ford Transit 16-Seat WAV', bayNumber: 1, dayIndex: 0, timeSlot: '08:30 - 11:30', jobType: 'Dual MOT & Council Compliance Test', technician: 'Dave Miller (Master Tech)', status: 'in_progress' },
  { id: 'WB-2', vehicleReg: 'KU23 EWX', makeModel: 'Mercedes-Benz V-Class Chauffeur', bayNumber: 2, dayIndex: 0, timeSlot: '09:00 - 13:00', jobType: 'Brake Caliper Rebuild & Fluid Flush', technician: 'Liam Walker', status: 'in_progress' },
  { id: 'WB-3', vehicleReg: 'LX72 GHY', makeModel: 'Peugeot Boxer Wheelchair WAV', bayNumber: 3, dayIndex: 0, timeSlot: '11:00 - 14:30', jobType: 'Ratcliff Tail-Lift LOLER 6-Mo Certification', technician: 'Samira Akhtar', status: 'pending_signoff' },
  { id: 'WB-4', vehicleReg: 'EN21 KLP', makeModel: 'Vauxhall Vivaro 9-Seat Minibus', bayNumber: 4, dayIndex: 0, timeSlot: '14:00 - 16:30', jobType: 'Front Axle Alignment & Michelin CrossClimate Tyres', technician: 'Tom Bailey', status: 'scheduled' },
  { id: 'WB-5', vehicleReg: 'BD24 TYU', makeModel: 'Ford Transit 16-Seat WAV', bayNumber: 2, dayIndex: 1, timeSlot: '09:00 - 12:00', jobType: 'Secondary Safety Gate Sign-Off & Road Test', technician: 'Dave Miller', status: 'scheduled' },
  { id: 'WB-6', vehicleReg: 'KU23 EWX', makeModel: 'Mercedes-Benz V-Class Chauffeur', bayNumber: 4, dayIndex: 1, timeSlot: '13:00 - 15:00', jobType: 'Annual Air Conditioning Sanitisation', technician: 'Tom Bailey', status: 'scheduled' },
  { id: 'WB-7', vehicleReg: 'LX72 GHY', makeModel: 'Peugeot Boxer Wheelchair WAV', bayNumber: 1, dayIndex: 2, timeSlot: '08:30 - 11:30', jobType: 'Luton Borough Council Spot Check Inspection', technician: 'Dave Miller', status: 'scheduled' },
  { id: 'WB-8', vehicleReg: 'RO22 WXY', makeModel: 'Ford Tourneo Custom WAV', bayNumber: 3, dayIndex: 2, timeSlot: '10:00 - 14:00', jobType: 'Q\'Straint Floor Rail Anchorage Overhaul', technician: 'Samira Akhtar', status: 'scheduled' },
  { id: 'WB-9', vehicleReg: 'EN21 KLP', makeModel: 'Vauxhall Vivaro 9-Seat Minibus', bayNumber: 1, dayIndex: 3, timeSlot: '09:00 - 11:00', jobType: 'Brake Disc Thickness & Fluid Moisture Check', technician: 'Liam Walker', status: 'scheduled' },
  { id: 'WB-10', vehicleReg: 'RO22 WXY', makeModel: 'Ford Tourneo Custom WAV', bayNumber: 2, dayIndex: 4, timeSlot: '08:30 - 12:30', jobType: 'Scheduled 12,000-Mile Interim Fleet Service', technician: 'Dave Miller', status: 'scheduled' }
];

export const MaintenancePage: React.FC = () => {
  const { defects, vehicles, reportDefect, verifyAndReleaseVehicle } = useData();
  const { currentRole, canReleaseVehicle } = useRole();

  const [activeTab, setActiveTab] = useState<'defects' | 'workshop' | 'service_records' | 'cost_ledger'>('defects');
  
  // Service Schedules state
  const [schedules, setSchedules] = useState<VehicleServiceSchedule[]>(mockServiceSchedules);
  const [expandedReg, setExpandedReg] = useState<string | null>('BD24 TYU');

  // Cost Ledger state
  const [ledgerItems, setLedgerItems] = useState<CostLedgerItem[]>(mockCostLedger);
  const [costFilterVehicle, setCostFilterVehicle] = useState<string>('all');
  const [isCostFilterOpen, setIsCostFilterOpen] = useState(false);
  const [visibleLedgerCount, setVisibleLedgerCount] = useState(5);

  // Workshop Planner state (Requirement: Day view by default on mobile, swipe between days, week view via toggle)
  const [workshopView, setWorkshopView] = useState<'day' | 'week'>('day');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Mon 29 Oct
  const [workshopAppointments, setWorkshopAppointments] = useState<WorkshopBayItem[]>(initialWorkshopAppointments);
  const [activeMoveBayItem, setActiveMoveBayItem] = useState<WorkshopBayItem | null>(null);

  const workshopDays = [
    { index: 0, date: '29/10/2026', label: 'Mon 29 Oct', count: workshopAppointments.filter(a => a.dayIndex === 0).length },
    { index: 1, date: '30/10/2026', label: 'Tue 30 Oct', count: workshopAppointments.filter(a => a.dayIndex === 1).length },
    { index: 2, date: '31/10/2026', label: 'Wed 31 Oct', count: workshopAppointments.filter(a => a.dayIndex === 2).length },
    { index: 3, date: '01/11/2026', label: 'Thu 01 Nov', count: workshopAppointments.filter(a => a.dayIndex === 3).length },
    { index: 4, date: '02/11/2026', label: 'Fri 02 Nov', count: workshopAppointments.filter(a => a.dayIndex === 4).length },
  ];

  const handleMoveBay = (itemId: string, newBay: 1 | 2 | 3 | 4) => {
    setWorkshopAppointments(prev => prev.map(a => a.id === itemId ? { ...a, bayNumber: newBay } : a));
    setActiveMoveBayItem(null);
  };
  
  // New Defect state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReg, setNewReg] = useState('BD24 TYU');
  const [newCategory, setNewCategory] = useState<VehicleDefect['category']>('Brakes');
  const [newSeverity, setNewSeverity] = useState<'minor' | 'critical_safety'>('critical_safety');
  const [newDescription, setNewDescription] = useState('');

  // Handle reporting
  const handleReport = () => {
    if (!newDescription.trim()) return;
    reportDefect({
      vehicleReg: newReg,
      reportedByStaffId: 'DEC-MGR-01',
      reportedByName: 'Office Controller',
      severity: newSeverity,
      category: newCategory,
      description: newDescription.trim(),
      status: 'reported',
      garageAction: {
        garageName: 'Dunstable Fleet Care Workshop Ltd',
        appointmentDate: '29/10/2026',
        downtimeStart: '29/10/2026 09:00',
        downtimeEnd: '29/10/2026 17:00',
        costEstimateGbp: 150.00
      }
    });
    setIsReportModalOpen(false);
    setNewDescription('');
  };

  // Cost Ledger Totals Calculation (Ensuring NO DOUBLE COUNTING)
  const filteredLedger = ledgerItems.filter(item => {
    if (costFilterVehicle !== 'all' && item.vehicleReg !== costFilterVehicle) return false;
    return true;
  });

  const totalQuotes = filteredLedger.reduce((sum, item) => sum + item.quoteCostGbp, 0);
  const totalApproved = filteredLedger.reduce((sum, item) => sum + item.approvedCostGbp, 0);
  const totalActualInvoiced = filteredLedger.reduce((sum, item) => sum + item.actualInvoicedCostGbp, 0);
  const totalParts = filteredLedger.reduce((sum, item) => sum + item.partsCostGbp, 0);
  const totalLabour = filteredLedger.reduce((sum, item) => sum + item.labourCostGbp, 0);
  const totalVat = filteredLedger.reduce((sum, item) => sum + item.vatAmountGbp, 0);

  // Approve quote action for spending limits
  const handleApproveCostItem = (id: string) => {
    setLedgerItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          approvalStatus: currentRole === 'owner_admin' ? 'approved_director' : 'approved_controller',
          approvedBy: currentRole === 'owner_admin' ? 'Arthur Pendergast (Owner / Director)' : 'Samira Khan (Controller)'
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Defects, Workshop &amp; Fleet Care</span>
            <span className="chip-blocked px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Safety Release Gate
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Defect pipeline, service interval calculation (earlier of date or mileage), and audited maintenance cost ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] overflow-x-auto">
            <button
              onClick={() => setActiveTab('defects')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
                activeTab === 'defects' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Defects ({defects.length})
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
                activeTab === 'workshop' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Workshop Portal
            </button>
            <button
              onClick={() => setActiveTab('service_records')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
                activeTab === 'service_records' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Service Intervals &amp; Records
            </button>
            <button
              onClick={() => setActiveTab('cost_ledger')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
                activeTab === 'cost_ledger' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Cost Ledger (£)
            </button>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn-danger !text-xs !py-1 !px-3.5 !min-h-[42px] whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Defect</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Alert */}
      <div className="bg-[#FF5D6C]/10 border border-[#FF5D6C]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[#FF5D6C]">
        <ShieldCheck className="w-4 h-4 text-[#FF5D6C] shrink-0 mt-0.5" />
        <div>
          <span className="font-heading font-bold">Independent 2-Person Verification Gate (DEF-04):</span>{' '}
          A garage appointment alone does not clear a defect. Safety defects require authorised second-person verification before dispatch release can be granted.
        </div>
      </div>

      {/* TAB 1: DEFECT PIPELINE */}
      {activeTab === 'defects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defects.map(def => {
            const isCritical = def.severity === 'critical_safety';
            const isReleased = def.status === 'verified_released';

            return (
              <div
                key={def.id}
                className="nr-card p-5 space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <span className="font-mono font-bold text-sm text-[var(--text)]">{def.vehicleReg}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      isCritical ? 'chip-blocked' : 'chip-due-soon'
                    }`}>
                      {isCritical ? 'Critical Safety (VOR)' : 'Minor'}
                    </span>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="text-xs font-heading font-semibold text-[var(--text)]">
                      {def.category}: {def.description}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Reported by {def.reportedByName} • {def.reportedAt}
                    </div>
                  </div>

                  {def.garageAction && (
                    <div className="bg-[var(--surface-2)] p-2.5 rounded-[12px] border border-[var(--border)] text-[11px] space-y-1 mt-2">
                      <div className="font-heading font-semibold text-[var(--text)] flex items-center justify-between">
                        <span>{def.garageAction.garageName}</span>
                        <span className="font-mono text-[#34D399]">£{def.garageAction.costEstimateGbp?.toFixed(2)}</span>
                      </div>
                      <div className="text-[var(--text-muted)]">
                        Appointment: {def.garageAction.appointmentDate}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <span className="font-heading font-bold uppercase text-[11px] text-[var(--text)]">
                      {def.status.replace('_', ' ')}
                    </span>
                  </div>

                  {!isReleased && canReleaseVehicle && (
                    <button
                      onClick={() => verifyAndReleaseVehicle(def.id, 'Verified roadworthy following caliper rebuild.')}
                      className="btn-primary w-full !text-xs !py-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Authorise Release</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: WORKSHOP PLANNER & PORTAL (Requirement: Day view by default on mobile, swipe between days, week view via toggle, tap-based bay moves) */}
      {activeTab === 'workshop' && (
        <div className="space-y-4">
          
          {/* Workshop Planner Header & Controls */}
          <div className="nr-card p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text)] flex items-center gap-2">
                  <span>Dunstable Central Workshop Bay Planner</span>
                  <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    4 Bays Live
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Day-by-day bay loading, turnaround SLAs, and tap-based vehicle bay reallocation.
                </p>
              </div>

              {/* View Toggle: Day View vs Week View */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setWorkshopView('day')}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
                      workshopView === 'day' 
                        ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-sm' 
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Day View (Mobile)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkshopView('week')}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
                      workshopView === 'week' 
                        ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-sm' 
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Week View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Day Selector (Swipe / Tap pills across Monday to Friday) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-muted)]">
                <span>WORKSHOP SCHEDULE DATE:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedDayIndex === 0}
                    onClick={() => setSelectedDayIndex(prev => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-[8px] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[var(--text)] font-heading font-bold text-sm">
                    {workshopDays[selectedDayIndex].label}
                  </span>
                  <button
                    type="button"
                    disabled={selectedDayIndex === workshopDays.length - 1}
                    onClick={() => setSelectedDayIndex(prev => Math.min(workshopDays.length - 1, prev + 1))}
                    className="p-1.5 rounded-[8px] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Pills Bar */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {workshopDays.map(d => (
                  <button
                    key={d.index}
                    type="button"
                    onClick={() => setSelectedDayIndex(d.index)}
                    className={`flex-1 min-w-[110px] sm:min-w-0 p-2.5 rounded-[14px] border text-left transition ${
                      selectedDayIndex === d.index
                        ? 'bg-[#B6F23C]/15 border-[#B6F23C] text-[var(--text)] shadow-sm'
                        : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider block font-semibold">{d.label.split(' ')[0]}</div>
                    <div className="font-heading font-bold text-xs text-[var(--text)]">{d.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-[10px] font-mono text-[#3FE0C5] mt-0.5">{d.count} Vehicles</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Depot Contract SLA Note */}
            <div className="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[var(--text-muted)]">
                Depot Contract: <strong className="text-[var(--text)]">Dunstable Fleet Care Ltd</strong> • Bay Turnaround SLA: 24h Minor / 48h Major
              </span>
              <span className="text-[#34D399] font-mono font-bold shrink-0">Emergency Bay 4 On Standby</span>
            </div>
          </div>

          {/* DAY VIEW: 4 Bay Columns (Stacked on mobile, 4-col on desktop) */}
          {workshopView === 'day' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(bayNum => {
                const bayNames = {
                  1: 'Bay 1: MOT & Council Testing',
                  2: 'Bay 2: Heavy Mechanical & Brakes',
                  3: 'Bay 3: WAV Tail-Lift & LOLER',
                  4: 'Bay 4: Rapid Tyres & Inspection'
                };
                const bayAppts = workshopAppointments.filter(
                  a => a.dayIndex === selectedDayIndex && a.bayNumber === bayNum
                );

                return (
                  <div key={bayNum} className="nr-card p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                        <span className="font-heading font-bold text-xs text-[var(--text)]">
                          {bayNames[bayNum as 1|2|3|4]}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
                          {bayAppts.length} Booked
                        </span>
                      </div>

                      <div className="mt-3 space-y-3">
                        {bayAppts.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-[16px]">
                            <Wrench className="w-6 h-6 mx-auto text-[var(--text-muted)]/50 mb-1" />
                            <span>Bay Available for Emergency Walk-in</span>
                          </div>
                        ) : (
                          bayAppts.map(appt => (
                            <div 
                              key={appt.id}
                              className="p-3.5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2.5 shadow-sm hover:border-[#3FE0C5] transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-black text-sm text-[var(--text)]">{appt.vehicleReg}</span>
                                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                  appt.status === 'in_progress'
                                    ? 'chip-ready animate-pulse'
                                    : appt.status === 'pending_signoff'
                                    ? 'chip-blocked'
                                    : 'chip-pending'
                                }`}>
                                  {appt.status.replace('_', ' ')}
                                </span>
                              </div>

                              <p className="text-[11px] text-[var(--text-muted)] font-medium line-clamp-1">{appt.makeModel}</p>

                              <div className="text-xs font-heading font-semibold text-[var(--text)]">
                                {appt.jobType}
                              </div>

                              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                                <span className="flex items-center gap-1 font-mono text-[#3FE0C5]">
                                  <Clock className="w-3.5 h-3.5" />
                                  {appt.timeSlot}
                                </span>
                                <span className="truncate max-w-[120px]">{appt.technician.split(' ')[0]}</span>
                              </div>

                              {/* Mobile Tap-based Alternative to Drag & Drop */}
                              <button
                                type="button"
                                onClick={() => setActiveMoveBayItem(appt)}
                                className="w-full mt-1 min-h-[38px] text-xs font-heading font-bold rounded-[10px] bg-[var(--surface)] text-[#3FE0C5] hover:bg-[#3FE0C5]/10 border border-[#3FE0C5]/40 flex items-center justify-center gap-1.5 transition active:scale-95"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>Move Bay / Reschedule</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* WEEK VIEW: Multi-Day Snap-Scroll Container */
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="grid grid-cols-5 gap-3 min-w-[760px]">
                {workshopDays.map(d => {
                  const dayAppts = workshopAppointments.filter(a => a.dayIndex === d.index);
                  return (
                    <div key={d.index} className="nr-card p-3 space-y-2">
                      <div className="pb-2 border-b border-[var(--border)]">
                        <span className="font-heading font-bold text-xs text-[var(--text)] block">{d.label}</span>
                        <span className="text-[10px] font-mono text-[#3FE0C5]">{dayAppts.length} Total Vehicles</span>
                      </div>
                      <div className="space-y-2">
                        {dayAppts.map(appt => (
                          <div key={appt.id} className="p-2 rounded-[10px] bg-[var(--surface-2)] text-[11px] space-y-1 border border-[var(--border)]">
                            <div className="flex justify-between font-mono font-bold text-[var(--text)]">
                              <span>{appt.vehicleReg}</span>
                              <span className="text-[10px] text-[#3FE0C5]">Bay {appt.bayNumber}</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{appt.jobType}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAP-BASED REALLOCATE MODAL SHEET */}
          {activeMoveBayItem && (
            <div className="nr-modal-backdrop" onClick={() => setActiveMoveBayItem(null)}>
              <div className="nr-modal-sheet max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="nr-modal-sheet-header">
                  <div>
                    <h3 className="font-heading font-black text-base text-[var(--text)]">
                      Reallocate Workshop Bay: {activeMoveBayItem.vehicleReg}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Select target bay for {activeMoveBayItem.jobType}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMoveBayItem(null)}
                    className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-3">
                  {[1, 2, 3, 4].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleMoveBay(activeMoveBayItem.id, b as 1|2|3|4)}
                      className={`w-full min-h-[52px] p-3 rounded-[16px] border text-left flex items-center justify-between font-heading font-bold text-xs transition active:scale-95 ${
                        activeMoveBayItem.bayNumber === b
                          ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)]'
                          : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[#3FE0C5]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="block font-bold">Bay {b}: {b === 1 ? 'MOT & Testing' : b === 2 ? 'Heavy Mechanics' : b === 3 ? 'WAV Tail-Lift' : 'Rapid Tyres'}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">Instant Reallocation</span>
                      </div>
                      {activeMoveBayItem.bayNumber === b ? (
                        <span className="chip-ready px-2 py-0.5 rounded-full text-[10px]">Current Bay</span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#3FE0C5]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="nr-modal-sheet-footer">
                  <button
                    type="button"
                    onClick={() => setActiveMoveBayItem(null)}
                    className="btn-ghost w-full !min-h-[48px] !text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: SERVICE INTERVALS & CALCULATIONS (Requirement 3) */}
      {activeTab === 'service_records' && (
        <div className="space-y-4">
          
          {/* Stale Mileage Warning Banner */}
          {schedules.some(s => s.isMileageStale) && (
            <div className="bg-[#FFC24B]/15 border-2 border-[#FFC24B] p-4 rounded-[18px] text-xs text-[var(--text)] flex items-start gap-3 shadow-md">
              <AlertCircle className="w-5 h-5 text-[#FFC24B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-heading font-bold text-sm text-[#D97706] dark:text-[#FFC24B] uppercase tracking-wider block">
                  Mileage Freshness Warning (VEH-05 Policy)
                </span>
                <p className="text-[12px]">
                  Vehicle <strong>KU23 EWX</strong> has not received an odometer submission in 12 days (last recorded 16/10/2026). Drivers must submit an odometer reading via the mobile app daily to calculate exact service wear.
                </p>
              </div>
            </div>
          )}

          {/* Service Schedules Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {schedules.map(sched => {
              const isExpanded = expandedReg === sched.vehicleReg;
              const isOverdue = sched.reminderMilestone === 'overdue';
              const isDueSoon = sched.reminderMilestone === '1000_miles' || sched.reminderMilestone === '14_days';

              return (
                <div 
                  key={sched.vehicleReg} 
                  className={`nr-card p-5 space-y-4 flex flex-col justify-between ${
                    isOverdue ? 'border-[#FF5D6C] border-2 shadow-coral-glow' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <div>
                        <h4 className="font-mono font-bold text-base text-[var(--text)]">{sched.vehicleReg}</h4>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">{sched.makeModel}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isOverdue 
                          ? 'chip-blocked animate-pulse' 
                          : isDueSoon 
                          ? 'chip-due-soon' 
                          : 'chip-ready'
                      }`}>
                        {isOverdue ? 'Service Overdue' : isDueSoon ? 'Due Soon' : 'Service OK'}
                      </span>
                    </div>

                    {/* Mileage Freshness Badge */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5" />
                        Current Odometer:
                      </span>
                      <span className="font-mono font-bold text-[var(--text)]">
                        {sched.currentOdometerMiles.toLocaleString()} miles
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)]">Odometer Recorded:</span>
                      <span className={`font-mono ${sched.isMileageStale ? 'text-[#FF5D6C] font-bold' : 'text-[var(--text)]'}`}>
                        {sched.lastOdometerUpdateDate} {sched.isMileageStale ? '(STALE)' : '(Fresh)'}
                      </span>
                    </div>

                    {/* Service Calculation Logic (Earlier of Date or Mileage) */}
                    <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-muted)]">Calculation Rule:</span>
                        <span className="font-mono font-bold text-[#3FE0C5]">
                          {sched.limitingFactor === 'earlier_by_date' ? 'Earlier by Date (12 Mos)' : 'Earlier by Mileage (12k Mi)'}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-[var(--border)]">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Next Due Date:</span>
                          <span className={`font-mono font-bold ${isOverdue ? 'text-[#FF5D6C]' : 'text-[var(--text)]'}`}>
                            {sched.nextServiceDateDue}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Next Due Mileage:</span>
                          <span className="font-mono font-bold text-[var(--text)]">
                            {sched.nextServiceMileageDue.toLocaleString()} miles
                          </span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-[var(--border)] flex justify-between items-center text-xs">
                        <span className="font-heading font-semibold text-[var(--text)]">Next Scheduled:</span>
                        <span className="font-mono font-bold text-[#B6F23C]">{sched.calculatedNextService}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service History Expand Button */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setExpandedReg(isExpanded ? null : sched.vehicleReg)}
                      className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-[12px] text-xs font-heading font-semibold bg-[var(--surface-2)] text-[var(--text)] hover:text-[#B6F23C] transition"
                    >
                      <span>Past Service History ({sched.history.length})</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                        {sched.history.map(hist => (
                          <div key={hist.id} className="p-2.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[11px] space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-[var(--text)]">{hist.serviceDate} • {hist.odometerMiles.toLocaleString()} mi</span>
                              <span className="font-mono font-bold text-[#34D399]">£{hist.costGbp.toFixed(2)}</span>
                            </div>
                            <p className="text-[var(--text-muted)] capitalize font-semibold">{hist.serviceType.replace('_', ' ')} • {hist.workshopGarage}</p>
                            <p className="text-[10px] text-[var(--text-muted)] leading-tight">{hist.technicianNotes}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COST LEDGER (Requirement: Under 768px stacked card list, filters bottom sheet, pagination load more, desktop sticky table) */}
      {activeTab === 'cost_ledger' && (
        <div className="space-y-4">
          
          {/* Spending Approval Rules Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="nr-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Total Fleet Approved Spend
              </span>
              <span className="text-xl font-mono font-extrabold text-[var(--text)]">
                £{totalApproved.toFixed(2)}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">From {filteredLedger.length} maintenance orders</span>
            </div>

            <div className="nr-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Total Invoiced Actuals
              </span>
              <span className="text-xl font-mono font-extrabold text-[#3FE0C5]">
                £{totalActualInvoiced.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#34D399] block">100% audited invoices</span>
            </div>

            <div className="nr-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Parts vs Labour Split
              </span>
              <div className="flex justify-between font-mono text-xs pt-0.5">
                <span>Parts: £{totalParts.toFixed(2)}</span>
                <span>Labour: £{totalLabour.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">20% VAT Total: £{totalVat.toFixed(2)}</span>
            </div>

            <div className="nr-card p-4 space-y-1 bg-[var(--surface-2)]">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Spending Approval Policy
              </span>
              <p className="text-[11px] text-[var(--text)] leading-tight">
                <strong>&le; £250:</strong> Controller authority.<br />
                <strong>&gt; £250:</strong> Mandatory Director / Owner sign-off.
              </p>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="nr-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-[var(--text)] text-sm sm:text-base">
                  Itemised Vehicle Maintenance Cost Ledger
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Audit ledger tracking quotes, approved authorisations, actual invoices, parts, labour, and VAT (No double counting).
                </p>
              </div>

              {/* Mobile Filter Trigger Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCostFilterOpen(true)}
                  className="md:hidden min-h-[44px] px-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-heading font-bold text-[var(--text)] flex items-center gap-2 active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#3FE0C5]" />
                  <span>Filter by Vehicle</span>
                  {costFilterVehicle !== 'all' && (
                    <span className="w-2 h-2 rounded-full bg-[#B6F23C]" />
                  )}
                </button>

                {/* Desktop Inline Select */}
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="text-[var(--text-muted)] font-semibold">Filter by Vehicle:</span>
                  <select
                    value={costFilterVehicle}
                    onChange={(e) => setCostFilterVehicle(e.target.value)}
                    className="nr-input !h-[42px] !text-xs font-mono font-bold"
                  >
                    <option value="all">All Vehicles (Fleet Total)</option>
                    <option value="BD24 TYU">BD24 TYU (Ford Transit)</option>
                    <option value="KU23 EWX">KU23 EWX (Mercedes V-Class)</option>
                    <option value="LX72 GHY">LX72 GHY (Peugeot Boxer)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MOBILE: Stacked Card List (Under 768px) */}
            <div className="md:hidden space-y-3">
              {filteredLedger.slice(0, visibleLedgerCount).map(item => (
                <div 
                  key={item.id}
                  className="p-4 rounded-[18px] bg-[var(--surface-2)] border border-[var(--border)] space-y-3 shadow-sm"
                >
                  {/* Top Row: Reg & Status Chip */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <div>
                      <span className="font-mono font-black text-sm text-[var(--text)] block">{item.vehicleReg}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Job Ref: {item.jobRef}</span>
                    </div>

                    {item.approvalStatus === 'approved_director' ? (
                      <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Director Approved
                      </span>
                    ) : item.approvalStatus === 'approved_controller' ? (
                      <span className="bg-[#3FE0C5]/15 text-[#3FE0C5] border border-[#3FE0C5]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Controller Approved
                      </span>
                    ) : (
                      <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Pending Authorisation
                      </span>
                    )}
                  </div>

                  {/* Category & Description */}
                  <div>
                    <span className="text-xs font-heading font-bold text-[var(--text)] capitalize block">
                      {item.category.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5">{item.notes}</p>
                  </div>

                  {/* Financial Triple Box */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-[14px] bg-[var(--surface)] border border-[var(--border)] text-center text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">Quote</span>
                      <span className="font-mono font-bold text-[var(--text-muted)]">£{item.quoteCostGbp.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">Approved</span>
                      <span className="font-mono font-bold text-[var(--text)]">£{item.approvedCostGbp.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-[#34D399] uppercase block font-bold">Invoiced</span>
                      <span className="font-mono font-black text-[#34D399]">£{item.actualInvoicedCostGbp.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Breakdown & Invoice Reference */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                    <span>Parts: £{item.partsCostGbp.toFixed(0)} | Labour: £{item.labourCostGbp.toFixed(0)}</span>
                    <span className="text-[var(--text)] font-bold">{item.invoiceRef}</span>
                  </div>

                  {/* Action Button: Large 48px touch target */}
                  {item.approvalStatus === 'pending_approval' ? (
                    <button
                      type="button"
                      onClick={() => handleApproveCostItem(item.id)}
                      className="w-full min-h-[48px] rounded-[14px] bg-[#B6F23C] text-[#08201C] font-heading font-black text-xs hover:brightness-105 transition active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve Quote (£{item.quoteCostGbp.toFixed(2)})</span>
                    </button>
                  ) : (
                    <div className="text-center text-[11px] font-mono text-[var(--text-muted)] pt-1">
                      Authorised by: {item.approvedBy}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Infinite Scroll / Load More */}
              {visibleLedgerCount < filteredLedger.length && (
                <button
                  type="button"
                  onClick={() => setVisibleLedgerCount(prev => prev + 5)}
                  className="w-full min-h-[52px] rounded-[16px] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-heading font-extrabold text-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Load More Maintenance Records ({filteredLedger.length - visibleLedgerCount} remaining)</span>
                </button>
              )}
            </div>

            {/* DESKTOP: Sticky Table (md and above) */}
            <div className="hidden md:block overflow-x-auto table-sticky-first table-scroll-hint">
              <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                  <tr>
                    <th className="p-3.5">Job Ref &amp; Vehicle</th>
                    <th className="p-3.5">Category &amp; Work Description</th>
                    <th className="p-3.5 font-mono">Quote (£)</th>
                    <th className="p-3.5 font-mono">Approved (£)</th>
                    <th className="p-3.5 font-mono">Actual Invoiced (£)</th>
                    <th className="p-3.5 font-mono">Parts / Labour / VAT</th>
                    <th className="p-3.5">Invoice / Credit Ref</th>
                    <th className="p-3.5">Approval Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredLedger.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[var(--text)]">{item.jobRef}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{item.vehicleReg}</div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="font-heading font-semibold text-[var(--text)] capitalize">
                          {item.category.replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">{item.notes}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[var(--text-muted)]">
                        £{item.quoteCostGbp.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-mono font-semibold text-[var(--text)]">
                        £{item.approvedCostGbp.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-[#34D399]">
                        £{item.actualInvoicedCostGbp.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-[var(--text-muted)]">
                        <div>P: £{item.partsCostGbp.toFixed(2)} | L: £{item.labourCostGbp.toFixed(2)}</div>
                        <div className="text-[10px]">VAT (20%): £{item.vatAmountGbp.toFixed(2)}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="font-bold text-[var(--text)]">{item.invoiceRef}</div>
                        {item.creditNoteRef && (
                          <div className="text-[#3FE0C5] text-[10px] font-semibold">{item.creditNoteRef}</div>
                        )}
                      </td>

                      <td className="p-3.5">
                        {item.approvalStatus === 'approved_director' ? (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Director Approved
                          </span>
                        ) : item.approvalStatus === 'approved_controller' ? (
                          <span className="bg-[#3FE0C5]/15 text-[#3FE0C5] border border-[#3FE0C5]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Controller Approved
                          </span>
                        ) : (
                          <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Pending Authorisation
                          </span>
                        )}
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.approvedBy}</div>
                      </td>

                      <td className="p-3.5 text-right">
                        {item.approvalStatus === 'pending_approval' ? (
                          <button
                            onClick={() => handleApproveCostItem(item.id)}
                            className="btn-primary !text-[11px] !py-1 !px-2.5 !min-h-[36px]"
                          >
                            Approve Quote
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            Signed Off
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE FILTERS BOTTOM SHEET */}
          {isCostFilterOpen && (
            <div className="nr-modal-backdrop" onClick={() => setIsCostFilterOpen(false)}>
              <div className="nr-modal-sheet max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="nr-modal-sheet-header">
                  <div>
                    <h3 className="font-heading font-black text-base text-[var(--text)]">
                      Filter Maintenance Ledger
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Filter cost and audit records by vehicle
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCostFilterOpen(false)}
                    className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[var(--text)]">Select Vehicle Registration</label>
                    <select
                      value={costFilterVehicle}
                      onChange={(e) => setCostFilterVehicle(e.target.value)}
                      className="nr-input !h-[52px] text-sm font-mono font-bold"
                    >
                      <option value="all">All Vehicles (Fleet Total)</option>
                      <option value="BD24 TYU">BD24 TYU (Ford Transit)</option>
                      <option value="KU23 EWX">KU23 EWX (Mercedes V-Class)</option>
                      <option value="LX72 GHY">LX72 GHY (Peugeot Boxer)</option>
                    </select>
                  </div>
                </div>

                <div className="nr-modal-sheet-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setCostFilterVehicle('all');
                      setIsCostFilterOpen(false);
                    }}
                    className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCostFilterOpen(false)}
                    className="btn-primary flex-1 !min-h-[48px] !text-xs font-bold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* REPORT DEFECT MODAL SHEET (Responsive full-screen sheet on mobile with sticky header & footer) */}
      {isReportModalOpen && (
        <div className="nr-modal-backdrop" onClick={() => setIsReportModalOpen(false)}>
          <div className="nr-modal-sheet max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="nr-modal-sheet-header">
              <div>
                <h3 className="font-heading font-black text-base text-[var(--text)] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#FF5D6C]" />
                  <span>Report Vehicle Safety Defect</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Immediate VOR Roadworthiness Safety Gate Trigger
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-heading font-bold block text-[var(--text)]">Vehicle Registration</label>
                <select
                  value={newReg}
                  onChange={e => setNewReg(e.target.value)}
                  className="nr-input !h-[52px] !px-3 font-mono font-bold text-sm"
                >
                  {vehicles.map(v => (
                    <option key={v.registration} value={v.registration}>
                      {v.registration} ({v.make} {v.model})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-heading font-bold block text-[var(--text)]">Defect Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="nr-input !h-[52px] !px-3 text-sm"
                  >
                    <option value="Brakes">Brakes</option>
                    <option value="Tyres">Tyres</option>
                    <option value="Steering">Steering</option>
                    <option value="Lights">Lights</option>
                    <option value="Ramp/Lift">Ramp/Lift</option>
                    <option value="Fluids">Fluids</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-heading font-bold block text-[var(--text)]">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as any)}
                    className="nr-input !h-[52px] !px-3 text-sm font-bold text-[#FF5D6C]"
                  >
                    <option value="critical_safety">Critical Safety (Auto VOR Block)</option>
                    <option value="minor">Minor (Monitorable)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading font-bold block text-[var(--text)]">Defect Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the failure, noise, warning light, or physical damage..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-[14px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 outline-none text-sm"
                />
              </div>

              <div className="p-3 rounded-[12px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-[#FF5D6C] text-[11px] leading-relaxed">
                <strong>Mandatory 2-Person Safety Gate (DEF-04):</strong> Critical safety defects immediately place this vehicle into VOR (Vehicle Off Road) status. The vehicle cannot be dispatched until a second person inspects and releases it.
              </div>
            </div>

            <div className="nr-modal-sheet-footer">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="btn-danger flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Submit &amp; Trigger Gate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
