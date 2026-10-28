import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
import { 
  Receipt, 
  Fuel, 
  Zap, 
  Car, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Camera, 
  Upload, 
  UserCheck, 
  Plus, 
  Check, 
  X, 
  Image, 
  Lock, 
  Eye, 
  EyeOff,
  Search,
  ExternalLink
} from 'lucide-react';
import { 
  mockDriverExpenses, 
  mockAccidentReports, 
  mockGreyFleet 
} from '../data/mockDataPhase10';
import { 
  DriverExpenseRecord, 
  AccidentIncidentReport, 
  GreyFleetRecord,
  ExpenseCategory 
} from '../types/phase10';

export const ExpensesIncidentsPage: React.FC = () => {
  const { currentRole, canViewSafeguarding } = useRole();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'expenses' | 'incidents' | 'grey_fleet'>('expenses');
  
  // Expenses State
  const [expenses, setExpenses] = useState<DriverExpenseRecord[]>(mockDriverExpenses);
  const [expenseFilterCategory, setExpenseFilterCategory] = useState<string>('all');
  const [isSubmitExpenseModalOpen, setIsSubmitExpenseModalOpen] = useState(false);
  const [selectedReceiptPhoto, setSelectedReceiptPhoto] = useState<string | null>(null);

  // New Expense Form State (also matching mobile driver form)
  const [newExpCategory, setNewExpCategory] = useState<ExpenseCategory>('fuel_diesel');
  const [newExpAmount, setNewExpAmount] = useState<string>('45.00');
  const [newExpLitres, setNewExpLitres] = useState<string>('30.5');
  const [newExpReg, setNewExpReg] = useState<string>('BD24 TYU');
  const [newExpNotes, setNewExpNotes] = useState<string>('');
  const [newExpReceiptAttached, setNewExpReceiptAttached] = useState<boolean>(true);

  // Incidents State
  const [incidents, setIncidents] = useState<AccidentIncidentReport[]>(mockAccidentReports);
  const [selectedIncident, setSelectedIncident] = useState<AccidentIncidentReport | null>(null);
  const [isReportIncidentModalOpen, setIsReportIncidentModalOpen] = useState(false);

  // Grey Fleet State
  const [greyFleet, setGreyFleet] = useState<GreyFleetRecord[]>(mockGreyFleet);

  // Expense Handlers
  const handleApproveExpense = (id: string) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? {
      ...exp,
      status: 'approved',
      reviewedBy: user?.name || 'Office Controller'
    } : exp));
  };

  const handleRejectExpense = (id: string) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? {
      ...exp,
      status: 'rejected',
      reviewedBy: user?.name || 'Office Controller'
    } : exp));
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DriverExpenseRecord = {
      id: `EXP-00${expenses.length + 1}`,
      driverId: user?.id || 'DEC-DRV-01',
      driverName: user?.name || 'Tariq Mahmood',
      vehicleReg: newExpReg,
      category: newExpCategory,
      amountGbp: parseFloat(newExpAmount) || 0,
      litresOrKwh: parseFloat(newExpLitres) || undefined,
      date: '28/10/2026 17:15',
      receiptPhotoUrl: '/receipts/demo_uploaded_receipt.jpg',
      status: 'submitted',
      reviewNotes: newExpNotes || 'Receipt submitted via mobile entry form.'
    };
    setExpenses([created, ...expenses]);
    setIsSubmitExpenseModalOpen(false);
  };

  const totalPendingExpenses = expenses.filter(e => e.status === 'submitted').reduce((s, e) => s + e.amountGbp, 0);
  const totalApprovedExpenses = expenses.filter(e => e.status === 'approved' || e.status === 'reimbursed').reduce((s, e) => s + e.amountGbp, 0);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Expenses, Incidents &amp; Grey Fleet</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Operations &amp; Vetting
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Driver fuel &amp; charging receipts, road traffic collision reporting, and private grey fleet assurance.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              activeTab === 'expenses' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Driver Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              activeTab === 'incidents' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Accident &amp; Incident Log ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('grey_fleet')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              activeTab === 'grey_fleet' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Grey Fleet Register ({greyFleet.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DRIVER EXPENSES (Requirement 5) */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="nr-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Pending Approval Queue
              </span>
              <span className="text-xl font-mono font-extrabold text-[#FFC24B]">
                £{totalPendingExpenses.toFixed(2)}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">
                {expenses.filter(e => e.status === 'submitted').length} claim receipts awaiting review
              </span>
            </div>

            <div className="nr-card p-4 space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Approved &amp; Reimbursed
              </span>
              <span className="text-xl font-mono font-extrabold text-[#34D399]">
                £{totalApprovedExpenses.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#34D399] block">Exported to weekly driver settlement</span>
            </div>

            <div className="nr-card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Driver Mobile Entry Form
                </span>
                <span className="text-xs text-[var(--text)] font-heading font-semibold block mt-0.5">
                  Simulate driver uploading forecourt receipt
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitExpenseModalOpen(true)}
                className="btn-primary !text-xs !py-1.5 !px-3"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Expense</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                  Fuel, EV Charging, AdBlue &amp; Parking Expense Claims
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Driver submissions with verified forecourt receipt photos and BACS payroll reimbursement.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)] font-semibold">Category:</span>
                <select
                  value={expenseFilterCategory}
                  onChange={(e) => setExpenseFilterCategory(e.target.value)}
                  className="nr-input !h-[36px] !text-xs font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="fuel_diesel">Fuel (Diesel)</option>
                  <option value="fuel_petrol">Fuel (Petrol)</option>
                  <option value="ev_charging">EV Rapid Charging</option>
                  <option value="adblue">Euro 6 AdBlue</option>
                  <option value="parking_tolls">Parking &amp; Airport Tolls</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                  <tr>
                    <th className="p-3.5">Claim Ref &amp; Driver</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Vehicle Reg</th>
                    <th className="p-3.5 font-mono">Amount (£ GBP)</th>
                    <th className="p-3.5">Volume / Units</th>
                    <th className="p-3.5">Receipt Attachment</th>
                    <th className="p-3.5">Claim Status</th>
                    <th className="p-3.5 text-right">Office Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {expenses.filter(e => expenseFilterCategory === 'all' || e.category === expenseFilterCategory).map(exp => (
                    <tr key={exp.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-heading font-bold text-[var(--text)]">{exp.driverName}</div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">{exp.id} • {exp.date}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text)] capitalize text-[11px]">
                          {exp.category.includes('ev') ? (
                            <Zap className="w-3.5 h-3.5 text-[#3FE0C5]" />
                          ) : (
                            <Fuel className="w-3.5 h-3.5 text-[#FF9F6B]" />
                          )}
                          <span>{exp.category.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-[var(--text)]">
                        {exp.vehicleReg}
                      </td>

                      <td className="p-3.5 font-mono font-extrabold text-sm text-[var(--text)]">
                        £{exp.amountGbp.toFixed(2)}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-[var(--text-muted)]">
                        {exp.litresOrKwh ? (
                          exp.category === 'ev_charging' ? `${exp.litresOrKwh} kWh` : `${exp.litresOrKwh} Litres`
                        ) : '—'}
                      </td>

                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptPhoto(exp.receiptPhotoUrl)}
                          className="flex items-center gap-1 text-[11px] text-[#3FE0C5] hover:underline font-mono"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>View Receipt Photo</span>
                        </button>
                      </td>

                      <td className="p-3.5">
                        {exp.status === 'submitted' && (
                          <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Submitted
                          </span>
                        )}
                        {exp.status === 'approved' && (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Approved
                          </span>
                        )}
                        {exp.status === 'reimbursed' && (
                          <span className="bg-[#3FE0C5]/20 text-[#3FE0C5] border border-[#3FE0C5]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Reimbursed
                          </span>
                        )}
                        {exp.status === 'rejected' && (
                          <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        {exp.status === 'submitted' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApproveExpense(exp.id)}
                              className="btn-primary !text-[11px] !py-1 !px-2.5 !min-h-[30px]"
                              title="Approve for weekly payroll reimbursement"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectExpense(exp.id)}
                              className="p-1.5 rounded-[8px] text-[#FF5D6C] hover:bg-[#FF5D6C]/15 transition"
                              title="Reject claim"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            {exp.reviewedBy ? `By ${exp.reviewedBy}` : 'Processed'}
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

      {/* TAB 2: ACCIDENT & INCIDENT REPORT (Requirement 6) */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          
          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-[var(--text)] text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF5D6C]" />
                  <span>Road Traffic Incident &amp; Collision Register</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Mobile accident forms, third-party details, Police CAD reference, and GDPR-restricted injury reports.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Insurer Hotline: <strong className="text-[var(--text)]">0800 917 2200</strong> (Aviva Fleet)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {incidents.map(inc => (
                <div key={inc.id} className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-3 text-xs">
                  
                  {/* Top Incident Banner */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#FF5D6C]">{inc.reportRef}</span>
                      <span className="text-[var(--text-muted)]">• {inc.dateTime}</span>
                      <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {inc.investigationStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[var(--text-muted)]">Police Ref:</span>
                      <span className="font-bold text-[var(--text)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                        {inc.policeRefCAD}
                      </span>
                    </div>
                  </div>

                  {/* Incident Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Column 1: Fleet Vehicle */}
                    <div className="p-3 bg-[var(--surface)] rounded-[12px] border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                        Fleet Vehicle &amp; Driver
                      </span>
                      <div className="font-heading font-bold text-sm text-[var(--text)]">{inc.vehicleReg}</div>
                      <div className="text-[11px] text-[var(--text)]">Driver: {inc.driverName} ({inc.driverId})</div>
                      <div className="text-[10px] text-[#34D399] font-semibold uppercase font-mono">
                        Status: {inc.drivableStatus.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Column 2: Third Party Details */}
                    <div className="p-3 bg-[var(--surface)] rounded-[12px] border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                        Third Party Involved
                      </span>
                      <div className="font-heading font-bold text-sm text-[var(--text)]">
                        {inc.thirdPartyVehicle.reg} ({inc.thirdPartyVehicle.makeModel})
                      </div>
                      <div className="text-[11px] text-[var(--text)]">
                        {inc.thirdPartyVehicle.driverName} • {inc.thirdPartyVehicle.contactPhone}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        {inc.thirdPartyVehicle.insurer} (Pol: {inc.thirdPartyVehicle.policyNumber})
                      </div>
                    </div>

                    {/* Column 3: Witness & Location */}
                    <div className="p-3 bg-[var(--surface)] rounded-[12px] border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                        Location &amp; Witnesses
                      </span>
                      <div className="text-[11px] font-semibold text-[var(--text)]">{inc.location}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {inc.witnesses.length} Independent Witness: {inc.witnesses[0].name} ({inc.witnesses[0].phone})
                      </div>
                      <div className="text-[10px] text-[#3FE0C5] font-mono">
                        {inc.photoCount} Scene &amp; Damage Photos Uploaded
                      </div>
                    </div>

                  </div>

                  {/* Restricted Injury Section (Requirement 6: Restricted Injury Info) */}
                  <div className="p-3 bg-[var(--surface)] rounded-[12px] border border-[var(--border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-[11px] text-[var(--text)] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#FFC24B]" />
                        <span>Restricted Injury &amp; Medical Disclosure (HR &amp; Directors Only)</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inc.injuryDetails.hasInjuries ? 'chip-blocked' : 'chip-ready'
                      }`}>
                        {inc.injuryDetails.hasInjuries ? 'Injuries Reported' : 'No Injuries (Zero Casualty)'}
                      </span>
                    </div>

                    {canViewSafeguarding ? (
                      <p className="text-[11px] text-[var(--text)] leading-relaxed">
                        {inc.injuryDetails.restrictedMedicalSummary}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[var(--text-muted)] italic">
                        [Medical narrative redacted by GDPR Safety Gate. Visible only to Designated Safeguarding Lead / HR].
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GREY FLEET REGISTER (Requirement 6) */}
      {activeTab === 'grey_fleet' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                Grey Fleet Compliance Register (Private Staff Vehicles for Duty)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                DVSA MOT, VED Road Tax, Business Class 1 / Hire &amp; Reward Insurance check, and Council Escort Badge.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Add Grey Fleet Vehicle Modal')}
              className="btn-primary !text-xs !py-1 !px-3"
            >
              <Plus className="w-4 h-4" />
              <span>Register Grey Vehicle</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Staff Owner</th>
                  <th className="p-3.5">Registration &amp; Model</th>
                  <th className="p-3.5">Annual DVSA MOT</th>
                  <th className="p-3.5">VED Road Tax</th>
                  <th className="p-3.5">Business Insurance Endorsement</th>
                  <th className="p-3.5">Council Badge</th>
                  <th className="p-3.5">Road Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {greyFleet.map(gf => {
                  const isInsuranceExpired = gf.businessInsuranceStatus === 'expired';
                  const isMotDueSoon = gf.motStatus === 'due_soon';
                  const isFullyCleared = !isInsuranceExpired && gf.motStatus === 'valid' && gf.taxStatus === 'taxed' && gf.councilBadgeApproved;

                  return (
                    <tr key={gf.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-heading font-bold text-[var(--text)]">{gf.staffName}</div>
                        <div className="text-[10px] text-[var(--text-muted)] capitalize">{gf.staffRole} ({gf.staffId})</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[var(--text)]">{gf.registration}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{gf.makeModel}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          gf.motStatus === 'valid' ? 'chip-ready' : 'chip-due-soon'
                        }`}>
                          {gf.motStatus} ({gf.motExpiryDate})
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          {gf.taxStatus} ({gf.taxExpiryDate})
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        {isInsuranceExpired ? (
                          <div className="space-y-0.5">
                            <span className="chip-blocked px-2 py-0.5 rounded-full text-[10px] font-bold uppercase animate-pulse">
                              EXPIRED ({gf.insuranceExpiryDate})
                            </span>
                            <div className="text-[10px] text-[#FF5D6C] font-semibold">Prohibited from passenger transit</div>
                          </div>
                        ) : (
                          <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            {gf.businessInsuranceStatus.replace('_', ' ')} (Exp: {gf.insuranceExpiryDate})
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {gf.councilBadgeApproved ? (
                          <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Council Badge Approved
                          </span>
                        ) : (
                          <span className="chip-blocked px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Badge Pending
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isFullyCleared ? (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Operational
                          </span>
                        ) : (
                          <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Suspended
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driver Mobile Entry Expense Modal */}
      {isSubmitExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Submit Fuel &amp; Expense Claim
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Mobile driver upload receipt</p>
              </div>
              <button 
                onClick={() => setIsSubmitExpenseModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Expense Category</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value as any)}
                  className="nr-input !h-[42px] font-semibold"
                >
                  <option value="fuel_diesel">Fuel (Diesel)</option>
                  <option value="fuel_petrol">Fuel (Petrol)</option>
                  <option value="ev_charging">EV Rapid DC Charging</option>
                  <option value="adblue">Euro 6 AdBlue</option>
                  <option value="parking_tolls">Parking &amp; Airport Barrier Tolls</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Amount (£ GBP)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Volume (L / kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newExpLitres}
                    onChange={(e) => setNewExpLitres(e.target.value)}
                    className="nr-input !h-[42px] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Vehicle Registration</label>
                <input
                  type="text"
                  required
                  value={newExpReg}
                  onChange={(e) => setNewExpReg(e.target.value)}
                  className="nr-input !h-[42px] font-mono font-bold"
                />
              </div>

              {/* Receipt Dropzone Simulation */}
              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Forecourt Receipt Photo</label>
                <div className="border-2 border-dashed border-[#B6F23C]/60 bg-[var(--surface-2)] p-4 rounded-[14px] text-center space-y-1.5 cursor-pointer hover:border-[#B6F23C]">
                  <Camera className="w-6 h-6 text-[#B6F23C] mx-auto" />
                  <span className="text-[11px] font-heading font-bold text-[var(--text)] block">
                    {newExpReceiptAttached ? 'receipt_shell_28oct.jpg (Ready)' : 'Tap to take photo or attach image'}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block">Clear VAT receipt showing litres and date</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitExpenseModalOpen(false)}
                  className="btn-ghost flex-1 !text-xs !min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 !text-xs !min-h-[42px]"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Receipt Photo Modal */}
      {selectedReceiptPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="nr-card p-5 max-w-sm w-full space-y-3 border border-[var(--border)] shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-xs text-[var(--text)]">Forecourt VAT Receipt</span>
              <button onClick={() => setSelectedReceiptPhoto(null)} className="text-sm font-bold text-[var(--text-muted)]">✕</button>
            </div>
            <div className="h-48 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] flex flex-col items-center justify-center text-center p-4 space-y-2">
              <Receipt className="w-10 h-10 text-[#B6F23C]" />
              <p className="font-mono text-xs text-[var(--text)] font-bold">SHELL PETROLEUM UK LTD</p>
              <p className="text-[10px] text-[var(--text-muted)]">Dunstable Road • 28/10/2026 14:32</p>
              <p className="font-mono text-sm text-[#34D399] font-bold">TOTAL: £68.50 (VAT incl)</p>
            </div>
            <button
              onClick={() => setSelectedReceiptPhoto(null)}
              className="btn-primary w-full !text-xs !py-2"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
