import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Bell, 
  MapPin, 
  Clock, 
  Users, 
  Luggage, 
  Car, 
  PoundSterling, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  Navigation,
  Plane
} from 'lucide-react';

export const JobOfferModal: React.FC = () => {
  const { jobOffer, acceptOffer, rejectOffer } = useData();
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('Too far / Cannot meet pickup ETA');

  useEffect(() => {
    if (!jobOffer) {
      setSecondsLeft(30);
      setRejectMode(false);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((jobOffer.expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        rejectOffer(jobOffer.id, 'Offer timed out / No driver response');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobOffer, rejectOffer]);

  if (!jobOffer) return null;

  const { booking, pickupEtaMinutes } = jobOffer;
  const progressPercent = (secondsLeft / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border-2 border-blue-500 overflow-hidden flex flex-col relative animate-scaleUp">
        
        {/* Animated Countdown Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
                <Bell className="w-4 h-4 animate-bounce" />
                <span>New Job Offer Dispatched</span>
              </h2>
            </div>
            
            {/* Countdown Badge */}
            <div className={`px-2.5 py-1 rounded-full font-mono text-xs font-black flex items-center gap-1 border shadow-inner ${
              secondsLeft <= 10 
                ? 'bg-rose-500 text-white border-rose-300 animate-pulse' 
                : 'bg-white/20 text-white border-white/30'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{secondsLeft}s left</span>
            </div>
          </div>

          <p className="text-[11px] text-blue-100 mt-1 relative z-10">
            Automated dispatch allocation • Response mandatory within 30 seconds
          </p>

          {/* Shrinking Countdown Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${
                secondsLeft <= 10 ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Header Brief: Ref & Fare */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Booking Reference
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {booking.bookingRef}
              </h3>
              <p className="text-xs text-slate-500">
                Vehicle: <strong className="text-slate-800 dark:text-slate-200">{booking.vehicleCategory}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                £{booking.totalGbp.toFixed(2)}
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">
                {booking.paymentStatus === 'account_invoice' ? 'Account Billed' : 'Card Paid'}
              </p>
            </div>
          </div>

          {/* Route Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 space-y-3 border border-slate-200/80 dark:border-slate-700/60">
            {/* Pickup */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded font-mono">
                    ~{pickupEtaMinutes} mins away
                  </span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                  {booking.pickupAddress}
                </p>
                <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  {booking.pickupPostcode}
                </span>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Destination</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                  {booking.destinationAddress}
                </p>
                <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  {booking.destinationPostcode}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger & Job Specs */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">PASSENGERS</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {booking.passengerCount}
              </span>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">LUGGAGE</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                {booking.luggageCount}
              </span>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">TIME</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {booking.scheduledTime}
              </span>
            </div>
          </div>

          {/* Reject Reason Selector Form */}
          {rejectMode && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded-2xl space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between text-rose-800 dark:text-rose-300 font-bold">
                <span>Select Decline Reason:</span>
                <button 
                  type="button" 
                  onClick={() => setRejectMode(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Too far / Cannot meet pickup ETA">Too far / Cannot meet pickup ETA</option>
                <option value="Mandatory rest break scheduled">Mandatory rest break scheduled</option>
                <option value="Shift end approaching">Shift end approaching</option>
                <option value="Vehicle defect / Maintenance required">Vehicle defect / Maintenance required</option>
                <option value="SEN School Run clash">SEN School Run clash</option>
              </select>

              <button
                type="button"
                onClick={() => rejectOffer(jobOffer.id, rejectReason)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Confirm Decline & Alert Dispatch
              </button>
            </div>
          )}

          {/* Primary Action Buttons */}
          {!rejectMode && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                type="button"
                onClick={() => acceptOffer(jobOffer.id)}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Job ({secondsLeft}s)</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
