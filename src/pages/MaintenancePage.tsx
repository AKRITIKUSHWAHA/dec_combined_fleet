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
  ChevronUp
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

      {/* TAB 2: WORKSHOP PORTAL */}
      {activeTab === 'workshop' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Contracted Workshop Portal (Dunstable Fleet Care Ltd &amp; Mercedes Van Centre)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Direct work orders, garage turnaround SLAs, and downtime tracking.
              </p>
            </div>
            <span className="chip-ready px-3 py-1 rounded-full text-xs font-mono font-bold">
              3 Work Orders In Progress
            </span>
          </div>

          <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-2">
            <div className="flex justify-between items-center font-heading font-bold text-[var(--text)]">
              <span>Dunstable Fleet Care Workshop Ltd (Depot Contract)</span>
              <span className="text-[#34D399]">SLAS: 24h Minor / 48h Major</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Account Ref: DEC-FLT-DUNSTABLE • Next available emergency bay: Tomorrow 08:30. Authorised mechanic sign-off integrated via DEC Workshop tablet app.
            </p>
          </div>
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
                      className="w-full flex items-center justify-between p-2 rounded-[10px] text-xs font-heading font-semibold bg-[var(--surface-2)] text-[var(--text)] hover:text-[#B6F23C] transition"
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

      {/* TAB 4: COST LEDGER (Requirement 4) */}
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

          {/* Filter Bar */}
          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                  Itemised Vehicle Maintenance Cost Ledger
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Audit ledger tracking quotes, approved authorisations, actual invoices, parts, labour, and VAT (No double counting).
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Filter by Vehicle:</span>
                <select
                  value={costFilterVehicle}
                  onChange={(e) => setCostFilterVehicle(e.target.value)}
                  className="nr-input !h-[36px] !text-xs font-mono font-bold"
                >
                  <option value="all">All Vehicles (Fleet Total)</option>
                  <option value="BD24 TYU">BD24 TYU (Ford Transit)</option>
                  <option value="KU23 EWX">KU23 EWX (Mercedes V-Class)</option>
                  <option value="LX72 GHY">LX72 GHY (Peugeot Boxer)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
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
                            className="btn-primary !text-[11px] !py-1 !px-2.5 !min-h-[32px]"
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
        </div>
      )}

      {/* Report Defect Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="font-heading font-bold text-base text-[var(--text)]">
                Report Vehicle Safety Defect
              </h3>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Vehicle Registration</label>
                <select
                  value={newReg}
                  onChange={e => setNewReg(e.target.value)}
                  className="nr-input !h-[44px] !px-3 font-mono font-bold"
                >
                  {vehicles.map(v => (
                    <option key={v.registration} value={v.registration}>
                      {v.registration} ({v.make} {v.model})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Defect Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="nr-input !h-[44px] !px-3"
                  >
                    <option value="Brakes">Brakes</option>
                    <option value="Tyres">Tyres</option>
                    <option value="Steering">Steering</option>
                    <option value="Lights">Lights</option>
                    <option value="Ramp/Lift">Ramp/Lift</option>
                    <option value="Fluids">Fluids</option>
                  </select>
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as any)}
                    className="nr-input !h-[44px] !px-3"
                  >
                    <option value="critical_safety">Critical Safety (Auto VOR Block)</option>
                    <option value="minor">Minor (Monitorable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Defect Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the failure, noise, warning light, or physical damage..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex gap-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="btn-ghost flex-1 !text-xs !min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="btn-danger flex-1 !text-xs !min-h-[44px]"
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
