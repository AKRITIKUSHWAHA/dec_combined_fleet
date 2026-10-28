import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  Car, 
  Search, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Wrench, 
  PlusCircle, 
  FileText,
  Accessibility
} from 'lucide-react';

export const FleetPage: React.FC = () => {
  const { vehicles } = useData();
  const { selectedCompany } = useCompany();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = vehicles.filter(v => {
    if (selectedCompany && v.companyId !== selectedCompany.id) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return v.registration.toLowerCase().includes(q) ||
             v.make.toLowerCase().includes(q) ||
             v.model.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Fleet & Dual MOT Compliance</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              {filtered.length} Vehicles
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Independent tracking of Annual DVSA MOT vs Council 6-Month Inspections (Requirement VEH-02) with 1-month advance reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search registration, make..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => alert('Add Vehicle Modal - Enter Registration, VIN, Seating, and Inspection Schedules')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Compliance Rule Info Box */}
      <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
        <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold text-amber-900 dark:text-amber-200">
            Independent Expiry Logic (VEH-02 &amp; VEH-04):
          </span>{' '}
          An official DVSA MOT API update updates only the annual certificate expiry. It does <em>not</em> alter or clear local council 6-month compliance test deadlines. Reminders trigger 1 calendar month in advance.
        </div>
      </div>

      {/* Vehicles Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Vehicle Details</th>
                <th className="p-3">Accessibility &amp; Fuel</th>
                <th className="p-3">Annual DVSA MOT</th>
                <th className="p-3">Council 6-Month Test</th>
                <th className="p-3">Road Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold text-xs">
                        {v.make.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                          {v.registration}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {v.make} {v.model} ({v.year})
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          VIN: {v.vin}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {v.seatingCapacity} seats • {v.fuelType}
                      </div>
                      {v.hasRampOrLift && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                          <Accessibility className="w-3 h-3" /> Ramp / Lift ({v.wheelchairCapacity} Wheelchair)
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400">
                        {v.currentMileage.toLocaleString()} miles
                      </div>
                    </div>
                  </td>

                  {/* Independent Deadline 1: Annual MOT */}
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {v.annualDvsaMot.expiryDate}
                        </span>
                        {v.annualDvsaMot.status === 'due_soon' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            1-MO REMINDER
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Last Tested: {v.annualDvsaMot.lastTestDate} • {v.annualDvsaMot.advisoriesCount} advisories
                      </p>
                    </div>
                  </td>

                  {/* Independent Deadline 2: Council 6-Month Test */}
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {v.councilSixMonthInspection.dueDate}
                        </span>
                        {v.councilSixMonthInspection.status === 'due_soon' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            DUE SOON
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {v.councilSixMonthInspection.council}
                        {v.councilSixMonthInspection.designatedDepotRequired && (
                          <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                            ★ Designated Depot Mandatory
                          </span>
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Road Status */}
                  <td className="p-3">
                    {v.status === 'blocked_off_road' ? (
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> VOR (Off-Road)
                        </span>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 max-w-[180px] line-clamp-1" title={v.isOffRoadReason}>
                          {v.isOffRoadReason}
                        </p>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {v.status}
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => alert(`Showing compliance history and MOT test logs for ${v.registration}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
