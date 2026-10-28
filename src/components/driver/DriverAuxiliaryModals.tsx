import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  Phone, 
  Building2, 
  Car,
  AlertCircle,
  Download,
  Users
} from 'lucide-react';

/* =========================================================================
   1. Future Jobs Modal
   ========================================================================= */
interface FutureJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureJobsModal: React.FC<FutureJobsModalProps> = ({ isOpen, onClose }) => {
  const { bookings } = useData();

  if (!isOpen) return null;

  // Mock future scheduled jobs
  const futureJobs = [
    {
      id: 'fj-1',
      bookingRef: 'DEC-2026-4091',
      scheduledTime: 'Tomorrow 08:30',
      type: 'SEN School Run',
      route: 'CBC-SEN-ROUTE-03',
      pickup: 'Dunstable Central Depot -> The Chiltern School',
      seats: 6,
      passengers: '5 Pupils + 1 PA (Sarah H.)',
      vehicle: 'Ford Transit Custom WAV (CB22 WPR)',
      fareGbp: 95.00
    },
    {
      id: 'fj-2',
      bookingRef: 'DEC-2026-9821',
      scheduledTime: 'Tomorrow 14:15',
      type: 'Airport Transfer',
      pickup: 'Hilton London Bankside -> London Luton Airport T1',
      seats: 4,
      passengers: 'Marcus Sterling (Flight BA2490)',
      vehicle: 'Mercedes-Benz V-Class (LT73 XKL)',
      fareGbp: 135.00
    },
    {
      id: 'fj-3',
      bookingRef: 'DEC-2026-5510',
      scheduledTime: 'Friday 17:00',
      type: 'Executive Corporate',
      pickup: 'Luton Hoo Hotel -> The Shard, London Bridge',
      seats: 3,
      passengers: 'Barclays Private Clients',
      vehicle: 'Mercedes-Benz V-Class (LT73 XKL)',
      fareGbp: 165.00
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Future Scheduled Jobs</span>
            </h3>
            <p className="text-xs text-slate-500">Upcoming roster allocated by Dispatch</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {futureJobs.map(job => (
            <div key={job.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                  {job.bookingRef}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                  {job.scheduledTime}
                </span>
              </div>

              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {job.pickup}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>{job.passengers}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  £{job.fareGbp.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   2. Trip History Modal
   ========================================================================= */
interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pastTrips = [
    {
      ref: 'DEC-8902',
      date: 'Today 11:20 - 12:45',
      route: 'Luton Airport T1 -> Canary Wharf, London',
      fare: 125.00,
      payment: 'Account Billed',
      customer: 'David Harrison'
    },
    {
      ref: 'DEC-8894',
      date: 'Today 09:15 - 10:30',
      route: 'Dunstable -> Luton Town Centre',
      fare: 23.50,
      payment: 'Card Paid Online',
      customer: 'Mrs. Brenda Vance'
    },
    {
      ref: 'DEC-8850',
      date: 'Yesterday 16:30 - 18:00',
      route: 'The Chiltern School PM Run -> Dunstable',
      fare: 68.00,
      payment: 'Local Authority Invoice',
      customer: 'Central Beds Council SEN'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Trip History & Receipts</span>
            </h3>
            <p className="text-xs text-slate-500">Completed journeys archive</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {pastTrips.map(trip => (
            <div key={trip.ref} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {trip.ref}
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  £{trip.fare.toFixed(2)}
                </span>
              </div>

              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {trip.route}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>{trip.date}</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">{trip.payment}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   3. Driver Documents & Compliance Modal
   ========================================================================= */
interface DriverDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverDocumentsModal: React.FC<DriverDocumentsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const docs = [
    {
      title: 'DVLA Driving Licence Photocard',
      number: 'MUKHT905187TM99K',
      status: 'Valid • 0 Points',
      expiry: '15/09/2028',
      type: 'ok'
    },
    {
      title: 'Council Private Hire Driver Badge',
      number: 'PHD-LUTON-2024-89',
      status: 'Valid (Luton Borough Council)',
      expiry: '20/08/2027',
      type: 'ok'
    },
    {
      title: 'Enhanced DBS Check with Barred Lists',
      number: 'DBS-00192837482',
      status: 'Cleared • Update Service Live',
      expiry: 'Continuous Online Check',
      type: 'ok'
    },
    {
      title: 'Safeguarding & Passenger Restraints',
      number: 'CERT-BEDS-2024',
      status: 'Certified (WAV & Wheelchair Ramp)',
      expiry: '12/04/2027',
      type: 'ok'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Driver Compliance & Credentials</span>
            </h3>
            <p className="text-xs text-slate-500">Official digital document portfolio</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {docs.map(doc => (
            <div key={doc.title} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {doc.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Valid</span>
                </span>
              </div>

              <p className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                Ref: {doc.number}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>{doc.status}</span>
                <span>Expires: <strong className="text-slate-700 dark:text-slate-200">{doc.expiry}</strong></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


/* =========================================================================
   4. Dispatch Two-Way Messages Modal
   ========================================================================= */
interface DispatchMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchMessagesModal: React.FC<DispatchMessagesModalProps> = ({ isOpen, onClose }) => {
  const { dispatchMessages, sendDriverMessage } = useData();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendDriverMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (msg: string) => {
    sendDriverMessage(msg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Dispatch Controller Channel</span>
            </h3>
            <p className="text-xs text-slate-500">Direct 2-way dispatch communications</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
          {dispatchMessages.map((msg) => {
            const isDriver = msg.sender === 'Driver';

            return (
              <div key={msg.id} className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {msg.sender} • {msg.timestamp}
                </span>

                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  isDriver 
                    ? 'bg-blue-600 text-white rounded-br-xs' 
                    : msg.isUrgent
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 rounded-bl-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                }`}>
                  {msg.isUrgent && (
                    <span className="font-black text-rose-600 dark:text-rose-400 block text-[10px] uppercase tracking-wider mb-1">
                      ⚠️ URGENT DISPATCH BROADCAST
                    </span>
                  )}
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Taps */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {[
            'Arrived at Terminal 1',
            'Stuck in heavy traffic',
            'Passenger delayed baggage',
            'Job complete • Ready for next'
          ].map(quick => (
            <button
              key={quick}
              type="button"
              onClick={() => handleQuickSend(quick)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:bg-blue-50 dark:hover:bg-blue-950 transition"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to Dispatch Controller..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};


/* =========================================================================
   5. Emergency SOS Panic Modal
   ========================================================================= */
interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSos: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  onConfirmSos
}) => {
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    setSosSent(true);
    onConfirmSos();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rose-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border-4 border-rose-600 p-5 space-y-4 animate-scaleUp">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-500/40 animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-rose-600 tracking-wide uppercase">
            {sosSent ? '🚨 EMERGENCY SOS ACTIVE' : 'Driver Emergency Panic'}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {sosSent 
              ? 'Telemetry signal and live coordinates locked. Dispatch Controller and Bedfordshire Emergency Response notified.'
              : 'Pressing confirm will instantly broadcast your live GPS beacon, vehicle registration, and driver identity to DEC Dispatch Control and log an urgent panic alarm.'}
          </p>
        </div>

        {sosSent ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs space-y-2 text-rose-900 dark:text-rose-200">
            <div className="flex items-center justify-between font-mono font-bold">
              <span>VEHICLE: LT73 XKL</span>
              <span className="text-rose-600 animate-pulse">● LIVE BEACON</span>
            </div>
            <p className="text-[11px]">
              If in immediate danger, dial <strong>999</strong> directly. Dispatch controller has opened telephone emergency line.
            </p>
            <a
              href="tel:999"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call 999 Police / Ambulance</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Close SOS Screen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
            >
              Cancel / False Alarm
            </button>

            <button
              type="button"
              onClick={handleActivate}
              className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>TRIGGER SOS</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
