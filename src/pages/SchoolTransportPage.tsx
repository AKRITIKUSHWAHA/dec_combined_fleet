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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>School Transport &amp; SEN Operations</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              Section 8 Standard
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            AM/PM run schedules, PA pupil escorts, wheelchair safety, and mandatory End-of-Run sweeps (CHK-05 &amp; AT-C10).
          </p>
        </div>
      </div>

      {/* Mandatory Sweep Info Banner */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">End-of-Run Vehicle Sweep Gate (AT-C10):</span>{' '}
          School runs must complete a physical check confirming no child or personal belongings remain in the bus/van before driver and vehicle availability is restored to the general dispatch pool.
        </div>
      </div>

      {/* School Runs Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schoolRuns.map(run => (
          <div
            key={run.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {run.schoolRunDetails?.routeNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {run.schoolRunDetails?.contractName}
                </h3>
                <p className="text-xs text-slate-500">{run.schoolRunDetails?.schoolName}</p>
              </div>

              <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {run.schoolRunDetails?.amOrPm} Run ({run.scheduledTime})
              </span>
            </div>

            {/* Crew Allocation */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono">
                  {run.assignedVehicleId ? vehicles.find(v => v.id === run.assignedVehicleId)?.registration : 'Pending Allocation'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {run.assignedDriverId ? staff.find(s => s.id === run.assignedDriverId)?.name : 'Pending Driver'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Passenger Assistant</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {run.assignedPAId ? staff.find(s => s.id === run.assignedPAId)?.name : 'Sarah Jenkins'}
                </strong>
              </div>
            </div>

            {/* Student Manifest Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Pupil Passenger Roster (Privacy Protected):
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs">
                <div className="py-1.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Pupil 1: Liam K.</span>
                    <span className="text-[11px] text-slate-400 block">Accessibility: Manual Wheelchair + 4-Point Restraint</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Checked In
                  </span>
                </div>
                <div className="py-1.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Pupil 2: Mia T.</span>
                    <span className="text-[11px] text-slate-400 block">Accessibility: Harness &amp; Booster Seat</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Checked In
                  </span>
                </div>
              </div>
            </div>

            {/* End of run sweep sign-off */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    End-of-Run Vehicle Sweep Sign-off
                  </span>
                  {sweepSigned ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      SWEEP PENDING
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  "I confirm that an end-of-run physical walkaround of all seats was completed and no pupil or item was left unattended in the vehicle."
                </p>

                <button
                  onClick={() => setSweepSigned(!sweepSigned)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    sweepSigned
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
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
