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
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { 
  mockLicenceChecks, 
  mockDbsRecords, 
  mockDbsAccessLogs 
} from '../data/mockDataPhase10';
import { LicenceCheckRecord, DbsRecord } from '../types/phase10';

export const CompliancePage: React.FC = () => {
  const { currentRole, canViewDBS, canViewSafeguarding } = useRole();

  const [activeTab, setActiveTab] = useState<'dvla' | 'dbs' | 'safeguarding' | 'access_logs'>('dvla');
  const [licenceRecords, setLicenceRecords] = useState<LicenceCheckRecord[]>(mockLicenceChecks);
  const [dbsList, setDbsList] = useState<DbsRecord[]>(mockDbsRecords);
  
  // Running check states
  const [checkingDriverId, setCheckingDriverId] = useState<string | null>(null);
  const [checkResultBanner, setCheckResultBanner] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Selected DBS record modal for HR
  const [selectedDbs, setSelectedDbs] = useState<DbsRecord | null>(null);

  // Requirement 1: Run check button (Never show success on failure)
  const handleRunLicenceCheck = (record: LicenceCheckRecord) => {
    setCheckingDriverId(record.id);
    setCheckResultBanner(null);

    setTimeout(() => {
      setCheckingDriverId(null);

      // Simulation logic respecting requirement: Never show success on failure
      if (record.id === 'LIC-003') {
        // Marcus Thorne - 6 points (Blocked)
        setCheckResultBanner({
          type: 'error',
          message: `DVLA ADD GATEWAY FAILURE: Licence ${record.licenceNumber} has 6 active penalty points (CU80 + SP50). Threshold exceeded. Driver remains strictly BLOCKED from school operations.`
        });
        setLicenceRecords(prev => prev.map(r => r.id === record.id ? {
          ...r,
          lastCheckDate: '28/10/2026',
          status: 'blocked',
          hasChangedResult: true,
          changedResultNote: 'ALERT: 3 new penalty points confirmed by live DVLA ADD lookup. Driver blocked from passenger transport.'
        } : r));
      } else if (record.id === 'LIC-005') {
        // Liam Davies - Timeout / Pending
        setCheckResultBanner({
          type: 'error',
          message: `DVLA ADD GATEWAY ERROR: HTTP 504 Gateway Timeout while querying DVLA database. Verification failed. Status kept as VERIFICATION PENDING.`
        });
        setLicenceRecords(prev => prev.map(r => r.id === record.id ? {
          ...r,
          lastCheckDate: '28/10/2026',
          status: 'verification_pending',
          lastDvlaGatewayResponse: 'failed'
        } : r));
      } else {
        // Valid pass
        setCheckResultBanner({
          type: 'success',
          message: `DVLA ADD Gateway Success: Driver ${record.driverName} verified with 0 active endorsements. Next check scheduled for 28/11/2026.`
        });
        setLicenceRecords(prev => prev.map(r => r.id === record.id ? {
          ...r,
          lastCheckDate: '28/10/2026',
          nextCheckDue: '28/11/2026',
          status: 'ready',
          lastDvlaGatewayResponse: 'pass'
        } : r));
      }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Compliance, DVLA &amp; DBS Assurance</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              GDPR &amp; DBS-04 Controls
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Automated DVLA ADD check register, Enhanced DBS Barred List assurance, and strict controller field masking.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('dvla')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              activeTab === 'dvla' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            DVLA Licence Checks
          </button>
          <button
            onClick={() => setActiveTab('dbs')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              activeTab === 'dbs' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            DBS Update Service
          </button>
          {canViewDBS && (
            <button
              onClick={() => setActiveTab('access_logs')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
                activeTab === 'access_logs' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              DBS Access Audit Log
            </button>
          )}
          <button
            onClick={() => setActiveTab('safeguarding')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1 whitespace-nowrap ${
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
            You are logged in as a <strong>Controller</strong>. Sensitive criminal record certificate numbers, conviction narratives, and medical suitability decisions are locked and redacted. Controllers only see operational status: <strong className="text-[#34D399]">Cleared</strong> / <strong className="text-[#FFC24B]">Pending</strong> / <strong className="text-[#FF5D6C]">Restricted</strong>.
          </div>
        </div>
      )}

      {/* Live Result Feedback Banner */}
      {checkResultBanner && (
        <div className={`p-4 rounded-[16px] text-xs flex items-start justify-between gap-3 shadow-md border ${
          checkResultBanner.type === 'error'
            ? 'bg-[#FF5D6C]/15 border-[#FF5D6C]/40 text-[#FF5D6C]'
            : checkResultBanner.type === 'warning'
            ? 'bg-[#FFC24B]/15 border-[#FFC24B]/40 text-[#D97706] dark:text-[#FFC24B]'
            : 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]'
        }`}>
          <div className="flex items-start gap-2.5">
            {checkResultBanner.type === 'error' ? (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : checkResultBanner.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <p className="font-semibold">{checkResultBanner.message}</p>
          </div>
          <button 
            onClick={() => setCheckResultBanner(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: DVLA LICENCE CHECKS (Requirement 1) */}
      {activeTab === 'dvla' && (
        <div className="space-y-4">
          
          {/* Changed result alert box if any driver has changed result */}
          {licenceRecords.some(r => r.hasChangedResult) && (
            <div className="bg-[#FF5D6C]/15 border-2 border-[#FF5D6C] p-4 rounded-[18px] text-xs text-[var(--text)] flex items-start gap-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-[#FF5D6C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-heading font-bold text-sm text-[#FF5D6C] uppercase tracking-wider block">
                  Mandatory Licence Change Alert (Safety Policy LIC-02)
                </span>
                <p className="text-[12px] text-[var(--text)]">
                  {licenceRecords.find(r => r.hasChangedResult)?.changedResultNote}
                </p>
                <div className="text-[11px] font-mono text-[var(--text-muted)] pt-1">
                  Immediate action: Driver suspended from automated dispatch allocations until HR review is completed.
                </div>
              </div>
            </div>
          )}

          <div className="nr-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                  Automated DVLA Licence Check Register (ADD Integration)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Per-driver verification schedule, annual declaration validity, and live penalty points audit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  DVLA Gateway: <strong className="text-[#34D399]">CONNECTED</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                  <tr>
                    <th className="p-3.5">Driver Name</th>
                    <th className="p-3.5">Licence No. &amp; Audit Ref</th>
                    <th className="p-3.5">Declaration Validity</th>
                    <th className="p-3.5">Penalty Points &amp; Endorsements</th>
                    <th className="p-3.5">Last / Next Check</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {licenceRecords.map(record => {
                    const isCheckingThis = checkingDriverId === record.id;
                    return (
                      <tr key={record.id} className="hover:bg-[var(--surface-2)] transition-colors">
                        
                        <td className="p-3.5">
                          <div className="font-heading font-bold text-[var(--text)]">{record.driverName}</div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">{record.driverId}</div>
                        </td>

                        <td className="p-3.5 font-mono">
                          <div className="font-bold text-[var(--text)]">{record.licenceNumber}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{record.dvlaAuditRef}</div>
                        </td>

                        <td className="p-3.5">
                          {record.declarationStatus === 'valid' ? (
                            <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                              <span>Valid ({record.annualDeclarationDate})</span>
                            </span>
                          ) : record.declarationStatus === 'due_soon' ? (
                            <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#FFC24B]" />
                              <span>Expired 19/10/26</span>
                            </span>
                          ) : (
                            <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-[#FF5D6C]" />
                              <span>Invalid Declaration</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {record.points > 0 ? (
                            <div className="space-y-1">
                              <span className="chip-blocked px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                {record.points} Points
                              </span>
                              {record.endorsements.map((e, idx) => (
                                <div key={idx} className="text-[10px] text-[var(--text-muted)] leading-tight max-w-xs">
                                  <strong className="text-[#FF5D6C] font-mono">{e.code}</strong> ({e.points} pts) - {e.description} (Exp: {e.expiry})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                              0 Clean Points
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono text-[11px]">
                          <div>Last: <span className="text-[var(--text)] font-semibold">{record.lastCheckDate}</span></div>
                          <div className="text-[var(--text-muted)]">Next: {record.nextCheckDue}</div>
                        </td>

                        <td className="p-3.5">
                          {record.status === 'ready' && (
                            <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                              Cleared
                            </span>
                          )}
                          {record.status === 'due_soon' && (
                            <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                              Due Soon
                            </span>
                          )}
                          {record.status === 'blocked' && (
                            <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono animate-pulse">
                              Blocked
                            </span>
                          )}
                          {record.status === 'verification_pending' && (
                            <span className="bg-[#8B9CFF]/20 text-[#8B9CFF] border border-[#8B9CFF]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                              Pending Gateway
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRunLicenceCheck(record)}
                            disabled={isCheckingThis}
                            className="btn-primary !text-xs !py-1 !px-3 !min-h-[36px]"
                            title="Perform live DVLA ADD lookup for this driver"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingThis ? 'animate-spin' : ''}`} />
                            <span>{isCheckingThis ? 'Querying...' : 'Run Check'}</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DBS UPDATE SERVICE (Requirement 2: Restricted HR / Locked for Controller) */}
      {activeTab === 'dbs' && (
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                Enhanced DBS &amp; Barred-List Verification Portal
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Children's &amp; Adults' Barred List checks. Certified for School Transport (SEN-03).
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading font-bold bg-[var(--surface-2)] px-3 py-1.5 rounded-[12px] border border-[var(--border)] text-[var(--text)]">
              {canViewDBS ? <Eye className="w-4 h-4 text-[#34D399]" /> : <EyeOff className="w-4 h-4 text-[#FFC24B]" />}
              <span>{canViewDBS ? 'HR Compliance Full Access' : 'Controller Restricted Access (DBS-04)'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Staff Member &amp; Role</th>
                  <th className="p-3.5">Certificate Ref (HR Only)</th>
                  <th className="p-3.5">Check Level</th>
                  <th className="p-3.5">Update Service Consent</th>
                  <th className="p-3.5">Latest Status</th>
                  <th className="p-3.5">Next Review Date</th>
                  <th className="p-3.5">Suitability Decision</th>
                  <th className="p-3.5">Controller Status</th>
                  {canViewDBS && <th className="p-3.5 text-right">HR Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {dbsList.map(item => (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    
                    <td className="p-3.5">
                      <div className="font-heading font-bold text-[var(--text)]">{item.staffName}</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{item.staffRole.replace('_', ' ')}</div>
                    </td>

                    {/* Certificate Reference - MASKED FOR CONTROLLERS */}
                    <td className="p-3.5 font-mono">
                      {canViewDBS ? (
                        <div className="font-bold text-[var(--text)]">{item.certificateReference}</div>
                      ) : (
                        <span className="text-[var(--text-muted)] italic font-mono text-[11px]">
                          [Locked • DBS-04]
                        </span>
                      )}
                      <div className="text-[10px] text-[var(--text-muted)]">Issued: {item.issueDate}</div>
                    </td>

                    <td className="p-3.5 text-[11px]">
                      {canViewDBS ? (
                        <span className="font-semibold text-[var(--text)]">{item.level}</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">Enhanced (Barred Lists)</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {item.updateServiceConsent === 'valid_consent' ? (
                        <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Active Consent
                        </span>
                      ) : (
                        <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Renewal Required
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {canViewDBS ? (
                        <span className="font-mono text-[11px] font-semibold text-[var(--text)]">
                          {item.latestStatus === 'no_information_recorded' ? 'No Info Recorded (Clean)' : 'Under HR Review'}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] italic text-[11px]">[Restricted to HR]</span>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[var(--text)] font-semibold">
                      {item.nextReviewDate}
                    </td>

                    {/* Suitability Decision - STRICTLY MASKED FOR CONTROLLERS */}
                    <td className="p-3.5">
                      {canViewDBS ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.suitabilityDecision === 'approved_sen' ? 'chip-ready' : 'chip-due-soon'
                        }`}>
                          {item.suitabilityDecision.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] italic text-[11px]">[Restricted]</span>
                      )}
                    </td>

                    {/* Controller Status: ONLY Cleared / Pending / Restricted */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        item.operationalClearance === 'cleared'
                          ? 'chip-ready'
                          : item.operationalClearance === 'pending'
                          ? 'chip-due-soon'
                          : 'chip-blocked'
                      }`}>
                        {item.operationalClearance}
                      </span>
                    </td>

                    {canViewDBS && (
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDbs(item)}
                          className="btn-secondary !text-xs !py-1 !px-2.5 !min-h-[34px]"
                        >
                          View Details
                        </button>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DBS ACCESS AUDIT LOG (Requirement 2) */}
      {activeTab === 'access_logs' && canViewDBS && (
        <div className="nr-card p-5 space-y-4">
          <div className="pb-3 border-b border-[var(--border)]">
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Statutory DBS Access Audit Trail (DBS Code of Practice Compliance)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Immutable log of every user viewing, exporting, or altering sensitive DBS certificate records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Audited Staff Subject</th>
                  <th className="p-3.5">Viewer / Role</th>
                  <th className="p-3.5">Action Taken</th>
                  <th className="p-3.5">Documented Purpose / Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {mockDbsAccessLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-mono text-[var(--text)] font-semibold">{log.timestamp}</td>
                    <td className="p-3.5 font-heading font-bold text-[var(--text)]">{log.recordStaffName}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--text)]">{log.viewerName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{log.viewerRole}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[#3FE0C5]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-[var(--text-muted)] text-[11px]">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SAFEGUARDING CASES (Confidential PEO-06) */}
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

      {/* HR Detail Modal for DBS */}
      {selectedDbs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Enhanced DBS Certificate File
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  Staff: {selectedDbs.staffName} ({selectedDbs.staffId})
                </p>
              </div>
              <button 
                onClick={() => setSelectedDbs(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-semibold">Certificate Number</span>
                <span className="font-mono font-bold text-[var(--text)] text-sm">{selectedDbs.certificateReference}</span>
              </div>
              <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-semibold">Date of Issue</span>
                <span className="font-mono font-bold text-[var(--text)] text-sm">{selectedDbs.issueDate}</span>
              </div>
              <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-semibold">Barred List Check Level</span>
                <span className="font-semibold text-[var(--text)] text-[11px]">{selectedDbs.level}</span>
              </div>
              <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-semibold">Update Service Status</span>
                <span className="font-semibold text-[#34D399] text-[11px]">{selectedDbs.latestStatus.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] space-y-1 text-xs">
              <span className="text-[var(--text-muted)] block text-[10px] font-semibold">HR Suitability Determination</span>
              <p className="text-[var(--text)] leading-relaxed">{selectedDbs.suitabilityNotes}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedDbs(null)}
                className="btn-primary !text-xs !py-1.5 !px-4"
              >
                Close Audit File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
