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
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverCockpitPage: React.FC = () => {
  const { bookings, updateJobStatus } = useData();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  
  // Find an active or assigned booking for testing
  const activeJob = bookings.find(b => b.status === 'en_route' || b.status === 'arrived' || b.status === 'pob') || bookings[0];

  return (
    <div className="space-y-4 max-w-md mx-auto pb-10">
      
      {/* Top Mobile App Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Driver On Duty
        </span>

        {/* Offline Simulator Switch */}
        <button
          onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
            isSimulatedOffline ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
          }`}
          title="Toggle network offline mode"
        >
          {isSimulatedOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          <span>{isSimulatedOffline ? 'OFFLINE' : 'ONLINE'}</span>
        </button>
      </div>

      {/* Offline Stored Mode Warning Banner (Requirement CHK-07 & APP-04) */}
      {isSimulatedOffline && (
        <div className="bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
          <WifiOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Offline Stored Queue Active</p>
            <p className="text-[11px] mt-0.5">
              Status changes are safely stored in encrypted local storage. Events will automatically sync with verified timestamps upon reconnection.
            </p>
          </div>
        </div>
      )}

      {emergencyAlertSent && (
        <div className="bg-red-600 text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>EMERGENCY DESK NOTIFIED • Priority Open</span>
          </div>
          <button 
            onClick={() => setEmergencyAlertSent(false)}
            className="text-[11px] underline opacity-90"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Driver Cockpit Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        {/* Job Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Active Duty Assignment
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {activeJob?.bookingRef}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vehicle: <strong className="text-slate-800 dark:text-slate-200 font-mono">LT73 XKL</strong> (Mercedes V-Class)
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              £{activeJob?.totalGbp.toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Account Fare</p>
          </div>
        </div>

        {/* Passenger Contact Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {activeJob?.customerName}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {activeJob?.passengerCount} Passengers • {activeJob?.luggageCount} Luggage
            </p>
          </div>
          <a
            href={`tel:${activeJob?.customerPhone}`}
            className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Call passenger"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Journey Postcodes & Route */}
        <div className="space-y-3.5 py-1">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs flex-1">
              <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Pickup Location</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{activeJob?.pickupAddress}</p>
              <p className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">{activeJob?.pickupPostcode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs flex-1">
              <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Destination</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{activeJob?.destinationAddress}</p>
              <p className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">{activeJob?.destinationPostcode}</p>
            </div>
          </div>
        </div>

        {/* Big 4 Driver Touch Workflow Buttons (JOB-NEW-01) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Tap Action to Advance:
            </span>
            <span className="text-[10px] text-blue-600 font-mono font-bold">
              Current: {activeJob.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Step 1: En Route */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'en_route')}
              className={`min-h-[52px] p-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex flex-col items-center justify-center gap-1 ${
                activeJob.status === 'en_route'
                  ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>1. En Route</span>
              {activeJob.statusTimestamps.enRoute && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.enRoute}</span>
              )}
            </button>

            {/* Step 2: Arrived */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'arrived')}
              className={`min-h-[52px] p-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex flex-col items-center justify-center gap-1 ${
                activeJob.status === 'arrived'
                  ? 'bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900 shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>2. Arrived</span>
              {activeJob.statusTimestamps.arrived && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.arrived}</span>
              )}
            </button>

            {/* Step 3: POB */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'pob')}
              className={`min-h-[52px] p-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex flex-col items-center justify-center gap-1 ${
                activeJob.status === 'pob'
                  ? 'bg-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-900 shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>3. POB (On Board)</span>
              {activeJob.statusTimestamps.pob && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.pob}</span>
              )}
            </button>

            {/* Step 4: Job Clear */}
            <button
              onClick={() => updateJobStatus(activeJob.id, 'completed')}
              className={`min-h-[52px] p-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex flex-col items-center justify-center gap-1 ${
                activeJob.status === 'completed'
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900 shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>4. Job Clear</span>
              {activeJob.statusTimestamps.jobClear && (
                <span className="text-[10px] font-mono opacity-80">{activeJob.statusTimestamps.jobClear}</span>
              )}
            </button>
          </div>
        </div>

        {/* Safety Panic & Support Trigger */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> GPS 10s Frequency
          </span>

          <button
            onClick={() => setEmergencyAlertSent(true)}
            className="text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Emergency / SOS</span>
          </button>
        </div>

      </div>

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
    <div className="space-y-4 max-w-md mx-auto pb-10">
      
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cockpit</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          PA On Duty (Sarah J.)
        </span>
        <span className="text-xs font-mono font-bold">15:15 PM</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            SEN Route Roster • PM School Run
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            CBC-SEN-ROUTE-01
          </h2>
          <p className="text-xs text-slate-500">
            The Chiltern School &rarr; Dunstable &amp; Leighton Buzzard
          </p>
        </div>

        {/* Student Attendance Manifest */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pupil Attendance &amp; Support Handover:
          </p>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 text-xs">
            {students.map(st => (
              <div key={st.id} className="py-2.5 px-2 flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                  <p className="text-[11px] text-slate-500">{st.need}</p>
                </div>
                <button
                  onClick={() => toggleStudentStatus(st.id)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase transition ${
                    st.status.includes('Handed')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {st.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Vehicle Sweep Sign-off (Requirement CHK-05 & AT-C10) */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              Mandatory End-Of-Run Safety Sweep
            </h3>
            {sweepCompleted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            I certify that the entire vehicle interior and all seating rows have been physically inspected and no pupil or personal property remains on board.
          </p>

          <button
            onClick={() => {
              setSweepCompleted(!sweepCompleted);
              alert(sweepCompleted ? 'Sweep cancelled.' : 'Vehicle sweep verified and digitally signed! Driver availability unlocked.');
            }}
            className={`min-h-[46px] w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 ${
              sweepCompleted
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
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
