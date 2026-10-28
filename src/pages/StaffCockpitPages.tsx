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
  Users,
  RotateCcw,
  UserX,
  XCircle,
  Wifi,
  WifiOff,
  PoundSterling,
  Clock,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Plane
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PendingSyncChips } from '../components/driver/PendingSyncChips';
import { 
  JobClearConfirmModal, 
  WrongTapModal, 
  NoShowModal, 
  CancelJobModal 
} from '../components/driver/DriverActionModals';
import { 
  EmergencySosModal, 
  DispatchMessagesModal 
} from '../components/driver/DriverAuxiliaryModals';

export const DriverCockpitPage: React.FC = () => {
  const { 
    bookings, 
    advanceJobFlow, 
    revertWrongTap, 
    cancelJobWithReason, 
    markNoShowWithReason,
    triggerEmergencySos 
  } = useData();
  const { currentUser, isOnline, toggleOnlineStatus } = useAuth();
  
  // Modals state
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isWrongTapOpen, setIsWrongTapOpen] = useState(false);
  const [isNoShowOpen, setIsNoShowOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  // Find active job
  const activeJob = bookings.find(b => 
    b.status === 'allocated' || 
    b.status === 'en_route' || 
    b.status === 'arrived' || 
    b.status === 'pob'
  ) || bookings[0];

  const handlePrimaryAction = () => {
    if (!activeJob) return;

    if (activeJob.status === 'pob') {
      // Enforce confirmation modal before Job Clear
      setIsConfirmClearOpen(true);
      return;
    }

    advanceJobFlow(activeJob.id, isOnline);
  };

  const handleConfirmJobClear = () => {
    if (!activeJob) return;
    advanceJobFlow(activeJob.id, isOnline);
    setIsConfirmClearOpen(false);
  };

  // Determine label & appearance for the SINGLE MAIN BUTTON
  const getPrimaryButtonConfig = () => {
    if (!activeJob) {
      return {
        label: 'No Active Booking Assigned',
        icon: Navigation,
        bgClass: 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed',
        disabled: true
      };
    }

    switch (activeJob.status) {
      case 'unallocated':
        return {
          label: 'Accept Dispatched Job',
          icon: CheckCircle2,
          bgClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
          disabled: false
        };
      case 'allocated':
        return {
          label: '1. Start Journey & Go En Route',
          icon: Navigation,
          bgClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 ring-4 ring-blue-500/20',
          disabled: false
        };
      case 'en_route':
        return {
          label: '2. Arrived at Pickup Location',
          icon: MapPin,
          bgClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/30 ring-4 ring-amber-500/20',
          disabled: false
        };
      case 'arrived':
        return {
          label: '3. Passenger On Board (POB)',
          icon: Users,
          bgClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30 ring-4 ring-purple-500/20',
          disabled: false
        };
      case 'pob':
        return {
          label: '4. Complete Journey (Job Clear)',
          icon: CheckCircle2,
          bgClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20',
          disabled: false
        };
      case 'completed':
        return {
          label: '✓ Trip Completed • Job Cleared',
          icon: CheckCircle2,
          bgClass: 'bg-slate-700 text-slate-300 cursor-default',
          disabled: true
        };
      case 'cancelled':
        return {
          label: 'Booking Cancelled',
          icon: XCircle,
          bgClass: 'bg-slate-700 text-slate-400 cursor-default',
          disabled: true
        };
      case 'no_show':
        return {
          label: 'Passenger No-Show Logged',
          icon: UserX,
          bgClass: 'bg-slate-700 text-slate-400 cursor-default',
          disabled: true
        };
      default:
        return {
          label: 'Advance Status',
          icon: Navigation,
          bgClass: 'bg-blue-600 text-white',
          disabled: false
        };
    }
  };

  const primaryBtn = getPrimaryButtonConfig();
  const PrimaryIcon = primaryBtn.icon;

  return (
    <div className="space-y-4 max-w-md mx-auto pb-8">
      
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-2xl shadow-lg border border-slate-800">
        <Link to="/app/home" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Driver On Duty ({currentUser?.name?.split(' ')[0] || 'Tariq'})
        </span>
        <button
          onClick={() => setIsSosOpen(true)}
          className="p-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black flex items-center gap-1 shadow-md shadow-rose-600/30 animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>

      {/* Offline Alert Strip if network is simulated offline */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>OFFLINE MODE: Statuses saved locally with exact tap time.</span>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className="underline text-[11px] font-extrabold uppercase shrink-0"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Main Cockpit Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        {/* Job Header & Reference */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Active Assigned Run
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {activeJob?.bookingRef}
            </h2>
            <p className="text-xs text-slate-500">
              Vehicle: <strong className="text-slate-800 dark:text-slate-200">LT73 XKL</strong> (Mercedes-Benz V-Class)
            </p>
          </div>

          <button
            onClick={() => setIsMessagesOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Dispatch</span>
          </button>
        </div>

        {/* SEPARATE PAYMENT STATUS FROM JOURNEY STATUS */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          
          {/* Box 1: Journey Operational Status */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. JOURNEY STATUS
            </span>
            <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white uppercase font-mono text-sm">
              <span className={`w-2 h-2 rounded-full ${
                activeJob.status === 'en_route' ? 'bg-blue-500 animate-ping' :
                activeJob.status === 'arrived' ? 'bg-amber-500 animate-ping' :
                activeJob.status === 'pob' ? 'bg-purple-500 animate-ping' :
                activeJob.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
              <span>{activeJob?.status.replace('_', ' ')}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Enforced step progression
            </p>
          </div>

          {/* Box 2: Payment Status (Strictly Separated) */}
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              2. PAYMENT STATUS
            </span>
            <div className="flex items-center gap-1 font-black text-emerald-800 dark:text-emerald-300 text-sm">
              <PoundSterling className="w-3.5 h-3.5" />
              <span>£{activeJob?.totalGbp.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
              {activeJob?.paymentStatus === 'account_invoice' 
                ? 'Corporate Account Billed' 
                : activeJob?.paymentStatus === 'paid_card'
                  ? 'Prepaid Card Online'
                  : 'Cash on Delivery'}
            </p>
          </div>

        </div>

        {/* Passenger Contact Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {activeJob?.customerName}
            </p>
            <p className="text-[11px] text-slate-500">
              {activeJob?.passengerCount} Passengers • {activeJob?.luggageCount} Luggage Bags
            </p>
          </div>
          <a
            href={`tel:${activeJob?.customerPhone}`}
            className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition"
            title="Call passenger"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Journey Locations */}
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-500 uppercase text-[10px]">Pickup Location</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{activeJob?.pickupAddress}</p>
              <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{activeJob?.pickupPostcode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-500 uppercase text-[10px]">Destination</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{activeJob?.destinationAddress}</p>
              <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{activeJob?.destinationPostcode}</p>
            </div>
          </div>
        </div>

        {/* ONE MAIN BUTTON AT A TIME (ENFORCED SEQUENCE) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Next Journey Action:</span>
            <span className="font-mono text-slate-500">Step Progression</span>
          </div>

          <button
            type="button"
            disabled={primaryBtn.disabled}
            onClick={handlePrimaryAction}
            className={`w-full py-4 px-4 rounded-2xl font-black text-sm uppercase tracking-wide transition shadow-xl flex items-center justify-center gap-2 transform active:scale-98 ${primaryBtn.bgClass}`}
          >
            <PrimaryIcon className="w-5 h-5" />
            <span>{primaryBtn.label}</span>
          </button>
        </div>

        {/* Secondary Exception Actions: No-show, Cancel, Wrong Tap */}
        {activeJob.status !== 'completed' && activeJob.status !== 'cancelled' && activeJob.status !== 'no_show' && (
          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setIsWrongTapOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex flex-col items-center justify-center gap-1 transition"
              title="Accidental tap revert flow"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Wrong Tap</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNoShowOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-orange-950/50 hover:text-orange-600 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex flex-col items-center justify-center gap-1 transition"
              title="Customer failed to arrive"
            >
              <UserX className="w-3.5 h-3.5 text-orange-500" />
              <span>No-Show</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex flex-col items-center justify-center gap-1 transition"
              title="Cancel booking with reason"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Cancel</span>
            </button>
          </div>
        )}

      </div>

      {/* PENDING SYNC CHIPS (ORIGINAL TIME VS RECEIVED TIME) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <PendingSyncChips maxItems={3} showTitle={true} />
      </div>

      {/* Modals */}
      {activeJob && (
        <>
          <JobClearConfirmModal
            booking={activeJob}
            isOpen={isConfirmClearOpen}
            onClose={() => setIsConfirmClearOpen(false)}
            onConfirm={handleConfirmJobClear}
          />

          <WrongTapModal
            booking={activeJob}
            isOpen={isWrongTapOpen}
            onClose={() => setIsWrongTapOpen(false)}
            onRevert={(reason) => revertWrongTap(activeJob.id, reason, isOnline)}
          />

          <NoShowModal
            booking={activeJob}
            isOpen={isNoShowOpen}
            onClose={() => setIsNoShowOpen(false)}
            onDeclareNoShow={(wait, reason) => markNoShowWithReason(activeJob.id, wait, reason, isOnline)}
          />

          <CancelJobModal
            booking={activeJob}
            isOpen={isCancelOpen}
            onClose={() => setIsCancelOpen(false)}
            onCancelBooking={(reason) => cancelJobWithReason(activeJob.id, reason, isOnline)}
          />
        </>
      )}

      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onConfirmSos={() => triggerEmergencySos(activeJob?.bookingRef)}
      />

      <DispatchMessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

    </div>
  );
};

export const PACockpitPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12">
      <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-2xl shadow-lg border border-slate-800">
        <Link to="/app/home" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          PA On Duty ({currentUser?.name?.split(' ')[0] || 'Sarah H.'})
        </span>
        <span className="text-xs font-mono font-bold">14:00</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            SEN School Transport Contract
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            The Chiltern School PM Run
          </h2>
          <p className="text-slate-500">
            Route: <strong>CBC-SEN-ROUTE-03</strong> • Vehicle: <strong>CB22 WPR</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/app/pupils"
            className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold flex items-center justify-between"
          >
            <span>Pupil Rollcall</span>
            <ChevronRight className="w-4 h-4 text-blue-500" />
          </Link>

          <Link
            to="/app/sweep"
            className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-between"
          >
            <span>Vehicle Sweep</span>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};
