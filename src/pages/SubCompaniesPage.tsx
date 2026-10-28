import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { useCompany } from '../context/CompanyContext';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Archive, 
  Share2, 
  ShieldCheck, 
  ShieldAlert, 
  Car, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Tag, 
  History, 
  Lock, 
  Unlock,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { SubCompanyExtended } from '../types';

export const SubCompaniesPage: React.FC = () => {
  const { 
    subCompaniesExtended, 
    createSubCompanyExtended, 
    updateSubCompanyExtended, 
    archiveSubCompanyExtended, 
    transferAssetCompany,
    vehicles,
    staff
  } = useData();
  const { currentRole } = useRole();
  const { selectedCompanyId, setSelectedCompanyId } = useCompany();

  const [selectedCompId, setSelectedCompId] = useState<string>(subCompaniesExtended[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'details' | 'sharing' | 'depots' | 'history' | 'isolation_demo'>('details');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // New Company form
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formTradingName, setFormTradingName] = useState('');
  const [formRegisteredEntity, setFormRegisteredEntity] = useState('');
  const [formCompaniesHouse, setFormCompaniesHouse] = useState('');
  const [formLicence, setFormLicence] = useState('');
  const [formCouncil, setFormCouncil] = useState<'Luton' | 'Central Bedfordshire' | 'Hertfordshire' | 'Buckinghamshire'>('Luton');
  const [formPhone, setFormPhone] = useState('');
  const [formDispatchPhone, setFormDispatchPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#08201C');
  const [formSecondaryColor, setFormSecondaryColor] = useState('#B6F23C');
  const [formTariffScheme, setFormTariffScheme] = useState('Executive Airport Tier A');

  // Transfer Asset form
  const [transferType, setTransferType] = useState<'vehicle' | 'driver'>('vehicle');
  const [transferRef, setTransferRef] = useState('');
  const [transferToId, setTransferToId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // Isolation Tester State
  const [simulatedActorRole, setSimulatedActorRole] = useState<'controller' | 'owner_admin'>('controller');
  const [testTargetCompanyId, setTestTargetCompanyId] = useState<string>(subCompaniesExtended[1]?.id || '');

  // Restricted to Owner / Head Office Admin
  const isOwnerAdmin = currentRole === 'owner_admin';

  const selectedCompany = subCompaniesExtended.find(c => c.id === selectedCompId) || subCompaniesExtended[0];

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) return;

    createSubCompanyExtended({
      name: formName,
      code: formCode.toUpperCase(),
      tradingName: formTradingName || formName,
      registeredEntity: formRegisteredEntity || `${formName} UK Ltd`,
      companiesHouseNumber: formCompaniesHouse || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      operatorLicence: formLicence || `PHO/${formCode.toUpperCase()}/2026/${Math.floor(100 + Math.random() * 900)}`,
      council: formCouncil,
      phone: formPhone || '+44 1582 700000',
      dispatchPhone: formDispatchPhone || formPhone || '+44 1582 700001',
      email: formEmail || `ops@${formCode.toLowerCase()}-fleet.co.uk`,
      vehicleCount: 0,
      driverCount: 0,
      branding: {
        primaryColorHex: formPrimaryColor,
        secondaryColorHex: formSecondaryColor
      },
      depots: [
        {
          id: `dep-${Date.now()}`,
          name: `${formName} Main Depot`,
          address: 'Central Logistics Park, Bedfordshire',
          capacity: 20
        }
      ],
      assignedTariffScheme: formTariffScheme,
      isArchived: false,
      sharingRules: {
        allowFleetSharing: true,
        allowDriverSharing: false,
        depotLock: true
      }
    });

    setIsCreateModalOpen(false);
    setFormName('');
    setFormCode('');
    setFormTradingName('');
  };

  const handleTransferAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRef || !transferToId || !selectedCompany) return;

    transferAssetCompany(transferType, transferRef, selectedCompany.id, transferToId, transferReason || 'Operational fleet realignment');
    setIsTransferModalOpen(false);
    setTransferRef('');
    setTransferReason('');
    alert(`Asset ${transferRef} transferred successfully to destination sub-company!`);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Sub-Company Multi-Tenancy Management</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Admin Exclusive
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Create, brand, configure cross-dispatch sharing rules, legal entity records, and enforce multi-tenant isolation gates.
          </p>
        </div>

        {isOwnerAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary !h-[42px] px-4 rounded-[12px] text-xs font-heading font-bold flex items-center gap-1.5 shadow-lime-glow self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sub-Company</span>
          </button>
        )}
      </div>

      {/* Grid: Company Cards & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Companies Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="nr-card p-3.5 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Registered Operating Entities ({subCompaniesExtended.length})
            </span>

            <div className="space-y-2">
              {subCompaniesExtended.map(comp => {
                const isSelected = comp.id === selectedCompany?.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                      isSelected 
                        ? 'border-[#B6F23C] bg-[var(--surface-2)] shadow-sm' 
                        : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                          style={{ backgroundColor: comp.branding.secondaryColorHex }}
                          title={`Brand: ${comp.branding.secondaryColorHex}`}
                        />
                        <div>
                          <p className="font-heading font-bold text-xs text-[var(--text)]">
                            {comp.name}
                          </p>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            Code: {comp.code} • {comp.council}
                          </span>
                        </div>
                      </div>

                      {comp.isArchived ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/20 text-slate-400">
                          Archived
                        </span>
                      ) : (
                        <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="font-mono">{comp.operatorLicence}</span>
                      <span className="font-bold text-[var(--text)]">{comp.vehicleCount} Vehicles</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Company Detail & Sharing Rules (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCompany ? (
            <div className="nr-card p-5 space-y-4">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                      style={{ 
                        backgroundColor: `${selectedCompany.branding.secondaryColorHex}25`, 
                        color: selectedCompany.branding.secondaryColorHex 
                      }}
                    >
                      {selectedCompany.code}
                    </span>
                    <h2 className="text-base font-heading font-bold text-[var(--text)]">
                      {selectedCompany.tradingName}
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Legal Entity: <strong className="text-[var(--text)]">{selectedCompany.registeredEntity}</strong> • Co. House: <span className="font-mono">{selectedCompany.companiesHouseNumber}</span>
                  </p>
                </div>

                {isOwnerAdmin && !selectedCompany.isArchived && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className="btn-secondary !h-[34px] px-3 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#3FE0C5]" />
                      <span>Transfer Asset</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Archive ${selectedCompany.name}? Fleet vehicles must be reassigned.`)) {
                          archiveSubCompanyExtended(selectedCompany.id);
                        }
                      }}
                      className="btn-secondary !h-[34px] px-3 rounded-[10px] text-xs font-heading font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tabs */}
              <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] text-xs flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
                    activeTab === 'details' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Legal Entity &amp; Branding
                </button>
                <button
                  onClick={() => setActiveTab('sharing')}
                  className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
                    activeTab === 'sharing' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Fleet Sharing Rules
                </button>
                <button
                  onClick={() => setActiveTab('depots')}
                  className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
                    activeTab === 'depots' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Operating Depots ({selectedCompany.depots.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
                    activeTab === 'history' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Assignment History ({selectedCompany.assignmentHistory.length})
                </button>
                <button
                  onClick={() => setActiveTab('isolation_demo')}
                  className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition text-[#FF5D6C] flex items-center gap-1 ${
                    activeTab === 'isolation_demo' ? 'bg-[var(--surface)] shadow-xs' : ''
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Cross-Company Access Denied View</span>
                </button>
              </div>

              {/* Tab 1: Details */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Operator Licence</span>
                      <p className="font-heading font-bold text-[var(--text)] font-mono">{selectedCompany.operatorLicence}</p>
                      <span className="text-[10px] text-[var(--text-muted)]">Registered with {selectedCompany.council} Council</span>
                    </div>

                    <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Assigned Tariff Scheme</span>
                      <p className="font-heading font-bold text-[var(--text)]">{selectedCompany.assignedTariffScheme}</p>
                      <span className="text-[10px] text-[var(--text-muted)]">Commercial pricing multiplier applied</span>
                    </div>

                    <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Customer &amp; Dispatch Line</span>
                      <p className="font-heading font-bold text-[var(--text)] font-mono">{selectedCompany.phone}</p>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">Dispatch line: {selectedCompany.dispatchPhone}</span>
                    </div>

                    <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Branding Colors</span>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--border)]" style={{ backgroundColor: selectedCompany.branding.primaryColorHex }} />
                          <span className="font-mono text-[10px]">{selectedCompany.branding.primaryColorHex}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--border)]" style={{ backgroundColor: selectedCompany.branding.secondaryColorHex }} />
                          <span className="font-mono text-[10px]">{selectedCompany.branding.secondaryColorHex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Sharing Rules */}
              {activeTab === 'sharing' && (
                <div className="space-y-3.5 pt-1 text-xs">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-1">
                    <p className="font-heading font-bold text-blue-300">Fleet &amp; Workforce Pooling Boundaries:</p>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      Configure whether vehicles and drivers registered under this legal entity can be cross-dispatched for bookings belonging to sister operating companies.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-heading font-bold text-[var(--text)]">Shared Fleet Pooling</p>
                        <p className="text-[11px] text-[var(--text-muted)]">Allow sister companies to allocate vehicles from this company.</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        selectedCompany.sharingRules.allowFleetSharing 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {selectedCompany.sharingRules.allowFleetSharing ? 'ENABLED' : 'RING-FENCED'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-heading font-bold text-[var(--text)]">Cross-Company Driver Dispatch</p>
                        <p className="text-[11px] text-[var(--text-muted)]">Allow drivers registered here to complete jobs booked under other accounts.</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        selectedCompany.sharingRules.allowDriverSharing 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {selectedCompany.sharingRules.allowDriverSharing ? 'PERMITTED' : 'RESTRICTED'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-heading font-bold text-[var(--text)]">Mandatory Depot Lock</p>
                        <p className="text-[11px] text-[var(--text-muted)]">Enforce that all vehicles return strictly to this company's assigned yard at end of duty.</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        selectedCompany.sharingRules.depotLock 
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                      }`}>
                        {selectedCompany.sharingRules.depotLock ? 'DEPOT LOCKED' : 'FLEXIBLE'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Depots */}
              {activeTab === 'depots' && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="space-y-2">
                    {selectedCompany.depots.map(dep => (
                      <div key={dep.id} className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-heading font-bold text-xs text-[var(--text)]">{dep.name}</p>
                          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {dep.address}
                          </span>
                        </div>
                        <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                          Capacity: {dep.capacity} Vehicles
                        </span>
                      </div>
                    ))}

                    {selectedCompany.depots.length === 0 && (
                      <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl">
                        No depots currently registered under this entity.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Assignment History */}
              {activeTab === 'history' && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="space-y-2">
                    {selectedCompany.assignmentHistory.map(h => (
                      <div key={h.id} className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="chip-pending px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                              {h.itemType}: {h.itemRef}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {h.date}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text)] leading-relaxed">
                            {h.details}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3FE0C5]/15 text-[#3FE0C5] capitalize">
                          {h.action}
                        </span>
                      </div>
                    ))}

                    {selectedCompany.assignmentHistory.length === 0 && (
                      <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl">
                        No historical asset transfers recorded for this company.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Multi-Tenant Cross-Company Access Denied Demonstration */}
              {activeTab === 'isolation_demo' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-heading font-bold text-xs">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Multi-Tenant Boundary Test Simulator</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      This demonstration validates that when an operational user (e.g. Controller scoped to <strong>{selectedCompany.name}</strong>) attempts to access bookings, pupil rosters, or fleet telematics belonging to a ring-fenced sister company without cross-sharing permission, the platform enforces an immediate <strong>Cross-Company Access Denied</strong> gate.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block mb-1">
                          Simulated Persona
                        </label>
                        <select
                          value={simulatedActorRole}
                          onChange={e => setSimulatedActorRole(e.target.value as any)}
                          className="nr-input w-full !h-[34px] !text-xs font-mono"
                        >
                          <option value="controller">Dispatcher Controller (Scoped)</option>
                          <option value="owner_admin">Owner / Global Admin (Universal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block mb-1">
                          Target Sister Company Asset
                        </label>
                        <select
                          value={testTargetCompanyId}
                          onChange={e => setTestTargetCompanyId(e.target.value)}
                          className="nr-input w-full !h-[34px] !text-xs"
                        >
                          {subCompaniesExtended.filter(c => c.id !== selectedCompany.id).map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Render simulated Access Denied View */}
                  {simulatedActorRole === 'controller' ? (
                    <div className="p-6 bg-[var(--surface-2)] border-2 border-dashed border-rose-500/40 rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase">
                          DEC-TENANT-04: Cross-Company Access Denied
                        </span>
                        <h3 className="text-sm font-heading font-bold text-[var(--text)] mt-2">
                          Ring-Fenced Asset Boundary Active
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
                          Your active session is scoped to <strong>{selectedCompany.name}</strong>. Cross-company fleet sharing is disabled on the target operating company. Telematics, bookings, and driver allocations cannot be accessed across tenant silos.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-[var(--surface-2)] border-2 border-dashed border-emerald-500/40 rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Unlock className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                          Global Tenant Bypass Authorized
                        </span>
                        <h3 className="text-sm font-heading font-bold text-[var(--text)] mt-2">
                          Owner / Admin Universal Scope
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
                          As an Owner / Head Office Admin, multi-tenant boundaries are visible for auditing and cross-entity reallocations.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="nr-card p-12 text-center text-xs text-[var(--text-muted)]">
              Select an operating company from the list.
            </div>
          )}
        </div>

      </div>

      {/* ======================================================================
          MODAL: CREATE NEW SUB-COMPANY
          ====================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-xl w-full border border-[var(--border)] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#B6F23C]" />
                <span>Create New Operating Sub-Company</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">Company Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beds County SEN Transport Ltd"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  />
                </div>

                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">3-Letter Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. BCS"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-heading font-bold text-[var(--text)] block mb-1">Full Registered Legal Entity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Beds County Logistics Operations UK Ltd"
                  value={formRegisteredEntity}
                  onChange={e => setFormRegisteredEntity(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">Licensing Council *</label>
                  <select
                    value={formCouncil}
                    onChange={e => setFormCouncil(e.target.value as any)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  >
                    <option value="Luton">Luton Borough Council</option>
                    <option value="Central Bedfordshire">Central Bedfordshire</option>
                    <option value="Hertfordshire">Hertfordshire County Council</option>
                    <option value="Buckinghamshire">Buckinghamshire Council</option>
                  </select>
                </div>

                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">Operator Licence Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. PHO/LUT/2026/088"
                    value={formLicence}
                    onChange={e => setFormLicence(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">Primary Brand Accent Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formSecondaryColor}
                      onChange={e => setFormSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[var(--border)] cursor-pointer p-0.5 bg-[var(--surface-2)]"
                    />
                    <input
                      type="text"
                      value={formSecondaryColor}
                      onChange={e => setFormSecondaryColor(e.target.value)}
                      className="nr-input w-full !h-[38px] !text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-heading font-bold text-[var(--text)] block mb-1">Default Tariff Scheme</label>
                  <select
                    value={formTariffScheme}
                    onChange={e => setFormTariffScheme(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  >
                    <option value="Executive Airport Tier A">Executive Airport Tier A</option>
                    <option value="Council SEN Daily Contract Tariff">Council SEN Daily Contract Tariff</option>
                    <option value="Standard Regional Mileage">Standard Regional Mileage</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !h-[38px] px-5 rounded-[12px] font-heading font-bold shadow-lime-glow"
                >
                  Create Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: TRANSFER ASSET (VEHICLE / DRIVER)
          ====================================================================== */}
      {isTransferModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full border border-[var(--border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#3FE0C5]" />
              <span>Transfer Asset Between Companies</span>
            </h3>

            <p className="text-xs text-[var(--text-muted)]">
              Move a vehicle or staff record from <strong>{selectedCompany.name}</strong> to another operating entity with immutable audit history.
            </p>

            <form onSubmit={handleTransferAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="font-heading font-bold text-[var(--text)] block mb-1">Asset Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setTransferType('vehicle'); setTransferRef(''); }}
                    className={`py-2 rounded-lg font-heading font-bold border transition ${
                      transferType === 'vehicle' ? 'border-[#B6F23C] bg-[var(--surface-2)] text-[#08201C] dark:text-[#B6F23C]' : 'border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    Vehicle Fleet
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTransferType('driver'); setTransferRef(''); }}
                    className={`py-2 rounded-lg font-heading font-bold border transition ${
                      transferType === 'driver' ? 'border-[#B6F23C] bg-[var(--surface-2)] text-[#08201C] dark:text-[#B6F23C]' : 'border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    Driver / Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="font-heading font-bold text-[var(--text)] block mb-1">Select Asset *</label>
                {transferType === 'vehicle' ? (
                  <select
                    required
                    value={transferRef}
                    onChange={e => setTransferRef(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs font-mono"
                  >
                    <option value="">Select vehicle VRN...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.registration}>{v.registration} - {v.make} {v.model}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    required
                    value={transferRef}
                    onChange={e => setTransferRef(e.target.value)}
                    className="nr-input w-full !h-[38px] !text-xs"
                  >
                    <option value="">Select staff member...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role.toUpperCase()})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="font-heading font-bold text-[var(--text)] block mb-1">Destination Sub-Company *</label>
                <select
                  required
                  value={transferToId}
                  onChange={e => setTransferToId(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                >
                  <option value="">Select destination company...</option>
                  {subCompaniesExtended.filter(c => c.id !== selectedCompany.id && !c.isArchived).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-heading font-bold text-[var(--text)] block mb-1">Transfer Rationale</label>
                <input
                  type="text"
                  placeholder="e.g. Reassigned to Bedford South SEN contract"
                  value={transferReason}
                  onChange={e => setTransferReason(e.target.value)}
                  className="nr-input w-full !h-[38px] !text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !h-[38px] px-4 rounded-[12px] font-heading font-bold shadow-lime-glow"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
