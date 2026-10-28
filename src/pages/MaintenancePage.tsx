import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ShieldCheck, 
  FileText,
  Lock,
  PoundSterling
} from 'lucide-react';
import { VehicleDefect } from '../types';

export const MaintenancePage: React.FC = () => {
  const { defects, vehicles, reportDefect, verifyAndReleaseVehicle } = useData();
  const { currentRole, canReleaseVehicle } = useRole();

  const [activeTab, setActiveTab] = useState<'defects' | 'workshop'>('defects');
  
  // New Defect state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReg, setNewReg] = useState('BD24 TYU');
  const [newCategory, setNewCategory] = useState<VehicleDefect['category']>('Brakes');
  const [newSeverity, setNewSeverity] = useState<'minor' | 'critical_safety'>('critical_safety');
  const [newDescription, setNewDescription] = useState('');

  // Handle reporting
  const handleReport = () => {
    if (!newDescription.trim()) return;
    reportDefect({
      vehicleReg: newReg,
      reportedByStaffId: 'DEC-MGR-01',
      reportedByName: 'Office Controller',
      severity: newSeverity,
      category: newCategory,
      description: newDescription.trim(),
      status: 'reported',
      garageAction: {
        garageName: 'Dunstable Fleet Care Workshop Ltd',
        appointmentDate: '29/10/2026',
        downtimeStart: '29/10/2026 09:00',
        downtimeEnd: '29/10/2026 17:00',
        costEstimateGbp: 150.00
      }
    });
    setIsReportModalOpen(false);
    setNewDescription('');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Defects, Maintenance &amp; Workshop</span>
            <span className="chip-blocked px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Safety Release Gate
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Traceable defect lifecycle (DEF-02): Reported &rarr; Triaged &rarr; Booked &rarr; Repaired &rarr; Independently Verified &rarr; Released.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('defects')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'defects' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Defect Pipeline ({defects.length})
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'workshop' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              Workshop Portal
            </button>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn-danger !text-xs !py-1 !px-3.5 !min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Defect</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Alert */}
      <div className="bg-[#FF5D6C]/10 border border-[#FF5D6C]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[#FF5D6C]">
        <ShieldCheck className="w-4 h-4 text-[#FF5D6C] shrink-0 mt-0.5" />
        <div>
          <span className="font-heading font-bold">Independent 2-Person Verification Gate (DEF-04):</span>{' '}
          A garage appointment alone does not clear a defect. Safety defects require authorised second-person verification before dispatch release can be granted.
        </div>
      </div>

      {activeTab === 'defects' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defects.map(def => {
            const isCritical = def.severity === 'critical_safety';
            const isReleased = def.status === 'verified_released';

            return (
              <div
                key={def.id}
                className="nr-card p-5 space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
                      {def.defectRef}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isReleased
                        ? 'chip-ready'
                        : isCritical
                        ? 'chip-blocked'
                        : 'chip-due-soon'
                    }`}>
                      {isReleased ? 'RELEASED / ACTIVE' : def.severity.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-[var(--text)] mt-1">
                    {def.vehicleReg}
                  </h3>
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] font-mono">
                    Category: {def.category} • Reported: {def.reportedAt}
                  </p>

                  <p className="text-xs text-[var(--text)] mt-2 line-clamp-3 bg-[var(--surface-2)] p-3 rounded-[12px] border border-[var(--border)] leading-relaxed">
                    "{def.description}"
                  </p>
                </div>

                {/* Garage Action Info */}
                <div className="space-y-2 border-t border-[var(--border)] pt-3 text-xs">
                  {def.garageAction && (
                    <div className="text-[11px] text-[var(--text-muted)] space-y-0.5">
                      <p><strong className="text-[var(--text)]">Garage:</strong> {def.garageAction.garageName}</p>
                      <p><strong className="text-[var(--text)]">Estimate:</strong> £{def.garageAction.costEstimateGbp.toFixed(2)} GBP</p>
                      {def.garageAction.verifiedBy && (
                        <p className="text-[#34D399] font-semibold">
                          ✓ Verified by {def.garageAction.verifiedBy}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Verification & Release Action */}
                  {!isReleased ? (
                    canReleaseVehicle ? (
                      <button
                        onClick={() => verifyAndReleaseVehicle(def.id, 'John MasterTech (Auth Verifier)')}
                        className="btn-primary w-full !text-xs !py-1 !min-h-[44px]"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign-off &amp; Release to Service</span>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[11px] text-[var(--text-muted)] text-center flex items-center justify-center gap-1 border border-[var(--border)]">
                        <Lock className="w-3.5 h-3.5 text-[#FFC24B]" />
                        <span>Release requires Mechanic/Admin role</span>
                      </div>
                    )
                  ) : (
                    <div className="p-2.5 rounded-[12px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#065F46] dark:text-[#34D399] font-heading font-bold text-center text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Returned to Dispatch Pool</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Workshop Portal Tab */
        <div className="nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                Workshop Work Orders &amp; Maintenance Costs
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Track labour hours, parts used, and garage invoices without double-counting (SRV-05).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Work Order / Reg</th>
                  <th className="p-3.5">Assigned Garage</th>
                  <th className="p-3.5">Work Performed</th>
                  <th className="p-3.5">Estimated Cost</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {defects.map(d => (
                  <tr key={d.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-[var(--text)]">{d.defectRef}</div>
                      <div className="text-[var(--text-muted)]">{d.vehicleReg}</div>
                    </td>
                    <td className="p-3.5 text-[var(--text)]">
                      {d.garageAction?.garageName || 'Pending Allocation'}
                    </td>
                    <td className="p-3.5 text-[var(--text-muted)] max-w-xs truncate">
                      {d.description}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[var(--text)] tabular-nums">
                      £{d.garageAction?.costEstimateGbp?.toFixed(2) || '0.00'} GBP
                    </td>
                    <td className="p-3.5">
                      <span className="chip-pending px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Defect Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-[var(--text)]">
              Report Vehicle Defect
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Select Vehicle</label>
                <select
                  value={newReg}
                  onChange={e => setNewReg(e.target.value)}
                  className="nr-input !h-[44px] !px-3 font-mono"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.registration} className="bg-[var(--surface)] text-[var(--text)]">
                      {v.registration} - {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="nr-input !h-[44px] !px-3"
                  >
                    <option value="Brakes">Brakes</option>
                    <option value="Tyres/Wheels">Tyres/Wheels</option>
                    <option value="Lights">Lights</option>
                    <option value="Steering">Steering</option>
                    <option value="Ramp/Lift">Ramp/Lift</option>
                    <option value="Fluids">Fluids</option>
                  </select>
                </div>
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as any)}
                    className="nr-input !h-[44px] !px-3"
                  >
                    <option value="critical_safety">Critical Safety (Auto VOR Block)</option>
                    <option value="minor">Minor (Monitorable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Defect Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the failure, noise, warning light, or physical damage..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex gap-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="btn-ghost flex-1 !text-xs !min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="btn-danger flex-1 !text-xs !min-h-[44px]"
              >
                Submit &amp; Trigger Gate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
