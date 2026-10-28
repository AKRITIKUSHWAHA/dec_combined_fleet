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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tariff &amp; Pricing Engine</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              v3.2 Active (GBP £)
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Editable mileage formulas, waiting time, and airport surcharges with immutable historical versioning (Requirement 6).
          </p>
        </div>

        {canManageTariffs && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Tariff Version</span>
          </button>
        )}
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>New tariff schedule published! Existing confirmed bookings will preserve original rate cards.</span>
        </div>
      )}

      {/* Main Tariff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Base & Mileage */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <PoundSterling className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Standard Mileage Rates
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Base Drop Fare (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.baseFare}
                onChange={e => setTariffs({ ...tariffs, baseFare: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Per-Mile Charge (£/mile)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.perMileRate}
                onChange={e => setTariffs({ ...tariffs, perMileRate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Minimum Booking Total (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.minimumFare}
                onChange={e => setTariffs({ ...tariffs, minimumFare: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Airport & Surcharges */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Plane className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Airport &amp; Executive Extras
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Airport Drop-off Barrier Fee (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.airportDropFee}
                onChange={e => setTariffs({ ...tariffs, airportDropFee: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Meet &amp; Greet + Flight Buffer (£)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.airportPickupMeetGreet}
                onChange={e => setTariffs({ ...tariffs, airportPickupMeetGreet: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Waiting Time Charge (£/min)</label>
              <input
                type="text"
                disabled={!canManageTariffs}
                value={tariffs.waitingPerMinute}
                onChange={e => setTariffs({ ...tariffs, waitingPerMinute: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Multipliers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Tag className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Vehicle Category Multipliers
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Standard Saloon</span>
              <span className="font-mono font-bold text-blue-600">1.0x (Baseline)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">MPV (5-6 Seater)</span>
              <span className="font-mono font-bold text-blue-600">1.4x</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Executive Chauffeur</span>
              <span className="font-mono font-bold text-blue-600">1.8x</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Wheelchair Accessible (WAV)</span>
              <span className="font-mono font-bold text-blue-600">1.0x (No Surcharge - LAW-04)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
