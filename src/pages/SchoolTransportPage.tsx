import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Car, 
  Clock, 
  ShieldCheck, 
  FileCheck,
  UserCheck
} from 'lucide-react';

export const SchoolTransportPage: React.FC = () => {
  const { bookings, staff, vehicles } = useData();
  const [sweepSigned, setSweepSigned] = useState(false);

  // Filter school bookings
  const schoolRuns = bookings.filter(b => b.isSchoolRun);

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>School Transport &amp; SEN Operations</span>
            <span className="chip-pending px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Section 8 Standard
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            AM/PM run schedules, PA pupil escorts, wheelchair safety, and mandatory End-of-Run sweeps (CHK-05 &amp; AT-C10).
          </p>
        </div>
      </div>

      {/* Mandatory Sweep Info Banner */}
      <div className="bg-[#FFC24B]/15 border border-[#FFC24B]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[var(--text)]">
        <ShieldCheck className="w-4 h-4 text-[#FFC24B] shrink-0 mt-0.5" />
        <div>
          <span className="font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">End-of-Run Vehicle Sweep Gate (AT-C10):</span>{' '}
          School runs must complete a physical check confirming no child or personal belongings remain in the bus/van before driver and vehicle availability is restored to the general dispatch pool.
        </div>
      </div>

      {/* School Runs Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schoolRuns.map(run => (
          <div
            key={run.id}
            className="nr-card p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#3FE0C5]">
                  {run.schoolRunDetails?.routeNumber}
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--text)] mt-0.5">
                  {run.schoolRunDetails?.contractName}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{run.schoolRunDetails?.schoolName}</p>
              </div>

              <span className="chip-pending px-3 py-1 rounded-full font-bold text-xs">
                {run.schoolRunDetails?.amOrPm} Run ({run.scheduledTime})
              </span>
            </div>

            {/* Crew Allocation */}
            <div className="grid grid-cols-3 gap-2 bg-[var(--surface-2)] p-3 rounded-[14px] text-xs border border-[var(--border)]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Vehicle</span>
                <strong className="text-[var(--text)] font-mono">
                  {run.assignedVehicleId ? vehicles.find(v => v.id === run.assignedVehicleId)?.registration : 'Pending'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Driver</span>
                <strong className="text-[var(--text)]">
                  {run.assignedDriverId ? staff.find(s => s.id === run.assignedDriverId)?.name : 'Pending'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Passenger Assistant</span>
                <strong className="text-[#FF9F6B] font-bold">
                  {run.assignedPAId ? staff.find(s => s.id === run.assignedPAId)?.name : 'Sarah Jenkins'}
                </strong>
              </div>
            </div>

            {/* Student Manifest Preview */}
            <div className="space-y-2">
              <span className="text-xs font-heading font-bold text-[var(--text)] uppercase tracking-wider block">
                Pupil Passenger Roster (Privacy Protected):
              </span>
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[14px] p-2 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-[var(--text)]">Pupil 1: Liam K.</span>
                    <span className="text-[11px] text-[var(--text-muted)] block">Accessibility: Manual Wheelchair + 4-Point Restraint</span>
                  </div>
                  <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Checked In
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-[var(--text)]">Pupil 2: Mia T.</span>
                    <span className="text-[11px] text-[var(--text-muted)] block">Accessibility: Harness &amp; Booster Seat</span>
                  </div>
                  <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Checked In
                  </span>
                </div>
              </div>
            </div>

            {/* End of run sweep sign-off */}
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="p-4 rounded-[16px] bg-[#FFC24B]/15 border border-[#FFC24B]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">
                    End-of-Run Vehicle Sweep Sign-off
                  </span>
                  {sweepSigned ? (
                    <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      SWEEP PENDING
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[var(--text)] leading-relaxed">
                  "I confirm that an end-of-run physical walkaround of all seats was completed and no pupil or item was left unattended in the vehicle."
                </p>

                <button
                  onClick={() => setSweepSigned(!sweepSigned)}
                  className={`w-full py-2.5 rounded-[12px] text-xs font-heading font-bold transition-all ${
                    sweepSigned
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                >
                  {sweepSigned ? 'Reset Sign-off' : 'Countersign & Clear Vehicle for Dispatch'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
