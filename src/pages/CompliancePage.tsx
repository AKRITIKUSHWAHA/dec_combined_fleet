import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle, 
  FileText,
  UserCheck
} from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const { staff } = useData();
  const { currentRole, canViewDBS, canViewSafeguarding } = useRole();

  const [activeTab, setActiveTab] = useState<'dvla' | 'dbs' | 'safeguarding'>('dvla');
  const [isCheckingDvla, setIsCheckingDvla] = useState(false);

  const handleSimulateDvlaCheck = () => {
    setIsCheckingDvla(true);
    setTimeout(() => {
      setIsCheckingDvla(false);
      alert('DVLA Access to Driver Data (ADD) check completed. 4 records verified with DVLA gateway.');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Compliance, DVLA &amp; DBS Assurance</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
              GDPR &amp; DBS Controls
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Strict role-based field masking: Controllers see only "Cleared / Pending / Restricted" (DBS-04).
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dvla')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dvla' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
            }`}
          >
            DVLA Licence Checks
          </button>
          <button
            onClick={() => setActiveTab('dbs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dbs' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
            }`}
          >
            DBS Update Service
          </button>
          <button
            onClick={() => setActiveTab('safeguarding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              activeTab === 'safeguarding' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-300' : 'text-slate-500'
            }`}
          >
            <Lock className="w-3 h-3 text-rose-500" />
            <span>Safeguarding Cases</span>
          </button>
        </div>
      </div>

      {/* Role Notice on Compliance Access */}
      {!canViewDBS && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Controller Privacy Barrier Active (DBS-04):</span>{' '}
            You are logged in as a <strong>Controller</strong>. Sensitive criminal record certificate numbers, conviction narratives, and medical details are redacted and hidden by the system. You only see operational clearance.
          </div>
        </div>
      )}

      {/* DVLA Tab */}
      {activeTab === 'dvla' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Automated DVLA Licence Check Register (ADD Integration)
              </h3>
              <p className="text-xs text-slate-500">
                Weekly risk-based lookup of points, endorsements, and entitlement categories.
              </p>
            </div>

            <button
              onClick={handleSimulateDvlaCheck}
              disabled={isCheckingDvla}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDvla ? 'animate-spin' : ''}`} />
              <span>{isCheckingDvla ? 'Querying DVLA...' : 'Run Scheduled Lookup'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Staff Name / Role</th>
                  <th className="p-3">Driving Licence No.</th>
                  <th className="p-3">DVLA Status</th>
                  <th className="p-3">Penalty Points</th>
                  <th className="p-3">Last Check</th>
                  <th className="p-3">Clearance Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {staff.map(s => {
                  const lic = s.drivingLicence;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{s.role.replace('_', ' ')}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {lic ? lic.licenceNumber : <span className="text-slate-400 font-normal">N/A (PA Only)</span>}
                      </td>
                      <td className="p-3">
                        {lic ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {lic.dvlaStatus}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3">
                        {lic ? (
                          <span className={`font-bold ${lic.penaltyPoints > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {lic.penaltyPoints} Points ({lic.endorsementsCount} endorsements)
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3 text-slate-500">
                        {lic ? lic.dvlaLastCheckDate : '—'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.operationalClearance === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.operationalClearance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DBS Tab with Strict Masking */}
      {activeTab === 'dbs' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                DBS Update Service &amp; Enhanced Barred-List Verification
              </h3>
              <p className="text-xs text-slate-500">
                Children's &amp; Adults' Barred List checks for school transport staff.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {canViewDBS ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
              <span>{canViewDBS ? 'HR Full Access Mode' : 'Controller Redacted Mode'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">DBS Certificate No.</th>
                  <th className="p-3">Update Service Status</th>
                  <th className="p-3">Last Checked</th>
                  <th className="p-3">Suitability Decision</th>
                  <th className="p-3">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {staff.map(s => {
                  const dbs = s.dbsCheck;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{s.role.replace('_', ' ')}</div>
                      </td>

                      {/* Certificate Number (Masked for Controllers) */}
                      <td className="p-3 font-mono">
                        {canViewDBS ? (
                          <span className="font-bold text-slate-900 dark:text-white">
                            {dbs?.certificateNumber || 'Pending Check'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium italic">
                            [Redacted by Privacy Gate]
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {dbs?.updateServiceRegistered ? 'Active Subscription' : 'Manual Annual'}
                        </span>
                      </td>

                      <td className="p-3 text-slate-500">
                        {dbs?.lastCheckedDate || '15/10/2026'}
                      </td>

                      {/* Suitability Decision (Restricted for Controllers) */}
                      <td className="p-3">
                        {canViewDBS ? (
                          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                            {dbs?.suitabilityDecision.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            [Restricted to HR]
                          </span>
                        )}
                      </td>

                      {/* Operational Clearance is always visible to Controllers */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.operationalClearance === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.operationalClearance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Safeguarding Cases Tab */}
      {activeTab === 'safeguarding' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Safeguarding Incident Case Register (Confidential PEO-06)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Accessible ONLY to designated Safeguarding Lead Officers.
              </p>
            </div>
          </div>

          {canViewSafeguarding ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-600">CASE-SAFE-2026-004</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">Under Investigation</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                Passenger Support Query: Non-verbal pupil wheelchair strap check
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Safeguarding Officer Assigned: Eleanor Vance (Lead Designated Officer). Central Bedfordshire SEN contract review logged.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Lock className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Access Prohibited: Controller role cannot view Safeguarding Case Narratives.
              </p>
              <p className="text-[11px] text-slate-400">
                Switch your active persona to HR/Vetting or Owner in the header to view this confidential register.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
