import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { useData } from '../context/DataContext';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Car, 
  Upload, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  Users, 
  Check, 
  FileText,
  Clock,
  Sparkles,
  Camera,
  PenTool
} from 'lucide-react';

/* =========================================================================
   1. Staff Daily Checks Page (/app/checks)
   ========================================================================= */
export const StaffChecksPage: React.FC = () => {
  const { offlineDraftsCount, isOnline } = useAuth();
  const { activeChecklist, submitDailyCheck, logSyncAction } = useData();

  // State for check items: pass / fail / na
  const [itemStatuses, setItemStatuses] = useState<{ [id: string]: 'pass' | 'fail' | 'na' }>({
    'chk-i1': 'pass',
    'chk-i2': 'pass',
    'chk-i3': 'pass',
    'chk-i4': 'pass',
    'chk-i5': 'pass',
    'chk-i6': 'pass',
    'chk-i7': 'pass',
    'chk-i8': 'pass'
  });

  const [odometer, setOdometer] = useState(42180);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [signatureName, setSignatureName] = useState('Tariq Mahmood');
  const [submitted, setSubmitted] = useState(false);
  const [offlineDraftSaved, setOfflineDraftSaved] = useState(false);

  const checkItems = activeChecklist?.items || [
    { id: 'chk-i1', label: 'Tyres, Pressure & Legal Tread Depth (min 1.6mm)', category: 'mechanical', requiresPhotoOnFail: true },
    { id: 'chk-i2', label: 'Service Brakes, Handbrake & ABS Warning Dashboard Lights', category: 'mechanical', requiresPhotoOnFail: false },
    { id: 'chk-i3', label: 'Exterior Headlights, Sidelights, Brake Lights & Indicators', category: 'exterior', requiresPhotoOnFail: true },
    { id: 'chk-i4', label: 'Windscreen, Wipers, Washers & All Mirrors', category: 'exterior', requiresPhotoOnFail: false },
    { id: 'chk-i5', label: 'Wheelchair Ramp / Hydraulic Tail Lift Certified Operation', category: 'accessibility', requiresPhotoOnFail: true, wavOnly: true },
    { id: 'chk-i6', label: 'Wheelchair Floor Tracking & 4-Point Tie-Down Restraints', category: 'accessibility', requiresPhotoOnFail: true, wavOnly: true },
    { id: 'chk-i7', label: 'Fire Extinguisher (In-Date Pressure Gauge) & First Aid Kit', category: 'safety', requiresPhotoOnFail: true },
    { id: 'chk-i8', label: 'Council Private Hire Vehicle Licence Plates & Roof Sign', category: 'exterior', requiresPhotoOnFail: false }
  ];

  const handleSetStatus = (id: string, status: 'pass' | 'fail' | 'na') => {
    setItemStatuses(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const failuresCount = Object.values(itemStatuses).filter(st => st === 'fail').length;

    submitDailyCheck({
      vehicleReg: 'LT73 XKL',
      driverId: 'drv-01',
      driverName: signatureName || 'Tariq Mahmood',
      odometerReading: odometer,
      itemsChecked: checkItems.length,
      failuresCount,
      status: failuresCount > 0 ? 'failed' : isOnline ? 'passed' : 'offline_synced'
    });

    logSyncAction(
      `Daily Walkaround Check: LT73 XKL (${failuresCount === 0 ? 'All Clean' : `${failuresCount} Failures`})`,
      'LT73 XKL',
      `Signed by ${signatureName}. Odometer: ${odometer} mi.`,
      isOnline
    );

    if (!isOnline) {
      setOfflineDraftSaved(true);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOfflineDraftSaved(false);
    }, 4500);
  };

  const hasFailures = Object.values(itemStatuses).some(s => s === 'fail');

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12">
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Pre-Use Walkaround Inspection ({activeChecklist?.version || 'v2.4'})
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Daily Vehicle Safety Check
            </h2>
            <p className="text-xs text-slate-500">
              Vehicle: <strong className="text-slate-800 dark:text-slate-200">LT73 XKL</strong> (Mercedes V-Class WAV)
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-900">
            {checkItems.length} Criteria
          </span>
        </div>

        {/* Offline Draft Alert State */}
        {!isOnline && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Offline Mode: Check will be saved as a secure local draft.</span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-amber-200 dark:bg-amber-900 px-1.5 py-0.5 rounded">
              Draft State
            </span>
          </div>
        )}

        {submitted && (
          <div className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs animate-fadeIn ${
            offlineDraftSaved
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">
                {offlineDraftSaved ? 'Saved as Offline Draft!' : 'Daily Check Submitted to DEC Dispatch!'}
              </p>
              <span className="text-[11px] opacity-80">
                {offlineDraftSaved 
                  ? 'Client timestamp locked. Will sync automatically upon cellular reconnection.' 
                  : 'Vehicle compliance cleared for road use.'}
              </span>
            </div>
          </div>
        )}

        {/* Odometer Input */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Vehicle Odometer Mileage
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(parseInt(e.target.value, 10))}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-xs text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-400 font-bold">miles</span>
          </div>
        </div>

        {/* Inspection Items with Pass / Fail / N/A 3-Way Toggle */}
        <div className="space-y-2">
          {checkItems.map((item, idx) => {
            const currentStatus = itemStatuses[item.id] || 'pass';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition space-y-2 ${
                  currentStatus === 'pass'
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    : currentStatus === 'fail'
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60'
                      : 'bg-slate-100/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* 3-WAY TOGGLE BUTTONS (Pass / Fail / N/A) */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSetStatus(item.id, 'pass')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition ${
                        currentStatus === 'pass'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Pass
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStatus(item.id, 'fail')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition ${
                        currentStatus === 'fail'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Fail
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStatus(item.id, 'na')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition ${
                        currentStatus === 'na'
                          ? 'bg-slate-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>

                {/* If Fail is selected, prompt for defect photo */}
                {currentStatus === 'fail' && (
                  <div className="p-2.5 bg-rose-100/70 dark:bg-rose-950/60 rounded-xl border border-rose-300 dark:border-rose-900/60 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-rose-600" />
                      <span className="text-rose-900 dark:text-rose-200 font-semibold text-[11px]">
                        Defect Photo Required
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPhotoAttached(true)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        photoAttached 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-white dark:bg-slate-900 text-rose-600 border border-rose-300'
                      }`}
                    >
                      {photoAttached ? '✓ Photo Captured' : '+ Snap Photo'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Driver Digital Signature Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-blue-600" />
            <span>Driver Digital Sign-Off</span>
          </label>

          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Type your full legal name to sign..."
            required
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-serif italic text-sm text-slate-900 dark:text-white"
          />

          <p className="text-[10px] text-slate-400 leading-snug">
            I certify under the Road Traffic Act that I have carried out this pre-use inspection of vehicle LT73 XKL and recorded all visual defects truthfully.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Submit & Sign Walkaround Check</span>
        </button>

      </form>
    </div>
  );
};


/* =========================================================================
   2. Staff Defect Report Page (/app/defects)
   ========================================================================= */
export const StaffDefectsPage: React.FC = () => {
  const { isOnline } = useAuth();
  const [severity, setSeverity] = useState<'minor' | 'critical_safety'>('minor');
  const [category, setCategory] = useState('Tyres/Wheels');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setDescription('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Workshop & Garage Escalation
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Report Vehicle Defect
          </h2>
          <p className="text-xs text-slate-500">
            Critical safety defects will mark the vehicle as VOR (Vehicle Off Road).
          </p>
        </div>

        {submitted && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Defect ticket logged with Fleet Engineering!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Severity Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Severity Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('minor')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  severity === 'minor'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>Minor (Advisory)</span>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('critical_safety')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  severity === 'critical_safety'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Critical / VOR Safety</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            >
              <option value="Tyres/Wheels">Tyres / Wheels / Pressure</option>
              <option value="Brakes">Braking System / Fluid</option>
              <option value="Lights">Exterior Lighting & Indicators</option>
              <option value="Ramp/Lift">Wheelchair Ramp / Tail Lift</option>
              <option value="Bodywork">Bodywork / Door Closures</option>
              <option value="Glass/Mirrors">Glass / Visibility</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Defect Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details of the fault or observation..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Submit Defect Ticket</span>
          </button>
        </form>

      </div>
    </div>
  );
};

/* =========================================================================
   3. Staff Pupils SEN Page (/app/pupils)
   ========================================================================= */
/* =========================================================================
   3. Staff Pupils SEN Page (/app/pupils)
   ========================================================================= */
export const StaffPupilsPage: React.FC = () => {
  const { schoolRoutes, updatePupilAttendance } = useData();
  const currentRoute = schoolRoutes[0];

  const handleToggleStatus = (pupilId: string, currentStatus: string) => {
    if (!currentRoute) return;
    const nextStatus = currentStatus === 'scheduled' 
      ? 'boarded' 
      : (currentStatus === 'boarded' ? 'handed_over' : (currentStatus === 'handed_over' ? 'absent' : 'scheduled'));
    
    updatePupilAttendance(currentRoute.id, pupilId, nextStatus, nextStatus === 'absent' ? 'Parent notified: unwell' : undefined, 'SEN Reception Staff');
  };

  if (!currentRoute) {
    return <div className="p-4 text-center text-xs text-slate-500">No active SEN school route assigned today.</div>;
  }

  const boardedCount = currentRoute.pupils.filter(p => p.attendanceStatus === 'boarded').length;
  const deliveredCount = currentRoute.pupils.filter(p => p.attendanceStatus === 'handed_over').length;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              SEN Transport Passenger Manifest
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Pupil Attendance Roll
            </h2>
            <p className="text-xs text-slate-500">
              Route: <strong className="text-slate-800 dark:text-slate-200">{currentRoute.routeCode}</strong> ({currentRoute.schoolName})
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            {currentRoute.pupils.length} Students
          </span>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Boarded</span>
            <span className="font-bold text-amber-600">{boardedCount}</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Delivered</span>
            <span className="font-bold text-emerald-600">{deliveredCount}</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Total</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentRoute.pupils.length}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {currentRoute.pupils.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.name} <span className="text-slate-400 font-normal">({p.age} yrs)</span>
                  </h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {p.specialNeeds}
                  </p>
                  {p.wheelchairUser && (
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mt-1">
                      Wheelchair Clamp
                    </span>
                  )}
                  {p.medicalAlert && (
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ml-1">
                      {p.medicalAlert}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(p.id, p.attendanceStatus)}
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-full transition shadow-xs ${
                    p.attendanceStatus === 'boarded'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : p.attendanceStatus === 'handed_over'
                      ? 'bg-emerald-600 text-white font-bold'
                      : p.attendanceStatus === 'absent'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p.attendanceStatus.replace('_', ' ')}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   4. Staff Vehicle Safety Sweep Page (/app/sweep)
   ========================================================================= */
export const StaffSweepPage: React.FC = () => {
  const { schoolRoutes, completeDriverSweep, countersignPASweep } = useData();
  const currentRoute = schoolRoutes[1] || schoolRoutes[0]; // route CBC-SCH-08 has pending sweep to demonstrate
  const [driverSweepNotes, setDriverSweepNotes] = useState('');

  if (!currentRoute) {
    return <div className="p-4 text-center text-xs text-slate-500">No active route found.</div>;
  }

  const isDriverDone = !!currentRoute.sweepDetails?.driverCompleted;
  const isPACountersigned = !!currentRoute.sweepDetails?.paCountersigned;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Child Safeguarding Compliance Gate
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Mandatory Vehicle Sweep
          </h2>
          <p className="text-xs text-slate-500">
            Route: <strong className="text-slate-800 dark:text-slate-200">{currentRoute.routeCode}</strong> ({currentRoute.assignedVehicleReg})
          </p>
        </div>

        {/* Safety Gate Warning Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
          <h4 className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Two-Step Verification Enforced</span>
          </h4>
          <p className="leading-relaxed text-[11px]">
            The driver must physically inspect every seat, footwell, and restraint. The driver <strong className="font-black">CANNOT become available</strong> for subsequent dispatch bookings until the Passenger Assistant countersigns this sweep!
          </p>
        </div>

        {/* Step 1: Driver Physical Sweep */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Step 1: Driver Physical Inspection
            </span>
            {isDriverDone ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Completed ({currentRoute.sweepDetails?.driverTimestamp})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                Pending Driver
              </span>
            )}
          </div>

          {!isDriverDone ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                placeholder="Driver sweep notes (e.g. all clear, no items left)..."
                value={driverSweepNotes}
                onChange={e => setDriverSweepNotes(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={() => completeDriverSweep(currentRoute.id, driverSweepNotes)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Certify Driver Physical Sweep
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Physical sweep confirmed: All seats and floor areas inspected clear.
            </p>
          )}
        </div>

        {/* Step 2: Passenger Assistant Countersignature */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Step 2: PA Countersignature (Unlocks Driver)
            </span>
            {isPACountersigned ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Countersigned ({currentRoute.sweepDetails?.paTimestamp})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                Awaiting PA Signature
              </span>
            )}
          </div>

          {isDriverDone && !isPACountersigned ? (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                Passenger Assistant {currentRoute.assignedPA1Name}: sign below to confirm all students are in school and release vehicle {currentRoute.assignedVehicleReg}.
              </p>
              <button
                type="button"
                onClick={() => countersignPASweep(currentRoute.id, currentRoute.assignedPA1Name)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
              >
                <PenTool className="w-4 h-4" />
                PA Countersign & Release Driver to Available
              </button>
            </div>
          ) : isPACountersigned ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded-xl text-center space-y-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="text-xs font-black text-emerald-800 dark:text-emerald-200">
                Driver & Vehicle Legally Released
              </p>
              <p className="text-[10px] text-emerald-600">
                Countersigned by {currentRoute.sweepDetails?.paSignatureName} at {currentRoute.sweepDetails?.paTimestamp}. Driver duty status set to AVAILABLE.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Step 2 will unlock once driver completes Step 1.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   5. Staff Sync & Profile Page (/app/sync)
   ========================================================================= */
export const StaffSyncPage: React.FC = () => {
  const { 
    currentUser, 
    offlineDraftsCount, 
    syncOfflineDrafts, 
    isOnline, 
    toggleOnlineStatus, 
    lastSyncTime, 
    openLogoutDialog, 
    isLoading 
  } = useAuth();
  const { currentRole } = useRole();

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <img
            src={currentUser?.avatarUrl}
            alt={currentUser?.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentUser?.name}
            </h3>
            <p className="text-xs text-slate-500">
              {currentUser?.department}
            </p>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block mt-0.5 font-bold">
              Badge: {currentUser?.badgeNumber || 'LT-STAFF-104'}
            </span>
          </div>
        </div>

        {/* Sync Status Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              DEC Cloud Sync Status
            </span>
            <span className="text-xs font-mono text-slate-500">
              {lastSyncTime}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Network Connection:</span>
            <span className={`font-bold ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isOnline ? 'Online (4G/LTE)' : 'Offline (Local Sandbox)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Unsent Offline Drafts:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {offlineDraftsCount} record(s) pending
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => syncOfflineDrafts()}
              disabled={isLoading || !isOnline}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync All Now'}</span>
            </button>

            <button
              onClick={toggleOnlineStatus}
              className="py-2.5 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              {isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="pt-2">
          <button
            onClick={openLogoutDialog}
            className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Tablet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
