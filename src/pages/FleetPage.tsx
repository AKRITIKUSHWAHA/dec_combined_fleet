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
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Fleet &amp; Dual MOT Compliance</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              {filtered.length} Vehicles
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Independent tracking of Annual DVSA MOT vs Council 6-Month Inspections (Requirement VEH-02) with 1-month advance reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search registration, make..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[42px] !pl-9 !text-xs w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => alert('Add Vehicle Modal - Enter Registration, VIN, Seating, and Inspection Schedules')}
            className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Compliance Rule Info Box */}
      <div className="bg-[#FFC24B]/10 border border-[#FFC24B]/40 p-3.5 rounded-[16px] flex items-start gap-2.5 text-xs text-[var(--text)]">
        <Calendar className="w-4 h-4 text-[#FFC24B] shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">
            Independent Expiry Logic (VEH-02 &amp; VEH-04):
          </span>{' '}
          An official DVSA MOT API update updates only the annual certificate expiry. It does <em>not</em> alter or clear local council 6-month compliance test deadlines. Reminders trigger 1 calendar month in advance.
        </div>
      </div>

      {/* Vehicles Table / Cards */}
      <div className="nr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
              <tr>
                <th className="p-3.5">Vehicle Details</th>
                <th className="p-3.5">Accessibility &amp; Fuel</th>
                <th className="p-3.5">Annual DVSA MOT</th>
                <th className="p-3.5">Council 6-Month Test</th>
                <th className="p-3.5">Road Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[#B6F23C] shrink-0 font-heading font-bold text-xs">
                        {v.make.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-[var(--text)] text-xs">
                          {v.registration}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {v.make} {v.model} ({v.year})
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono">
                          VIN: {v.vin}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <div className="font-medium text-[var(--text)]">
                        {v.seatingCapacity} seats • {v.fuelType}
                      </div>
                      {v.hasRampOrLift && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3FE0C5] bg-[#3FE0C5]/15 border border-[#3FE0C5]/30 px-2 py-0.5 rounded-full font-mono">
                          <Accessibility className="w-3 h-3" /> Ramp ({v.wheelchairCapacity} Wheelchair)
                        </span>
                      )}
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        {v.currentMileage.toLocaleString()} miles
                      </div>
                    </div>
                  </td>

                  {/* Independent Deadline 1: Annual MOT */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-[var(--text)]">
                          {v.annualDvsaMot.expiryDate}
                        </span>
                        {v.annualDvsaMot.status === 'due_soon' && (
                          <span className="chip-due-soon px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                            1-MO REMINDER
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        Last Tested: {v.annualDvsaMot.lastTestDate} • {v.annualDvsaMot.advisoriesCount} advisories
                      </p>
                    </div>
                  </td>

                  {/* Independent Deadline 2: Council 6-Month Test */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-[var(--text)]">
                          {v.councilSixMonthInspection.dueDate}
                        </span>
                        {v.councilSixMonthInspection.status === 'due_soon' && (
                          <span className="chip-due-soon px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                            DUE SOON
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {v.councilSixMonthInspection.council}
                        {v.councilSixMonthInspection.designatedDepotRequired && (
                          <span className="block text-[10px] text-[#FF9F6B] font-bold">
                            ★ Designated Depot Mandatory
                          </span>
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Road Status */}
                  <td className="p-3.5">
                    {v.status === 'blocked_off_road' ? (
                      <div>
                        <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> VOR (Off-Road)
                        </span>
                        <p className="text-[10px] text-[#FF5D6C] mt-1 max-w-[180px] line-clamp-1" title={v.isOffRoadReason}>
                          {v.isOffRoadReason}
                        </p>
                      </div>
                    ) : (
                      <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {v.status}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => alert(`Showing compliance history and MOT test logs for ${v.registration}`)}
                      className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
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
