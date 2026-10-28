import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockAirportBookings } from '../data/mockDataPhase9';
import { AirportFlightBooking } from '../types/phase9';
import { 
  Plane, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  Luggage, 
  Car, 
  ShieldAlert, 
  ArrowRightLeft, 
  Sparkles,
  Sliders,
  RefreshCw,
  Calendar,
  Building,
  Check
} from 'lucide-react';

export const AirportExecutivePage: React.FC = () => {
  const { currentRole } = useRole();
  const [bookings, setBookings] = useState<AirportFlightBooking[]>(mockAirportBookings);
  const [selectedBooking, setSelectedBooking] = useState<AirportFlightBooking>(mockAirportBookings[0]);
  const [showClashResolverModal, setShowClashResolverModal] = useState(false);
  const [bufferSlider, setBufferSlider] = useState<number>(selectedBooking.landingBufferMinutes || 45);
  const [clashResolved, setClashResolved] = useState(false);

  // Recalculate agreed collection time based on buffer slider
  const handleBufferChange = (newBuffer: number) => {
    setBufferSlider(newBuffer);
    const [hours, mins] = selectedBooking.actualLanding.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + newBuffer;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    const formatted = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    
    setSelectedBooking(prev => ({
      ...prev,
      landingBufferMinutes: newBuffer,
      agreedCollectionTime: formatted
    }));
  };

  const handleRecheckDriverClash = () => {
    setClashResolved(true);
    setShowClashResolverModal(false);
    setSelectedBooking(prev => ({
      ...prev,
      hasClashWithSchoolRun: false,
      assignedDriverName: 'David Vance (Reallocated)'
    }));
  };

  return (
    <div className="space-y-5">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#3FE0C5]" />
            <span>Airport &amp; Executive Chauffeur Dispatch</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Live Radar Feeds
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Flight tracking, scheduled vs actual landing, collection buffers, school run clash warnings, meet &amp; greet nameboards, and chauffeur hourly bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)] hidden md:inline">
            London LTN • LHR • LGW • STN
          </span>
          <button
            onClick={() => alert('Radar API pings verified: Flight stats synced with Heathrow and Luton radar streams.')}
            className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll Live Radar</span>
          </button>
        </div>
      </div>

      {/* Flight Delay Alert Banner (Clash Detection with School Runs) */}
      {selectedBooking.hasClashWithSchoolRun && !clashResolved && (
        <div className="p-4 rounded-[18px] bg-[#FF5D6C]/15 border-2 border-[#FF5D6C] text-xs text-[var(--text)] space-y-3 animate-in fade-in duration-200 shadow-coral-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-9 h-9 rounded-[12px] bg-[#FF5D6C] text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-[#FF5D6C]">
                  CRITICAL DISPATCH CLASH: Flight {selectedBooking.flightNumber} Delayed by +{selectedBooking.flightDelayMinutes} min!
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Actual landing pushed to <strong className="text-[var(--text)]">{selectedBooking.actualLanding}</strong> (agreed pickup <strong className="text-[var(--text)]">{selectedBooking.agreedCollectionTime}</strong>).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowClashResolverModal(true)}
              className="btn-danger !text-xs !py-2 !px-4 !min-h-[40px] shrink-0 font-heading font-bold shadow-md"
            >
              Recheck Driver Availability &amp; Reallocate
            </button>
          </div>

          <div className="p-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-[var(--text-muted)] block">Conflict Duty:</span>
              <span className="font-bold text-[var(--text)]">{selectedBooking.clashDetails?.schoolRouteName}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Allocated Staff:</span>
              <span className="font-bold text-[#FF9F6B]">{selectedBooking.assignedDriverName} (Driver)</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Clash Timing:</span>
              <span className="font-bold text-[#FF5D6C]">
                Starts {selectedBooking.clashDetails?.schoolRunStartTime} ({selectedBooking.clashDetails?.clashOverlapMinutes}m overlap)
              </span>
            </div>
          </div>
        </div>
      )}

      {clashResolved && (
        <div className="p-3.5 rounded-[14px] bg-[#34D399]/15 border border-[#34D399]/40 text-xs text-[#065F46] dark:text-[#34D399] flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>Driver conflict resolved! Driver David Vance reallocated to Airport Run. Tariq Mahmood safeguarded for PM School Run.</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#34D399]/20 px-2 py-0.5 rounded">CLEARED</span>
        </div>
      )}

      {/* Main Grid: Left Airport Queue, Right Selected Flight Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Airport Run Cards (4 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Scheduled Airport Arrivals ({bookings.length})
            </span>
            <span className="text-[10px] font-mono text-[#3FE0C5]">Buffer Rules Active</span>
          </div>

          {bookings.map((b) => {
            const isSelected = selectedBooking.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBooking(b);
                  setBufferSlider(b.landingBufferMinutes);
                }}
                className={`nr-card p-4 cursor-pointer transition-all duration-180 border ${
                  isSelected
                    ? 'border-[#3FE0C5] shadow-aqua-glow bg-[var(--surface-2)]/80'
                    : 'hover:border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-[var(--text)]">
                      {b.flightNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      b.flightStatus === 'Delayed'
                        ? 'bg-[#FF5D6C]/20 text-[#FF5D6C] border border-[#FF5D6C]/40 animate-pulse'
                        : 'bg-[#34D399]/20 text-[#34D399]'
                    }`}>
                      {b.flightStatus} {b.flightDelayMinutes > 0 ? `+${b.flightDelayMinutes}m` : ''}
                    </span>
                  </div>

                  <span className="text-xs font-heading font-bold text-[#3FE0C5]">
                    £{b.totalGbp.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  {b.airport} • {b.terminal}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[var(--border)] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Landing:</span>
                    <span className="text-[var(--text)] font-bold">{b.actualLanding}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Agreed Pickup:</span>
                    <span className="text-[#B6F23C] font-bold">{b.agreedCollectionTime}</span>
                  </div>
                </div>

                {b.hasClashWithSchoolRun && !clashResolved && (
                  <div className="mt-2 text-[10px] text-[#FF5D6C] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>School Run Conflict Detected</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Booking Dossier & Interactive Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="nr-card p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/40">
                    {selectedBooking.vehicleCategory.toUpperCase()} CHAUFFEUR
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Ref: {selectedBooking.bookingRef}
                  </span>
                </div>
                <h2 className="text-xl font-heading font-bold text-[var(--text)] mt-1">
                  {selectedBooking.flightNumber} • {selectedBooking.airline}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">Agreed Terminal Meeting:</span>
                <span className="text-xl font-heading font-black text-[#B6F23C] font-mono">
                  {selectedBooking.agreedCollectionTime}
                </span>
              </div>
            </div>

            {/* Landing vs Collection Time Breakdown (Requirement 1) */}
            <div className="bg-[var(--surface-2)] p-4 rounded-[16px] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#3FE0C5]" />
                  <span>Landing Buffer Adjustment (Customs, Immigration &amp; Luggage)</span>
                </span>
                <span className="font-mono font-bold text-[#3FE0C5]">+{bufferSlider} Minutes</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={bufferSlider}
                onChange={(e) => handleBufferChange(Number(e.target.value))}
                className="w-full accent-[#B6F23C] cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Scheduled Touchdown</span>
                  <span className="font-bold text-[var(--text)]">{selectedBooking.scheduledLanding}</span>
                </div>
                <div className="p-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Radar Touchdown</span>
                  <span className={`font-bold ${selectedBooking.flightStatus === 'Delayed' ? 'text-[#FF5D6C]' : 'text-[var(--text)]'}`}>
                    {selectedBooking.actualLanding}
                  </span>
                </div>
                <div className="p-2 rounded-[10px] bg-[var(--surface)] border border-[#B6F23C]/50 shadow-xs">
                  <span className="text-[10px] text-[var(--text-muted)] block">Agreed Passenger Pickup</span>
                  <span className="font-bold text-[#B6F23C]">{selectedBooking.agreedCollectionTime}</span>
                </div>
              </div>
            </div>

            {/* Meet-and-Greet Nameboard Card */}
            {selectedBooking.meetAndGreet.enabled && (
              <div className="p-4 rounded-[16px] border border-[#B6F23C]/40 bg-[var(--surface)] space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B6F23C]" />
                    <span>Digital Airport Nameboard &amp; Paging Specimen</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#34D399]">DRIVER PAGING ACTIVE</span>
                </div>

                {/* Nameboard Box Simulation */}
                <div className="bg-[#08201C] text-[#EAF7F2] p-5 rounded-[14px] border-2 border-[#B6F23C] text-center shadow-lg space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8FB5AA]">
                    DEC VIP CHAUFFEURS • {selectedBooking.airport}
                  </p>
                  <p className="text-xl sm:text-2xl font-heading font-extrabold text-[#B6F23C] tracking-wide py-1">
                    {selectedBooking.meetAndGreet.nameboardText}
                  </p>
                  <p className="text-xs text-[#EAF7F2] font-mono">
                    Meeting At: <strong className="text-white">{selectedBooking.meetAndGreet.meetPoint}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Linked Return Journey & Chauffeur Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              {/* Linked Return Journey */}
              <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#3FE0C5]" />
                    <span>Linked Return Leg</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#34D399]">PAIRED</span>
                </div>
                {selectedBooking.hasLinkedReturn ? (
                  <div>
                    <p className="text-[11px] font-mono text-[var(--text)]">
                      Return Ref: <strong className="text-[#3FE0C5]">{selectedBooking.linkedReturnRef}</strong>
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                      Pickup: {selectedBooking.returnPickupTime}
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={() => alert('One-click Return Leg Generated! Return reference paired with this outbound booking.')}
                    className="btn-secondary !text-xs !py-1 !px-2.5 !min-h-[32px] w-full mt-1"
                  >
                    + Generate Linked Return Leg
                  </button>
                )}
              </div>

              {/* Chauffeur Booking Specification */}
              <div className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#FF9F6B]" />
                    <span>Chauffeur Booking Mode</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#FF9F6B]/20 text-[#FF9F6B] px-1.5 py-0.2 rounded font-bold">
                    {selectedBooking.chauffeurDetails?.bookingType || 'By Journey'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] space-y-0.5">
                  <p>Included: <strong className="text-[var(--text)]">{selectedBooking.chauffeurDetails?.includedMileage || 40} miles</strong></p>
                  <p>Overtime: <strong className="text-[var(--text)]">£{selectedBooking.chauffeurDetails?.overtimeRatePerHour || 45}/hr</strong> beyond schedule</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Clash Resolver Dialog Modal */}
      {showClashResolverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#FF5D6C]/20 text-[#FF5D6C] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Resolve Driver Schedule Clash
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Protect Council SEN Run &bull; Reallocate Airport Run
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-2">
              <p className="text-[var(--text)] leading-relaxed">
                Flight <strong>BA 2490</strong> was delayed by 85 minutes. Driver <strong>Tariq Mahmood</strong> is contracted to start <strong>The Chiltern School SEN Run</strong> at 15:30.
              </p>
              <div className="p-2 rounded-[8px] bg-[var(--surface)] text-[11px] font-mono text-[#FF9F6B]">
                Suggested Alternative: <strong>David Vance (Executive E-Class BP23 ZXC)</strong> is currently waiting at Luton Airport holding bay and has 0 conflicts.
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowClashResolverModal(false)}
                className="btn-ghost flex-1 !text-xs !min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleRecheckDriverClash}
                className="btn-primary flex-1 !text-xs !min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Reallocation to David Vance</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AirportExecutivePage;

