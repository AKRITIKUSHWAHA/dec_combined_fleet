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
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Daily Checks &amp; Builder</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              UK Walkaround Standard
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            No-code custom checklist authoring with mandatory photo evidence on critical failures (Requirement CHK-01 to CHK-06).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'builder' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Checklist Builder
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'submissions' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
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
            <div className="nr-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                  Active Walkaround Checklist Template (v2.4)
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {checkItems.length} inspection checkpoints
                </span>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {checkItems.map((item, idx) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center font-mono font-bold text-[11px] text-[#B6F23C] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-[var(--text)]">
                          {item.label}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)] flex-wrap">
                          <span className="px-2 py-0.5 rounded-[6px] bg-[var(--surface-2)] text-[var(--text)] font-medium">
                            {item.section}
                          </span>
                          {item.mandatoryPhotoOnFail && (
                            <span className="text-[#3FE0C5] font-semibold inline-flex items-center gap-1 font-mono">
                              <Camera className="w-3 h-3" /> Mandatory Photo If Failed
                            </span>
                          )}
                          {item.isSchoolSpecific && (
                            <span className="text-[#FF9F6B] font-bold">
                              ★ School Contract Requirement
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckItems(prev => prev.filter(i => i.id !== item.id))}
                      className="p-2 text-[var(--text-muted)] hover:text-[#FF5D6C] transition"
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
            <div className="nr-card p-5 space-y-3.5">
              <h3 className="font-heading font-bold text-[var(--text)] text-xs uppercase tracking-wider">
                Add Inspection Item
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Check Description</label>
                  <input
                    type="text"
                    placeholder="e.g. AdBlue level & exhaust warning"
                    value={newItemLabel}
                    onChange={e => setNewItemLabel(e.target.value)}
                    className="nr-input !h-[44px] !px-3"
                  />
                </div>

                <div>
                  <label className="font-heading font-semibold block mb-1 text-[var(--text)]">Section Group</label>
                  <select
                    value={newItemSection}
                    onChange={e => setNewItemSection(e.target.value)}
                    className="nr-input !h-[44px] !px-3"
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
                    className="w-4 h-4 rounded accent-[#B6F23C]"
                  />
                  <label htmlFor="photoReq" className="text-[var(--text)] font-medium">
                    Require Photo on Failure
                  </label>
                </div>

                <button
                  onClick={handleAddItem}
                  className="btn-primary w-full !text-xs !py-1 !min-h-[44px]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add to Checklist</span>
                </button>
              </div>
            </div>

            {/* Simulation Shortcut */}
            <div className="bg-[#34D399]/15 border border-[#34D399]/40 p-4 rounded-[18px] space-y-2.5 text-xs">
              <h4 className="font-heading font-bold text-[#065F46] dark:text-[#34D399] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#34D399]" />
                <span>Simulate Driver Submission</span>
              </h4>
              <p className="text-[var(--text)] text-[11px] leading-relaxed">
                Click below to simulate driver Tariq submitting today's pass checklist for Mercedes V-Class LT73 XKL.
              </p>
              <button
                onClick={handleSimulatePassCheck}
                className="btn-primary w-full !text-xs !py-1 !min-h-[42px]"
              >
                Submit Passed Check
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Submissions View */
        <div className="nr-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Today's Audit Log of Walkaround Submissions
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-mono">Locked legal records</span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {dailyChecks.map(chk => (
              <div key={chk.id} className="p-4 flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold ${
                    chk.status === 'passed' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#FF5D6C]/20 text-[#FF5D6C]'
                  }`}>
                    {chk.status === 'passed' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--text)] text-sm">
                        {chk.vehicleReg}
                      </span>
                      <span className="font-heading font-bold text-[var(--text)]">
                        {chk.driverName}
                      </span>
                      <span className="text-[var(--text-muted)] font-mono text-[11px]">
                        ({chk.checkRef})
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                      Completed at {chk.timestamp} • Odometer: {chk.odometerReading.toLocaleString()} miles • {chk.itemsChecked} checks verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    chk.status === 'passed' ? 'chip-ready' : 'chip-blocked'
                  }`}>
                    {chk.status} ({chk.failuresCount} failures)
                  </span>
                  <button
                    onClick={() => alert(`Inspection report details for ${chk.checkRef}: All items locked, GPS and signature verified.`)}
                    className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
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
