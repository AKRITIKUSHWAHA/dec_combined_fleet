import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Car, 
  GraduationCap, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  PlusCircle,
  UserX
} from 'lucide-react';
import { DriverPAProfile } from '../types';
import { OffboardingModal } from '../components/workforce/OffboardingModal';

export const WorkforcePage: React.FC = () => {
  const { staff } = useData();
  const { selectedCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'all' | 'drivers' | 'pas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffboardOpen, setIsOffboardOpen] = useState(false);
  const [offboardTargetId, setOffboardTargetId] = useState<string | undefined>(undefined);

  const filtered = staff.filter(s => {
    if (selectedCompany && s.companyId !== selectedCompany.id) return false;
    if (activeTab === 'drivers' && s.role === 'pa') return false;
    if (activeTab === 'pas' && s.role === 'driver') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
             s.staffId.toLowerCase().includes(q) ||
             s.phone.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Workforce Management (Drivers &amp; PAs)</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              {filtered.length} Staff
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Dedicated PA profiles (PA-NEW-01) with no driving licence requirement &amp; dual-role person records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tab Selector */}
          <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'all' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              All Staff
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'drivers' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('pas')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'pas' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              PAs Only
            </button>
          </div>

          <button
            onClick={() => { setOffboardTargetId(undefined); setIsOffboardOpen(true); }}
            className="btn-secondary !h-[38px] px-3.5 rounded-[10px] text-xs font-heading font-bold text-rose-400 hover:text-rose-300 border-rose-500/30 flex items-center gap-1.5 shrink-0"
            title="Launch formal offboarding flow"
          >
            <UserX className="w-3.5 h-3.5 text-rose-500" />
            <span>Offboard Staff</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search staff ID or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[38px] !pl-9 !text-xs w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* PA & Dual Role Rule Banner */}
      <div className="bg-[#FF9F6B]/15 border border-[#FF9F6B]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[var(--text)]">
        <GraduationCap className="w-4 h-4 text-[#FF9F6B] shrink-0 mt-0.5" />
        <div>
          <span className="font-heading font-bold text-[#FF9F6B]">Dual-Role &amp; PA Policy (PA-NEW-01):</span>{' '}
          Passenger Assistants (PAs) require council authorisation, safeguarding, and PAT training, but <em>never</em> a driving licence. A staff member who both drives and escorts (e.g. <strong>Marcus Bell</strong>) maintains a single linked identity.
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(person => {
          const isDual = person.role === 'dual_driver_pa';
          const isPA = person.role === 'pa';
          const isRestricted = person.operationalClearance === 'restricted';

          return (
            <div
              key={person.id}
              className="nr-card p-5 space-y-3.5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                      {person.staffId}
                    </span>
                    <h3 className="text-base font-heading font-bold text-[var(--text)] mt-0.5">
                      {person.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">{person.assignedDepot}</p>
                  </div>

                  <span className={`text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isDual
                      ? 'chip-pending'
                      : isPA
                      ? 'chip-due-soon'
                      : 'chip-ready'
                  }`}>
                    {isDual ? 'Dual (Driver + PA)' : isPA ? 'Passenger Assistant' : 'Driver'}
                  </span>
                </div>

                {/* Duty & Clearance */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    person.operationalClearance === 'cleared' ? 'chip-ready' : 'chip-blocked'
                  }`}>
                    {person.operationalClearance}
                  </span>

                  <span className="text-[11px] text-[var(--text-muted)]">
                    Status: <strong className="capitalize text-[var(--text)]">{person.dutyStatus.replace('_', ' ')}</strong>
                  </span>
                </div>

                {/* Credentials Preview */}
                <div className="mt-3 p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-1.5 font-mono">
                  {person.drivingLicence ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)]">Driving Licence:</span>
                      <strong className="text-[var(--text)]">
                        {person.drivingLicence.dvlaStatus.toUpperCase()} ({person.drivingLicence.penaltyPoints} pts)
                      </strong>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#FF9F6B] font-bold font-sans">
                      ✓ Non-Driving Role (No Licence Required)
                    </div>
                  )}

                  {person.paAuthorisation && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)]">Council Approval:</span>
                      <strong className="text-[#3FE0C5]">
                        Valid to {person.paAuthorisation.expiryDate}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Safeguarding:</span>
                    <strong className="text-[#34D399]">Valid to 2027</strong>
                  </div>
                </div>

                {isRestricted && person.clearanceReason && (
                  <p className="text-[11px] text-[#FF5D6C] mt-2 bg-[#FF5D6C]/10 p-2.5 rounded-[10px] border border-[#FF5D6C]/30 leading-relaxed">
                    {person.clearanceReason}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[var(--border)] flex gap-2">
                <a
                  href={`tel:${person.phone}`}
                  className="btn-secondary flex-1 !text-xs !py-1 !min-h-[38px] flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => { setOffboardTargetId(person.id); setIsOffboardOpen(true); }}
                  className="p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
                  title="Offboard staff member"
                >
                  <UserX className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Full staff file for ${person.name}: Training badges, route pairings, and audit history.`)}
                  className="btn-primary flex-1 !text-xs !py-1 !min-h-[38px]"
                >
                  Full Profile
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Offboarding Modal */}
      <OffboardingModal
        isOpen={isOffboardOpen}
        onClose={() => setIsOffboardOpen(false)}
        preSelectedStaffId={offboardTargetId}
      />

    </div>
  );
};
