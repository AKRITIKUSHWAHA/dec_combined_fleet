import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { 
  Tag, 
  PoundSterling, 
  Clock, 
  Plane, 
  Lock, 
  Save, 
  CheckCircle2, 
  History 
} from 'lucide-react';

export const TariffsPage: React.FC = () => {
  const { currentRole, canManageTariffs } = useRole();

  const [tariffs, setTariffs] = useState({
    baseFare: '4.50',
    perMileRate: '2.40',
    minimumFare: '8.00',
    waitingPerMinute: '0.45',
    airportDropFee: '5.00',
    airportPickupMeetGreet: '12.50',
    nightSurchargePercent: '20'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Tariff &amp; Pricing Engine</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              v3.2 Active (GBP £)
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Editable mileage formulas, waiting time, and airport surcharges with immutable historical versioning (Requirement 6).
          </p>
        </div>

        {canManageTariffs && (
          <button
            onClick={handleSave}
            className="btn-primary !text-xs !py-1 !px-4 !min-h-[42px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Tariff Version</span>
          </button>
        )}
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-[14px] bg-[#34D399]/15 border border-[#34D399]/40 text-xs text-[#065F46] dark:text-[#34D399] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>New tariff schedule published! Existing confirmed bookings will preserve original rate cards.</span>
        </div>
      )}

      {/* Main Tariff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Base & Mileage */}
        <div className="nr-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <PoundSterling className="w-4 h-4 text-[#B6F23C]" />
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Standard Mileage Rates
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Base Drop Fare (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.baseFare}
                onChange={e => setTariffs({ ...tariffs, baseFare: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Per-Mile Charge (£/mile)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.perMileRate}
                onChange={e => setTariffs({ ...tariffs, perMileRate: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Minimum Booking Total (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.minimumFare}
                onChange={e => setTariffs({ ...tariffs, minimumFare: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Airport & Surcharges */}
        <div className="nr-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Plane className="w-4 h-4 text-[#3FE0C5]" />
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Airport &amp; Executive Extras
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Airport Drop-off Barrier Fee (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.airportDropFee}
                onChange={e => setTariffs({ ...tariffs, airportDropFee: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Meet &amp; Greet + Flight Buffer (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.airportPickupMeetGreet}
                onChange={e => setTariffs({ ...tariffs, airportPickupMeetGreet: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] font-heading font-semibold block mb-1">Waiting Time Charge (£/min)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.waitingPerMinute}
                onChange={e => setTariffs({ ...tariffs, waitingPerMinute: e.target.value })}
                className="nr-input !h-[44px] !px-3 font-mono font-bold disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Multipliers */}
        <div className="nr-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Tag className="w-4 h-4 text-[#FF9F6B]" />
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Vehicle Category Multipliers
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)]">
              <span className="font-heading font-semibold text-[var(--text)]">Standard Saloon</span>
              <span className="font-mono font-bold text-[#34D399]">1.0x (Baseline)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)]">
              <span className="font-heading font-semibold text-[var(--text)]">MPV (5-6 Seater)</span>
              <span className="font-mono font-bold text-[#FF9F6B]">1.4x</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)]">
              <span className="font-heading font-semibold text-[var(--text)]">Executive Chauffeur</span>
              <span className="font-mono font-bold text-[#B6F23C]">1.8x</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)]">
              <span className="font-heading font-semibold text-[var(--text)]">Wheelchair Accessible (WAV)</span>
              <span className="font-mono font-bold text-[#3FE0C5]">1.0x (No Surcharge - LAW-04)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
