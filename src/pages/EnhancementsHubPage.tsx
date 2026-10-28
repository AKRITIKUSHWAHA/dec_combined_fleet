import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Gavel,
  Compass,
  Smartphone,
  CreditCard,
  Split,
  Eye,
  EyeOff,
  Clock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Send,
  Check,
  Percent,
  Sliders,
  DollarSign,
  Users,
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  initialBusyZones,
  initialJobBidTenders,
  initialDestinationModeConfig,
  initialSplitPaymentSession,
  initialPassengerLocationPrivacy
} from '../data/mockDataPhase13';
import {
  BusyZoneSurge,
  JobBidTender,
  DestinationModeConfig,
  SplitPaymentSession,
  PassengerLocationPrivacySetting
} from '../types/phase13';

export const EnhancementsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bidding_surge' | 'destination_mode' | 'carplay' | 'split_payment' | 'passenger_privacy'>('bidding_surge');

  // 1. Bidding & Busy Zones State
  const [busyZones, setBusyZones] = useState<BusyZoneSurge[]>(initialBusyZones);
  const [tenders, setTenders] = useState<JobBidTender[]>(initialJobBidTenders);
  const [selectedTender, setSelectedTender] = useState<JobBidTender | null>(initialJobBidTenders[0]);
  const [bidAmountInput, setBidAmountInput] = useState<string>('102.00');
  const [bidNoteInput, setBidNoteInput] = useState<string>('Driver on airport perimeter road (3 mins out).');
  const [bidSuccessMsg, setBidSuccessMsg] = useState<string | null>(null);

  // Countdown timer simulation for open tenders
  useEffect(() => {
    const timer = setInterval(() => {
      setTenders(prev =>
        prev.map(t => {
          if (t.status === 'bidding_open' && t.secondsRemaining > 0) {
            return { ...t, secondsRemaining: t.secondsRemaining - 1 };
          }
          if (t.secondsRemaining === 0 && t.status === 'bidding_open') {
            return { ...t, status: 'expired' };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Destination Mode State
  const [destConfig, setDestConfig] = useState<DestinationModeConfig>(initialDestinationModeConfig);
  const [destinationPostcodeInput, setDestinationPostcodeInput] = useState(destConfig.destinationPostcode);
  const [destinationAddressInput, setDestinationAddressInput] = useState(destConfig.destinationAddress);
  const [targetArrivalInput, setTargetArrivalInput] = useState(destConfig.targetArrivalTime);
  const [maxDetourMinutesInput, setMaxDetourMinutesInput] = useState(destConfig.maxDetourMinutes);
  const [corridorAngleInput, setCorridorAngleInput] = useState(destConfig.corridorAngleDegrees);

  // 4. Split Payment State
  const [splitSession, setSplitSession] = useState<SplitPaymentSession>(initialSplitPaymentSession);
  const [passengerCountChoice, setPassengerCountChoice] = useState<number>(4);
  const [simulatedCardIndex, setSimulatedCardIndex] = useState<number | null>(null);
  const [terminalAuthorising, setTerminalAuthorising] = useState(false);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  // 5. Passenger Privacy State
  const [privacySetting, setPrivacySetting] = useState<PassengerLocationPrivacySetting>(initialPassengerLocationPrivacy);
  const [privacySavedNotice, setPrivacySavedNotice] = useState(false);

  // Handle Tender Bid Submission
  const handleTenderBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;

    const bidVal = parseFloat(bidAmountInput);
    if (isNaN(bidVal) || bidVal <= 0) return;

    setTenders(prev =>
      prev.map(t => {
        if (t.id === selectedTender.id) {
          return {
            ...t,
            bidsCount: t.bidsCount + 1,
            currentLowestBidGbp: Math.min(t.currentLowestBidGbp || 999, bidVal),
            mySubmittedBidGbp: bidVal
          };
        }
        return t;
      })
    );

    setSelectedTender(prev => prev ? {
      ...prev,
      bidsCount: prev.bidsCount + 1,
      currentLowestBidGbp: Math.min(prev.currentLowestBidGbp || 999, bidVal),
      mySubmittedBidGbp: bidVal
    } : null);

    setBidSuccessMsg(`Bid of £${bidVal.toFixed(2)} placed for ${selectedTender.tenderRef}!`);
    setTimeout(() => setBidSuccessMsg(null), 4000);
  };

  // Handle Destination Mode Save
  const handleSaveDestinationMode = (e: React.FormEvent) => {
    e.preventDefault();
    setDestConfig(prev => ({
      ...prev,
      destinationPostcode: destinationPostcodeInput,
      destinationAddress: destinationAddressInput,
      targetArrivalTime: targetArrivalInput,
      maxDetourMinutes: maxDetourMinutesInput,
      corridorAngleDegrees: corridorAngleInput,
      isEnabled: true,
      statusText: `Destination filter ACTIVE: Filtering pickups heading towards ${destinationPostcodeInput} (${destinationAddressInput}) before ${targetArrivalInput}.`
    }));
  };

  // Handle Split Fare Passenger Count Change
  const handleSetPassengerCount = (count: number) => {
    setPassengerCountChoice(count);
    const amountPerPerson = Number((splitSession.totalFareGbp / count).toFixed(2));
    const newPax = Array.from({ length: count }).map((_, idx) => {
      const existing = splitSession.passengers[idx];
      return {
        id: `pax-${idx + 1}`,
        passengerIndex: idx + 1,
        name: existing ? existing.name : `Passenger ${idx + 1}`,
        allocatedAmountGbp: amountPerPerson,
        paymentMethod: existing ? existing.paymentMethod : 'contactless_nfc',
        status: existing ? existing.status : 'pending',
        authCode: existing ? existing.authCode : undefined,
        receiptRecipient: existing ? existing.receiptRecipient : `07700 900${idx + 1}0`,
        receiptSent: existing ? existing.receiptSent : false,
        timestamp: existing ? existing.timestamp : undefined
      } as any;
    });

    setSplitSession(prev => ({
      ...prev,
      passengerCount: count,
      passengers: newPax
    }));
  };

  // Simulate NFC Tap for a split passenger
  const handlePayPassenger = (passengerIndex: number) => {
    setSimulatedCardIndex(passengerIndex);
    setTerminalAuthorising(true);

    setTimeout(() => {
      setSplitSession(prev => {
        const updated = prev.passengers.map(p => {
          if (p.passengerIndex === passengerIndex) {
            return {
              ...p,
              status: 'paid' as const,
              authCode: `AUTH-${Math.floor(1000 + Math.random() * 9000)}-EMV`,
              receiptSent: true,
              timestamp: '18:12'
            };
          }
          return p;
        });

        const allPaid = updated.every(p => p.status === 'paid');
        return {
          ...prev,
          passengers: updated,
          allPaid
        };
      });

      setTerminalAuthorising(false);
      setPaymentSuccessToast(`Passenger #${passengerIndex} paid £${(splitSession.totalFareGbp / passengerCountChoice).toFixed(2)} via Contactless NFC. SMS receipt sent.`);
      setTimeout(() => setPaymentSuccessToast(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 text-xs select-none">
      
      {/* Top Banner with Night Road Aesthetic and Enhancement Mark */}
      <div 
        style={{ background: 'var(--hero-bg)' }}
        className="p-6 rounded-[24px] border border-[var(--border)] shadow-xl text-white relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C] text-[#08201C] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phase 13 Enhancement Suite</span>
              </span>
              <span className="text-[11px] font-mono text-[#8FB5AA]">
                Optional Modules • Night Road Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#EAF7F2]">
              Driver &amp; Dispatch Enhancements Hub
            </h1>
            <p className="text-xs text-[#8FB5AA] mt-1 max-w-2xl leading-relaxed">
              Explore and configure next-generation capabilities: live surge bidding boards, directional destination filtering, CarPlay landscape driver cockpit, in-cab contactless split payments, and passenger location privacy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/carplay-cockpit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[44px] !px-4 !text-xs flex items-center gap-2 shadow-lime-glow"
            >
              <Smartphone className="w-4 h-4" />
              <span>Launch Full CarPlay Screen</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-2 nr-scrollbar">
        {[
          { id: 'bidding_surge', label: '1. Bidding & Busy-Zone Map', icon: Flame, badge: 'Active Surges' },
          { id: 'destination_mode', label: '2. Destination Mode', icon: Compass, badge: destConfig.isEnabled ? 'ON' : 'OFF' },
          { id: 'carplay', label: '3. CarPlay Driver Screen', icon: Smartphone, badge: '80px Controls' },
          { id: 'split_payment', label: '4. Contactless & Split Pay', icon: Split, badge: 'EMV Reader' },
          { id: 'passenger_privacy', label: '5. Passenger Location Privacy', icon: Shield, badge: 'GDPR' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-[16px] font-heading font-semibold text-xs whitespace-nowrap transition-all duration-180 border ${
                isActive
                  ? 'bg-[#B6F23C] text-[#08201C] border-[#B6F23C] font-bold shadow-lime-glow'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#08201C]' : 'text-[#3FE0C5]'}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isActive ? 'bg-[#08201C]/20 text-[#08201C]' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: BIDDING / BUSY-ZONE MAP
         ======================================================== */}
      {activeTab === 'bidding_surge' && (
        <div className="space-y-6">
          
          {/* Header pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)] p-4 rounded-[18px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF9F6B]/20 text-[#FF9F6B] border border-[#FF9F6B]/30 uppercase">
                Enhancement Module
              </span>
              <h2 className="text-sm font-heading font-bold text-[var(--text)]">
                Surge Heat Map &amp; Real-Time Driver Bidding Tenders
              </h2>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              Surge algorithms calibrate multipliers every 5 minutes based on active flight arrivals &amp; railway queues.
            </div>
          </div>

          {/* Busy Zones Heat Cards */}
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF9F6B]" />
              <span>Current High-Demand Busy Zones (Surge Multipliers)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {busyZones.map(zone => {
                const isCrit = zone.demandIntensity === 'surge_critical';
                return (
                  <div
                    key={zone.id}
                    className="nr-card p-5 space-y-3 relative overflow-hidden border border-[var(--border)] hover:border-[#B6F23C]/50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--surface-2)] text-[#3FE0C5] border border-[var(--border)]">
                          {zone.zoneCode} • {zone.postcode}
                        </span>
                        <h3 className="font-heading font-bold text-sm text-[var(--text)] mt-1.5">
                          {zone.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-mono font-black ${isCrit ? 'text-[#FF5D6C]' : 'text-[#FF9F6B]'}`}>
                          {zone.surgeMultiplier}x
                        </span>
                        <span className="block text-[10px] font-mono uppercase text-[var(--text-muted)]">
                          Surge Rate
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--surface-2)] p-2.5 rounded-[12px]">
                      {zone.surgeReason}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-[10px] font-mono">
                      <div>
                        <span className="text-[var(--text-muted)] block">Drivers</span>
                        <span className="font-bold text-[var(--text)]">{zone.activeDriversInZone} in zone</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Unassigned</span>
                        <span className="font-bold text-[#FF5D6C]">{zone.unassignedPassengerCount} riders</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Est Wait</span>
                        <span className="font-bold text-[#34D399]">{zone.avgWaitTimeMinutes} mins</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Bidding Board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            
            {/* Tenders Feed (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-[#B6F23C]" />
                  <h3 className="text-sm font-heading font-bold text-[var(--text)]">
                    Live Broadcast Tenders Open for Driver Bids
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {tenders.filter(t => t.status === 'bidding_open').length} active tenders
                </span>
              </div>

              {tenders.map(tender => {
                const isSelected = selectedTender?.id === tender.id;
                const isOpen = tender.status === 'bidding_open';
                return (
                  <div
                    key={tender.id}
                    onClick={() => isOpen && setSelectedTender(tender)}
                    className={`nr-card p-4 space-y-3 cursor-pointer transition border ${
                      isSelected
                        ? 'border-[#B6F23C] ring-2 ring-[#B6F23C]/30 bg-[var(--surface)]'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)]'
                    } ${!isOpen ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[var(--text)]">{tender.tenderRef}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3FE0C5]/10 text-[#3FE0C5] border border-[#3FE0C5]/30">
                            {tender.vehicleCategory}
                          </span>
                          {tender.flightNumber && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#FF9F6B] bg-[#FF9F6B]/10">
                              ✈ {tender.flightNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-[var(--text)]">
                          {tender.pickupAddress} <span className="text-[#3FE0C5]">→</span> {tender.destinationAddress}
                        </div>
                      </div>

                      <div className="text-right">
                        {isOpen ? (
                          <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#FF5D6C] bg-[#FF5D6C]/10 px-2.5 py-1 rounded-full border border-[#FF5D6C]/30 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{tender.secondsRemaining}s left</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[var(--surface-2)] text-[var(--text-muted)]">
                            Tender Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border)] text-[10px] font-mono">
                      <div>
                        <span className="text-[var(--text-muted)] block">Distance / Time</span>
                        <span className="font-bold text-[var(--text)]">{tender.distanceMiles} mi • {tender.estDurationMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Base Meter Fare</span>
                        <span className="font-bold text-[var(--text)]">£{tender.baseFareGbp.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Guide Bid Rate</span>
                        <span className="font-bold text-[#34D399]">£{tender.guideBidGbp.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Lowest Current Bid</span>
                        <span className="font-black text-[#B6F23C]">
                          {tender.currentLowestBidGbp ? `£${tender.currentLowestBidGbp.toFixed(2)}` : 'No bids yet'}
                        </span>
                      </div>
                    </div>

                    {tender.mySubmittedBidGbp && (
                      <div className="bg-[#B6F23C]/10 border border-[#B6F23C]/30 p-2 rounded-[10px] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#08201C] dark:text-[#B6F23C] font-bold">Your submitted bid: £{tender.mySubmittedBidGbp.toFixed(2)}</span>
                        <span className="text-[#34D399]">✓ Bid active in auction pool</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bidding Terminal (Col 5) */}
            <div className="lg:col-span-5">
              {selectedTender && selectedTender.status === 'bidding_open' ? (
                <div className="nr-card p-6 space-y-4 border-2 border-[#B6F23C]/40 sticky top-20 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Bidding On Tender</span>
                      <h3 className="text-base font-heading font-extrabold text-[var(--text)]">
                        {selectedTender.tenderRef}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-mono font-black text-[#FF5D6C] animate-pulse">
                        {selectedTender.secondsRemaining}s
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Auction Closes</span>
                    </div>
                  </div>

                  {bidSuccessMsg && (
                    <div className="bg-[#34D399]/20 border border-[#34D399] text-[#34D399] p-3 rounded-[12px] font-mono font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{bidSuccessMsg}</span>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="bg-[var(--surface-2)] p-3 rounded-[12px] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">Route Details</span>
                      <p className="font-semibold text-[var(--text)]">{selectedTender.pickupAddress}</p>
                      <p className="text-[var(--text-muted)]">to {selectedTender.destinationAddress}</p>
                      <p className="text-[10px] font-mono text-[#3FE0C5] pt-1">
                        {selectedTender.distanceMiles} miles • Estimated {selectedTender.estDurationMinutes} mins driving time
                      </p>
                    </div>

                    {selectedTender.notes && (
                      <p className="text-[11px] text-[var(--text-muted)] italic">
                        &quot;{selectedTender.notes}&quot;
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleTenderBidSubmit} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-1">
                        Your Bid Offer (£ GBP)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-[var(--text-muted)]">£</span>
                        <input
                          type="number"
                          step="0.50"
                          min="30"
                          max="500"
                          required
                          value={bidAmountInput}
                          onChange={e => setBidAmountInput(e.target.value)}
                          className="w-full h-12 pl-8 pr-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-base font-mono font-extrabold text-[var(--text)] focus:border-[#B6F23C] focus:ring-1 focus:ring-[#B6F23C] outline-none"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">
                        Guide rate is £{selectedTender.guideBidGbp.toFixed(2)}. Current lowest bid: £{selectedTender.currentLowestBidGbp?.toFixed(2) || 'None'}.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-1">
                        Dispatcher Note / Driver Proximity
                      </label>
                      <input
                        type="text"
                        value={bidNoteInput}
                        onChange={e => setBidNoteInput(e.target.value)}
                        placeholder="e.g. 5 minutes away at airport roundabout"
                        className="w-full h-10 px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:border-[#B6F23C] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full !min-h-[48px] !text-xs font-extrabold flex items-center justify-center gap-2 shadow-lime-glow"
                    >
                      <Gavel className="w-4 h-4" />
                      <span>Submit Driver Bid (£{bidAmountInput})</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="nr-card p-6 text-center text-[var(--text-muted)] space-y-2">
                  <Info className="w-8 h-8 mx-auto text-[#8FB5AA]" />
                  <p className="font-semibold text-[var(--text)]">Select an open tender from the list</p>
                  <p className="text-xs">Review the route, guide fare, and submit a competitive bid before the auction timer reaches zero.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: DESTINATION MODE
         ======================================================== */}
      {activeTab === 'destination_mode' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)] p-4 rounded-[18px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3FE0C5]/20 text-[#3FE0C5] border border-[#3FE0C5]/30 uppercase">
                Enhancement Module
              </span>
              <h2 className="text-sm font-heading font-bold text-[var(--text)]">
                Driver Destination Mode (Head towards Home / Corridor Filter)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDestConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
                className={`px-3 py-1.5 rounded-full font-mono font-bold text-xs flex items-center gap-1.5 transition ${
                  destConfig.isEnabled
                    ? 'bg-[#34D399] text-[#08201C]'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{destConfig.isEnabled ? 'FILTER ACTIVE' : 'FILTER PAUSED'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Settings Form (Col 6) */}
            <div className="lg:col-span-6 nr-card p-6 space-y-5">
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-base text-[var(--text)]">
                  Configure Destination Target
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  When active, auto-dispatch filters out rides that send you away from your destination. Only journeys moving towards your destination within your corridor tolerance will be offered.
                </p>
              </div>

              <form onSubmit={handleSaveDestinationMode} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-1">
                    Destination Address (Home / Depot)
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationAddressInput}
                    onChange={e => setDestinationAddressInput(e.target.value)}
                    className="w-full h-11 px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:border-[#B6F23C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      required
                      value={destinationPostcodeInput}
                      onChange={e => setDestinationPostcodeInput(e.target.value)}
                      className="w-full h-11 px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text)] focus:border-[#B6F23C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-1">
                      Must Arrive By
                    </label>
                    <input
                      type="time"
                      value={targetArrivalInput}
                      onChange={e => setTargetArrivalInput(e.target.value)}
                      className="w-full h-11 px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text)] focus:border-[#B6F23C] outline-none"
                    />
                  </div>
                </div>

                {/* Corridor Angle Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-heading font-semibold text-[var(--text)]">
                      Route Corridor Angle Tolerance
                    </label>
                    <span className="font-mono font-bold text-[#3FE0C5] text-xs">{corridorAngleInput}° cone</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="5"
                    value={corridorAngleInput}
                    onChange={e => setCorridorAngleInput(parseInt(e.target.value))}
                    className="w-full accent-[#B6F23C]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                    Tighter angle (15°) ensures direct line home; wider (35°) allows slight detours for higher paying fares.
                  </span>
                </div>

                {/* Detour Minutes Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-heading font-semibold text-[var(--text)]">
                      Maximum Detour Allowed
                    </label>
                    <span className="font-mono font-bold text-[#FF9F6B] text-xs">+{maxDetourMinutesInput} mins</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={maxDetourMinutesInput}
                    onChange={e => setMaxDetourMinutesInput(parseInt(e.target.value))}
                    className="w-full accent-[#FF9F6B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-primary w-full !min-h-[46px] !text-xs font-extrabold shadow-lime-glow"
                  >
                    Save &amp; Activate Destination Mode
                  </button>
                </div>
              </form>
            </div>

            {/* Live Corridor Simulation (Col 6) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="nr-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#3FE0C5]" />
                    <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                      Live Filter Telematics
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    destConfig.isEnabled ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                  }`}>
                    {destConfig.isEnabled ? 'Filtering Active' : 'Filter Inactive'}
                  </span>
                </div>

                <div className="bg-[var(--surface-2)] p-4 rounded-[16px] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Target Destination:</span>
                    <span className="font-bold text-[var(--text)]">{destConfig.destinationAddress}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[var(--text-muted)]">Postcode / Target Time:</span>
                    <span className="text-[#3FE0C5]">{destConfig.destinationPostcode} • Before {destConfig.targetArrivalTime}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[var(--text-muted)]">Distance Remaining:</span>
                    <span className="text-[#FF9F6B] font-bold">{destConfig.distanceToDestinationMiles} miles</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[var(--text-muted)]">Dead Mileage Saved Today:</span>
                    <span className="text-[#34D399] font-bold">~22.4 miles (5 jobs filtered)</span>
                  </div>
                </div>

                {/* Simulation Comparison List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-bold">
                    Real-time Corridor Evaluation Sample
                  </span>

                  <div className="p-3 rounded-[12px] bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#34D399]">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>ACCEPTED (In-Corridor): Luton Airport → Flitwick Station</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                        Angle: 8° off direct path • Detour: +4 mins • Progress home: +9.2 miles
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#34D399]">£28.00</span>
                  </div>

                  <div className="p-3 rounded-[12px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5D6C]">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>REJECTED (Opposite Heading): Luton Airport → St Albans / M25</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                        Angle: 172° (Directly opposite Bedford) • Suppressed to protect arrival time
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] line-through">£42.00</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 3: CARPLAY-STYLE LARGE-CONTROL DRIVER SCREEN
         ======================================================== */}
      {activeTab === 'carplay' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)] p-4 rounded-[18px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C] text-[#08201C] uppercase">
                Enhancement Module
              </span>
              <h2 className="text-sm font-heading font-bold text-[var(--text)]">
                CarPlay / In-Dash Tablet Cockpit (80px+ Large Touch Controls)
              </h2>
            </div>
            <Link
              to="/carplay-cockpit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[40px] !px-4 !text-xs flex items-center gap-1.5 shadow-lime-glow"
            >
              <span>Open Standalone Fullscreen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="nr-card p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-heading font-extrabold text-[var(--text)]">
                  Vehicle-Mounted Ergonomics Specification
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-1">
                  Engineered specifically for landscape tablet cradles and in-vehicle head units. Strictly adheres to UK road safety standards: zero sub-menus, high-contrast dark palette, large 80px touch targets, and instant one-tap status advancement.
                </p>
              </div>
            </div>

            {/* Embedded Live Preview Container */}
            <div className="border-4 border-[#24574D] rounded-[24px] overflow-hidden shadow-2xl bg-[#051412] p-4 text-[#EAF7F2]">
              <div className="flex items-center justify-between pb-3 border-b border-[#24574D]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5D6C]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFC24B]" />
                  <span className="w-3 h-3 rounded-full bg-[#34D399]" />
                  <span className="text-xs font-mono font-bold text-[#8FB5AA] ml-2">CARPLAY TABLET HUD PREVIEW</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FF5D6C] text-slate-900 font-mono font-black text-xs flex items-center justify-center">
                    30
                  </div>
                  <div className="px-3 py-1 bg-[#164038] text-[#34D399] rounded-[10px] font-mono font-extrabold text-sm">
                    28 MPH
                  </div>
                </div>
              </div>

              <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[18px] bg-[#B6F23C] text-[#08201C] flex items-center justify-center shrink-0">
                    <Navigation className="w-8 h-8 rotate-45 transform" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#3FE0C5] uppercase font-bold">In 180m • Turn Left</span>
                    <h4 className="text-xl sm:text-2xl font-heading font-black text-white">
                      A505 Dunstable Road
                    </h4>
                    <span className="text-xs font-mono text-[#8FB5AA]">Active Job: DEC-881 • Luton Airport T1</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-2">
                  <button
                    type="button"
                    className="min-h-[64px] bg-[#FF9F6B] text-[#08201C] font-heading font-black rounded-[18px] text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>ARRIVED AT PICKUP</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[48px] bg-[#164038] text-[#3FE0C5] border border-[#3FE0C5]/40 rounded-[14px] text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Open In-Cab Split Payment</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Ergonomic Audit Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[var(--surface-2)] p-4 rounded-[14px] space-y-1">
                <span className="font-heading font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                  <span>80px Touch Standards</span>
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Primary actions exceed ISO 15005 driver distraction guidelines for one-tap execution.
                </p>
              </div>

              <div className="bg-[var(--surface-2)] p-4 rounded-[14px] space-y-1">
                <span className="font-heading font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                  <span>Speed Limit Telematics</span>
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
                  UK road sign speed limit badges with live GPS pulse alert if over speed threshold.
                </p>
              </div>

              <div className="bg-[var(--surface-2)] p-4 rounded-[14px] space-y-1">
                <span className="font-heading font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                  <span>High Contrast HUD</span>
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Night Road dark theme optimized to prevent night-driving pupil dilation or windshield glare.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: CONTACTLESS & SPLIT PAYMENT SCREEN
         ======================================================== */}
      {activeTab === 'split_payment' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)] p-4 rounded-[18px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3FE0C5]/20 text-[#3FE0C5] border border-[#3FE0C5]/30 uppercase">
                Enhancement Module
              </span>
              <h2 className="text-sm font-heading font-bold text-[var(--text)]">
                In-Cab Contactless Terminal &amp; Multi-Passenger Split Fare
              </h2>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              PCI-DSS Level 1 Encrypted • Barclaycard / Stripe Terminal SDK
            </div>
          </div>

          {paymentSuccessToast && (
            <div className="bg-[#34D399]/20 border border-[#34D399] text-[#34D399] p-3 rounded-[14px] font-mono font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{paymentSuccessToast}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Split Calculator & Passenger List (Col 7) */}
            <div className="lg:col-span-7 nr-card p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Fare Split Breakdown</span>
                  <h3 className="text-base font-heading font-extrabold text-[var(--text)]">
                    Booking #{splitSession.bookingRef}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-[#34D399]">
                    £{splitSession.totalFareGbp.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Total Fixed Fare</span>
                </div>
              </div>

              {/* Number of Passengers Selector */}
              <div>
                <label className="block text-xs font-heading font-semibold text-[var(--text)] mb-2">
                  Select Number of Splitting Passengers
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSetPassengerCount(num)}
                      className={`h-11 rounded-[12px] font-heading font-bold text-xs transition border ${
                        passengerCountChoice === num
                          ? 'bg-[#B6F23C] text-[#08201C] border-[#B6F23C] shadow-lime-glow'
                          : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      {num} Riders (£{(splitSession.totalFareGbp / num).toFixed(2)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Passenger Cards */}
              <div className="space-y-3">
                {splitSession.passengers.map(p => {
                  const isPaid = p.status === 'paid';
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-[16px] border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isPaid
                          ? 'bg-[#34D399]/10 border-[#34D399]/30'
                          : 'bg-[var(--surface-2)] border-[var(--border)]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-xs text-[var(--text)]">{p.name}</span>
                          {isPaid ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#34D399] text-[#08201C]">
                              PAID ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#FF9F6B] bg-[#FF9F6B]/10 border border-[#FF9F6B]/30">
                              PENDING CARD TAP
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          Receipt: {p.receiptRecipient} • Method: {p.paymentMethod.replace('_', ' ').toUpperCase()}
                          {p.authCode && <span className="text-[#3FE0C5] ml-2">({p.authCode})</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-base font-mono font-black text-[var(--text)]">
                          £{p.allocatedAmountGbp.toFixed(2)}
                        </span>
                        {!isPaid ? (
                          <button
                            type="button"
                            onClick={() => handlePayPassenger(p.passengerIndex)}
                            className="btn-primary !min-h-[38px] !px-3 !text-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Tap &amp; Pay</span>
                          </button>
                        ) : (
                          <span className="text-xs font-mono text-[#34D399] font-bold">
                            SMS Sent ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* In-Cab Terminal Hardware Simulator (Col 5) */}
            <div className="lg:col-span-5 nr-card p-6 space-y-4 border-2 border-[#3FE0C5]/40 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3FE0C5]/10 text-[#3FE0C5] border border-[#3FE0C5]/30">
                <CreditCard className="w-4 h-4" />
                <span>Contactless Reader Simulation</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Awaiting Contactless Tap</span>
                <span className="text-3xl font-mono font-black text-[#B6F23C]">
                  £{(splitSession.totalFareGbp / passengerCountChoice).toFixed(2)}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Per Passenger Split Amount</span>
              </div>

              <div className="bg-[var(--surface-2)] p-6 rounded-[22px] border-2 border-dashed border-[#3FE0C5]/40 space-y-3">
                {terminalAuthorising ? (
                  <div className="py-4 space-y-2">
                    <div className="w-10 h-10 border-4 border-[#3FE0C5] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-heading font-bold text-xs text-[#3FE0C5]">Processing NFC Contactless Chip...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-[#3FE0C5]/10 text-[#3FE0C5] flex items-center justify-center mx-auto animate-pulse">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-heading font-bold text-[var(--text)]">
                      Tap Apple Pay, Google Wallet or Contactless Card
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Card reader ready. Supports Visa, Mastercard, Amex, Apple Pay and Chip &amp; PIN.
                    </p>
                  </>
                )}
              </div>

              <div className="text-[10px] font-mono text-[var(--text-muted)] space-y-1 text-left bg-[var(--surface-2)] p-3 rounded-[12px]">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="text-[var(--text)]">DEC Combined Fleet Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span>Terminal ID:</span>
                  <span className="text-[var(--text)]">DEC-POS-8821</span>
                </div>
                <div className="flex justify-between">
                  <span>Receipts:</span>
                  <span className="text-[#34D399]">Digital SMS / Email Dispatch</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 5: PASSENGER LOCATION SHARING WITH PRIVACY OPTION
         ======================================================== */}
      {activeTab === 'passenger_privacy' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)] p-4 rounded-[18px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C] text-[#08201C] uppercase">
                Enhancement Module
              </span>
              <h2 className="text-sm font-heading font-bold text-[var(--text)]">
                Passenger Live Location Sharing vs Non-Sharing Privacy Setting
              </h2>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              UK GDPR Compliant • Zero Telemetry Retention
            </div>
          </div>

          {privacySavedNotice && (
            <div className="bg-[#34D399]/20 border border-[#34D399] text-[#34D399] p-3 rounded-[14px] font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Location preference updated and synchronized across customer booking &amp; tracking sessions.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OPTION A: PRECISE LIVE GPS */}
            <div
              onClick={() => {
                setPrivacySetting(prev => ({
                  ...prev,
                  mode: 'precise_live_gps',
                  explanation: 'Share real-time GPS telemetry with driver during pickup window for precision kerbside navigation.'
                }));
                setPrivacySavedNotice(true);
                setTimeout(() => setPrivacySavedNotice(false), 3000);
              }}
              className={`nr-card p-6 space-y-4 cursor-pointer transition border-2 ${
                privacySetting.mode === 'precise_live_gps'
                  ? 'border-[#B6F23C] bg-[var(--surface)] ring-2 ring-[#B6F23C]/30 shadow-lime-glow'
                  : 'border-[var(--border)] hover:border-[var(--border)]/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-[16px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                {privacySetting.mode === 'precise_live_gps' && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B6F23C] text-[#08201C]">
                    ACTIVE SELECTION ✓
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-heading font-extrabold text-[var(--text)]">
                  Option A: Share Precise Live GPS with Driver
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Streams high-accuracy GPS telemetry (within 5 metres) to the driver app only while your driver is en route and during pickup.
                </p>
              </div>

              <div className="space-y-2 bg-[var(--surface-2)] p-4 rounded-[14px] text-xs">
                <div className="flex items-center gap-2 text-[#34D399] font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Real-time kerbside walking guidance</span>
                </div>
                <div className="flex items-center gap-2 text-[#34D399] font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Driver sees if you are crossing the road or at an airport barrier</span>
                </div>
                <div className="flex items-center gap-2 text-[#34D399] font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Auto-calibrates walking distance &amp; wait time</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Recommended for busy airports, crowded train stations, and large event venues.
              </span>
            </div>

            {/* OPTION B: PRIVACY MODE (NON-SHARING) */}
            <div
              onClick={() => {
                setPrivacySetting(prev => ({
                  ...prev,
                  mode: 'privacy_fixed_pin',
                  explanation: 'Driver navigates only to your booked street address or postcode pin. Zero device GPS telemetry transmitted.'
                }));
                setPrivacySavedNotice(true);
                setTimeout(() => setPrivacySavedNotice(false), 3000);
              }}
              className={`nr-card p-6 space-y-4 cursor-pointer transition border-2 ${
                privacySetting.mode === 'privacy_fixed_pin'
                  ? 'border-[#FF9F6B] bg-[var(--surface)] ring-2 ring-[#FF9F6B]/30'
                  : 'border-[var(--border)] hover:border-[var(--border)]/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-[16px] bg-[#FF9F6B]/20 text-[#FF9F6B] flex items-center justify-center shrink-0">
                  <EyeOff className="w-6 h-6" />
                </div>
                {privacySetting.mode === 'privacy_fixed_pin' && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF9F6B] text-[#08201C]">
                    ACTIVE SELECTION ✓
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-heading font-extrabold text-[var(--text)]">
                  Option B: Privacy Mode (Do Not Share GPS)
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Driver navigates strictly to your booked pickup address and postcode pin. No background or device GPS telemetry is ever requested or transmitted.
                </p>
              </div>

              <div className="space-y-2 bg-[var(--surface-2)] p-4 rounded-[14px] text-xs">
                <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#3FE0C5] shrink-0" />
                  <span>Maximum privacy — no mobile telemetry shared</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#3FE0C5] shrink-0" />
                  <span>Driver waits at exact booked pin/doorstep</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#3FE0C5] shrink-0" />
                  <span>Zero battery consumption on passenger phone</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Ideal for executive privacy, discreet transfers, or residential pickups.
              </span>
            </div>

          </div>

          {/* Privacy & GDPR Assurance Box */}
          <div className="nr-card p-5 space-y-2 border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[var(--text)]">
              <Shield className="w-4 h-4 text-[#34D399]" />
              <span>UK Data Protection &amp; GDPR Guarantee</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {privacySetting.gdprCompliantNotice}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

