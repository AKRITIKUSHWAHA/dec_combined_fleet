import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Car, 
  GraduationCap, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  PlusCircle
} from 'lucide-react';
import { DriverPAProfile } from '../types';

export const WorkforcePage: React.FC = () => {
  const { staff } = useData();
  const { selectedCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'all' | 'drivers' | 'pas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<DriverPAProfile | null>(null);

  const filtered = staff.filter(s => {
    if (selectedCompany && s.companyId !== selectedCompany.id) return false;
    if (activeTab === 'drivers' && s.role === 'pa') return false;
    if (activeTab === 'pas' && s.role === 'driver') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
             s.staffId.toLowerCase().includes(q) ||
             s.phone.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Workforce Management (Drivers &amp; PAs)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              {filtered.length} Staff
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Dedicated PA profiles (PA-NEW-01) with no driving licence requirement &amp; dual-role person records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              All Staff
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'drivers' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('pas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'pas' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              PAs Only
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff ID or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* PA & Dual Role Rule Banner */}
      <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
        <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dual-Role &amp; PA Policy (PA-NEW-01):</span>{' '}
          Passenger Assistants (PAs) require council authorisation, safeguarding, and PAT training, but <em>never</em> a driving licence. A staff member who both drives and escorts (e.g. <strong>Marcus Bell</strong>) maintains a single linked identity.
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(person => {
          const isDual = person.role === 'dual_driver_pa';
          const isPA = person.role === 'pa';
          const isRestricted = person.operationalClearance === 'restricted';

          return (
            <div
              key={person.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {person.staffId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-500">{person.assignedDepot}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isDual
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : isPA
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {isDual ? 'Dual (Driver + PA)' : isPA ? 'Passenger Assistant' : 'Driver'}
                  </span>
                </div>

                {/* Duty & Clearance */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    person.operationalClearance === 'cleared'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {person.operationalClearance}
                  </span>

                  <span className="text-[11px] text-slate-500">
                    Status: <strong className="capitalize">{person.dutyStatus.replace('_', ' ')}</strong>
                  </span>
                </div>

                {/* Credentials Preview */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  {person.drivingLicence ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Driving Licence:</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {person.drivingLicence.dvlaStatus.toUpperCase()} ({person.drivingLicence.penaltyPoints} pts)
                      </strong>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      ✓ Non-Driving Role (No Licence Required)
                    </div>
                  )}

                  {person.paAuthorisation && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Council PA Authorisation:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        Valid to {person.paAuthorisation.expiryDate}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Safeguarding:</span>
                    <strong className="text-emerald-600">Valid to 2027</strong>
                  </div>
                </div>

                {isRestricted && person.clearanceReason && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-2 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
                    {person.clearanceReason}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <a
                  href={`tel:${person.phone}`}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-semibold text-xs text-slate-700 dark:text-slate-200"
                >
                  Call
                </a>
                <button
                  onClick={() => alert(`Full staff file for ${person.name}: Training badges, route pairings, and audit history.`)}
                  className="flex-1 py-2 text-center rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white"
                >
                  Full Profile
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
