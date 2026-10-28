import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle, 
  FileText,
  UserCheck
} from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const { staff } = useData();
  const { currentRole, canViewDBS, canViewSafeguarding } = useRole();

  const [activeTab, setActiveTab] = useState<'dvla' | 'dbs' | 'safeguarding'>('dvla');
  const [isCheckingDvla, setIsCheckingDvla] = useState(false);

  const handleSimulateDvlaCheck = () => {
    setIsCheckingDvla(true);
    setTimeout(() => {
      setIsCheckingDvla(false);
      alert('DVLA Access to Driver Data (ADD) check completed. 4 records verified with DVLA gateway.');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Compliance, DVLA &amp; DBS Assurance</span>
            <span className="chip-pending px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              GDPR &amp; DBS Controls
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Strict role-based field masking: Controllers see only "Cleared / Pending / Restricted" (DBS-04).
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('dvla')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'dvla' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            DVLA Licence Checks
          </button>
          <button
            onClick={() => setActiveTab('dbs')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'dbs' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            DBS Update Service
          </button>
          <button
            onClick={() => setActiveTab('safeguarding')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1 ${
              activeTab === 'safeguarding' ? 'bg-[var(--surface)] shadow-sm text-[#FF5D6C]' : 'text-[var(--text-muted)]'
            }`}
          >
            <Lock className="w-3 h-3 text-[#FF5D6C]" />
            <span>Safeguarding Cases</span>
          </button>
        </div>
      </div>

      {/* Role Notice on Compliance Access */}
      {!canViewDBS && (
        <div className="bg-[#FFC24B]/15 border border-[#FFC24B]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[var(--text)]">
          <Lock className="w-4 h-4 text-[#FFC24B] shrink-0 mt-0.5" />
          <div>
            <span className="font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">Controller Privacy Barrier Active (DBS-04):</span>{' '}
            You are logged in as a <strong>Controller</strong>. Sensitive criminal record certificate numbers, conviction narratives, and medical details are redacted and hidden by the system. You only see operational clearance.
          </div>
        </div>
      )}

      {/* DVLA Tab */}
      {activeTab === 'dvla' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                Automated DVLA Licence Check Register (ADD Integration)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Weekly risk-based lookup of points, endorsements, and entitlement categories.
              </p>
            </div>

            <button
              onClick={handleSimulateDvlaCheck}
              disabled={isCheckingDvla}
              className="btn-primary !text-xs !py-1 !min-h-[42px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDvla ? 'animate-spin' : ''}`} />
              <span>{isCheckingDvla ? 'Querying DVLA...' : 'Run Scheduled Lookup'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Staff Name / Role</th>
                  <th className="p-3.5">Driving Licence No.</th>
                  <th className="p-3.5">DVLA Status</th>
                  <th className="p-3.5">Penalty Points</th>
                  <th className="p-3.5">Last Check</th>
                  <th className="p-3.5">Clearance Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {staff.map(s => {
                  const lic = s.drivingLicence;
                  return (
                    <tr key={s.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-heading font-bold text-[var(--text)]">{s.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] capitalize">{s.role.replace('_', ' ')}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[var(--text)]">
                        {lic ? lic.licenceNumber : <span className="text-[var(--text-muted)] font-normal">N/A (PA Only)</span>}
                      </td>
                      <td className="p-3.5">
                        {lic ? (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            {lic.dvlaStatus}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3.5 font-mono">
                        {lic ? (
                          <span className={`font-bold ${lic.penaltyPoints > 0 ? 'text-[#FF5D6C]' : 'text-[var(--text)]'}`}>
                            {lic.penaltyPoints} Points ({lic.endorsementsCount} endorsements)
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)] font-mono">
                        {lic ? lic.dvlaLastCheckDate : '—'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.operationalClearance === 'cleared' ? 'chip-ready' : 'chip-blocked'
                        }`}>
                          {s.operationalClearance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DBS Tab with Strict Masking */}
      {activeTab === 'dbs' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                DBS Update Service &amp; Enhanced Barred-List Verification
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Children's &amp; Adults' Barred List checks for school transport staff.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading font-bold bg-[var(--surface-2)] px-3 py-1.5 rounded-[12px] border border-[var(--border)] text-[var(--text)]">
              {canViewDBS ? <Eye className="w-4 h-4 text-[#34D399]" /> : <EyeOff className="w-4 h-4 text-[#FFC24B]" />}
              <span>{canViewDBS ? 'HR Full Access Mode' : 'Controller Redacted Mode'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Staff Member</th>
                  <th className="p-3.5">DBS Certificate No.</th>
                  <th className="p-3.5">Update Service Status</th>
                  <th className="p-3.5">Last Checked</th>
                  <th className="p-3.5">Suitability Decision</th>
                  <th className="p-3.5">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {staff.map(s => {
                  const dbs = s.dbsCheck;
                  return (
                    <tr key={s.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-heading font-bold text-[var(--text)]">{s.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)] capitalize">{s.role.replace('_', ' ')}</div>
                      </td>

                      {/* Certificate Number (Masked for Controllers) */}
                      <td className="p-3.5 font-mono">
                        {canViewDBS ? (
                          <span className="font-bold text-[var(--text)]">
                            {dbs?.certificateNumber || 'Pending Check'}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] font-medium italic">
                            [Redacted by Privacy Gate]
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {dbs?.updateServiceRegistered ? 'Active Subscription' : 'Manual Annual'}
                        </span>
                      </td>

                      <td className="p-3.5 text-[var(--text-muted)] font-mono">
                        {dbs?.lastCheckedDate || '15/10/2026'}
                      </td>

                      {/* Suitability Decision (Restricted for Controllers) */}
                      <td className="p-3.5">
                        {canViewDBS ? (
                          <span className="text-[#34D399] font-heading font-semibold">
                            {dbs?.suitabilityDecision.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] italic">
                            [Restricted to HR]
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.operationalClearance === 'cleared' ? 'chip-ready' : 'chip-blocked'
                        }`}>
                          {s.operationalClearance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Safeguarding Cases Tab */}
      {activeTab === 'safeguarding' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF5D6C]" />
                <span>Safeguarding Incident Case Register (Confidential PEO-06)</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Accessible ONLY to designated Safeguarding Lead Officers.
              </p>
            </div>
          </div>

          {canViewSafeguarding ? (
            <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#FF5D6C]">CASE-SAFE-2026-004</span>
                <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Under Investigation</span>
              </div>
              <p className="font-heading font-bold text-[var(--text)]">
                Passenger Support Query: Non-verbal pupil wheelchair strap check
              </p>
              <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                Safeguarding Officer Assigned: Eleanor Vance (Lead Designated Officer). Central Bedfordshire SEN contract review logged.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
              <Lock className="w-8 h-8 text-[#FF5D6C] mx-auto" />
              <p className="font-heading font-bold text-[var(--text)]">
                Access Prohibited: Controller role cannot view Safeguarding Case Narratives.
              </p>
              <p className="text-[11px]">
                Switch your active persona to HR/Vetting or Owner in the header to view this confidential register.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
