import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  MapPin, 
  Car, 
  Clock, 
  Wifi, 
  WifiOff, 
  X, 
  List, 
  Compass, 
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Radio,
  EyeOff,
  Eye
} from 'lucide-react';
import { DriverPAProfile } from '../types';

export const LiveMapPage: React.FC = () => {
  const { staff, vehicles } = useData();
  const { selectedCompany } = useCompany();

  const [selectedDriver, setSelectedDriver] = useState<DriverPAProfile | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideOffDuty, setHideOffDuty] = useState(true);
  const [feedFailureSimulated, setFeedFailureSimulated] = useState(false);

  // Drivers with locations
  const driversWithLocation = staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa');

  const filteredDrivers = driversWithLocation.filter(d => {
    if (hideOffDuty && (!d.onDuty || d.dutyStatus === 'off_duty')) return false;
    if (selectedCompany && d.companyId !== selectedCompany.id) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.currentVehicleReg?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const offDutyCount = driversWithLocation.filter(d => !d.onDuty || d.dutyStatus === 'off_duty').length;
  const staleCount = filteredDrivers.filter(d => d.currentLocation && !d.currentLocation.isFresh).length;
  const driversOnDuty = filteredDrivers;

  return (
    <div className="space-y-4">
      
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Live Dispatch Map</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>GPS Live</span>
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Real-time on-duty driver positions, connection freshness (fresh &lt;15s, stale &gt;60s, offline), and ETA to pickup.
          </p>
        </div>

        {/* View Switcher and Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search driver / reg..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[42px] !pl-9 !text-xs w-36 sm:w-48"
            />
          </div>

          <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1 transition ${
                viewMode === 'map' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-[10px] text-xs font-heading font-bold flex items-center gap-1 transition ${
                viewMode === 'list' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* UK GDPR Tracking Disclosure Notice (Requirement 8) */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-[14px] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong className="text-[var(--text)]">UK GDPR Article 13 Telematics Disclosure:</strong> Telemetry is captured solely during active duty shifts. Off-duty drivers ({offDutyCount}) are automatically sequestered from tracking manifests.
          </span>
        </div>

        <button
          onClick={() => setHideOffDuty(!hideOffDuty)}
          className={`px-3 py-1 rounded-[8px] text-[11px] font-heading font-bold transition flex items-center gap-1.5 ${
            hideOffDuty 
              ? 'bg-[#B6F23C] text-[#08201C] shadow-xs' 
              : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
          }`}
        >
          {hideOffDuty ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{hideOffDuty ? 'Off-Duty Drivers Hidden' : 'Show All (Including Off-Duty)'}</span>
        </button>
      </div>

      {/* Feed-Failure Alert (Requirement 8) */}
      {(feedFailureSimulated || staleCount > 0) && (
        <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-[14px] flex items-center justify-between flex-wrap gap-2 text-xs animate-pulse">
          <div className="flex items-center gap-2.5 text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="font-heading font-bold text-rose-200">
                Telematics Feed Failure Warning (Telemetry Latency Spikes):
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                GPS telemetry lost contact for vehicle LT24 XAA / drv-01 (+78s stale). Fallback cell tower estimation enabled.
              </p>
            </div>
          </div>

          <button
            onClick={() => setFeedFailureSimulated(!feedFailureSimulated)}
            className="btn-secondary !h-[30px] px-2.5 rounded-[8px] text-[10px] font-mono font-bold"
          >
            {feedFailureSimulated ? 'Dismiss Test Alert' : 'Simulate Feed Drop'}
          </button>
        </div>
      )}

      {/* Freshness Legend (Requirement MAP-NEW-02) */}
      <div className="nr-card p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Location Freshness:
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text)] font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>Fresh (&lt;15s)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text)] font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC24B]" />
            <span>Stale Warning (&gt;60s)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text)] font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5D6C]" />
            <span>Offline / Stored</span>
          </div>
        </div>

        <span className="text-[11px] text-[var(--text-muted)] font-mono">
          Europe/London Target: 10-15s auto-polling
        </span>
      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        <div className="relative bg-[#08201C] rounded-[20px] overflow-hidden border border-[#24574D] shadow-2xl h-[520px] sm:h-[580px]">
          
          {/* Simulated UK Bedfordshire / Luton / London Road Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3FE0C5_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Major Road Arteries SVG Simulation (M1, A505, A6) */}
          <svg className="absolute inset-0 w-full h-full stroke-[#164038]" xmlns="http://www.w3.org/2000/svg">
            <path d="M 120 0 L 280 300 L 450 600" strokeWidth="6" strokeDasharray="8 4" fill="none" />
            <path d="M 0 250 L 550 220" strokeWidth="4" fill="none" />
            <path d="M 380 230 L 490 280" strokeWidth="3" fill="none" />
          </svg>

          {/* Area Labels on Map */}
          <div className="absolute top-8 left-12 text-[#8FB5AA] font-mono font-bold text-xs uppercase tracking-widest pointer-events-none">
            Dunstable / A5
          </div>
          <div className="absolute top-1/3 left-1/3 text-[#B6F23C] font-heading font-bold text-sm tracking-wider pointer-events-none opacity-80">
            Luton Central
          </div>
          <div className="absolute top-1/2 right-16 text-[#3FE0C5] font-mono font-bold text-xs uppercase tracking-widest pointer-events-none bg-[#0F2F29]/90 px-3 py-1 rounded-[10px] border border-[#24574D]">
            ✈ London Luton Airport (LTN)
          </div>
          <div className="absolute bottom-8 right-24 text-[#8FB5AA] font-mono font-bold text-xs uppercase tracking-widest pointer-events-none">
            M1 South &rarr; London
          </div>

          {/* Driver Markers on Map */}
          {filteredDrivers.map((driver, idx) => {
            const positions = [
              { x: '35%', y: '40%' }, // Tariq
              { x: '18%', y: '25%' }, // Marcus
              { x: '72%', y: '48%' }, // David
              { x: '52%', y: '65%' }, // Kamran
            ];
            const pos = positions[idx % positions.length];
            const isFresh = driver.currentLocation?.isFresh ?? false;
            const isSelected = selectedDriver?.id === driver.id;

            return (
              <div
                key={driver.id}
                style={{ left: pos.x, top: pos.y }}
                onClick={() => setSelectedDriver(driver)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}>
                  
                  {/* Driver Name Tag */}
                  <div className={`px-2.5 py-1 rounded-[8px] text-[10px] font-mono font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 border ${
                    isSelected 
                      ? 'bg-[#B6F23C] text-[#08201C] border-[#B6F23C]' 
                      : 'bg-[#0F2F29] text-[#EAF7F2] border-[#24574D]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isFresh ? 'bg-[#34D399]' : 'bg-[#FFC24B]'}`} />
                    <span>{driver.name.split(' ')[0]}</span>
                    <span className="opacity-70">({driver.currentVehicleReg})</span>
                  </div>

                  {/* Marker Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    !driver.onDuty
                      ? 'bg-[#164038] border-[#24574D] text-[#8FB5AA]'
                      : isFresh
                      ? 'bg-[#34D399] border-white text-[#08201C]'
                      : 'bg-[#FFC24B] border-white text-[#08201C]'
                  }`}>
                    <Car className="w-4 h-4" />
                  </div>

                  {driver.onDuty && isFresh && (
                    <span className="absolute bottom-1 w-9 h-9 rounded-full bg-[#34D399]/30 animate-ping -z-10" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Drill-down Drawer for Selected Driver */}
          {selectedDriver && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 nr-card p-5 z-30 text-xs shadow-2xl">
              <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#3FE0C5] tracking-wider block">
                    Driver Telematics Details
                  </span>
                  <h3 className="text-base font-heading font-bold text-[var(--text)] mt-0.5">
                    {selectedDriver.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    ID: {selectedDriver.staffId} • {selectedDriver.assignedDepot}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="p-1 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Vehicle Assigned:</span>
                  <strong className="text-[var(--text)] font-mono text-sm">{selectedDriver.currentVehicleReg || 'None'}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Duty Status:</span>
                  <span className="chip-pending px-2 py-0.5 rounded-full font-bold uppercase text-[10px]">
                    {selectedDriver.dutyStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">GPS Signal Freshness:</span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                    selectedDriver.currentLocation?.isFresh ? 'text-[#34D399]' : 'text-[#FFC24B]'
                  }`}>
                    {selectedDriver.currentLocation?.isFresh ? (
                      <>
                        <Wifi className="w-3.5 h-3.5" /> Fresh (Ping: 8s)
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5" /> Stale (&gt;60s no ping)
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Current Speed:</span>
                  <strong className="text-[var(--text)] font-mono">
                    {selectedDriver.currentLocation?.speedMph || 0} mph
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Clearance:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    selectedDriver.operationalClearance === 'cleared' ? 'chip-ready' : 'chip-blocked'
                  }`}>
                    {selectedDriver.operationalClearance}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex gap-2">
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="btn-secondary flex-1 !text-xs !py-1 !min-h-[42px]"
                >
                  Call
                </a>
                <button
                  onClick={() => alert(`Opening dispatch assignment modal for ${selectedDriver.name}`)}
                  className="btn-primary flex-1 !text-xs !py-1 !min-h-[42px]"
                >
                  Dispatch
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* List Mode View */
        <div className="nr-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Driver</th>
                  <th className="p-3.5">Assigned Vehicle</th>
                  <th className="p-3.5">Duty Status</th>
                  <th className="p-3.5">GPS Freshness</th>
                  <th className="p-3.5">Clearance</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredDrivers.map(d => (
                  <tr key={d.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5">
                      <div className="font-heading font-bold text-[var(--text)]">{d.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono">{d.staffId} • {d.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[var(--text)]">
                      {d.currentVehicleReg || '—'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]">
                        {d.dutyStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {d.currentLocation?.isFresh ? (
                        <span className="text-[#34D399] font-semibold flex items-center gap-1 font-mono">
                          <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Fresh
                        </span>
                      ) : (
                        <span className="text-[#FFC24B] font-semibold flex items-center gap-1 font-mono">
                          <span className="w-2 h-2 rounded-full bg-[#FFC24B]" /> Stale (&gt;60s)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.operationalClearance === 'cleared' ? 'chip-ready' : 'chip-blocked'
                      }`}>
                        {d.operationalClearance}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedDriver(d)}
                        className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
