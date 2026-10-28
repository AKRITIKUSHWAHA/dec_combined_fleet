import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  PhoneCall, 
  ArrowLeft, 
  RotateCcw,
  User,
  ShieldX,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { 
  mockCustomerTrackingData, 
  mockExpiredTrackingData 
} from '../../data/mockDataPhase12';
import { CustomerTrackingData } from '../../types/phase12';

export const CustomerTrackingPage: React.FC = () => {
  const { bookingRef } = useParams<{ bookingRef?: string }>();

  // State toggle to demonstrate normal tracking vs EXPIRED state
  const [isExpiredSimulation, setIsExpiredSimulation] = useState<boolean>(() => {
    return bookingRef?.toLowerCase().includes('expired') || false;
  });

  // Enhancement: Passenger Live GPS Location Sharing vs Non-Sharing Privacy Setting
  const [isGpsSharingActive, setIsGpsSharingActive] = useState<boolean>(true);
  const [sharingToast, setSharingToast] = useState<string | null>(null);

  const toggleGpsSharing = () => {
    const next = !isGpsSharingActive;
    setIsGpsSharingActive(next);
    setSharingToast(next ? 'Live GPS telemetry sharing with driver Tariq is now ON' : 'Privacy Mode: Live GPS sharing disabled. Driver will navigate to booked pin.');
    setTimeout(() => setSharingToast(null), 3500);
  };

  const tracking: CustomerTrackingData = isExpiredSimulation 
    ? mockExpiredTrackingData 
    : mockCustomerTrackingData;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Top Header & Simulation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <Link to="/book" className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Booking Portal</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Live Journey Tracking</span>
            <span className="font-mono text-sm bg-[var(--surface-2)] text-[#3FE0C5] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
              {tracking.bookingRef}
            </span>
          </h1>
        </div>

        {/* Toggle to demonstrate Requirement 2: Shows an expired state */}
        <div className="flex items-center gap-2 bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] self-start sm:self-auto">
          <span className="text-[11px] font-heading font-semibold text-[var(--text-muted)] pl-2">Session State:</span>
          <button
            type="button"
            onClick={() => setIsExpiredSimulation(false)}
            className={`px-2.5 py-1 rounded-[8px] text-[11px] font-heading font-bold transition ${
              !isExpiredSimulation ? 'bg-[#34D399] text-[#08201C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Live Active
          </button>
          <button
            type="button"
            onClick={() => setIsExpiredSimulation(true)}
            className={`px-2.5 py-1 rounded-[8px] text-[11px] font-heading font-bold transition ${
              isExpiredSimulation ? 'bg-[#FF5D6C] text-white' : 'text-[var(--text-muted)]'
            }`}
          >
            Expired Link
          </button>
        </div>
      </div>

      {/* EXPIRED STATE (Requirement 2: Expiring link, shows an expired state) */}
      {isExpiredSimulation ? (
        <div className="nr-card p-8 sm:p-10 text-center space-y-5 border-2 border-[#FF5D6C]/40 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#FF5D6C]/20 text-[#FF5D6C] flex items-center justify-center mx-auto border-2 border-[#FF5D6C]">
            <ShieldX className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="chip-blocked px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-block">
              Session Link Expired
            </span>
            <h2 className="text-2xl font-heading font-extrabold text-[var(--text)]">
              Tracking Link No Longer Active
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              In accordance with UK Passenger Data Security &amp; Driver Safety Policy, live tracking sessions automatically terminate 60 minutes after journey completion.
            </p>
          </div>

          <div className="bg-[var(--surface-2)] p-4 rounded-[14px] border border-[var(--border)] max-w-md mx-auto text-xs space-y-1.5 text-left">
            <div className="flex justify-between font-mono">
              <span className="text-[var(--text-muted)]">Booking Reference:</span>
              <span className="font-bold text-[var(--text)]">{tracking.bookingRef}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[var(--text-muted)]">Journey Route:</span>
              <span className="font-bold text-[var(--text)]">Dunstable &rarr; Luton Hospital</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[var(--text-muted)]">Link Invalidation:</span>
              <span className="text-[#FF5D6C] font-semibold">28/10/2026 14:00 (Post-Completion)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:01582999888"
              className="btn-primary w-full sm:w-auto !min-h-[44px] !px-6 !text-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 24/7 Dispatch Desk (01582 999 888)</span>
            </a>

            <button
              type="button"
              onClick={() => setIsExpiredSimulation(false)}
              className="btn-secondary w-full sm:w-auto !min-h-[44px] !px-4 !text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>View Active Session</span>
            </button>
          </div>
        </div>
      ) : (

        /* LIVE ACTIVE TRACKING VIEW (Own booking only) */
        <div className="space-y-5">
          
          {/* Status Progress Banner */}
          <div className="nr-card p-6 space-y-5 border border-[var(--border)]">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#3FE0C5] font-bold uppercase tracking-wider block">
                  Live Dispatch Telematics
                </span>
                <h2 className="text-xl font-heading font-bold text-[var(--text)] mt-0.5">
                  Driver {tracking.driverFirstName} is En Route
                </h2>
                <p className="text-xs text-[var(--text-muted)]">{tracking.liveStatusText}</p>
              </div>

              {/* ETA Display */}
              <div className="bg-[var(--surface-2)] p-3 rounded-[16px] border border-[var(--border)] text-center sm:text-right shrink-0">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Estimated Arrival
                </span>
                <span className="text-3xl font-mono font-extrabold text-[#34D399] block leading-none mt-1">
                  {tracking.currentEtaMinutes} mins
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-1">
                  {tracking.distanceRemainingMiles} miles away
                </span>
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              {[
                { label: 'Allocated', done: true },
                { label: 'En Route', active: true },
                { label: 'Arrived', pending: true },
                { label: 'On Board', pending: true }
              ].map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className={`h-2 rounded-full transition-all ${
                    step.done ? 'bg-[#34D399]' : step.active ? 'bg-[#B6F23C] shadow-lime-glow animate-pulse' : 'bg-[var(--surface-2)]'
                  }`} />
                  <span className={`text-[10px] font-heading font-semibold block ${
                    step.active ? 'text-[#B6F23C] font-bold' : step.done ? 'text-[#34D399]' : 'text-[var(--text-muted)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Vehicle & Driver Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[var(--surface-2)] rounded-[16px] border border-[var(--border)] text-xs">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center font-heading font-extrabold text-base border border-[#B6F23C]/40">
                  {tracking.driverFirstName.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">Your Allocated Driver</span>
                  <span className="font-heading font-bold text-sm text-[var(--text)] block">{tracking.driverFirstName}</span>
                  <span className="text-[11px] text-[#34D399] font-semibold">Enhanced DBS &amp; Council Cleared</span>
                </div>
              </div>

              <div className="space-y-1 sm:border-l sm:border-[var(--border)] sm:pl-4">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">Vehicle Specification</span>
                <div className="font-heading font-bold text-sm text-[var(--text)] flex items-center gap-2">
                  <span>{tracking.vehicleMakeModel}</span>
                  <span className="font-mono bg-[var(--surface)] text-[var(--text)] px-2 py-0.5 rounded border border-[var(--border)] text-xs">
                    {tracking.vehicleReg}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] block">Colour: {tracking.vehicleColor}</span>
              </div>

            </div>

            {/* Simulated Live Route Map Representation */}
            <div className="h-44 bg-[var(--surface-2)] rounded-[16px] border border-[var(--border)] relative overflow-hidden flex flex-col items-center justify-center p-4 text-center space-y-2">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3FE0C5_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-center gap-8">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#B6F23C] text-[#08201C] flex items-center justify-center mx-auto shadow-lime-glow animate-bounce">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[var(--text)] block">Tariq ({tracking.vehicleReg})</span>
                </div>

                <div className="w-24 sm:w-40 border-t-2 border-dashed border-[#3FE0C5]" />

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#3FE0C5]/20 text-[#3FE0C5] flex items-center justify-center mx-auto border border-[#3FE0C5]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[var(--text)] block">Pick-Up Station</span>
                </div>
              </div>

              <div className="relative z-10 text-[11px] font-mono text-[var(--text-muted)]">
                Live telematics updated 4 seconds ago • Heading South on A505
              </div>
            </div>

            {/* Toast notice for location sharing toggle */}
            {sharingToast && (
              <div className="p-3 rounded-[12px] bg-[#34D399]/20 border border-[#34D399] text-[#34D399] font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{sharingToast}</span>
              </div>
            )}

            {/* Enhancement: Passenger Live GPS Location Sharing vs Non-Sharing Option */}
            <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/40 uppercase">
                    Enhancement
                  </span>
                  <span className="font-heading font-bold text-xs text-[var(--text)]">
                    Passenger Kerbside Location Sharing
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleGpsSharing}
                  className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                    isGpsSharingActive
                      ? 'bg-[#34D399] text-[#08201C]'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                  }`}
                >
                  {isGpsSharingActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isGpsSharingActive ? 'SHARING LIVE GPS (5m)' : 'PRIVACY MODE (PIN ONLY)'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {isGpsSharingActive
                  ? 'Your live GPS location is being streamed to driver Tariq to help them identify your exact kerbside position at pickup. This stream auto-expires when you board.'
                  : 'Privacy mode active: Driver Tariq will only see your booked street address pin. Your phone’s live device location will not be broadcast.'}
              </p>
            </div>

            {/* Route Points */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3FE0C5] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block font-semibold uppercase">Pick-Up Location</span>
                  <span className="font-heading font-semibold text-[var(--text)]">{tracking.pickupAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-[var(--border)]">
                <Navigation className="w-4 h-4 text-[#FF9F6B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block font-semibold uppercase">Destination Drop-Off</span>
                  <span className="font-heading font-semibold text-[var(--text)]">{tracking.destinationAddress}</span>
                </div>
              </div>
            </div>

            {/* Security and Expiring Link Notice (Requirement 2) */}
            <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--text)]">Expiring Link Security Notice: </span>
                <span>{tracking.linkExpiryNotice}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

