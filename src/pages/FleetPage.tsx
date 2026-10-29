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
  Accessibility,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Gauge
} from 'lucide-react';
import { Vehicle } from '../types';

export const FleetPage: React.FC = () => {
  const { vehicles } = useData();
  const { selectedCompany } = useCompany();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedVehicleDetail, setSelectedVehicleDetail] = useState<Vehicle | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const displayedVehicles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search registration, make..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[42px] !pl-9 !text-xs w-44 sm:w-56"
            />
          </div>

          {/* Mobile Filters Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 h-[42px] px-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-heading font-bold text-[var(--text)] active:scale-95 transition"
          >
            <Filter className="w-4 h-4 text-[#3FE0C5]" />
            <span>Filters</span>
            {(searchQuery || filterStatus !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[#B6F23C]" />
            )}
          </button>

          <button
            onClick={() => alert('Add Vehicle Modal - Enter Registration, VIN, Seating, and Inspection Schedules')}
            className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[42px] flex items-center gap-1.5 shrink-0"
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

      {/* Vehicles Table / Mobile Stacked Cards Container */}
      <div className="nr-card overflow-hidden">
        
        {/* MOBILE VIEW: Stacked Card List (<768px) */}
        <div className="md:hidden divide-y divide-[var(--border)]">
          {displayedVehicles.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No vehicles found matching current filters.
            </div>
          ) : (
            displayedVehicles.map(v => {
              const isVor = v.status === 'blocked_off_road';
              return (
                <div key={v.id} className="p-4 space-y-3 text-xs">
                  {/* Card Header: Reg & Status Chip */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[#B6F23C] shrink-0 font-heading font-black text-xs">
                        {v.make.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-mono font-black text-sm text-[var(--text)] block tracking-wider">
                          {v.registration}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {v.make} {v.model} ({v.year})
                        </span>
                      </div>
                    </div>

                    <div>
                      {isVor ? (
                        <span className="chip-blocked px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> VOR
                        </span>
                      ) : (
                        <span className="chip-ready px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {v.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Fields Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-[var(--surface-2)] p-2.5 rounded-[12px] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block uppercase">Annual DVSA MOT</span>
                      <span className="font-bold text-[var(--text)]">{v.annualDvsaMot.expiryDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block uppercase">Council 6-Mo Due</span>
                      <span className="font-bold text-[var(--text)]">{v.councilSixMonthInspection.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block uppercase">Mileage</span>
                      <span className="text-[var(--text)]">{v.currentMileage.toLocaleString()} mi</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block uppercase">Seating</span>
                      <span className="text-[var(--text)]">{v.seatingCapacity} seats {v.hasRampOrLift ? '(WAV)' : ''}</span>
                    </div>
                  </div>

                  {/* View Details Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[var(--text-muted)]">Council: {v.councilSixMonthInspection.council}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleDetail(v)}
                      className="btn-secondary !h-[40px] !px-3.5 !text-xs flex items-center gap-1 font-bold active:scale-95"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* DESKTOP VIEW: Data Table (>=768px) with Sticky First Column & Scroll Hint */}
        <div className="hidden md:block overflow-x-auto table-scroll-hint">
          <table className="w-full text-left text-xs divide-y divide-[var(--border)] table-sticky-first">
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
              {displayedVehicles.map(v => (
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
                      onClick={() => setSelectedVehicleDetail(v)}
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

        {/* Large "Load More" Button / Pagination */}
        {hasMore && (
          <div className="p-4 border-t border-[var(--border)] text-center bg-[var(--surface-2)]/40">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="w-full sm:w-auto min-h-[48px] px-8 rounded-[14px] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] font-heading font-bold text-xs border border-[var(--border)] transition active:scale-98 shadow-sm"
            >
              Load More Vehicles ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>

      {/* Mobile Filters Bottom Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
          <div className="nr-card w-full rounded-t-[28px] p-5 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#3FE0C5]" />
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Filter Vehicles
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                  Search Reg / Make / Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD24, Mercedes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="nr-input text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                  Compliance Status
                </label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="nr-input text-base sm:text-xs cursor-pointer"
                >
                  <option value="all">All Vehicles</option>
                  <option value="available">Available / Active</option>
                  <option value="blocked_off_road">VOR (Blocked Off-Road)</option>
                  <option value="allocated">Allocated to Job</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setShowMobileFilters(false);
                }}
                className="btn-ghost flex-1 !h-[48px] !text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary flex-1 !h-[48px] !text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Detail Full-Screen / Bottom Sheet Modal */}
      {selectedVehicleDetail && (
        <div className="nr-modal-backdrop">
          <div className="nr-modal-sheet max-h-[92dvh] overflow-y-auto">
            {/* Sticky Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--surface)] z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center font-heading font-black text-sm">
                  {selectedVehicleDetail.make.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-[var(--text)]">
                    {selectedVehicleDetail.registration}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {selectedVehicleDetail.make} {selectedVehicleDetail.model} ({selectedVehicleDetail.year})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVehicleDetail(null)}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Status Banner */}
              <div className={`p-3 rounded-[14px] flex items-center justify-between ${
                selectedVehicleDetail.status === 'blocked_off_road' ? 'bg-[#FF5D6C]/15 border border-[#FF5D6C]/30 text-[#FF5D6C]' : 'bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399]'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {selectedVehicleDetail.status === 'blocked_off_road' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Road Status: {selectedVehicleDetail.status.toUpperCase()}</span>
                </div>
                {selectedVehicleDetail.hasRampOrLift && (
                  <span className="text-[10px] font-mono bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                    Certified WAV
                  </span>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2.5 bg-[var(--surface-2)] p-3 rounded-[16px] border border-[var(--border)] font-mono">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">VIN NUMBER</span>
                  <span className="font-bold text-[var(--text)]">{selectedVehicleDetail.vin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">CURRENT ODOMETER</span>
                  <span className="font-bold text-[var(--text)]">{selectedVehicleDetail.currentMileage.toLocaleString()} mi</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">SEATING CAPACITY</span>
                  <span className="font-bold text-[var(--text)]">{selectedVehicleDetail.seatingCapacity} seats</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">FUEL / POWERTRAIN</span>
                  <span className="font-bold text-[var(--text)]">{selectedVehicleDetail.fuelType}</span>
                </div>
              </div>

              {/* Statutory MOT & Council Inspection Deadlines */}
              <div className="space-y-2.5">
                <span className="font-heading font-bold text-xs text-[var(--text)] block uppercase tracking-wider">
                  Dual Statutory Compliance Deadlines
                </span>

                <div className="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>1. Annual DVSA MOT Certificate</span>
                    <span className="text-[#34D399]">{selectedVehicleDetail.annualDvsaMot.expiryDate}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Last tested {selectedVehicleDetail.annualDvsaMot.lastTestDate} with {selectedVehicleDetail.annualDvsaMot.advisoriesCount} advisories noted.
                  </p>
                </div>

                <div className="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>2. Council 6-Month Compliance Test</span>
                    <span className="text-[#FF9F6B]">{selectedVehicleDetail.councilSixMonthInspection.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Licensing Authority: {selectedVehicleDetail.councilSixMonthInspection.council}.
                    {selectedVehicleDetail.councilSixMonthInspection.designatedDepotRequired && ' Mandatory testing at council designated depot.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] sticky bottom-0 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedVehicleDetail(null)}
                className="btn-primary w-full !h-[48px] !text-xs font-bold"
              >
                Close Vehicle File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
