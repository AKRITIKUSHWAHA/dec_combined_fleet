import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  Volume2,
  VolumeX,
  Phone,
  ShieldAlert,
  ArrowLeft,
  CreditCard,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Sparkles,
  ChevronRight,
  Split,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { initialCarPlayNavState, initialDestinationModeConfig, initialSplitPaymentSession } from '../data/mockDataPhase13';
import { CarPlayNavState, SplitPaymentSession } from '../types/phase13';

export const DriverCarPlayCockpitPage: React.FC = () => {
  const [navState, setNavState] = useState<CarPlayNavState>(initialCarPlayNavState);
  const [jobState, setJobState] = useState<'en_route' | 'arrived' | 'pob' | 'completed'>('en_route');
  const [isDestinationModeOn, setIsDestinationModeOn] = useState(false);
  const [showPaymentTerminal, setShowPaymentTerminal] = useState(false);
  const [terminalStep, setTerminalStep] = useState<'idle' | 'processing' | 'approved'>('idle');
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [cockpitToast, setCockpitToast] = useState<string | null>(null);

  // Speedometer simulation jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setNavState(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const newSpeed = Math.min(34, Math.max(25, prev.currentMph + delta));
        return { ...prev, currentMph: newSpeed };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setCockpitToast(msg);
    setTimeout(() => setCockpitToast(null), 3500);
  };

  const handleNextJobState = () => {
    if (jobState === 'en_route') {
      setJobState('arrived');
      triggerToast('Status Updated: ARRIVED AT PICKUP POINT');
    } else if (jobState === 'arrived') {
      setJobState('pob');
      triggerToast('Status Updated: PASSENGER ON BOARD (POB)');
    } else if (jobState === 'pob') {
      setJobState('completed');
      triggerToast('JOB COMPLETED! Ready for next assignment.');
    } else {
      setJobState('en_route');
      triggerToast('New Job Accepted: Next Pickup Loaded.');
    }
  };

  const handleSimulateCardTap = () => {
    setTerminalStep('processing');
    setTimeout(() => {
      setTerminalStep('approved');
      triggerToast('PAYMENT APPROVED: £56.00 contactless auth code AUTH-9430');
      setTimeout(() => {
        setShowPaymentTerminal(false);
        setTerminalStep('idle');
      }, 2500);
    }, 1500);
  };

  const isOverSpeed = navState.currentMph > navState.speedLimitMph;

  return (
    <div className="w-full bg-[#051412] text-[#EAF7F2] select-none p-3 sm:p-5 flex flex-col justify-between font-sans overflow-x-hidden rounded-[28px] border border-[#24574D] shadow-2xl">
      
      {/* Toast banner */}
      {cockpitToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#B6F23C] text-[#08201C] font-heading font-extrabold px-6 py-3 rounded-full shadow-2xl text-center text-sm sm:text-base border-2 border-white animate-bounce">
          {cockpitToast}
        </div>
      )}

      {/* TOP BAR: CarPlay HUD header with Exit, Time, Status, and Speed Limit */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F2F29] border border-[#24574D] rounded-[24px] px-4 py-3 shadow-xl">
        
        {/* Left: Exit / Switch View + Mode Tag */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            to="/driver-cockpit"
            className="h-12 sm:h-14 px-3 sm:px-4 rounded-[16px] bg-[#164038] hover:bg-[#24574D] border border-[#24574D] flex items-center gap-2 text-xs font-heading font-bold text-[#EAF7F2] transition active:scale-95"
            title="Switch back to Driver Mobile Phone Portrait View"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#B6F23C]" />
            <span>Mobile Phone View</span>
          </Link>

          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#B6F23C]/20 text-[#B6F23C] border border-[#B6F23C]/40 uppercase tracking-wider items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CarPlay Cockpit (Landscape In-Car Display)</span>
          </span>
        </div>

        {/* Center: Destination mode status */}
        <button
          type="button"
          onClick={() => {
            setIsDestinationModeOn(!isDestinationModeOn);
            triggerToast(isDestinationModeOn ? 'Destination Mode DISABLED' : 'Destination Mode ACTIVE: Filtering rides towards Bedford MK40');
          }}
          className={`h-12 sm:h-14 px-3 sm:px-4 rounded-[16px] border flex items-center gap-2.5 transition active:scale-95 ${
            isDestinationModeOn
              ? 'bg-[#3FE0C5]/20 border-[#3FE0C5] text-[#3FE0C5]'
              : 'bg-[#164038] border-[#24574D] text-[#8FB5AA] hover:text-[#EAF7F2]'
          }`}
        >
          <Compass className={`w-4 h-4 sm:w-5 sm:h-5 ${isDestinationModeOn ? 'animate-spin' : ''}`} />
          <div className="text-left hidden md:block">
            <span className="text-[10px] font-mono block uppercase leading-none">Destination Mode</span>
            <span className="text-xs font-bold leading-none">{isDestinationModeOn ? 'Heading to MK40 3EA' : 'Off (Accept All)'}</span>
          </div>
        </button>

        {/* Right: Telematics & Speed Limit Instrument */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* UK Road Speed Limit Circle */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-4 border-[#FF5D6C] flex flex-col items-center justify-center text-slate-900 shadow-md shrink-0">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold leading-none">LIMIT</span>
            <span className="text-sm sm:text-base font-extrabold font-mono leading-tight">{navState.speedLimitMph}</span>
          </div>

          {/* Live GPS Speedometer */}
          <div className={`h-12 sm:h-14 px-3 sm:px-4 rounded-[18px] border flex flex-col justify-center items-center shrink-0 ${
            isOverSpeed 
              ? 'bg-[#FF5D6C]/20 border-[#FF5D6C] text-[#FF5D6C] animate-pulse'
              : 'bg-[#164038] border-[#24574D] text-[#34D399]'
          }`}>
            <span className="text-lg sm:text-xl font-mono font-black tracking-tight leading-none">
              {navState.currentMph}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#8FB5AA]">
              MPH GPS
            </span>
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION: Large Navigation Guidance Card */}
      <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Giant Turn Guidance Panel (Col 8) */}
        <div className="md:col-span-8 bg-[#0F2F29] border border-[#24574D] rounded-[28px] p-5 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B6F23C]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Navigation Instruction */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[#8FB5AA] text-xs font-mono uppercase tracking-wider">
              <span>Next Maneuver in {navState.distanceToTurnMeters}m</span>
              <span className="text-[#3FE0C5] font-bold">ETA {navState.estimatedArrival} ({navState.remainingMinutes}m remaining)</span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-[20px] bg-[#B6F23C] text-[#08201C] flex items-center justify-center shrink-0 shadow-lg shadow-[#B6F23C]/20">
                <Navigation className="w-8 h-8 sm:w-12 sm:h-12 rotate-45 transform" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-heading font-black text-[#EAF7F2] tracking-tight">
                  {navState.nextInstruction}
                </h1>
                <p className="text-xs sm:text-base text-[#8FB5AA] font-mono">
                  Currently on: <strong className="text-[#EAF7F2]">{navState.currentStreet}</strong> → onto <strong className="text-[#3FE0C5]">{navState.nextStreet}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Current Job Badge */}
          <div className="mt-6 pt-4 border-t border-[#24574D] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#34D399] animate-ping" />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#34D399]">
                Active Ride: DEC-2026-881 • Luton Airport T1 → Cambridge
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNavState(prev => ({ ...prev, isVoiceMuted: !prev.isVoiceMuted }))}
                className="h-10 sm:h-12 px-3 rounded-[14px] bg-[#164038] hover:bg-[#24574D] border border-[#24574D] flex items-center gap-2 text-xs font-semibold text-[#EAF7F2]"
              >
                {navState.isVoiceMuted ? <VolumeX className="w-4 h-4 text-[#FF5D6C]" /> : <Volume2 className="w-4 h-4 text-[#3FE0C5]" />}
                <span>{navState.isVoiceMuted ? 'Muted' : 'Voice ON'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Driver In-Cab Action Buttons (Col 4) */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
          
          {/* Contactless / Split Payment Button */}
          <button
            type="button"
            onClick={() => setShowPaymentTerminal(true)}
            className="h-20 lg:h-24 bg-[#164038] hover:bg-[#24574D] border-2 border-[#3FE0C5]/40 hover:border-[#3FE0C5] rounded-[24px] p-4 flex items-center justify-between transition active:scale-95 text-left group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-[#3FE0C5]/20 text-[#3FE0C5] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-[#3FE0C5] block font-bold">In-Cab Terminal</span>
                <span className="text-sm font-heading font-extrabold text-[#EAF7F2] block">Split &amp; Contactless</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8FB5AA] group-hover:text-white" />
          </button>

          {/* Passenger Call Direct Button */}
          <a
            href="tel:07700900122"
            className="h-20 lg:h-24 bg-[#164038] hover:bg-[#24574D] border border-[#24574D] rounded-[24px] p-4 flex items-center justify-between transition active:scale-95 text-left group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-[#FF9F6B]/20 text-[#FF9F6B] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-[#8FB5AA] block">Call Passenger</span>
                <span className="text-sm font-heading font-extrabold text-[#EAF7F2] block">Liam Henderson</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#34D399] font-bold">Direct Line</span>
          </a>

          {/* Emergency SOS Pulse Button */}
          <button
            type="button"
            onClick={() => {
              setEmergencyAlertActive(!emergencyAlertActive);
              triggerToast(emergencyAlertActive ? 'Emergency Stand-Down Sent' : 'EMERGENCY DISPATCH CAD ALERT BROADCAST TO BASE & 999');
            }}
            className={`h-20 lg:h-24 rounded-[24px] p-4 flex items-center justify-between transition active:scale-95 text-left shadow-lg ${
              emergencyAlertActive
                ? 'bg-[#FF5D6C] text-white animate-pulse'
                : 'bg-[#FF5D6C]/15 border-2 border-[#FF5D6C]/40 hover:border-[#FF5D6C] text-[#FF5D6C]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-[#FF5D6C] text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase block font-bold">Emergency Alert</span>
                <span className="text-sm font-heading font-extrabold block">
                  {emergencyAlertActive ? 'ACTIVE SOS PULSING' : 'Tap for Emergency'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-black uppercase">SOS</span>
          </button>

        </div>

      </div>

      {/* BOTTOM SECTION: GIANT 80PX+ SLIDE / ADVANCE JOB FLOW BUTTON */}
      <div className="bg-[#0F2F29] border border-[#24574D] rounded-[28px] p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-left">
              <span className="text-xs font-mono uppercase text-[#8FB5AA] block font-bold">Current Phase</span>
              <span className="text-lg font-heading font-black text-[#EAF7F2] capitalize">
                {jobState === 'en_route' && '1. En Route to Pickup'}
                {jobState === 'arrived' && '2. Waiting at Pickup (Arrived)'}
                {jobState === 'pob' && '3. In Transit with Passenger'}
                {jobState === 'completed' && '4. Fare Cleared & Complete'}
              </span>
            </div>
          </div>

          {/* Large 80px Action Button */}
          <button
            type="button"
            onClick={handleNextJobState}
            className={`w-full sm:w-auto min-h-[72px] sm:min-h-[80px] px-6 sm:px-12 rounded-[22px] font-heading font-extrabold text-base sm:text-xl flex items-center justify-center gap-3 sm:gap-4 transition active:scale-95 shadow-2xl text-center ${
              jobState === 'en_route'
                ? 'bg-gradient-to-r from-[#FFB487] to-[#FF9F6B] text-[#08201C] hover:brightness-105'
                : jobState === 'arrived'
                ? 'bg-gradient-to-r from-[#3FE0C5] to-[#34D399] text-[#08201C] hover:brightness-105'
                : jobState === 'pob'
                ? 'bg-gradient-to-r from-[#C9FF5A] to-[#B6F23C] text-[#08201C] hover:brightness-105 shadow-lime-glow'
                : 'bg-[#164038] text-[#34D399] border-2 border-[#34D399]'
            }`}
          >
            {jobState === 'en_route' && (
              <>
                <MapPin className="w-7 h-7" />
                <span>TAP: ARRIVED AT PICKUP POINT</span>
              </>
            )}
            {jobState === 'arrived' && (
              <>
                <CheckCircle2 className="w-7 h-7" />
                <span>TAP: PASSENGER ON BOARD (POB)</span>
              </>
            )}
            {jobState === 'pob' && (
              <>
                <Check className="w-7 h-7" />
                <span>TAP: COMPLETE &amp; CLEAR JOB (£56.00)</span>
              </>
            )}
            {jobState === 'completed' && (
              <>
                <Sparkles className="w-7 h-7" />
                <span>READY FOR NEXT BROADCAST JOB</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* MODAL: In-Cab Contactless Terminal Simulator */}
      {showPaymentTerminal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F2F29] border-2 border-[#3FE0C5] rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
            
            <button
              type="button"
              onClick={() => setShowPaymentTerminal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#164038] text-[#8FB5AA] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3FE0C5]/20 text-[#3FE0C5] border border-[#3FE0C5]/30">
              <CreditCard className="w-4 h-4" />
              <span>Contactless Terminal / Split Fare Reader</span>
            </div>

            <div>
              <span className="text-xs font-mono text-[#8FB5AA] uppercase tracking-wider block">Total Journey Fare Due</span>
              <span className="text-4xl sm:text-5xl font-mono font-black text-[#B6F23C]">£56.00</span>
              <span className="text-xs text-[#8FB5AA] block mt-1">Includes £4.00 driver tip</span>
            </div>

            {/* Split Breakdown */}
            <div className="bg-[#164038] p-4 rounded-[18px] border border-[#24574D] text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#EAF7F2] pb-1 border-b border-[#24574D]">
                <span>Passenger Split (4 Guests)</span>
                <span className="text-[#3FE0C5]">£14.00 each</span>
              </div>
              <div className="flex justify-between items-center text-[#8FB5AA]">
                <span>1. Liam Henderson</span>
                <span className="text-[#34D399] font-mono font-bold">PAID (Apple Pay) ✓</span>
              </div>
              <div className="flex justify-between items-center text-[#8FB5AA]">
                <span>2. Marcus Vance</span>
                <span className="text-[#34D399] font-mono font-bold">PAID (Contactless) ✓</span>
              </div>
              <div className="flex justify-between items-center text-[#FF9F6B]">
                <span>3. Sophie Chen</span>
                <span className="font-mono font-bold">AWAITING CARD TAP</span>
              </div>
              <div className="flex justify-between items-center text-[#FF9F6B]">
                <span>4. Oliver James</span>
                <span className="font-mono font-bold">AWAITING CARD TAP</span>
              </div>
            </div>

            {/* Terminal Screen Simulation */}
            <div className="bg-[#08201C] border-2 border-dashed border-[#3FE0C5]/50 rounded-[22px] p-6 text-center space-y-3">
              {terminalStep === 'idle' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#3FE0C5]/10 text-[#3FE0C5] flex items-center justify-center mx-auto animate-pulse">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-heading font-extrabold text-[#EAF7F2]">
                    Present Card or Device
                  </h3>
                  <p className="text-xs text-[#8FB5AA]">
                    Hold contactless card, Apple Pay or Google Pay to terminal or insert chip
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateCardTap}
                    className="w-full min-h-[56px] rounded-[16px] bg-[#B6F23C] text-[#08201C] font-heading font-extrabold text-sm hover:brightness-105 active:scale-95 transition"
                  >
                    Simulate Customer NFC Tap (£14.00)
                  </button>
                </>
              )}

              {terminalStep === 'processing' && (
                <div className="py-6 space-y-3">
                  <div className="w-12 h-12 border-4 border-[#3FE0C5] border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-base font-heading font-extrabold text-[#3FE0C5]">Authorising EMV Contactless...</h3>
                  <p className="text-xs text-[#8FB5AA]">Communicating with Barclaycard Merchant Gateway</p>
                </div>
              )}

              {terminalStep === 'approved' && (
                <div className="py-6 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-[#34D399]/20 text-[#34D399] flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-black text-[#34D399]">PAYMENT APPROVED</h3>
                  <p className="text-xs font-mono text-[#8FB5AA]">Auth: AUTH-9430 • Receipt sent via SMS to 07700 900551</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-[#8FB5AA]">
              <span>Merchant: DEC Combined Fleet Ltd</span>
              <span>MID: 8820-1944-01</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

