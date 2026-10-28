import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Lock, 
  Plus, 
  UserX, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Download,
  Upload,
  AlertCircle,
  Eye,
  FileCheck,
  Send,
  X
} from 'lucide-react';
import { SafeguardingCase, SafeguardingSeverity, SafeguardingStatus } from '../types';

export const SafeguardingPage: React.FC = () => {
  const { 
    safeguardingCases, 
    addSafeguardingCase, 
    updateSafeguardingStatus, 
    addSafeguardingDecision, 
    addSafeguardingDisclosure,
    staff 
  } = useData();
  const { currentRole, canViewSafeguarding } = useRole();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(safeguardingCases[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'narrative' | 'disclosures' | 'decisions' | 'attachments'>('narrative');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isDisclosureModalOpen, setIsDisclosureModalOpen] = useState(false);

  // New Case form state
  const [newTitle, setNewTitle] = useState('');
  const [newIncidentDate, setNewIncidentDate] = useState(new Date().toISOString().slice(0, 16));
  const [newSeverity, setNewSeverity] = useState<SafeguardingSeverity>('medium');
  const [newStaffId, setNewStaffId] = useState('');
  const [newPupilName, setNewPupilName] = useState('');
  const [newPupilSchool, setNewPupilSchool] = useState('');
  const [newRouteCode, setNewRouteCode] = useState('');
  const [newVehicleReg, setNewVehicleReg] = useState('');
  const [newNarrative, setNewNarrative] = useState('');
  const [newReporter, setNewReporter] = useState('Elena Rostova (Compliance)');
  const [newReporterRole, setNewReporterRole] = useState('Designated Safeguarding Lead');

  // Decision form state
  const [decisionAction, setDecisionAction] = useState('Precautionary Route Suspension');
  const [decisionRationale, setDecisionRationale] = useState('');
  const [decisionReviewDate, setDecisionReviewDate] = useState('');

  // Disclosure form state
  const [discAgency, setDiscAgency] = useState('Luton Borough Council - LADO');
  const [discOfficer, setDiscOfficer] = useState('');
  const [discRef, setDiscRef] = useState('');
  const [discNotes, setDiscNotes] = useState('');

  // SECURITY GATE: General Controllers & Drivers must NEVER see safeguarding narratives
  if (!canViewSafeguarding && currentRole !== 'owner_admin' && currentRole !== 'hr_vetting') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[var(--surface)] border border-rose-500/30 rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 uppercase tracking-wider">
              403 Access Strictly Denied
            </span>
            <h2 className="text-lg font-heading font-bold text-[var(--text)] mt-2">
              Safeguarding &amp; Section 47 Portal Restricted
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
              Under UK statutory guidance (Working Together to Safeguard Children 2023), safeguarding narratives and LADO referral histories are strictly restricted to Designated Safeguarding Officers and Head Office Executives.
            </p>
          </div>
          <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-[11px] text-[var(--text-muted)] text-left">
            <p className="font-bold text-[var(--text)]">Role Isolation Rule:</p>
            <p className="mt-0.5">Controllers, drivers, and mechanics cannot view safeguarding files. General incident logs never receive these narratives.</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedCase = safeguardingCases.find(c => c.id === selectedCaseId) || safeguardingCases[0];

  const filteredCases = safeguardingCases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = c.caseNumber.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchPupil = c.pupilOrPassenger?.name.toLowerCase().includes(q);
      const matchStaff = c.subjectStaffName?.toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchPupil && !matchStaff) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: SafeguardingSeverity) => {
    switch (severity) {
      case 'critical_s47':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-500 border border-rose-500/40 animate-pulse">Critical Section 47</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/40">High Severity</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/40">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/40">Low / Minor</span>;
    }
  };

  const getStatusBadge = (status: SafeguardingStatus) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30">Open</span>;
      case 'under_investigation':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">Under Investigation</span>;
      case 'lado_referral':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-500 border border-purple-500/30">LADO Referred</span>;
      case 'escalated_police':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">Police Escalated</span>;
      case 'closed_substantiated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">Substantiated &amp; Closed</span>;
      case 'closed_unsubstantiated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">Closed (Unsubstantiated)</span>;
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newNarrative) return;

    const assignedStaff = staff.find(s => s.id === newStaffId);

    addSafeguardingCase({
      title: newTitle,
      incidentDate: newIncidentDate,
      reportedBy: newReporter,
      reporterRole: newReporterRole,
      subjectStaffId: newStaffId || undefined,
      subjectStaffName: assignedStaff?.name || undefined,
      subjectStaffRole: (assignedStaff?.role === 'pa' ? 'pa' : 'driver') as any,
      pupilOrPassenger: newPupilName ? {
        name: newPupilName,
        school: newPupilSchool,
        vulnerabilities: ['SEN Transport Passenger']
      } : undefined,
      routeCode: newRouteCode || undefined,
      vehicleReg: newVehicleReg || undefined,
      status: 'open',
      severity: newSeverity,
      narrative: newNarrative,
      deadlines: {
        ladoSlaHours: newSeverity === 'critical_s47' ? 24 : 48,
        ladoDeadlineIso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        internalReviewIso: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        isOverdue: false
      },
      attachments: [],
      decisions: [],
      disclosures: []
    });

    setIsNewCaseModalOpen(false);
    setNewTitle('');
    setNewNarrative('');
    setNewPupilName('');
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !decisionRationale) return;

    addSafeguardingDecision(selectedCase.id, {
      decidedBy: 'Elena Rostova (Designated Safeguarding Lead)',
      actionTaken: decisionAction,
      rationale: decisionRationale,
      reviewDate: decisionReviewDate || undefined
    });

    setIsDecisionModalOpen(false);
    setDecisionRationale('');
  };

  const handleAddDisclosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !discAgency || !discOfficer) return;

    addSafeguardingDisclosure(selectedCase.id, {
      agency: discAgency,
      officerName: discOfficer,
      referenceNo: discRef || `LADO-${Date.now().toString().slice(-4)}`,
      notes: discNotes
    });

    setIsDisclosureModalOpen(false);
    setDiscOfficer('');
    setDiscNotes('');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Safeguarding &amp; Section 47 Cases Area</span>
            <span className="chip-blocked px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Restricted Confidential</span>
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Dedicated safeguarding case management, statutory LADO 24h reporting deadlines, decisions, and disclosures. Isolated from general dispatch views.
          </p>
        </div>

        <button
          onClick={() => setIsNewCaseModalOpen(true)}
          className="btn-primary !h-[42px] px-4 rounded-[12px] text-xs font-heading font-bold flex items-center gap-1.5 shadow-lime-glow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Safeguarding Concern</span>
        </button>
      </div>

      {/* Statutory Protection Banner */}
      <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-[16px] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-heading font-bold text-purple-300">
            Confidentiality &amp; Working Together to Safeguard Children 2023 Protocol:
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Case details, evidence files, and disclosures held within this area are strictly sequestered. Controllers and operational drivers can only see a binary operational clearance flag (Cleared vs Restricted) with no access to case narratives or allegations.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="nr-card p-3.5 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Cases</span>
          <p className="text-xl font-black text-[var(--text)] font-mono">
            {safeguardingCases.filter(c => c.status !== 'closed_substantiated' && c.status !== 'closed_unsubstantiated').length}
          </p>
          <span className="text-[10px] text-amber-500 font-medium">Under active review</span>
        </div>

        <div className="nr-card p-3.5 space-y-1 border-purple-500/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">LADO Referrals</span>
          <p className="text-xl font-black text-purple-400 font-mono">
            {safeguardingCases.filter(c => c.status === 'lado_referral').length}
          </p>
          <span className="text-[10px] text-[var(--text-muted)]">24h statutory clock active</span>
        </div>

        <div className="nr-card p-3.5 space-y-1 border-rose-500/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">Section 47 Alerts</span>
          <p className="text-xl font-black text-rose-500 font-mono">
            {safeguardingCases.filter(c => c.severity === 'critical_s47').length}
          </p>
          <span className="text-[10px] text-rose-400 font-medium">Precautionary route suspensions</span>
        </div>

        <div className="nr-card p-3.5 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Resolved / Closed</span>
          <p className="text-xl font-black text-emerald-500 font-mono">
            {safeguardingCases.filter(c => c.status === 'closed_substantiated' || c.status === 'closed_unsubstantiated').length}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">Multi-agency signed off</span>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Cases List (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Filters Bar */}
          <div className="nr-card p-3 space-y-2.5">
            <input
              type="text"
              placeholder="Search case #, pupil, staff..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[38px] !text-xs w-full"
            />
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="nr-input !h-[34px] !text-[11px] flex-1"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="lado_referral">LADO Referral</option>
                <option value="closed_substantiated">Closed (Substantiated)</option>
                <option value="closed_unsubstantiated">Closed (Unsubstantiated)</option>
              </select>

              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="nr-input !h-[34px] !text-[11px] flex-1"
              >
                <option value="all">All Severities</option>
                <option value="critical_s47">Critical Section 47</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Cases List Cards */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCases.map(c => {
              const isSelected = c.id === selectedCase?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`nr-card p-3.5 cursor-pointer transition-all duration-180 border ${
                    isSelected 
                      ? 'border-[#B6F23C] bg-[var(--surface-2)] shadow-sm ring-1 ring-[#B6F23C]/30' 
                      : 'hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#B6F23C]">
                          {c.caseNumber}
                        </span>
                        {getSeverityBadge(c.severity)}
                      </div>
                      <h3 className="text-xs font-heading font-bold text-[var(--text)] line-clamp-1 mt-1">
                        {c.title}
                      </h3>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-2 leading-relaxed">
                    {c.narrative}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <span className="font-mono">
                      Reported: {new Date(c.reportedDate).toLocaleDateString('en-GB')}
                    </span>
                    {c.subjectStaffName && (
                      <span className="font-medium text-[var(--text)]">
                        Staff: {c.subjectStaffName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="nr-card p-8 text-center text-xs text-[var(--text-muted)]">
                No safeguarding cases matched the current search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Case Detail (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="nr-card p-5 space-y-4 border border-[var(--border)]">
              
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-black text-[#B6F23C]">
                      {selectedCase.caseNumber}
                    </span>
                    {getSeverityBadge(selectedCase.severity)}
                    {getStatusBadge(selectedCase.status)}
                  </div>
                  <h2 className="text-base font-heading font-bold text-[var(--text)] mt-1">
                    {selectedCase.title}
                  </h2>
                </div>

                {/* Status Changer */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <select
                    value={selectedCase.status}
                    onChange={e => updateSafeguardingStatus(selectedCase.id, e.target.value as SafeguardingStatus)}
                    className="nr-input !h-[36px] !text-xs font-heading font-bold"
                  >
                    <option value="open">Mark Open</option>
                    <option value="under_investigation">Mark Under Investigation</option>
                    <option value="lado_referral">Escalate to LADO</option>
                    <option value="escalated_police">Escalate to Police</option>
                    <option value="closed_substantiated">Close as Substantiated</option>
                    <option value="closed_unsubstantiated">Close as Unsubstantiated</option>
                  </select>
                </div>
              </div>

              {/* Statutory Reporting SLA Warning Box */}
              <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-heading font-bold text-[var(--text)]">LADO Statutory Reporting SLA (24h Window):</span>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Target deadline: {new Date(selectedCase.deadlines.ladoDeadlineIso).toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
                <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#08201C] bg-[#B6F23C]">
                  SLA Active &amp; Monitored
                </span>
              </div>

              {/* Key Parties Involved Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Subject Staff</span>
                  <p className="font-heading font-bold text-[var(--text)]">
                    {selectedCase.subjectStaffName || 'Not specified'}
                  </p>
                  <span className="text-[10px] text-amber-400 font-medium capitalize">
                    {selectedCase.subjectStaffRole || 'Staff member'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Pupil / Passenger</span>
                  <p className="font-heading font-bold text-[var(--text)]">
                    {selectedCase.pupilOrPassenger?.name || 'Adult / Not recorded'}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] truncate block">
                    {selectedCase.pupilOrPassenger?.school || 'Council SEN'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Route &amp; Vehicle</span>
                  <p className="font-heading font-bold text-[var(--text)] truncate">
                    {selectedCase.routeCode || 'General Dispatch'}
                  </p>
                  <span className="text-[10px] text-[#3FE0C5] font-mono">
                    {selectedCase.vehicleReg || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Tabs Bar */}
              <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] text-xs">
                <button
                  onClick={() => setActiveTab('narrative')}
                  className={`flex-1 py-1.5 rounded-[10px] font-heading font-bold transition ${
                    activeTab === 'narrative' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Confidential Narrative
                </button>
                <button
                  onClick={() => setActiveTab('disclosures')}
                  className={`flex-1 py-1.5 rounded-[10px] font-heading font-bold transition flex items-center justify-center gap-1 ${
                    activeTab === 'disclosures' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>Agency Disclosures</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[var(--surface-2)] rounded-full border border-[var(--border)] font-mono">
                    {selectedCase.disclosures.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('decisions')}
                  className={`flex-1 py-1.5 rounded-[10px] font-heading font-bold transition flex items-center justify-center gap-1 ${
                    activeTab === 'decisions' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>Decisions Log</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[var(--surface-2)] rounded-full border border-[var(--border)] font-mono">
                    {selectedCase.decisions.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`flex-1 py-1.5 rounded-[10px] font-heading font-bold transition flex items-center justify-center gap-1 ${
                    activeTab === 'attachments' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>Attachments</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[var(--surface-2)] rounded-full border border-[var(--border)] font-mono">
                    {selectedCase.attachments.length}
                  </span>
                </button>
              </div>

              {/* Tab 1: Narrative */}
              {activeTab === 'narrative' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="font-heading font-bold text-[var(--text)]">Official Incident Narrative (Confidential):</span>
                      <span>Recorded by {selectedCase.reportedBy}</span>
                    </div>
                    <p className="text-xs text-[var(--text)] leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedCase.narrative}
                    </p>
                  </div>

                  {/* Pupil Vulnerabilities tags */}
                  {selectedCase.pupilOrPassenger?.vulnerabilities && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-heading font-bold text-[var(--text-muted)]">
                        Pupil Vulnerability Profile:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedCase.pupilOrPassenger.vulnerabilities.map((v, i) => (
                          <span key={i} className="chip-pending px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Disclosures */}
              {activeTab === 'disclosures' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-[var(--text)]">
                      Multi-Agency Statutory Disclosures History
                    </span>
                    <button
                      onClick={() => setIsDisclosureModalOpen(true)}
                      className="btn-secondary !h-[32px] px-2.5 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log External Disclosure</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {selectedCase.disclosures.map(d => (
                      <div key={d.id} className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-heading font-bold text-xs text-purple-400">
                            {d.agency}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                            Ref: {d.referenceNo} • {new Date(d.date).toLocaleString('en-GB')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Officer: <span className="font-medium text-[var(--text)]">{d.officerName}</span>
                        </p>
                        <p className="text-xs text-[var(--text)] leading-relaxed mt-1">
                          {d.notes}
                        </p>
                      </div>
                    ))}

                    {selectedCase.disclosures.length === 0 && (
                      <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl">
                        No external disclosures transmitted yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Decisions Log */}
              {activeTab === 'decisions' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-[var(--text)]">
                      Safeguarding Officer Decisions &amp; Action Trail
                    </span>
                    <button
                      onClick={() => setIsDecisionModalOpen(true)}
                      className="btn-secondary !h-[32px] px-2.5 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Decision</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {selectedCase.decisions.map(dec => (
                      <div key={dec.id} className="p-3 bg-[var(--surface-2)] rounded-xl border border-amber-500/20 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-heading font-bold text-xs text-amber-400">
                            {dec.actionTaken}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {new Date(dec.date).toLocaleString('en-GB')}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text)] leading-relaxed">
                          {dec.rationale}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
                          <span>Signed off by: <strong className="text-[var(--text)]">{dec.decidedBy}</strong></span>
                          {dec.reviewDate && <span>Next Review: <strong>{dec.reviewDate}</strong></span>}
                        </div>
                      </div>
                    ))}

                    {selectedCase.decisions.length === 0 && (
                      <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl">
                        No formal management decisions recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Attachments */}
              {activeTab === 'attachments' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-[var(--text)]">
                      Evidence &amp; Telematics Attachments
                    </span>
                    <button className="btn-secondary !h-[32px] px-2.5 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Evidence</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedCase.attachments.map(att => (
                      <div key={att.id} className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-[#3FE0C5] shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-heading font-bold text-[var(--text)] truncate">
                              {att.name}
                            </p>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                              {Math.round(att.sizeKb)} KB • Uploaded by {att.uploadedBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 uppercase">
                            {att.classification}
                          </span>
                          <button 
                            onClick={() => alert(`Simulating secure download for evidence attachment: ${att.name}`)}
                            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
                            title="Download evidence"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedCase.attachments.length === 0 && (
                      <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl">
                        No attachments uploaded for this case.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="nr-card p-12 text-center text-xs text-[var(--text-muted)]">
              Select a safeguarding case from the left panel to review narratives and disclosures.
            </div>
          )}
        </div>

      </div>

      {/* ======================================================================
          MODAL 1: LOG NEW SAFEGUARDING CONCERN
          ====================================================================== */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-xl w-full border border-[var(--border)] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Log New Safeguarding Concern (S47 / LADO)</span>
              </h3>
              <button 
                onClick={() => setIsNewCaseModalOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5">
              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Incident Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorised Route Deviation & Delayed Drop-off"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    Severity Rating *
                  </label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as SafeguardingSeverity)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  >
                    <option value="low">Low (Internal review)</option>
                    <option value="medium">Medium (Investigation needed)</option>
                    <option value="high">High (Contract officer notice)</option>
                    <option value="critical_s47">Critical Section 47 (LADO / Police 24h)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    Date &amp; Time of Incident *
                  </label>
                  <input
                    type="datetime-local"
                    value={newIncidentDate}
                    onChange={e => setNewIncidentDate(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    Subject Staff Member
                  </label>
                  <select
                    value={newStaffId}
                    onChange={e => setNewStaffId(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  >
                    <option value="">Select driver or PA...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    Pupil / Passenger Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Davies"
                    value={newPupilName}
                    onChange={e => setNewPupilName(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    School / Centre
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Woodlands SEN Academy"
                    value={newPupilSchool}
                    onChange={e => setNewPupilSchool(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                    Route Code / Vehicle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SR-01 / LT24 XAA"
                    value={newRouteCode}
                    onChange={e => setNewRouteCode(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Confidential Factual Narrative *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="State facts clearly without speculation: timeline, observations, witnesses, passenger condition, and statements made..."
                  value={newNarrative}
                  onChange={e => setNewNarrative(e.target.value)}
                  className="nr-input w-full !p-3 !text-xs"
                />
              </div>

              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 text-[11px] text-[var(--text-muted)]">
                <span className="font-bold text-purple-300">Statutory Notice:</span> This concern will be recorded in the confidential safeguarding vault with automated LADO 24h SLA tracking.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !h-[38px] px-5 rounded-[12px] text-xs font-heading font-bold shadow-lime-glow"
                >
                  Log &amp; Initiate Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: RECORD DECISION
          ====================================================================== */}
      {isDecisionModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full border border-[var(--border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-[var(--text)]">
              Record Decision: {selectedCase.caseNumber}
            </h3>

            <form onSubmit={handleAddDecision} className="space-y-3.5">
              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Action Taken
                </label>
                <select
                  value={decisionAction}
                  onChange={e => setDecisionAction(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                >
                  <option value="Precautionary Route Suspension">Precautionary Route Suspension</option>
                  <option value="Full Precautionary Staff Suspension with Pay">Full Precautionary Staff Suspension with Pay</option>
                  <option value="Mandatory Practical Re-training Booked">Mandatory Practical Re-training Booked</option>
                  <option value="Formal LADO Multi-Agency Referral">Formal LADO Multi-Agency Referral</option>
                  <option value="Case Closed - Substantiated Management Action Taken">Case Closed - Substantiated</option>
                  <option value="Case Closed - Unsubstantiated Allegation">Case Closed - Unsubstantiated</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Rationale &amp; Statutory Justification *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why this decision was taken in the interest of child welfare..."
                  value={decisionRationale}
                  onChange={e => setDecisionRationale(e.target.value)}
                  className="nr-input w-full !p-3 !text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Next Review Date
                </label>
                <input
                  type="date"
                  value={decisionReviewDate}
                  onChange={e => setDecisionReviewDate(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: LOG AGENCY DISCLOSURE
          ====================================================================== */}
      {isDisclosureModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full border border-[var(--border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-[var(--text)]">
              Log External Agency Disclosure
            </h3>

            <form onSubmit={handleAddDisclosure} className="space-y-3.5">
              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Statutory Agency *
                </label>
                <select
                  value={discAgency}
                  onChange={e => setDiscAgency(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                >
                  <option value="Luton Borough Council - LADO">Luton Borough Council - LADO</option>
                  <option value="Central Bedfordshire Council - LADO">Central Bedfordshire Council - LADO</option>
                  <option value="Bedfordshire Police Safeguarding Hub">Bedfordshire Police Safeguarding Hub</option>
                  <option value="Council SEN Transport Commissioning Team">Council SEN Transport Commissioning Team</option>
                  <option value="School Designated Safeguarding Lead">School Designated Safeguarding Lead</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Recipient Officer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clare Montgomery (Senior Safeguarding Advisor)"
                  value={discOfficer}
                  onChange={e => setDiscOfficer(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Agency Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. LADO-LUT-2026-4491"
                  value={discRef}
                  onChange={e => setDiscRef(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Transmission Notes / Method
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dispatched via encrypted Egress email. Followed up by phone confirmation."
                  value={discNotes}
                  onChange={e => setDiscNotes(e.target.value)}
                  className="nr-input w-full !p-3 !text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisclosureModalOpen(false)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Record Disclosure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

