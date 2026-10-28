import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { useData } from '../context/DataContext';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  PoundSterling, 
  Calendar, 
  FileText, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Bell, 
  Coffee, 
  Power, 
  Radio, 
  ChevronRight,
  Plane,
  Users,
  Luggage,
  Sparkles
} from 'lucide-react';
import { JobOfferModal } from '../components/driver/JobOfferModal';
import { PendingSyncChips } from '../components/driver/PendingSyncChips';
import { 
  FutureJobsModal, 
  TripHistoryModal, 
  DriverDocumentsModal, 
  DispatchMessagesModal, 
  EmergencySosModal 
} from '../components/driver/DriverAuxiliaryModals';

export const StaffAppHomePage: React.FC = () => {
  const { currentUser, isOnline, toggleOnlineStatus, openLogoutDialog } = useAuth();
  const { currentRole } = useRole();
  const { 
    bookings, 
    driverDutyState, 
    setDriverDutyState, 
    triggerSimulatedOffer, 
    dispatchMessages,
    triggerEmergencySos 
  } = useData();
  const navigate = useNavigate();

  // Modals
  const [isFutureJobsOpen, setIsFutureJobsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  const isDriver = currentRole === 'driver';

  // Active current job
  const currentJob = bookings.find(b => 
    b.status === 'allocated' || 
    b.status === 'en_route' || 
    b.status === 'arrived' || 
    b.status === 'pob'
  ) || bookings[0];

  // Next job (preview for upcoming schedule)
  const nextJob = bookings.find(b => b.id !== currentJob?.id && (b.status === 'unallocated' || b.status === 'allocated')) || {
    bookingRef: 'DEC-2026-9821',
    scheduledTime: '15:45',
    pickupAddress: 'London Luton Airport (LTN), Terminal 1 Meet & Greet',
    destinationAddress: 'Hilton London Bankside, London',
    customerName: 'Marcus Sterling',
    passengerCount: 2,
    luggageCount: 2,
    totalGbp: 135.00,
    vehicleCategory: 'Executive VIP'
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      
      {/* JOB OFFER MODAL (Pops up automatically or via trigger) */}
      <JobOfferModal />

      {/* Auxiliary Popups */}
      <FutureJobsModal isOpen={isFutureJobsOpen} onClose={() => setIsFutureJobsOpen(false)} />
      <TripHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <DriverDocumentsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <DispatchMessagesModal isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />
      <EmergencySosModal 
        isOpen={isSosOpen} 
        onClose={() => setIsSosOpen(false)} 
        onConfirmSos={() => triggerEmergencySos(currentJob?.bookingRef)} 
      />

      {/* Top Driver Duty & Shift Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/30 text-white">
              DEC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  {currentUser?.name || 'Tariq Mukhtar'}
                </span>
                <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                  {isDriver ? 'Driver' : 'PA Staff'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Badge: <strong className="text-slate-200">PHD-LUTON-2024-89</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSosOpen(true)}
              className="p-1.5 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1 shadow-md shadow-rose-600/30 animate-pulse"
              title="Emergency SOS"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* 3-WAY DUTY TOGGLE (On duty / Break / Off) */}
        <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-1 text-xs select-none">
          
          {/* 1. On Duty */}
          <button
            type="button"
            onClick={() => setDriverDutyState('on_duty')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              driverDutyState === 'on_duty'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>On Duty</span>
          </button>

          {/* 2. Break */}
          <button
            type="button"
            onClick={() => setDriverDutyState('on_break')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              driverDutyState === 'on_break'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>On Break</span>
          </button>

          {/* 3. Off Duty */}
          <button
            type="button"
            onClick={() => setDriverDutyState('off_duty')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              driverDutyState === 'off_duty'
                ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-600'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Off Duty</span>
          </button>
        </div>

        {/* Duty Status Feedback Banner */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              driverDutyState === 'on_duty' ? 'bg-emerald-400 animate-ping' :
              driverDutyState === 'on_break' ? 'bg-amber-400' : 'bg-slate-500'
            }`} />
            <strong className="text-white">
              {driverDutyState === 'on_duty' ? 'Shift Active • GPS Broadcasting' :
               driverDutyState === 'on_break' ? 'Mandatory Break (18m remaining)' : 'Shift Offline • No Jobs'}
            </strong>
          </span>

          {/* Demo Trigger for Job Offer Screen */}
          <button
            type="button"
            onClick={triggerSimulatedOffer}
            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
            title="Click to simulate an incoming job offer with 30s countdown"
          >
            <Sparkles className="w-3 h-3" />
            <span>Simulate Offer</span>
          </button>
        </div>

      </div>

      {/* ASSIGNED VEHICLE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wide text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                LT73 XKL
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Roadworthy</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Mercedes-Benz V-Class Extra-Long
            </p>
            <p className="text-[10px] text-slate-400">
              7 Seats • Certified WAV Ramp • MOT valid Nov 2026
            </p>
          </div>
        </div>

        <Link
          to="/app/checks"
          className="text-right text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Check Log &rarr;
        </Link>
      </div>

      {/* CURRENT JOB CARD */}
      {currentJob && (
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl space-y-3.5 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase backdrop-blur">
                  Current Assigned Job
                </span>
                <span className="text-xs font-mono font-bold text-blue-200">
                  {currentJob.bookingRef}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {currentJob.customerName}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-emerald-300">
                £{currentJob.totalGbp.toFixed(2)}
              </span>
              <p className="text-[10px] text-blue-200 uppercase font-semibold">
                {currentJob.paymentStatus === 'account_invoice' ? 'Account Billed' : 'Card Paid'}
              </p>
            </div>
          </div>

          {/* Route Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 space-y-2 text-xs relative z-10">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="text-[10px] text-blue-200 block uppercase font-bold">Pickup</span>
                <span className="font-semibold text-white truncate block">{currentJob.pickupAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-white/10">
              <Navigation className="w-3.5 h-3.5 text-rose-300 shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="text-[10px] text-blue-200 block uppercase font-bold">Destination</span>
                <span className="font-semibold text-white truncate block">{currentJob.destinationAddress}</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown & Cockpit Launch Button */}
          <div className="flex items-center justify-between pt-1 relative z-10">
            <div className="text-[11px] text-blue-100 flex items-center gap-1.5">
              <span>Status:</span>
              <span className="font-bold uppercase font-mono px-2 py-0.5 rounded-md bg-white/20 text-white">
                {currentJob.status}
              </span>
            </div>

            <Link
              to="/app/driver-cockpit"
              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition transform active:scale-95"
            >
              <span>Open Cockpit Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* NEXT JOB PREVIEW CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Next Job in Queue</span>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-lg">
            Scheduled: {nextJob.scheduledTime}
          </span>
        </div>

        <div className="text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            {nextJob.customerName} • {nextJob.vehicleCategory}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {nextJob.pickupAddress} &rarr; {nextJob.destinationAddress}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{nextJob.passengerCount} Passengers • {nextJob.luggageCount} Bags</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              £{nextJob.totalGbp.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S EARNINGS CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Shift Performance & Earnings
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <PoundSterling className="w-3.5 h-3.5" />
            <span>Today Gross</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              £148.50
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              4 Completed Trips • 5h 20m Shift Time
            </p>
          </div>

          <div className="text-right text-xs space-y-0.5">
            <p className="text-slate-500">Account: <strong className="text-slate-800 dark:text-slate-200">£120.00</strong></p>
            <p className="text-slate-500">Card: <strong className="text-slate-800 dark:text-slate-200">£28.50</strong></p>
            <p className="text-slate-500">Cash: <strong className="text-slate-800 dark:text-slate-200">£0.00</strong></p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID: Future Jobs, History, Documents, Messages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        
        {/* Future Jobs */}
        <button
          type="button"
          onClick={() => setIsFutureJobsOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition flex flex-col items-center justify-center gap-1.5 text-center shadow-xs"
        >
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Future Jobs</span>
          <span className="text-[10px] text-slate-400">Roster (3)</span>
        </button>

        {/* History */}
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition flex flex-col items-center justify-center gap-1.5 text-center shadow-xs"
        >
          <Clock className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Trip History</span>
          <span className="text-[10px] text-slate-400">Receipts</span>
        </button>

        {/* Documents */}
        <button
          type="button"
          onClick={() => setIsDocsOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition flex flex-col items-center justify-center gap-1.5 text-center shadow-xs"
        >
          <FileText className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Documents</span>
          <span className="text-[10px] text-slate-400">Badges & DBS</span>
        </button>

        {/* Dispatch Messages */}
        <button
          type="button"
          onClick={() => setIsMessagesOpen(true)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition flex flex-col items-center justify-center gap-1.5 text-center shadow-xs relative"
        >
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Messages</span>
          <span className="text-[10px] text-slate-400">Controller (2)</span>
          {dispatchMessages.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

      </div>

      {/* PENDING SYNC AUDIT CHIPS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <PendingSyncChips maxItems={2} showTitle={true} />
      </div>

    </div>
  );
};
