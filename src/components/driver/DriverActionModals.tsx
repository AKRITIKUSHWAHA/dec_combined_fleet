import React, { useState } from 'react';
import { Booking } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RotateCcw, 
  Clock, 
  ShieldAlert, 
  PoundSterling, 
  UserX,
  XCircle,
  Sparkles
} from 'lucide-react';

/* =========================================================================
   1. Confirm Job Clear Modal (Checklist + Fare Confirmation)
   ========================================================================= */
interface JobClearConfirmModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const JobClearConfirmModal: React.FC<JobClearConfirmModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [checkedProperty, setCheckedProperty] = useState(false);
  const [checkedFare, setCheckedFare] = useState(false);

  if (!isOpen) return null;

  const canConfirm = checkedProperty && checkedFare;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Confirm Job Clear
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Booking {booking.bookingRef}
          </p>
        </div>

        {/* Fare & Payment Summary */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Booking Fare:</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              £{booking.totalGbp.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500">Payment Status:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
              {booking.paymentStatus === 'account_invoice' ? 'Corporate Account Invoice' : 'Card Paid Online'}
            </span>
          </div>
        </div>

        {/* Mandatory Safety Checkboxes */}
        <div className="space-y-2.5 text-xs">
          <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedProperty}
              onChange={(e) => setCheckedProperty(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Vehicle interior & boot checked. No passenger property left behind.
            </span>
          </label>

          <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedFare}
              onChange={(e) => setCheckedFare(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Passenger safely disembarked at destination.
            </span>
          </label>
        </div>

        {/* Modal Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition"
          >
            Clear Job Now
          </button>
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   2. Report Wrong Tap Flow Modal (Audit Safe Revert)
   ========================================================================= */
interface WrongTapModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onRevert: (reason: string) => void;
}

export const WrongTapModal: React.FC<WrongTapModalProps> = ({
  booking,
  isOpen,
  onClose,
  onRevert
}) => {
  const [reason, setReason] = useState('Accidental button tap while phone in cradle');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Report Wrong Tap / Revert
          </h3>
          <p className="text-xs text-slate-500">
            Reverts status safely while recording an audit entry for Dispatch.
          </p>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
          <p>
            Current Status: <strong className="uppercase font-mono">{booking.status}</strong>
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
            Will revert back to previous operational step.
          </p>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Select Reason for Wrong Tap:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="Accidental button tap while phone in cradle">Accidental button tap while phone in cradle</option>
            <option value="GPS false arrival triggering early arrival">GPS false arrival triggering early arrival</option>
            <option value="Tapped POB before customer loaded luggage">Tapped POB before customer loaded luggage</option>
            <option value="Wrong booking opened on screen">Wrong booking opened on screen</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={() => {
              onRevert(reason);
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition"
          >
            Revert Status
          </button>
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   3. Declare No-Show Flow Modal
   ========================================================================= */
interface NoShowModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onDeclareNoShow: (waitMinutes: number, reason: string) => void;
}

export const NoShowModal: React.FC<NoShowModalProps> = ({
  booking,
  isOpen,
  onClose,
  onDeclareNoShow
}) => {
  const [waitMinutes, setWaitMinutes] = useState(10);
  const [reason, setReason] = useState('Passenger not at designated pickup point; phone unreachable');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-md">
            <UserX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Declare Passenger No-Show
          </h3>
          <p className="text-xs text-slate-500">
            Applies standard standby wait fee and notifies Dispatch Controller.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Wait Time Elapsed (Minutes on site):
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={waitMinutes}
              onChange={(e) => setWaitMinutes(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold font-mono text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              * Minimum 5 minutes grace period required by contract.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Reason / Attempted Contact:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="Passenger not at designated pickup point; phone unreachable">Passenger not at designated pickup point; phone unreachable</option>
              <option value="Called customer 3 times with no response">Called customer 3 times with no response</option>
              <option value="Airport arrival terminal gate closed; flight rebooked">Airport arrival terminal gate closed; flight rebooked</option>
              <option value="Customer made alternative transport arrangements">Customer made alternative transport arrangements</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onDeclareNoShow(waitMinutes, reason);
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition"
          >
            Confirm No-Show
          </button>
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   4. Cancel Booking Flow Modal
   ========================================================================= */
interface CancelJobModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (reason: string) => void;
}

export const CancelJobModal: React.FC<CancelJobModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelBooking
}) => {
  const [reason, setReason] = useState('Customer requested on-site cancellation');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-md">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Cancel Booking {booking.bookingRef}
          </h3>
          <p className="text-xs text-slate-500">
            Please specify cancellation cause for the dispatch log.
          </p>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Select Cancellation Reason:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="Customer requested on-site cancellation">Customer requested on-site cancellation</option>
            <option value="Severe road closure / motorway gridlock">Severe road closure / motorway gridlock</option>
            <option value="Vehicle puncture / unexpected breakdown">Vehicle puncture / unexpected breakdown</option>
            <option value="Flight diverted to alternate UK airport">Flight diverted to alternate UK airport</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              onCancelBooking(reason);
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition"
          >
            Cancel Booking
          </button>
        </div>

      </div>
    </div>
  );
};
