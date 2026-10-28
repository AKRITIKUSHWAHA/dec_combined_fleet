import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Defects, Maintenance &amp; Workshop</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
              Safety Release Gate
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Traceable defect lifecycle (DEF-02): Reported &rarr; Triaged &rarr; Booked &rarr; Repaired &rarr; Independently Verified &rarr; Released.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('defects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'defects' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              Defect Pipeline ({defects.length})
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'workshop' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              Workshop Portal
            </button>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Defect</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Alert */}
      <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
        <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Independent 2-Person Verification Gate (DEF-04):</span>{' '}
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
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {def.defectRef}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isReleased
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isCritical
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {isReleased ? 'RELEASED / ACTIVE' : def.severity.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {def.vehicleReg}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Category: {def.category} • Reported: {def.reportedAt}
                  </p>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 line-clamp-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{def.description}"
                  </p>
                </div>

                {/* Garage Action Info */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  {def.garageAction && (
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p><strong className="text-slate-700 dark:text-slate-300">Garage:</strong> {def.garageAction.garageName}</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">Estimate:</strong> £{def.garageAction.costEstimateGbp.toFixed(2)} GBP</p>
                      {def.garageAction.verifiedBy && (
                        <p className="text-emerald-600 font-semibold">
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
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign-off &amp; Release to Service</span>
                      </button>
                    ) : (
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Release requires Mechanic/Admin role</span>
                      </div>
                    )
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-center text-xs flex items-center justify-center gap-1">
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Workshop Work Orders &amp; Maintenance Costs
              </h3>
              <p className="text-xs text-slate-500">
                Track labour hours, parts used, and garage invoices without double-counting (SRV-05).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Work Order / Reg</th>
                  <th className="p-3">Assigned Garage</th>
                  <th className="p-3">Work Performed</th>
                  <th className="p-3">Estimated / Final</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {defects.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{d.defectRef}</div>
                      <div className="font-mono text-slate-500">{d.vehicleReg}</div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {d.garageAction?.garageName || 'Pending Allocation'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {d.description}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      £{d.garageAction?.costEstimateGbp?.toFixed(2) || '0.00'} GBP
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Report Vehicle Defect
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Vehicle</label>
                <select
                  value={newReg}
                  onChange={e => setNewReg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.registration}>
                      {v.registration} - {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
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
                  <label className="font-semibold block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="critical_safety">Critical Safety (Auto VOR Block)</option>
                    <option value="minor">Minor (Monitorable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Defect Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the failure, noise, warning light, or physical damage..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
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
