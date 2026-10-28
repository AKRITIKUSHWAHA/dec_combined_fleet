import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  UserX, 
  UserCheck, 
  Lock, 
  PhoneCall, 
  MapPin, 
  X
} from 'lucide-react';
import { 
  mockTermCalendar, 
  mockStudentAbsences, 
  mockReplacementStaffCandidates, 
  mockFailedHandoverCases 
} from '../../data/mockDataPhase12';
import { 
  TermCalendarItem, 
  StudentAbsenceRecord, 
  ReplacementStaffCandidate, 
  FailedHandoverCase 
} from '../../types/phase12';

interface SchoolRoutesExtrasProps {
  currentTab: 'term_calendar' | 'absences' | 'crew_replacement' | 'failed_handover';
}

export const SchoolRoutesExtras: React.FC<SchoolRoutesExtrasProps> = ({ currentTab }) => {
  const [terms, setTerms] = useState<TermCalendarItem[]>(mockTermCalendar);
  const [absences, setAbsences] = useState<StudentAbsenceRecord[]>(mockStudentAbsences);
  const [candidates, setCandidates] = useState<ReplacementStaffCandidate[]>(mockReplacementStaffCandidates);
  const [failedHandovers, setFailedHandovers] = useState<FailedHandoverCase[]>(mockFailedHandoverCases);

  // Replacement Crew Form Selection (1 Driver + 2 PAs)
  const [selectedRepDriver, setSelectedRepDriver] = useState<string>('STAFF-REP-01');
  const [selectedRepPA1, setSelectedRepPA1] = useState<string>('STAFF-REP-03');
  const [selectedRepPA2, setSelectedRepPA2] = useState<string>('STAFF-REP-04');
  const [crewAssignedSuccess, setCrewAssignedSuccess] = useState<string | null>(null);

  // Failed Handover Modal
  const [isFailedHandoverModalOpen, setIsFailedHandoverModalOpen] = useState(false);
  const [fhoStudent, setFhoStudent] = useState('Liam Davies');
  const [fhoAddress, setFhoAddress] = useState('14 Hill Rise, Dunstable, LU6 3RT');
  const [fhoNotes, setFhoNotes] = useState('Driver knocked at door for 5 minutes; primary telephone unanswered.');

  const isDriverEligible = candidates.find(c => c.id === selectedRepDriver)?.eligibleForSen;
  const isPA1Eligible = candidates.find(c => c.id === selectedRepPA1)?.eligibleForSen;
  const isPA2Eligible = candidates.find(c => c.id === selectedRepPA2)?.eligibleForSen;
  const allCrewEligible = isDriverEligible && isPA1Eligible && isPA2Eligible;

  return (
    <div className="space-y-4">
      
      {/* 1. ACADEMIC TERM CALENDAR (Requirement 5) */}
      {currentTab === 'term_calendar' && (
        <div className="nr-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Academic Term &amp; Inset Day Calendar (Central Bedfordshire &amp; Luton Councils)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Official term dates, school holidays, and teacher training inset days controlling automated route schedules.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Add Term Date or Inset Day Modal')}
              className="btn-primary !text-xs !py-1.5 !px-3"
            >
              <Plus className="w-4 h-4" />
              <span>Add Inset / Term Date</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Academic Session / Holiday</th>
                  <th className="p-3.5">Start Date</th>
                  <th className="p-3.5">End Date</th>
                  <th className="p-3.5">Calendar Category</th>
                  <th className="p-3.5">Affected Schools &amp; SEN Routes</th>
                  <th className="p-3.5 text-right">Route Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {terms.map(t => (
                  <tr key={t.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-heading font-bold text-[var(--text)]">{t.name}</td>
                    <td className="p-3.5 font-mono text-[var(--text)]">{t.startDate}</td>
                    <td className="p-3.5 font-mono text-[var(--text)]">{t.endDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        t.type === 'term_time'
                          ? 'chip-ready'
                          : t.type === 'half_term'
                          ? 'chip-due-soon'
                          : 'chip-blocked'
                      }`}>
                        {t.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-[var(--text-muted)]">{t.schoolAffected}</td>
                    <td className="p-3.5 text-right">
                      {t.type === 'term_time' ? (
                        <span className="text-[#34D399] font-mono font-bold text-[11px]">Routes Active</span>
                      ) : (
                        <span className="text-[var(--text-muted)] font-mono text-[11px]">Routes Suspended</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. STUDENT ABSENCES & ROUTE SKIPS (Requirement 5) */}
      {currentTab === 'absences' && (
        <div className="nr-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Reported Student Absences &amp; Route Stop Skips
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Parent and council notifications automatically recalculate route waypoints and alert in-cab driver tablets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Report Parent Absence Modal — Sickness, Hospital Clinic or Sibling Isolation')}
              className="btn-primary !text-xs !py-1.5 !px-3"
            >
              <Plus className="w-4 h-4" />
              <span>Log Student Absence</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Assigned Route</th>
                  <th className="p-3.5 font-mono">Date of Absence</th>
                  <th className="p-3.5">Documented Reason</th>
                  <th className="p-3.5">Reported By &amp; Time</th>
                  <th className="p-3.5 text-right">Route Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {absences.map(abs => (
                  <tr key={abs.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-heading font-bold text-[var(--text)]">{abs.studentName}</td>
                    <td className="p-3.5 font-mono font-bold text-[#3FE0C5]">{abs.routeRef}</td>
                    <td className="p-3.5 font-mono text-[var(--text)] font-semibold">{abs.absenceDate}</td>
                    <td className="p-3.5 capitalize font-medium text-[var(--text)]">{abs.reason.replace('_', ' ')}</td>
                    <td className="p-3.5 text-[var(--text-muted)] text-[11px]">{abs.reportedBy} ({abs.reportedAt})</td>
                    <td className="p-3.5 text-right">
                      <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                        Stop Skipped • -6 Mins
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REPLACEMENT CREW FLOW WITH ELIGIBILITY CHECK (Requirement 5: 1 Driver + 2 PAs) */}
      {currentTab === 'crew_replacement' && (
        <div className="nr-card p-5 sm:p-6 space-y-5">
          <div className="pb-3 border-b border-[var(--border)]">
            <h3 className="font-heading font-bold text-sm text-[var(--text)]">
              Emergency Replacement Crew Assignment (1 Driver + 2 PAs)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Rigorous automated safety gate: checks Enhanced DBS Barred List, Council Badge validity, and driving points limit prior to dispatch.
            </p>
          </div>

          {crewAssignedSuccess && (
            <div className="bg-[#B6F23C] text-[#08201C] p-3.5 rounded-[14px] font-heading font-bold text-xs shadow-lime-glow flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{crewAssignedSuccess}</span>
              </div>
              <button onClick={() => setCrewAssignedSuccess(null)} className="font-mono text-xs">✕</button>
            </div>
          )}

          {/* Crew Slot Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Slot 1: Replacement Driver */}
            <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                Slot 1: Replacement Lead Driver
              </span>
              <select
                value={selectedRepDriver}
                onChange={(e) => setSelectedRepDriver(e.target.value)}
                className="nr-input !h-[42px] font-heading font-bold text-xs"
              >
                {candidates.filter(c => c.role === 'driver').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.eligibleForSen ? 'ELIGIBLE' : 'DISQUALIFIED'})
                  </option>
                ))}
              </select>

              {candidates.find(c => c.id === selectedRepDriver)?.eligibleForSen ? (
                <div className="p-2.5 rounded-[10px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>Eligibility Gate: PASSED</span></div>
                  <div className="text-[10px] text-[var(--text)]">Enhanced DBS Barred List Clear • Council Badge Valid • 0 Points</div>
                </div>
              ) : (
                <div className="p-2.5 rounded-[10px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-[#FF5D6C] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /><span>GATE BLOCKED: INELIGIBLE</span></div>
                  <div className="text-[10px]">{candidates.find(c => c.id === selectedRepDriver)?.ineligibilityReason}</div>
                </div>
              )}
            </div>

            {/* Slot 2: Replacement PA 1 */}
            <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                Slot 2: Passenger Assistant 1 (Lead Escort)
              </span>
              <select
                value={selectedRepPA1}
                onChange={(e) => setSelectedRepPA1(e.target.value)}
                className="nr-input !h-[42px] font-heading font-bold text-xs"
              >
                {candidates.filter(c => c.role === 'pa').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.eligibleForSen ? 'ELIGIBLE' : 'DISQUALIFIED'})
                  </option>
                ))}
              </select>

              {candidates.find(c => c.id === selectedRepPA1)?.eligibleForSen ? (
                <div className="p-2.5 rounded-[10px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>Eligibility Gate: PASSED</span></div>
                  <div className="text-[10px] text-[var(--text)]">Enhanced DBS Barred List Clear • Safeguarding Certified</div>
                </div>
              ) : (
                <div className="p-2.5 rounded-[10px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-[#FF5D6C] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /><span>GATE BLOCKED: INELIGIBLE</span></div>
                  <div className="text-[10px]">{candidates.find(c => c.id === selectedRepPA1)?.ineligibilityReason}</div>
                </div>
              )}
            </div>

            {/* Slot 3: Replacement PA 2 */}
            <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                Slot 3: Passenger Assistant 2 (Medical Support)
              </span>
              <select
                value={selectedRepPA2}
                onChange={(e) => setSelectedRepPA2(e.target.value)}
                className="nr-input !h-[42px] font-heading font-bold text-xs"
              >
                {candidates.filter(c => c.role === 'pa').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.eligibleForSen ? 'ELIGIBLE' : 'DISQUALIFIED'})
                  </option>
                ))}
              </select>

              {candidates.find(c => c.id === selectedRepPA2)?.eligibleForSen ? (
                <div className="p-2.5 rounded-[10px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>Eligibility Gate: PASSED</span></div>
                  <div className="text-[10px] text-[var(--text)]">Dual PA Mandate Satisfied • Verified Identity</div>
                </div>
              ) : (
                <div className="p-2.5 rounded-[10px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-[#FF5D6C] space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /><span>GATE BLOCKED: INELIGIBLE</span></div>
                  <div className="text-[10px]">{candidates.find(c => c.id === selectedRepPA2)?.ineligibilityReason}</div>
                </div>
              )}
            </div>

          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!allCrewEligible}
              onClick={() => {
                setCrewAssignedSuccess('Replacement crew verified and assigned to SEN-ROUTE-04B! Lead driver and 2 PAs dispatched with clear vetting.');
              }}
              className="btn-primary !min-h-[44px] !px-6 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Deploy Verified 3-Person Crew (1 Driver + 2 PAs)
            </button>
          </div>
        </div>
      )}

      {/* 4. FAILED HANDOVER ESCALATION (Requirement 5) */}
      {currentTab === 'failed_handover' && (
        <div className="nr-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#FF5D6C] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FF5D6C]" />
                <span>Failed Handover Escalation Protocol (SEN-05)</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Mandatory failover when parent/guardian is not present at home drop-off. Never leave a vulnerable child unattended.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFailedHandoverModalOpen(true)}
              className="btn-danger !text-xs !py-1.5 !px-3"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Trigger Handover Escalation Alert</span>
            </button>
          </div>

          {/* Handover Cases List */}
          <div className="space-y-3">
            {failedHandovers.map(cs => (
              <div key={cs.id} className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-3 text-xs">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#FF5D6C]">{cs.caseRef}</span>
                    <span className="font-heading font-bold text-[var(--text)]">{cs.studentName} ({cs.routeRef})</span>
                    <span className="text-[10px] text-[var(--text-muted)]">• {cs.timestamp}</span>
                  </div>
                  <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                    {cs.stage}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block font-semibold">Drop-off Residence</span>
                    <span className="font-semibold text-[var(--text)]">{cs.dropoffAddress}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">Primary Contact: {cs.parentContactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block font-semibold">Designated Safe Holding Point</span>
                    <span className="font-semibold text-[#3FE0C5]">{cs.designatedSafeHoldingPoint}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  <strong>Controller Audit Action:</strong> {cs.controllerLog}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Handover Escalation Modal */}
      {isFailedHandoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#FF5D6C] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Failed Handover Protocol</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Immediate safeguarding escalation</p>
              </div>
              <button onClick={() => setIsFailedHandoverModalOpen(false)} className="text-sm font-bold text-[var(--text-muted)]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 rounded-[12px] space-y-1 text-[#FF5D6C]">
                <span className="font-bold block">Protocol Steps 1 &amp; 2 Enforced:</span>
                <p className="text-[11px]">
                  1. Driver and PA remain with child in locked vehicle.<br />
                  2. Dispatch controller alerted to dial secondary guardian contacts.<br />
                  3. If unreachable in 15 mins, vehicle re-routed to Dunstable Depot Safe Room.
                </p>
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">Student Subject</label>
                <input type="text" value={fhoStudent} onChange={(e) => setFhoStudent(e.target.value)} className="nr-input font-bold" />
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">Residence Drop-off Address</label>
                <input type="text" value={fhoAddress} onChange={(e) => setFhoAddress(e.target.value)} className="nr-input" />
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">Controller Action Notes</label>
                <textarea rows={2} value={fhoNotes} onChange={(e) => setFhoNotes(e.target.value)} className="w-full p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs" />
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex gap-2">
              <button type="button" onClick={() => setIsFailedHandoverModalOpen(false)} className="btn-ghost flex-1 !text-xs !min-h-[42px]">Cancel</button>
              <button 
                type="button" 
                onClick={() => { 
                  setIsFailedHandoverModalOpen(false); 
                  alert('Emergency Handover Incident Logged! Secondary guardian contacted & safe holding room placed on active standby.'); 
                }} 
                className="btn-danger flex-1 !text-xs !min-h-[42px]"
              >
                Deploy Safe Haven Standby
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
