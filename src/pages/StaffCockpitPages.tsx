import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
  ArrowRight,
  LogOut,
  User as UserIcon,
  Fuel,
  Camera,
  Receipt,
  Car,
  Plus,
  X,
  Sparkles,
  CreditCard,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverCockpitPage: React.FC = () => {
  const { bookings, updateJobStatus } = useData();
  const { user, requestLogout, offlineDraftsCount } = useAuth();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [driverToast, setDriverToast] = useState<string | null>(null);

  // Mobile expense form state
  const [expCategory, setExpCategory] = useState<'fuel_diesel' | 'fuel_petrol' | 'ev_charging' | 'adblue' | 'parking_tolls'>('fuel_diesel');
  const [expAmount, setExpAmount] = useState('52.40');
  const [expLitres, setExpLitres] = useState('36.2');
  const [expReg, setExpReg] = useState('BD24 TYU');
  const [expReceiptAttached, setExpReceiptAttached] = useState(true);

  // Mobile incident form state
  const [incLocation, setIncLocation] = useState('A505 Roundabout Dunstable');
  const [incDrivable, setIncDrivable] = useState<'drivable' | 'vor_towed'>('drivable');
  const [incPoliceCad, setIncPoliceCad] = useState('CAD-8812-28OCT');
  const [incTpReg, setIncTpReg] = useState('FE19 KPL');
  const [incTpDriver, setIncTpDriver] = useState('John Davies');
  const [incTpPhone, setIncTpPhone] = useState('07700 900421');
  const [incTpInsurer, setIncTpInsurer] = useState('Direct Line Insurance');
  const [incHasInjuries, setIncHasInjuries] = useState(false);
  const [incInjuryNotes, setIncInjuryNotes] = useState('No injuries. Roadside paramedic clearance.');
  const [incPhotoAttached, setIncPhotoAttached] = useState(true);

  const handleMobileSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExpenseModal(false);
    setDriverToast('Expense receipt successfully submitted! Sent to office controller for approval.');
    setTimeout(() => setDriverToast(null), 4000);
  };

  const handleMobileSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIncidentModal(false);
    setDriverToast('INCIDENT REPORT FILED: CAD ref & photos sent to Controller & Aviva Fleet Claims hotline.');
    setTimeout(() => setDriverToast(null), 5000);
  };
  
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
          to="/dashboard" 
          className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#08201C] bg-[#B6F23C] hover:bg-[#a2dc34] py-1.5 px-3 focus:outline-none nr-focus rounded-[12px] shadow-sm transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Dashboard</span>
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

      {/* Phase 13 Enhancements Quick Bar */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[18px] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 font-bold text-[#B6F23C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENHANCEMENTS ACTIVE</span>
          </span>
          <span className="text-[var(--text-muted)]">Phase 13 Tools</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            to="/carplay-cockpit"
            className="flex items-center justify-center gap-1.5 p-2 rounded-[12px] bg-[var(--surface)] hover:bg-[#B6F23C] hover:text-[#08201C] border border-[var(--border)] font-heading font-bold transition text-[var(--text)] text-center"
          >
            <Navigation className="w-4 h-4 text-[#3FE0C5]" />
            <span>CarPlay Cockpit</span>
          </Link>
          <Link
            to="/office/enhancements"
            className="flex items-center justify-center gap-1.5 p-2 rounded-[12px] bg-[var(--surface)] hover:bg-[#3FE0C5] hover:text-[#08201C] border border-[var(--border)] font-heading font-bold transition text-[var(--text)] text-center"
          >
            <Compass className="w-4 h-4 text-[#FF9F6B]" />
            <span>Bidding &amp; Destination</span>
          </Link>
        </div>
      </div>

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
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B6F23C] bg-[#B6F23C]/10 px-2 py-0.5 rounded border border-[#B6F23C]/30">
              Active Assigned Run
            </span>
            <h2 className="text-2xl font-heading font-bold text-[var(--text)] mt-1">
              {activeJob?.bookingRef || 'DEC-2026-9810'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Customer: <strong className="text-[var(--text)]">{activeJob?.customerName}</strong> • {activeJob?.passengerCount} Passengers
            </p>
          </div>

          <a 
            href={`tel:${activeJob?.customerPhone || '07700900123'}`} 
            className="btn-secondary !min-h-[44px] !p-2 !rounded-full text-[#3FE0C5]"
            title="Call passenger directly"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Route Details */}
        <div className="space-y-3 bg-[var(--surface-2)] p-4 rounded-[16px] border border-[var(--border)] text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#3FE0C5] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-mono text-[var(--text-muted)] font-bold">Pick-up</p>
              <p className="font-heading font-bold text-[var(--text)]">{activeJob?.pickupAddress}</p>
              <p className="text-[11px] font-mono text-[#3FE0C5]">{activeJob?.pickupPostcode}</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-2 flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-[#FF9F6B] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-mono text-[var(--text-muted)] font-bold">Destination Drop</p>
              <p className="font-heading font-bold text-[var(--text)]">{activeJob?.destinationAddress}</p>
              <p className="text-[11px] font-mono text-[#FF9F6B]">{activeJob?.destinationPostcode}</p>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {((activeJob as any)?.specialRequirements || (activeJob as any)?.specialNotes) && (
          <div className="p-3 bg-[#FFC24B]/15 border border-[#FFC24B]/30 rounded-[12px] text-xs text-[var(--text)] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFC24B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Passenger Instruction: </span>
              <span>{(activeJob as any)?.specialRequirements || (activeJob as any)?.specialNotes}</span>
            </div>
          </div>
        )}

        {/* Interactive 4-Stage Driver Job-Flow */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <span>Progress Journey</span>
            <span>Current: <strong className="text-[#3FE0C5] uppercase">{activeJob?.status}</strong></span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
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

      {/* Toast Notification */}
      {driverToast && (
        <div className="bg-[#B6F23C] text-[#08201C] p-3.5 rounded-[16px] text-xs font-heading font-bold shadow-lime-glow flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{driverToast}</span>
          </div>
          <button onClick={() => setDriverToast(null)} className="text-xs p-1 font-mono">✕</button>
        </div>
      )}

      {/* Driver Mobile On-Duty Quick Tools (Requirements 5 & 6) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setShowExpenseModal(true)}
          className="nr-card p-3 flex items-center gap-2.5 text-left hover:border-[#B6F23C] transition border border-[var(--border)]"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-[var(--text)] block">Log Expense</span>
            <span className="text-[10px] text-[var(--text-muted)] block">Fuel / EV / AdBlue</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowIncidentModal(true)}
          className="nr-card p-3 flex items-center gap-2.5 text-left hover:border-[#FF5D6C] transition border border-[var(--border)]"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#FF5D6C]/20 text-[#FF5D6C] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-[var(--text)] block">Report Accident</span>
            <span className="text-[10px] text-[var(--text-muted)] block">Collision & Photos</span>
          </div>
        </button>
      </div>

      {/* Driver Profile & Sign Out (Profile/More Tab Section) */}
      <div className="nr-card p-4 flex items-center justify-between border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#34D399]/20 text-[#34D399] flex items-center justify-center font-heading font-bold text-sm border border-[#34D399]/40">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div>
            <p className="font-heading font-bold text-xs text-[var(--text)]">{user?.name || 'Tariq Mahmood'}</p>
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              Badge: {user?.badgeNumber || 'LT-PHV-4091'} • {isSimulatedOffline ? '1 unsent record' : 'All synced'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => requestLogout(isSimulatedOffline || offlineDraftsCount > 0)}
          className="btn-danger !text-xs !py-2 !px-3 !min-h-[40px] flex items-center gap-1.5 cursor-pointer"
          title="Sign out of Driver Cockpit"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
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
  const { user, requestLogout, offlineDraftsCount } = useAuth();
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
          to="/dashboard" 
          className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#08201C] bg-[#B6F23C] hover:bg-[#a2dc34] py-1.5 px-3 focus:outline-none nr-focus rounded-[12px] shadow-sm transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#FF9F6B] flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          PA On Duty ({user?.name ? user.name.split(' ')[0] : 'Sarah J.'})
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
              alert(sweepCompleted ? 'Sweep reset.' : 'Vehicle sweep verified and digitally signed! Driver availability unlocked.');
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

      {/* PA Profile & Sign Out (Profile/More Tab Section) */}
      <div className="nr-card p-4 flex items-center justify-between border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#FF9F6B]/20 text-[#FF9F6B] flex items-center justify-center font-heading font-bold text-sm border border-[#FF9F6B]/40">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <p className="font-heading font-bold text-xs text-[var(--text)]">{user?.name || 'Sarah Jenkins'}</p>
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              Badge: {user?.badgeNumber || 'CBC-PA-108'} • Passenger Assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => requestLogout(offlineDraftsCount > 0)}
          className="btn-danger !text-xs !py-2 !px-3 !min-h-[40px] flex items-center gap-1.5 cursor-pointer"
          title="Sign out of PA Cockpit"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

    </div>
  );
};

export default DriverCockpitPage;
