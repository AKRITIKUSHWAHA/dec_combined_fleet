import React, { useState } from 'react';
import { 
  mockAutoDispatchZones, 
  mockAirportHoldingQueue, 
  mockAutoDispatchConfig, 
  mockManualOverrides 
} from '../data/mockDataPhase9';
import { 
  AutoDispatchZone, 
  AutoDispatchQueueItem, 
  AutoDispatchConfig, 
  ManualDispatchOverrideLog 
} from '../types/phase9';
import { 
  Sliders, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  Save, 
  Plus, 
  History, 
  Zap,
  RotateCcw,
  UserCheck,
  Building2
} from 'lucide-react';

export const AutoDispatchSettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AutoDispatchConfig>(mockAutoDispatchConfig);
  const [zones, setZones] = useState<AutoDispatchZone[]>(mockAutoDispatchZones);
  const [queue, setQueue] = useState<AutoDispatchQueueItem[]>(mockAirportHoldingQueue);
  const [overrides, setOverrides] = useState<ManualDispatchOverrideLog[]>(mockManualOverrides);
  const [isSaved, setIsSaved] = useState(false);

  // Manual Override Form State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideBookingRef, setOverrideBookingRef] = useState('DEC-LTN-2026-904');
  const [suggestedDriver, setSuggestedDriver] = useState('Rashid Khan (Nearest Available)');
  const [overrideDriver, setOverrideDriver] = useState('Tariq Mahmood (Executive V-Class)');
  const [overrideReason, setOverrideReason] = useState('VIP client request for English/French speaking executive driver.');

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: ManualDispatchOverrideLog = {
      id: `ovr-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toTimeString().substring(0, 5),
      bookingRef: overrideBookingRef,
      suggestedDriverName: suggestedDriver,
      assignedDriverName: overrideDriver,
      controllerName: 'Liam Reynolds',
      mandatoryReason: overrideReason
    };
    setOverrides(prev => [newLog, ...prev]);
    setShowOverrideModal(false);
    setConfig(prev => ({ ...prev, manualOverridesTodayCount: prev.manualOverridesTodayCount + 1 }));
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#B6F23C]" />
            <span>Automated Dispatch Engine &amp; Queue Zones</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              config.autoDispatchActive ? 'chip-ready' : 'chip-blocked'
            }`}>
              {config.autoDispatchActive ? 'AUTO-DISPATCH ENGINE LIVE' : 'MANUAL DISPATCH ONLY'}
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Configure algorithmic zone allocation, airport FIFO queues, offer acceptance timers, escalation ladders, and logged manual overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverrideModal(true)}
            className="btn-secondary !text-xs !py-1 !px-3 !min-h-[38px]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Log Manual Override</span>
          </button>

          <button
            onClick={handleSaveConfig}
            className="btn-primary !text-xs !py-1 !px-4 !min-h-[38px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Rules</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-[14px] bg-[#34D399]/15 border border-[#34D399]/40 text-xs text-[#065F46] dark:text-[#34D399] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>Auto-dispatch rules updated! Algorithmic matching will apply to all new unallocated bookings immediately.</span>
        </div>
      )}

      {/* 4-Stat Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold text-[11px]">Offer Countdown Deadline</span>
          <p className="text-2xl font-heading font-bold text-[#B6F23C] font-mono tabular-nums">{config.offerDeadlineSeconds}s</p>
          <span className="text-[10px] text-[var(--text-muted)]">Timeout triggers escalation</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold text-[11px]">Maximum Dispatch Radius</span>
          <p className="text-2xl font-heading font-bold text-[#3FE0C5] font-mono tabular-nums">{config.maxRadiusMiles} mi</p>
          <span className="text-[10px] text-[var(--text-muted)]">Dead-mileage guardrail</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold text-[11px]">Airport FIFO Queue Depth</span>
          <p className="text-2xl font-heading font-bold text-[var(--text)] font-mono tabular-nums">{queue.length} Vehicles</p>
          <span className="text-[10px] text-[#34D399] font-bold">Luton Airside Holding</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold text-[11px]">Logged Overrides Today</span>
          <p className="text-2xl font-heading font-bold text-[#FF9F6B] font-mono tabular-nums">{config.manualOverridesTodayCount}</p>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">100% Audit Tracked</span>
        </div>
      </div>

      {/* Main Grid: Parameters & Rules (Left 5 Cols), Zones & FIFO Queue (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Algorithmic Parameters */}
        <div className="lg:col-span-5 nr-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#B6F23C]" />
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Algorithmic Priority &amp; Escalation Rules
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoDispatchActive}
                onChange={(e) => setConfig({ ...config, autoDispatchActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B6F23C]" />
            </label>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Offer Timer Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-muted)] font-semibold">Driver Acceptance Offer Deadline</label>
                <span className="font-mono font-bold text-[#B6F23C]">{config.offerDeadlineSeconds} Seconds</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={config.offerDeadlineSeconds}
                onChange={(e) => setConfig({ ...config, offerDeadlineSeconds: Number(e.target.value) })}
                className="w-full accent-[#B6F23C] cursor-pointer"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                Driver phone rings for {config.offerDeadlineSeconds}s before withdrawing offer.
              </span>
            </div>

            {/* Max Radius */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-muted)] font-semibold">Maximum Pickup Radius</label>
                <span className="font-mono font-bold text-[#3FE0C5]">{config.maxRadiusMiles} Miles</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={config.maxRadiusMiles}
                onChange={(e) => setConfig({ ...config, maxRadiusMiles: Number(e.target.value) })}
                className="w-full accent-[#3FE0C5] cursor-pointer"
              />
            </div>

            {/* Escalation Strategy */}
            <div>
              <label className="text-[var(--text-muted)] font-semibold block mb-1">
                Escalation Ladder (After {config.maxConsecutiveRejections} Declines or Timeouts)
              </label>
              <select
                value={config.escalationStrategy}
                onChange={(e) => setConfig({ ...config, escalationStrategy: e.target.value as any })}
                className="nr-input !h-[42px] font-heading font-bold"
              >
                <option value="alert_controller_desk">🚨 Alert Controller Desk (Audio Alarm + Flash)</option>
                <option value="auto_reassign_next">↻ Auto-Reassign to Next Ranked Driver</option>
                <option value="broadcast_available">📡 Broadcast to All On-Duty Vehicles in Zone</option>
              </select>
            </div>

            {/* Vehicle Tier Matching */}
            <div>
              <label className="text-[var(--text-muted)] font-semibold block mb-1">
                Vehicle Tier Matching Rule
              </label>
              <select
                value={config.vehicleMatchingMode}
                onChange={(e) => setConfig({ ...config, vehicleMatchingMode: e.target.value as any })}
                className="nr-input !h-[42px] font-heading font-bold"
              >
                <option value="allow_free_upgrade_saloon_to_exec">Allow Free Upgrade (Saloon booking to Executive car if idle)</option>
                <option value="strict_class_only">Strict Tier Only (Saloon to Saloon only)</option>
              </select>
            </div>

            {/* Cooldown after reject */}
            <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] space-y-1">
              <span className="font-heading font-bold text-[var(--text)] text-[11px] block">
                Driver Rejection Penalty Cooldown
              </span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Drivers declining 2 consecutive runs are demoted to bottom of the holding queue for {config.rejectionCooldownMinutes} minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Zones & FIFO Airport Queue */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Airport Holding Queue (FIFO) */}
          <div className="nr-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                  Luton Airport Terminal FIFO Holding Queue
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  First-in, first-out allocation order for terminal meet &amp; greet dispatches.
                </p>
              </div>

              <span className="chip-ready text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                FIFO ROTATION
              </span>
            </div>

            <div className="divide-y divide-[var(--border)] text-xs font-mono">
              {queue.map((q) => (
                <div key={q.driverId} className="p-3 flex items-center justify-between hover:bg-[var(--surface-2)] transition">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center font-bold text-xs">
                      #{q.queuePosition}
                    </span>
                    <div>
                      <p className="font-heading font-bold text-[var(--text)]">{q.driverName}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{q.vehicleReg} &bull; {q.vehicleTier}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[#3FE0C5] font-bold">Checked in {q.checkInTime}</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">Waiting: {q.waitingMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zones Table */}
          <div className="nr-card p-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[var(--text)]">
              Geofenced Dispatch Zones &amp; Coverage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {zones.map((zn) => (
                <div key={zn.id} className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-[var(--text)] truncate">{zn.code}</span>
                    <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{zn.name}</p>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-[var(--border)]">
                    <span>Radius: {zn.radiusMiles} mi</span>
                    <span className="font-bold text-[#B6F23C]">{zn.activeDriversInZone} Cars</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Manual Dispatch Overrides Audit Table (Requirement 5) */}
      <div className="nr-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-sm text-[var(--text)]">
              Manual Override Audit Trail (Mandatory Justification Log)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Every controller intervention overriding algorithmic dispatch is logged for Council compliance inspection.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#3FE0C5]">COMPLIANCE AUDITABLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Booking Ref</th>
                <th className="p-3">Algorithmic Suggestion</th>
                <th className="p-3">Overridden To</th>
                <th className="p-3">Controller</th>
                <th className="p-3">Mandatory Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[11px]">
              {overrides.map((ovr) => (
                <tr key={ovr.id} className="hover:bg-[var(--surface-2)] transition">
                  <td className="p-3 text-[var(--text-muted)]">{ovr.timestamp}</td>
                  <td className="p-3 font-bold text-[#3FE0C5]">{ovr.bookingRef}</td>
                  <td className="p-3 text-[var(--text-muted)] line-through">{ovr.suggestedDriverName}</td>
                  <td className="p-3 font-bold text-[#B6F23C]">{ovr.assignedDriverName}</td>
                  <td className="p-3 text-[var(--text)]">{ovr.controllerName}</td>
                  <td className="p-3 text-[var(--text)] max-w-sm truncate" title={ovr.mandatoryReason}>
                    {ovr.mandatoryReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Log Dialog Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
              <UserCheck className="w-5 h-5 text-[#B6F23C]" />
              <h3 className="font-heading font-bold text-base text-[var(--text)]">
                Log Manual Dispatch Override
              </h3>
            </div>

            <form onSubmit={handleLogOverride} className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">Booking Reference</label>
                <input
                  type="text"
                  required
                  value={overrideBookingRef}
                  onChange={(e) => setOverrideBookingRef(e.target.value)}
                  className="nr-input !h-[42px] font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">Algorithmic Match (System)</label>
                <input
                  type="text"
                  disabled
                  value={suggestedDriver}
                  className="nr-input !h-[42px] font-mono opacity-70"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">Target Driver Assignment</label>
                <input
                  type="text"
                  required
                  value={overrideDriver}
                  onChange={(e) => setOverrideDriver(e.target.value)}
                  className="nr-input !h-[42px] font-mono font-bold text-[#B6F23C]"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">
                  Mandatory Audit Reason (Council &amp; Operational Inspection)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide valid operational justification..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="nr-input !h-auto p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="btn-ghost flex-1 !text-xs !min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 !text-xs !min-h-[44px]"
                >
                  Confirm &amp; Log Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AutoDispatchSettingsPage;
