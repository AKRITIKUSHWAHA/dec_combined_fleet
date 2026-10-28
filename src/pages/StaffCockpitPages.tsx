import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Navigation, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ArrowLeft,
  GraduationCap,
  Wifi,
  WifiOff,
  Clock,
  ShieldAlert,
  Flame,
  Check,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverCockpitPage: React.FC = () => {
  const { bookings, updateJobStatus } = useData();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  
  // Find an active or assigned booking for testing
  const activeJob = bookings.find(b => b.status === 'en_route' || b.status === 'arrived' || b.status === 'pob') || bookings[0];

  const handleJobClearConfirm = () => {
    updateJobStatus(activeJob.id, 'completed');
    setShowClearConfirmModal(false);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12 text-[16px]">
      
      {/* Top Mobile App Navigation Bar */}
      <div 
        style={{ background: 'var(--hero-bg)' }}
        className="flex items-center justify-between text-white p-4 rounded-[20px] shadow-2xl border border-[var(--border)]"
      >
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs font-heading font-semibold text-[#8FB5AA] hover:text-white p-2 focus:outline-none nr-focus rounded-[12px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>

        <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#34D399] flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
          Driver On Duty
        </span>

        {/* Offline Simulator Switch */}
        <button
          onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
          className={`px-3 py-1.5 rounded-[12px] text-xs font-mono font-bold flex items-center gap-1.5 transition ${
            isSimulatedOffline ? 'bg-[#FF5D6C] text-white animate-pulse' : 'bg-[#0F2F29] text-[#8FB5AA] border border-[#24574D]'
          }`}
          title="Toggle network offline mode"
        >
          {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isSimulatedOffline ? 'OFFLINE' : 'ONLINE'}</span>
        </button>
      </div>

      {/* Offline Stored Mode Warning Banner (Requirement CHK-07 & APP-04) */}
      {isSimulatedOffline && (
        <div className="bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 rounded-[18px] p-4 flex items-start gap-3 text-xs text-[#FF5D6C]">
          <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-sm">Offline Stored Queue Active</p>
            <p className="text-[12px] mt-0.5 opacity-90">
              Status changes are safely stored in encrypted local cache. Events will automatically sync with verified timestamps upon reconnection.
            </p>
          </div>
        </div>
      )}

      {emergencyAlertSent && (
        <div className="bg-[#FF5D6C] text-white p-4 rounded-[18px] shadow-coral-glow flex items-center justify-between text-xs font-heading font-bold animate-pulse">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 shrink-0" />
            <span className="text-sm">EMERGENCY DESK NOTIFIED • Controller En Route</span>
          </div>
          <button 
            onClick={() => setEmergencyAlertSent(false)}
            className="text-xs underline opacity-90 p-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Driver Cockpit Main Card */}
      <div className="nr-card p-6 space-y-5">
        
        {/* Job Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B6F23C] block">
              Active Assigned Trip
            </span>
            <h2 className="text-2xl font-heading font-bold text-[var(--text)] mt-0.5">
              {activeJob?.bookingRef}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Assigned Vehicle: <strong className="text-[var(--text)] font-mono text-sm">LT73 XKL</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-heading font-bold text-[#34D399] font-mono tabular-nums">
              £{activeJob?.totalGbp.toFixed(2)}
            </span>
            <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Account Fare</p>
          </div>
        </div>

        {/* Passenger Contact Card */}
        <div className="bg-[var(--surface-2)] p-4 rounded-[18px] flex items-center justify-between border border-[var(--border)]">
          <div>
            <p className="text-base font-heading font-bold text-[var(--text)]">
              {activeJob?.customerName}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {activeJob?.passengerCount} Passengers • {activeJob?.luggageCount} Luggage
            </p>
          </div>
          <a
            href={`tel:${activeJob?.customerPhone}`}
            className="w-12 h-12 rounded-[14px] bg-[#B6F23C] text-[#08201C] flex items-center justify-center shadow-lime-glow hover:scale-105 active:scale-95 transition-all nr-focus"
            aria-label="Call passenger"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Journey Postcodes & Route */}
        <div className="space-y-4 py-1">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#34D399]/20 flex items-center justify-center text-[#34D399] shrink-0 mt-0.5 border border-[#34D399]/40">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-[var(--text-muted)] uppercase text-[10px] tracking-wider">Pickup Location</p>
              <p className="font-medium text-[var(--text)] text-sm mt-0.5">{activeJob?.pickupAddress}</p>
              <p className="font-mono text-xs text-[#3FE0C5] font-bold">{activeJob?.pickupPostcode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#FF5D6C]/20 flex items-center justify-center text-[#FF5D6C] shrink-0 mt-0.5 border border-[#FF5D6C]/40">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-[var(--text-muted)] uppercase text-[10px] tracking-wider">Destination</p>
              <p className="font-medium text-[var(--text)] text-sm mt-0.5">{activeJob?.destinationAddress}</p>
              <p className="font-mono text-xs text-[#3FE0C5] font-bold">{activeJob?.destinationPostcode}</p>
            </div>
          </div>
        </div>

        {/* Big 4 Driver Touch Workflow Buttons (JOB-NEW-01) with distinct colors */}
        <div className="pt-2 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] text-[11px]">
              Tap to Advance Status:
            </span>
            <span className="text-[11px] font-mono font-bold text-[#B6F23C]">
              State: {activeJob.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Step 1: En Route (Aqua #3FE0C5) */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'en_route')}
              className={`min-h-[56px] p-3 rounded-[14px] font-heading font-bold text-xs uppercase tracking-wider transition-all duration-180 flex flex-col items-center justify-center gap-1 nr-focus ${
                activeJob.status === 'en_route'
                  ? 'bg-[#3FE0C5] text-[#08201C] shadow-aqua-glow ring-2 ring-white'
                  : 'bg-[var(--surface-2)] text-[var(--text)] hover:border-[#3FE0C5] border border-[var(--border)]'
              }`}
            >
              <span>1. En Route</span>
              {activeJob.statusTimestamps.enRoute && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.enRoute}</span>
              )}
            </button>

            {/* Step 2: Arrived (Apricot #FF9F6B) */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'arrived')}
              className={`min-h-[56px] p-3 rounded-[14px] font-heading font-bold text-xs uppercase tracking-wider transition-all duration-180 flex flex-col items-center justify-center gap-1 nr-focus ${
                activeJob.status === 'arrived'
                  ? 'bg-[#FF9F6B] text-[#08201C] shadow-md ring-2 ring-white'
                  : 'bg-[var(--surface-2)] text-[var(--text)] hover:border-[#FF9F6B] border border-[var(--border)]'
              }`}
            >
              <span>2. Arrived</span>
              {activeJob.statusTimestamps.arrived && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.arrived}</span>
              )}
            </button>

            {/* Step 3: POB (Mint #34D399) */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'pob')}
              className={`min-h-[56px] p-3 rounded-[14px] font-heading font-bold text-xs uppercase tracking-wider transition-all duration-180 flex flex-col items-center justify-center gap-1 nr-focus ${
                activeJob.status === 'pob'
                  ? 'bg-[#34D399] text-[#08201C] shadow-md ring-2 ring-white'
                  : 'bg-[var(--surface-2)] text-[var(--text)] hover:border-[#34D399] border border-[var(--border)]'
              }`}
            >
              <span>3. POB (On Board)</span>
              {activeJob.statusTimestamps.pob && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.pob}</span>
              )}
            </button>

            {/* Step 4: Job Clear (Signal Lime #B6F23C with Confirm Sheet) */}
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className={`min-h-[56px] p-3 rounded-[14px] font-heading font-bold text-xs uppercase tracking-wider transition-all duration-180 flex flex-col items-center justify-center gap-1 nr-focus ${
                activeJob.status === 'completed'
                  ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow ring-2 ring-white'
                  : 'bg-[var(--surface-2)] text-[var(--text)] hover:border-[#B6F23C] border border-[var(--border)]'
              }`}
            >
              <span>4. Job Clear</span>
              {activeJob.statusTimestamps.jobClear && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.jobClear}</span>
              )}
            </button>
          </div>
        </div>

        {/* Safety Panic SOS Button */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-[var(--border)]">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#34D399] font-semibold font-mono">
            <CheckCircle2 className="w-4 h-4" /> GPS Active (10s Polling)
          </span>

          <button
            onClick={() => setEmergencyAlertSent(true)}
            className="btn-danger !min-h-[44px] !py-1.5 !px-3 !text-xs relative overflow-hidden"
          >
            <span className="absolute -inset-1 rounded-full bg-white/20 animate-ping pointer-events-none" />
            <span className="relative flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>EMERGENCY SOS</span>
            </span>
          </button>
        </div>

      </div>

      {/* Job Clear Confirmation Modal Sheet */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-[16px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-bold text-lg text-[var(--text)]">
                Confirm Journey Completion
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Passengers dropped off safely at {activeJob?.destinationPostcode}?
              </p>
            </div>

            <div className="p-3 rounded-[12px] bg-[var(--surface-2)] text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Total Fare:</span>
                <span className="font-bold text-[var(--text)]">£{activeJob?.totalGbp.toFixed(2)} GBP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Payment Mode:</span>
                <span className="font-bold text-[#34D399] uppercase">{activeJob?.paymentStatus}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="btn-ghost flex-1 !min-h-[44px] !text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleJobClearConfirm}
                className="btn-primary flex-1 !min-h-[44px] !text-xs"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const PACockpitPage: React.FC = () => {
  const [sweepCompleted, setSweepCompleted] = useState(false);
  const [students, setStudents] = useState([
    { id: '1', name: 'Liam K.', status: 'Boarded', need: 'Wheelchair restraint anchored' },
    { id: '2', name: 'Mia T.', status: 'Boarded', need: 'Booster harness secured' },
    { id: '3', name: 'Jacob S.', status: 'Waiting Pickup', need: 'Front row seating' },
  ]);

  const toggleStudentStatus = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'Boarded' ? 'Handed Over at School' : 'Boarded'
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12 text-[16px]">
      
      {/* Top Mobile Bar */}
      <div 
        style={{ background: 'var(--hero-bg)' }}
        className="flex items-center justify-between text-white p-4 rounded-[20px] shadow-2xl border border-[var(--border)]"
      >
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs font-heading font-semibold text-[#8FB5AA] hover:text-white p-2 focus:outline-none nr-focus rounded-[12px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#FF9F6B] flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          PA On Duty (Sarah J.)
        </span>
        <span className="text-xs font-mono font-bold">15:15 PM</span>
      </div>

      <div className="nr-card p-6 space-y-5">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B9CFF]">
            SEN Route Roster • PM School Run
          </span>
          <h2 className="text-xl font-heading font-bold text-[var(--text)] mt-0.5">
            CBC-SEN-ROUTE-01
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            The Chiltern School &rarr; Dunstable &amp; Leighton Buzzard
          </p>
        </div>

        {/* Student Attendance Manifest */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Pupil Attendance &amp; Support Handover:
          </p>
          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[18px] p-2 text-xs">
            {students.map(st => (
              <div key={st.id} className="py-3 px-2 flex items-center justify-between gap-2">
                <div>
                  <p className="font-heading font-bold text-[var(--text)]">{st.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{st.need}</p>
                </div>
                <button
                  onClick={() => toggleStudentStatus(st.id)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-[12px] font-heading font-bold text-[11px] uppercase transition-all duration-180 ${
                    st.status.includes('Handed')
                      ? 'bg-[#3FE0C5]/20 text-[#08201C] dark:text-[#3FE0C5] border border-[#3FE0C5]/40'
                      : 'bg-[#34D399]/20 text-[#08201C] dark:text-[#34D399] border border-[#34D399]/40'
                  }`}
                >
                  {st.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Vehicle Sweep Sign-off (Requirement CHK-05 & AT-C10) */}
        <div className="p-4 rounded-[18px] bg-[#FFC24B]/15 border border-[#FFC24B]/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold text-[#D97706] dark:text-[#FFC24B] uppercase tracking-wide">
              Mandatory End-Of-Run Safety Sweep
            </h3>
            {sweepCompleted && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#34D399] text-[#08201C] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          
          <p className="text-xs text-[var(--text)] leading-relaxed">
            I certify that the entire vehicle interior and all seating rows have been physically inspected and no pupil or personal property remains on board.
          </p>

          <button
            onClick={() => {
              setSweepCompleted(!sweepCompleted);
              alert(sweepCompleted ? 'Sweep cancelled.' : 'Vehicle sweep verified and digitally signed! Driver availability unlocked.');
            }}
            className={`min-h-[50px] w-full py-2.5 rounded-[14px] font-heading font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              sweepCompleted
                ? 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]'
                : 'btn-primary'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{sweepCompleted ? 'Reset Safety Sweep' : 'Sign & Complete Vehicle Sweep'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
