import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Navigation, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverCockpitPage: React.FC = () => {
  const { bookings, updateJobStatus } = useData();
  
  // Find an active or assigned booking for testing
  const activeJob = bookings.find(b => b.status === 'en_route' || b.status === 'arrived' || b.status === 'pob') || bookings[0];

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit App</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Driver On Duty (Tariq M.)
        </span>
        <span className="text-xs font-mono font-bold">13:30</span>
      </div>

      {/* Driver Cockpit Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        {/* Job Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Current Assigned Booking
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeJob?.bookingRef}
            </h2>
            <p className="text-xs text-slate-500">
              Vehicle: <strong className="text-slate-800 dark:text-slate-200">LT73 XKL</strong> (Mercedes V-Class)
            </p>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              £{activeJob?.totalGbp.toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-400">Account Fare</p>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {activeJob?.customerName}
            </p>
            <p className="text-[11px] text-slate-500">
              {activeJob?.passengerCount} Passengers • {activeJob?.luggageCount} Bags
            </p>
          </div>
          <a
            href={`tel:${activeJob?.customerPhone}`}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Journey Postcodes */}
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-slate-500 uppercase text-[10px]">Pickup Location</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{activeJob?.pickupAddress}</p>
              <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{activeJob?.pickupPostcode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Navigation className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-slate-500 uppercase text-[10px]">Destination</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{activeJob?.destinationAddress}</p>
              <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{activeJob?.destinationPostcode}</p>
            </div>
          </div>
        </div>

        {/* Big 4 Driver Action Buttons (Requirement JOB-NEW-01) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Tap to advance journey status:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateJobStatus(activeJob.id, 'en_route')}
              className={`p-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition shadow-sm ${
                activeJob.status === 'en_route'
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              1. En Route
            </button>

            <button
              onClick={() => updateJobStatus(activeJob.id, 'arrived')}
              className={`p-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition shadow-sm ${
                activeJob.status === 'arrived'
                  ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              2. Arrived
            </button>

            <button
              onClick={() => updateJobStatus(activeJob.id, 'pob')}
              className={`p-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition shadow-sm ${
                activeJob.status === 'pob'
                  ? 'bg-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              3. POB (On Board)
            </button>

            <button
              onClick={() => updateJobStatus(activeJob.id, 'completed')}
              className={`p-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition shadow-sm ${
                activeJob.status === 'completed'
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              4. Job Clear
            </button>
          </div>
        </div>

        {/* Offline / Panic triggers */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> GPS Online (10s refresh)
          </span>
          <button className="text-rose-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency / Panic
          </button>
        </div>

      </div>
    </div>
  );
};

export const PACockpitPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit App</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <GraduationCap className="w-4 h-4" />
          PA On Duty (Sarah J.)
        </span>
        <span className="text-xs font-mono font-bold">15:10</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            School Transport Roster (PM Run)
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            CBC-SEN-ROUTE-01
          </h2>
          <p className="text-xs text-slate-500">
            The Chiltern School &rarr; Dunstable / Leighton Buzzard
          </p>
        </div>

        {/* Manifest Preview */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Student 1: Liam K.</p>
              <p className="text-[11px] text-slate-500">Wheelchair restraint required</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              BOARDED
            </span>
          </div>

          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Student 2: Mia T.</p>
              <p className="text-[11px] text-slate-500">Booster seat & harness</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              BOARDED
            </span>
          </div>
        </div>

        {/* Mandatory Vehicle Sweep Signoff (Requirement CHK-05 & AT-C10) */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
            Mandatory End-Of-Run Safety Sweep
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            I certify that the entire vehicle has been physically inspected and no pupil or personal belonging remains on board.
          </p>
          <button className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition">
            Sign & Complete School Sweep
          </button>
        </div>
      </div>
    </div>
  );
};

