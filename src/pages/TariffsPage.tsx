import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockTariffRules, mockFixedRoutes } from '../data/mockDataPhase9';
import { TariffRule, FixedRouteTariff } from '../types/phase9';
import { 
  Tag, 
  PoundSterling, 
  Clock, 
  Plane, 
  Lock, 
  Save, 
  CheckCircle2, 
  History,
  Calculator,
  Car,
  Layers,
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const TariffsPage: React.FC = () => {
  const { currentRole, canManageTariffs } = useRole();

  const [activeTab, setActiveTab] = useState<'rules' | 'fixed_routes' | 'calculator'>('rules');
  const [selectedTariff, setSelectedTariff] = useState<TariffRule>(mockTariffRules[0]);
  const [isSaved, setIsSaved] = useState(false);

  // Price Calculator Interactive State
  const [calcDistance, setCalcDistance] = useState<number>(18.5);
  const [calcVehicleClass, setCalcVehicleClass] = useState<string>('Executive');
  const [calcWaitMinutes, setCalcWaitMinutes] = useState<number>(20);
  const [calcExtraStops, setCalcExtraStops] = useState<number>(1);
  const [calcIncludeAirportFee, setCalcIncludeAirportFee] = useState<boolean>(true);
  const [calcIncludeMeetGreet, setCalcIncludeMeetGreet] = useState<boolean>(true);
  const [calcIsNightHour, setCalcIsNightHour] = useState<boolean>(false);

  // Price Preview Calculation Formulas
  const rule = selectedTariff;
  const billableMiles = Math.max(0, calcDistance - rule.includedMiles);
  const mileageCharge = billableMiles * rule.perMileRateGbp;
  const basePrice = rule.baseDropFareGbp + mileageCharge;
  const rawFare = Math.max(rule.minimumFareGbp, basePrice);
  
  const billableWaitMinutes = Math.max(0, calcWaitMinutes - rule.waitingFreeBufferMinutes);
  const waitCharge = billableWaitMinutes * rule.waitingChargePerMinuteGbp;
  const stopsCharge = calcExtraStops * rule.extraStopChargeGbp;
  const airportCharge = calcIncludeAirportFee ? rule.airportDropFeeGbp : 0;
  const meetGreetCharge = calcIncludeMeetGreet ? rule.meetAndGreetFeeGbp : 0;

  const subtotalBeforeMultiplier = rawFare + waitCharge + stopsCharge + airportCharge + meetGreetCharge;
  const multiplier = calcIsNightHour ? rule.nightSurchargeMultiplier : 1.0;
  const passengerTotalPrice = Math.round(subtotalBeforeMultiplier * multiplier * 100) / 100;

  // Split: Passenger Gross vs Driver Net & Operator Commission (20%)
  const operatorCommission = Math.round(passengerTotalPrice * 0.20 * 100) / 100;
  const driverNetPayout = Math.round((passengerTotalPrice - operatorCommission) * 100) / 100;

  const handlePublish = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#B6F23C]" />
            <span>Tariff &amp; Pricing Engine</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              {rule.version} Active
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Included mileage rates, fixed postcode routes, multi-tier extras, effective versioning dates, and live price calculators.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'rules' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              Mileage &amp; Tiers
            </button>
            <button
              onClick={() => setActiveTab('fixed_routes')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
                activeTab === 'fixed_routes' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              Fixed Routes Matrix
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
                activeTab === 'calculator' ? 'bg-[var(--surface)] text-[#3FE0C5] shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#3FE0C5]" />
              <span>Price Calculator</span>
            </button>
          </div>

          {canManageTariffs && (
            <button
              onClick={handlePublish}
              className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[38px] shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Schedule</span>
            </button>
          )}
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-[14px] bg-[#34D399]/15 border border-[#34D399]/40 text-xs text-[#065F46] dark:text-[#34D399] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>New tariff schedule {rule.version} published! Version effective from {rule.effectiveFrom}. Rate freeze applied to existing pre-booked jobs.</span>
        </div>
      )}

      {/* TAB 1: MILEAGE & TARIFF RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          
          {/* Versioning & Entity Banner */}
          <div className="nr-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--surface-2)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center font-mono font-bold text-sm">
                {rule.version}
              </div>
              <div>
                <p className="font-heading font-bold text-xs text-[var(--text)]">{rule.name}</p>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Effective From: <strong className="text-[var(--text)]">{rule.effectiveFrom}</strong> • Status: <span className="text-[#34D399] font-bold uppercase">{rule.status}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-muted)]">Select Category Tier:</span>
              <select
                value={selectedTariff.id}
                onChange={(e) => {
                  const found = mockTariffRules.find(t => t.id === e.target.value);
                  if (found) setSelectedTariff(found);
                }}
                className="nr-input !h-[36px] !py-0 !px-3 text-xs font-heading font-semibold"
              >
                {mockTariffRules.map(t => (
                  <option key={t.id} value={t.id}>{t.vehicleCategory} ({t.name})</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-Column Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* 1. Base Drop & Included Mileage */}
            <div className="nr-card p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <PoundSterling className="w-4 h-4 text-[#B6F23C]" />
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">Base &amp; Included Mileage</h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Base Flag Drop Fare (£)</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!canManageTariffs}
                    value={rule.baseDropFareGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, baseDropFareGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Included Mileage in Base Drop (Miles)</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!canManageTariffs}
                    value={rule.includedMiles}
                    onChange={(e) => setSelectedTariff({ ...rule, includedMiles: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold text-[#3FE0C5]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Zero extra charge up to {rule.includedMiles} miles</span>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Per-Mile Subsequent Rate (£/mile)</label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={!canManageTariffs}
                    value={rule.perMileRateGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, perMileRateGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Absolute Minimum Journey Fare (£)</label>
                  <input
                    type="number"
                    step="1"
                    disabled={!canManageTariffs}
                    value={rule.minimumFareGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, minimumFareGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Waiting Time & Extra Stops */}
            <div className="nr-card p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <Clock className="w-4 h-4 text-[#3FE0C5]" />
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">Waiting &amp; Intermediate Stops</h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Free Waiting Time Buffer (Mins)</label>
                  <input
                    type="number"
                    disabled={!canManageTariffs}
                    value={rule.waitingFreeBufferMinutes}
                    onChange={(e) => setSelectedTariff({ ...rule, waitingFreeBufferMinutes: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Waiting Charge Rate (£/min)</label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={!canManageTariffs}
                    value={rule.waitingChargePerMinuteGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, waitingChargePerMinuteGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Applies after free buffer expires (£{(rule.waitingChargePerMinuteGbp * 60).toFixed(2)}/hour)</span>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Charge per Intermediate Via-Stop (£)</label>
                  <input
                    type="number"
                    disabled={!canManageTariffs}
                    value={rule.extraStopChargeGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, extraStopChargeGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Airport & Surcharge Multipliers */}
            <div className="nr-card p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <Plane className="w-4 h-4 text-[#FF9F6B]" />
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">Airport &amp; Multipliers</h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Airport Drop-off Barrier Fee (£)</label>
                  <input
                    type="number"
                    disabled={!canManageTariffs}
                    value={rule.airportDropFeeGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, airportDropFeeGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">Terminal 5 &amp; Luton barrier charges</span>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Meet &amp; Greet Service (£)</label>
                  <input
                    type="number"
                    disabled={!canManageTariffs}
                    value={rule.meetAndGreetFeeGbp}
                    onChange={(e) => setSelectedTariff({ ...rule, meetAndGreetFeeGbp: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold text-[#B6F23C]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">Includes nameboard and terminal parking</span>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] font-semibold block mb-1">Night Multiplier (23:00 - 05:00)</label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={!canManageTariffs}
                    value={rule.nightSurchargeMultiplier}
                    onChange={(e) => setSelectedTariff({ ...rule, nightSurchargeMultiplier: Number(e.target.value) })}
                    className="nr-input !h-[42px] font-mono font-bold"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FIXED ROUTES & POSTCODES MATRIX */}
      {activeTab === 'fixed_routes' && (
        <div className="space-y-4">
          <div className="nr-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                  Guaranteed Fixed Postcode Matrix Routes
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Fixed pricing overrides per-mile formulas for frequent airport &amp; inter-city corridors.
                </p>
              </div>

              {canManageTariffs && (
                <button
                  onClick={() => alert('New Fixed Route corridor modal opened.')}
                  className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
                >
                  + Add Fixed Corridor
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Corridor Name</th>
                    <th className="p-3">From Zone</th>
                    <th className="p-3">To Zone</th>
                    <th className="p-3">Vehicle Tier</th>
                    <th className="p-3 text-right">Passenger Price</th>
                    <th className="p-3 text-right">Driver Payout (80%)</th>
                    <th className="p-3 text-right">Commission (20%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono">
                  {mockFixedRoutes.map((fx) => (
                    <tr key={fx.id} className="hover:bg-[var(--surface-2)] transition">
                      <td className="p-3 font-heading font-bold text-[var(--text)]">
                        {fx.routeName}
                      </td>
                      <td className="p-3 text-[var(--text-muted)]">
                        {fx.fromLocation}
                      </td>
                      <td className="p-3 text-[var(--text-muted)]">
                        {fx.toLocation}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] font-bold text-[10px]">
                          {fx.vehicleCategory}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-[#B6F23C] text-sm">
                        £{fx.fixedPassengerPriceGbp.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-[#34D399]">
                        £{fx.driverPayoutGbp.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-[var(--text-muted)]">
                        £{fx.companyCommissionGbp.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICE PREVIEW CALCULATOR WITH WORKED EXAMPLES */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Inputs Column (5 Cols) */}
          <div className="lg:col-span-5 nr-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
              <Calculator className="w-5 h-5 text-[#3FE0C5]" />
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Trip Parameters &amp; Extras Simulator
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[var(--text-muted)] font-semibold">Distance in Miles</label>
                  <span className="font-mono font-bold text-[#B6F23C]">{calcDistance} Miles</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  step="0.5"
                  value={calcDistance}
                  onChange={(e) => setCalcDistance(Number(e.target.value))}
                  className="w-full accent-[#B6F23C] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">Vehicle Category</label>
                <select
                  value={calcVehicleClass}
                  onChange={(e) => setCalcVehicleClass(e.target.value)}
                  className="nr-input !h-[42px] font-heading font-bold"
                >
                  <option value="Executive">Executive Chauffeur (Mercedes V/E-Class)</option>
                  <option value="Saloon">Standard Saloon (Skoda Octavia)</option>
                  <option value="WAV">Wheelchair Accessible WAV</option>
                  <option value="Minibus">Minibus 8-16 Seater</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[var(--text-muted)] font-semibold">Waiting Time (Mins)</label>
                  <span className="font-mono font-bold text-[#3FE0C5]">{calcWaitMinutes} Mins (Free: {rule.waitingFreeBufferMinutes}m)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={calcWaitMinutes}
                  onChange={(e) => setCalcWaitMinutes(Number(e.target.value))}
                  className="w-full accent-[#3FE0C5] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">Intermediate Via Stops</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalcExtraStops(num)}
                      className={`flex-1 py-1.5 rounded-[10px] font-mono font-bold border transition ${
                        calcExtraStops === num ? 'bg-[#B6F23C] text-[#08201C] border-[#B6F23C]' : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)]'
                      }`}
                    >
                      {num} {num === 1 ? 'Stop' : 'Stops'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Airport Barrier Drop-off Fee (+£{rule.airportDropFeeGbp})</span>
                  <input
                    type="checkbox"
                    checked={calcIncludeAirportFee}
                    onChange={(e) => setCalcIncludeAirportFee(e.target.checked)}
                    className="w-4 h-4 accent-[#B6F23C]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Meet &amp; Greet Terminal Nameboard (+£{rule.meetAndGreetFeeGbp})</span>
                  <input
                    type="checkbox"
                    checked={calcIncludeMeetGreet}
                    onChange={(e) => setCalcIncludeMeetGreet(e.target.checked)}
                    className="w-4 h-4 accent-[#B6F23C]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text)]">Night Tariff Multiplier (1.25x Surcharge)</span>
                  <input
                    type="checkbox"
                    checked={calcIsNightHour}
                    onChange={(e) => setCalcIsNightHour(e.target.checked)}
                    className="w-4 h-4 accent-[#B6F23C]"
                  />
                </label>
              </div>

            </div>
          </div>

          {/* Worked Breakdown Output (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Side-by-side: Passenger Gross vs Driver Net & Commission */}
            <div className="nr-card p-6 space-y-5 border-2 border-[#B6F23C]/50 shadow-lime-glow">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#B6F23C] tracking-wider block">
                    PRICE CALCULATION ENGINE
                  </span>
                  <h3 className="font-heading font-bold text-lg text-[var(--text)]">
                    Worked Trip Fare Quotation
                  </h3>
                </div>
                <span className="chip-ready text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  Instant Quote
                </span>
              </div>

              {/* Price Comparison Display */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. Passenger Gross Charge */}
                <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <span className="text-xs font-heading font-semibold text-[var(--text-muted)] block">
                    Total Passenger Charge
                  </span>
                  <p className="text-3xl font-heading font-black text-[#B6F23C] font-mono tabular-nums">
                    £{passengerTotalPrice.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    Client Invoice / Card Receipt
                  </p>
                </div>

                {/* 2. Driver Net Payout (Shown Separately!) */}
                <div className="p-4 rounded-[16px] bg-[#34D399]/15 border border-[#34D399]/40 space-y-1">
                  <span className="text-xs font-heading font-semibold text-[#065F46] dark:text-[#34D399] block">
                    Driver Net Settlement (80%)
                  </span>
                  <p className="text-3xl font-heading font-black text-[#34D399] font-mono tabular-nums">
                    £{driverNetPayout.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    DEC Operator Fee: <strong className="text-[var(--text)]">£{operatorCommission.toFixed(2)} (20%)</strong>
                  </p>
                </div>

              </div>

              {/* Itemised Worked Breakdown Table */}
              <div className="space-y-1.5 pt-2 text-xs font-mono">
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1 font-heading">
                  Formula Component Ledger:
                </p>

                <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                  <span>Base Flag Drop (Includes first {rule.includedMiles} mi):</span>
                  <span>£{rule.baseDropFareGbp.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                  <span>Billable Mileage ({billableMiles.toFixed(1)} mi @ £{rule.perMileRateGbp}/mi):</span>
                  <span>£{mileageCharge.toFixed(2)}</span>
                </div>

                {waitCharge > 0 && (
                  <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                    <span>Waiting Time ({billableWaitMinutes} mins @ £{rule.waitingChargePerMinuteGbp}/min):</span>
                    <span>£{waitCharge.toFixed(2)}</span>
                  </div>
                )}

                {stopsCharge > 0 && (
                  <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                    <span>Intermediate Via Stops ({calcExtraStops} x £{rule.extraStopChargeGbp}):</span>
                    <span>£{stopsCharge.toFixed(2)}</span>
                  </div>
                )}

                {calcIncludeAirportFee && (
                  <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                    <span>Airport Drop-off Barrier Charge:</span>
                    <span>£{rule.airportDropFeeGbp.toFixed(2)}</span>
                  </div>
                )}

                {calcIncludeMeetGreet && (
                  <div className="flex justify-between py-1 border-b border-[var(--border)] text-[var(--text)]">
                    <span>Meet &amp; Greet Terminal Nameboard:</span>
                    <span>£{rule.meetAndGreetFeeGbp.toFixed(2)}</span>
                  </div>
                )}

                {calcIsNightHour && (
                  <div className="flex justify-between py-1 border-b border-[var(--border)] text-[#FF9F6B] font-bold">
                    <span>Night Surcharge Multiplier (1.25x):</span>
                    <span>Applied (+25%)</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TariffsPage;
