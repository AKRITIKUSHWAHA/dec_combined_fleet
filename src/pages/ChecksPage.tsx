import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChecklistTemplateItem, ChecklistVersion } from '../types';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Clock, 
  History, 
  X, 
  Eye, 
  FileText, 
  Sparkles,
  ShieldCheck,
  Search,
  GripVertical
} from 'lucide-react';

export const ChecksPage: React.FC = () => {
  const { 
    dailyChecks, 
    checklistVersions, 
    activeChecklist, 
    reorderChecklistItems, 
    publishChecklistVersion 
  } = useData();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'audit_log' | 'builder'>('builder');

  // Checklist Builder state
  const [builderItems, setBuilderItems] = useState<ChecklistTemplateItem[]>(activeChecklist?.items || []);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newVersionInput, setNewVersionInput] = useState('v2.5');
  const [authorInput, setAuthorInput] = useState('Alan Cooper (Compliance Lead)');
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  
  // Add item form
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'exterior' | 'mechanical' | 'safety' | 'accessibility'>('mechanical');
  const [newItemPhotoReq, setNewItemPhotoReq] = useState(false);
  const [newItemWavOnly, setNewItemWavOnly] = useState(false);

  // Sync builder items when activeChecklist changes
  React.useEffect(() => {
    if (activeChecklist) {
      setBuilderItems(activeChecklist.items);
    }
  }, [activeChecklist]);

  // Reorder helpers
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= builderItems.length) return;

    const updated = [...builderItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setBuilderItems(updated);
    reorderChecklistItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = builderItems.filter(item => item.id !== id);
    setBuilderItems(updated);
    reorderChecklistItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem: ChecklistTemplateItem = {
      id: `chk-custom-${Date.now()}`,
      label: newItemLabel.trim(),
      category: newItemCategory,
      requiresPhotoOnFail: newItemPhotoReq,
      wavOnly: newItemWavOnly
    };

    const updated = [...builderItems, newItem];
    setBuilderItems(updated);
    reorderChecklistItems(updated);
    setNewItemLabel('');
    setIsAddItemOpen(false);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    publishChecklistVersion(newVersionInput, authorInput, builderItems);
    setIsPublishModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Daily Walkaround Checks & Template Builder
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Author mandatory DVSA vehicle pre-use checklists with drag-reorder, version control, and over-the-air mobile deployment.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Checklist Builder (Office)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit_log')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'audit_log'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inspection Audit Log ({dailyChecks.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         TAB 1: CHECKLIST BUILDER (OFFICE)
         ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          
          {/* Builder Control Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold font-mono text-xs border border-blue-300 dark:border-blue-900">
                Active Template: {activeChecklist?.version || 'v2.4'}
              </span>
              <span className="text-slate-500 text-[11px]">
                {builderItems.length} inspection check items • Published {activeChecklist?.publishedAt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHistoryDrawerOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Version History ({checklistVersions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddItemOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Check Item</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Publish New Version</span>
              </button>
            </div>
          </div>

          {/* Drag-Reorder Inspection Items List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span>Item Sequence & Checklist Criteria</span>
              <span>Reorder / Controls</span>
            </div>

            <div className="space-y-2">
              {builderItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs transition hover:border-blue-400"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                        {item.wavOnly && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            WAV Only
                          </span>
                        )}
                      </div>

                      {item.requiresPhotoOnFail && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                          * Photo capture mandatory if driver marks Fail
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 text-slate-600 dark:text-slate-300 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === builderItems.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 text-slate-600 dark:text-slate-300 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 2: INSPECTION AUDIT LOG
         ========================================================================= */}
      {activeTab === 'audit_log' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Inspection Ref</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Driver / Inspector</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Odometer</th>
                  <th className="py-3 px-4">Defects</th>
                  <th className="py-3 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dailyChecks.map(chk => (
                  <tr key={chk.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {chk.checkRef}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white">
                      {chk.vehicleReg}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {chk.driverName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {chk.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {chk.odometerReading.toLocaleString()} mi
                    </td>
                    <td className="py-3 px-4">
                      {chk.failuresCount > 0 ? (
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {chk.failuresCount} Defect(s)
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Clean (0)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        chk.status === 'passed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {chk.status === 'passed' ? '✓ Passed Roadworthy' : '✗ Failed / Defect Escalated'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <form onSubmit={handleAddItem} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Inspection Criteria
              </h3>
              <button type="button" onClick={() => setIsAddItemOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Item Description:
                </label>
                <input
                  type="text"
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="e.g. Steering wheel free play & power assist"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category:
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                >
                  <option value="mechanical">Mechanical (Brakes, Steering, Tyres)</option>
                  <option value="exterior">Exterior & Visibility (Lights, Glass, Wipers)</option>
                  <option value="accessibility">Accessibility & WAV (Ramp, Floor tracking)</option>
                  <option value="safety">Safety Equipment (First Aid, Extinguisher)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemPhotoReq}
                    onChange={(e) => setNewItemPhotoReq(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Mandatory photo capture if marked Defect</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemWavOnly}
                    onChange={(e) => setNewItemWavOnly(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Display only on Wheelchair Accessible Vehicles (WAV)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddItemOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Add Criteria
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PUBLISH VERSION MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <form onSubmit={handlePublish} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Publish New Template Version
              </h3>
              <button type="button" onClick={() => setIsPublishModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Publishing will deploy this template immediately over-the-air to all driver mobile tablets. Current version will be safely archived.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  New Version Tag:
                </label>
                <input
                  type="text"
                  value={newVersionInput}
                  onChange={(e) => setNewVersionInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono font-bold text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Author / Approver:
                </label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Publish & Deploy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VERSION HISTORY DRAWER */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slideLeft">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Template Version History</span>
              </h3>
              <button onClick={() => setIsHistoryDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              {checklistVersions.map(ver => (
                <div key={ver.version} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                      {ver.version}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ver.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {ver.status === 'active' ? '● CURRENT ACTIVE' : 'Archived'}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">
                    Published by: <strong>{ver.publishedBy}</strong> on {ver.publishedAt}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>{ver.items.length} Check Criteria</span>
                    {ver.status !== 'active' && (
                      <button
                        type="button"
                        onClick={() => {
                          setBuilderItems(ver.items);
                          reorderChecklistItems(ver.items);
                          setIsHistoryDrawerOpen(false);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Restore Items &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
