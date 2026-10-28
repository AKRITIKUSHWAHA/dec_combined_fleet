import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  CheckSquare, 
  PlusCircle, 
  Trash2, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck,
  Smartphone
} from 'lucide-react';

interface CheckItem {
  id: string;
  label: string;
  section: string;
  type: 'pass_fail_na' | 'yes_no' | 'number' | 'text';
  mandatoryPhotoOnFail: boolean;
  isSchoolSpecific?: boolean;
}

export const ChecksPage: React.FC = () => {
  const { dailyChecks, submitDailyCheck } = useData();
  const [activeTab, setActiveTab] = useState<'builder' | 'submissions'>('builder');

  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { id: '1', label: 'Tyres & Wheel Nuts (Min 1.6mm tread depth)', section: 'Exterior', type: 'pass_fail_na', mandatoryPhotoOnFail: true },
    { id: '2', label: 'Brakes & Fluid Reservoir Level', section: 'Under Bonnet', type: 'pass_fail_na', mandatoryPhotoOnFail: true },
    { id: '3', label: 'Steering & Horn Operation', section: 'Cab', type: 'pass_fail_na', mandatoryPhotoOnFail: false },
    { id: '4', label: 'Windscreen, Mirrors & Wiper Washers', section: 'Glass', type: 'pass_fail_na', mandatoryPhotoOnFail: true },
    { id: '5', label: 'Lights, Indicators, Brake Lights & Hazards', section: 'Exterior', type: 'pass_fail_na', mandatoryPhotoOnFail: true },
    { id: '6', label: 'Seat Belts & Child Locks Functional', section: 'Safety', type: 'pass_fail_na', mandatoryPhotoOnFail: true, isSchoolSpecific: true },
    { id: '7', label: 'Wheelchair Ramp & Restraint Anchor Straps', section: 'Accessibility', type: 'pass_fail_na', mandatoryPhotoOnFail: true, isSchoolSpecific: true },
    { id: '8', label: 'First Aid Kit & Dry Powder Fire Extinguisher in Date', section: 'Emergency', type: 'yes_no', mandatoryPhotoOnFail: false }
  ]);

  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemSection, setNewItemSection] = useState('Exterior');
  const [newMandatoryPhoto, setNewMandatoryPhoto] = useState(true);

  const handleAddItem = () => {
    if (!newItemLabel.trim()) return;
    setCheckItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        label: newItemLabel.trim(),
        section: newItemSection,
        type: 'pass_fail_na',
        mandatoryPhotoOnFail: newMandatoryPhoto
      }
    ]);
    setNewItemLabel('');
  };

  const handleSimulatePassCheck = () => {
    submitDailyCheck({
      vehicleReg: 'LT73 XKL',
      driverId: 'drv-01',
      driverName: 'Tariq Mahmood',
      odometerReading: 42160,
      itemsChecked: checkItems.length,
      failuresCount: 0,
      status: 'passed'
    });
    alert('Simulated daily check submitted successfully! Vehicle is cleared for dispatch.');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Daily Checks &amp; Builder</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              UK Walkaround Standard
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            No-code custom checklist authoring with mandatory photo evidence on critical failures (Requirement CHK-01 to CHK-06).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'builder' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
            }`}
          >
            Checklist Builder
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'submissions' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
            }`}
          >
            Submissions ({dailyChecks.length})
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form Builder Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Walkaround Checklist Template (v2.4)
                </h3>
                <span className="text-xs text-slate-500">
                  {checkItems.length} inspection checkpoints
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {checkItems.map((item, idx) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.section}
                          </span>
                          {item.mandatoryPhotoOnFail && (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1">
                              <Camera className="w-3 h-3" /> Mandatory Photo If Failed
                            </span>
                          )}
                          {item.isSchoolSpecific && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              ★ School Contract Requirement
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckItems(prev => prev.filter(i => i.id !== item.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                      title="Remove checkpoint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Add New Item & Test Controls */}
          <div className="space-y-4">
            
            {/* Add Item Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Add Inspection Item
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Check Description</label>
                  <input
                    type="text"
                    placeholder="e.g. AdBlue level & exhaust warning"
                    value={newItemLabel}
                    onChange={e => setNewItemLabel(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Section Group</label>
                  <select
                    value={newItemSection}
                    onChange={e => setNewItemSection(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Exterior">Exterior</option>
                    <option value="Cab">Cab</option>
                    <option value="Safety">Safety</option>
                    <option value="Under Bonnet">Under Bonnet</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="photoReq"
                    checked={newMandatoryPhoto}
                    onChange={e => setNewMandatoryPhoto(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="photoReq" className="text-slate-700 dark:text-slate-300">
                    Require Photo on Failure
                  </label>
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add to Checklist</span>
                </button>
              </div>
            </div>

            {/* Simulation Shortcut */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Simulate Driver Submission</span>
              </h4>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                Click below to simulate driver Tariq submitting today's pass checklist for Mercedes V-Class LT73 XKL.
              </p>
              <button
                onClick={handleSimulatePassCheck}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition"
              >
                Submit Passed Check
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Submissions View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Today's Audit Log of Walkaround Submissions
            </h3>
            <span className="text-xs text-slate-500">Locked legal records</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dailyChecks.map(chk => (
              <div key={chk.id} className="p-4 flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    chk.status === 'passed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {chk.status === 'passed' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {chk.vehicleReg}
                      </span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        {chk.driverName}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({chk.checkRef})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Completed at {chk.timestamp} • Odometer: {chk.odometerReading.toLocaleString()} miles • {chk.itemsChecked} checks verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    chk.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {chk.status} ({chk.failuresCount} failures)
                  </span>
                  <button
                    onClick={() => alert(`Inspection report details for ${chk.checkRef}: All items locked, GPS and signature verified.`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
