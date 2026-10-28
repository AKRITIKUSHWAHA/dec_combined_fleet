import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useRole } from '../../context/RoleContext';
import { 
  UserX, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Calendar, 
  Key, 
  Car, 
  Briefcase, 
  FileCheck, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { DriverPAProfile, OffboardingRecord } from '../../types';

interface OffboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStaffId?: string;
}

export const OffboardingModal: React.FC<OffboardingModalProps> = ({
  isOpen,
  onClose,
  preSelectedStaffId
}) => {
  const { staff, bookings, schoolRoutes, executeStaffOffboarding } = useData();
  const { currentRole } = useRole();

  const [step, setStep] = useState<number>(1);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(preSelectedStaffId || staff[0]?.id || '');
  const [offboardReason, setOffboardReason] = useState<string>('Resignation - Voluntary Departure');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Asset Checklist
  const [assets, setAssets] = useState({
    vehicleReturned: true,
    councilIdBadge: true,
    fuelCardReturned: true,
    dashcamReturned: true,
    mobileDeviceReturned: true,
    uniformReturned: true
  });

  const [completedRecord, setCompletedRecord] = useState<OffboardingRecord | null>(null);

  if (!isOpen) return null;

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  // Calculate future affected bookings and routes
  const futureBookings = bookings.filter(b => b.assignedDriverId === selectedStaffId && (b.status === 'allocated' || b.status === 'unallocated'));
  const futureRoutes = schoolRoutes.filter(r => r.assignedDriverId === selectedStaffId || r.assignedPA1Id === selectedStaffId);

  const handleAssetToggle = (key: keyof typeof assets) => {
    setAssets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExecuteOffboarding = () => {
    if (!selectedStaffId) return;

    const record = executeStaffOffboarding(
      selectedStaffId,
      `${offboardReason}: ${customNotes || 'Formal offboarding executed'}`,
      assets,
      currentRole === 'owner_admin' ? 'Arthur Pendelton (Admin)' : 'Elena Rostova (Compliance)'
    );

    setCompletedRecord(record);
    setStep(4); // Certificate step
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] rounded-2xl max-w-xl w-full border border-[var(--border)] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-[var(--text)]">
                Staff Offboarding &amp; Access Revocation Flow
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Step {step} of 4 • Statutory Governance Procedure
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Staff Selection & Reason */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
              <p className="font-heading font-bold text-amber-400">Formal Separation Procedure:</p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Initiating offboarding will immediately terminate mobile app sessions, cancel future assignments, recover registered company equipment, and produce an immutable compliance certificate.
              </p>
            </div>

            <div>
              <label className="font-heading font-bold text-[var(--text)] block mb-1">
                Select Staff Member to Offboard *
              </label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="nr-input w-full !h-[38px] !text-xs"
              >
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role.toUpperCase()} ({s.assignedDepot})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading font-bold text-[var(--text)] block mb-1">
                Primary Reason for Separation *
              </label>
              <select
                value={offboardReason}
                onChange={e => setOffboardReason(e.target.value)}
                className="nr-input w-full !h-[38px] !text-xs"
              >
                <option value="Resignation - Voluntary Departure">Resignation - Voluntary Departure</option>
                <option value="Contract Termination - Operational Decision">Contract Termination - Operational Decision</option>
                <option value="Council Licensing Revocation">Council Licensing Revocation</option>
                <option value="Medical / DVLA Disqualification">Medical / DVLA Disqualification</option>
                <option value="Safeguarding / Section 47 Exclusion">Safeguarding / Section 47 Exclusion</option>
              </select>
            </div>

            <div>
              <label className="font-heading font-bold text-[var(--text)] block mb-1">
                Officer Notes / Details
              </label>
              <textarea
                rows={2}
                placeholder="Include reference to exit interview or council communication..."
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                className="nr-input w-full !p-3 !text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary !h-[38px] px-4 rounded-[12px] font-heading font-bold">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary !h-[38px] px-5 rounded-[12px] font-heading font-bold shadow-lime-glow flex items-center gap-1.5"
              >
                <span>Review Impacted Assignments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Future Assignments Cancellation Preview */}
        {step === 2 && selectedStaff && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Subject Staff</span>
              <p className="font-heading font-bold text-sm text-[var(--text)]">{selectedStaff.name}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Role: {selectedStaff.role.toUpperCase()} • Depot: {selectedStaff.assignedDepot}</span>
            </div>

            <div className="space-y-2">
              <span className="font-heading font-bold text-[var(--text)] block">
                Impacted Active &amp; Future Assignments:
              </span>

              <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-xs text-[var(--text)]">Allocated Airport &amp; Corporate Bookings</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Will be returned automatically to Unallocated dispatch pool.</p>
                </div>
                <span className="chip-blocked px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  {futureBookings.length} Bookings Affected
                </span>
              </div>

              <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-xs text-[var(--text)]">Assigned School SEN Transport Routes</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Driver / PA slot flagged as UNASSIGNED for immediate dispatcher cover.</p>
                </div>
                <span className="chip-pending px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  {futureRoutes.length} Routes Affected
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Immediate Access Revocation Notice:</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Mobile Staff Cockpit credentials will be immediately terminated. Active bearer tokens will be flushed.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary !h-[38px] px-4 rounded-[12px] font-heading font-bold flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary !h-[38px] px-5 rounded-[12px] font-heading font-bold shadow-lime-glow flex items-center gap-1.5"
              >
                <span>Proceed to Asset Recovery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Asset Recovery Checklist */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <span className="font-heading font-bold text-[var(--text)] block">
              Physical Asset Recovery Checklist (Audit Verification):
            </span>

            <div className="space-y-2">
              {[
                { key: 'vehicleReturned', label: 'Company Vehicle Handover & Walkaround Complete', desc: 'Keys recovered, mileage logged, fuel level checked.' },
                { key: 'councilIdBadge', label: 'Council Private Hire ID Badge & Decals Surrendered', desc: 'Required by council licensing standards upon contract cessation.' },
                { key: 'fuelCardReturned', label: 'Allstar / Fuel Card Cancelled & Destroyed', desc: 'Payment card deactivated with provider.' },
                { key: 'dashcamReturned', label: 'Vehicle Dashcam & Memory Card Secured', desc: 'Ensures no GDPR PII remains on removable media.' },
                { key: 'mobileDeviceReturned', label: 'Company Staff Tablet / Mobile Handset Returned', desc: 'Device wiped of cached manifests and passenger manifests.' },
                { key: 'uniformReturned', label: 'DEC High-Visibility Uniform & Lanyards Returned', desc: 'Prevents unauthorised impersonation on school contracts.' }
              ].map(item => {
                const checked = assets[item.key as keyof typeof assets];
                return (
                  <label
                    key={item.key}
                    className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-start gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAssetToggle(item.key as keyof typeof assets)}
                      className="mt-0.5 rounded accent-[#B6F23C] w-4 h-4 shrink-0"
                    />
                    <div>
                      <p className="font-heading font-bold text-xs text-[var(--text)]">{item.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary !h-[38px] px-4 rounded-[12px] font-heading font-bold flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleExecuteOffboarding}
                className="btn-primary !h-[38px] px-5 rounded-[12px] font-heading font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center gap-1.5"
              >
                <span>Execute Complete Offboarding</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Completion & Compliance Certificate */}
        {step === 4 && completedRecord && (
          <div className="space-y-4 text-xs text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                Offboarding Completed &amp; Audited
              </span>
              <h2 className="text-base font-heading font-bold text-[var(--text)] mt-1.5">
                Staff Credentials Purged for {completedRecord.staffName}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Certificate Ref: <span className="font-mono text-[#B6F23C] font-bold">{completedRecord.auditCertificateRef}</span>
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-left space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Offboarded Staff:</span>
                <span className="font-bold text-[var(--text)]">{completedRecord.staffName} ({completedRecord.staffRole.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Separation Date:</span>
                <span className="text-[var(--text)]">{new Date(completedRecord.offboardedAt).toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Bookings Unassigned:</span>
                <span className="text-rose-400 font-bold">{completedRecord.cancelledBookingsCount} returned to pool</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Mobile App Tokens:</span>
                <span className="text-emerald-400 font-bold">Immediately Revoked (0 active)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary w-full !h-[40px] rounded-[12px] text-xs font-heading font-bold shadow-lime-glow"
            >
              Close &amp; Return to Workforce
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

