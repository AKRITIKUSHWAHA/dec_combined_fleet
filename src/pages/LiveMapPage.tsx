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
  Filter
} from 'lucide-react';
import { DriverPAProfile } from '../types';

export const LiveMapPage: React.FC = () => {
  const { staff, vehicles } = useData();
  const { selectedCompany } = useCompany();

  const [selectedDriver, setSelectedDriver] = useState<DriverPAProfile | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  // Drivers with locations
  const driversOnDuty = staff.filter(s => s.role === 'driver' || s.role === 'dual_driver_pa');

  const filteredDrivers = driversOnDuty.filter(d => {
    if (selectedCompany && d.companyId !== selectedCompany.id) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.currentVehicleReg?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Live Dispatch Map</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              GPS Active
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time on-duty driver positions, connection freshness (fresh, stale &gt;60s, offline), and ETA to pickup.
          </p>
        </div>

        {/* View Switcher and Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver / reg..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none w-36 sm:w-48"
            />
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'map' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Freshness Legend (Requirement MAP-NEW-02) */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Location Freshness:
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Fresh (&lt;15s)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Stale Warning (&gt;60s)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Offline / Stored</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Europe/London Target: 10-15s auto-polling
        </span>
      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl h-[520px] sm:h-[580px]">
          
          {/* Simulated UK Bedfordshire / Luton / London Road Grid */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Major Road Arteries SVG Simulation (M1, A505, A6) */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-700/60" xmlns="http://www.w3.org/2000/svg">
            {/* M1 Motorway line */}
            <path d="M 120 0 L 280 300 L 450 600" strokeWidth="6" strokeDasharray="8 4" fill="none" />
            {/* A505 line */}
            <path d="M 0 250 L 550 220" strokeWidth="4" fill="none" />
            {/* Airport branch */}
            <path d="M 380 230 L 490 280" strokeWidth="3" fill="none" />
          </svg>

          {/* Area Labels on Map */}
          <div className="absolute top-8 left-12 text-slate-500 font-bold text-xs uppercase tracking-widest pointer-events-none">
            Dunstable / A5
          </div>
          <div className="absolute top-1/3 left-1/3 text-blue-400 font-bold text-sm tracking-wider pointer-events-none opacity-80">
            Luton Central
          </div>
          <div className="absolute top-1/2 right-16 text-sky-400 font-bold text-xs uppercase tracking-widest pointer-events-none bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
            ✈ London Luton Airport (LTN)
          </div>
          <div className="absolute bottom-8 right-24 text-slate-500 font-bold text-xs uppercase tracking-widest pointer-events-none">
            M1 South &rarr; London
          </div>

          {/* Driver Markers on Map */}
          {filteredDrivers.map((driver, idx) => {
            // Compute positions
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
                {/* Marker Pin */}
                <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}>
                  
                  {/* Driver Name Tag */}
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 border ${
                    isSelected 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-900/90 text-slate-100 border-slate-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isFresh ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{driver.name.split(' ')[0]}</span>
                    <span className="text-slate-400">({driver.currentVehicleReg})</span>
                  </div>

                  {/* Marker Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    !driver.onDuty
                      ? 'bg-slate-700 border-slate-500 text-slate-400'
                      : isFresh
                      ? 'bg-emerald-600 border-white text-white'
                      : 'bg-amber-600 border-white text-white'
                  }`}>
                    <Car className="w-4 h-4" />
                  </div>

                  {/* Pulse ring for fresh on-duty drivers */}
                  {driver.onDuty && isFresh && (
                    <span className="absolute bottom-1 w-8 h-8 rounded-full bg-emerald-500/30 animate-ping -z-10" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Drill-down Drawer for Selected Driver */}
          {selectedDriver && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xl z-30 text-xs">
              <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                    Driver Telematics Details
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedDriver.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID: {selectedDriver.staffId} • {selectedDriver.assignedDepot}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vehicle Assigned:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{selectedDriver.currentVehicleReg || 'None'}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Duty Status:</span>
                  <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {selectedDriver.dutyStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GPS Signal Freshness:</span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                    selectedDriver.currentLocation?.isFresh ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {selectedDriver.currentLocation?.isFresh ? (
                      <>
                        <Wifi className="w-3.5 h-3.5" /> Fresh (Updated 8s ago)
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5" /> Stale (&gt;60s no ping)
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Speed:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {selectedDriver.currentLocation?.speedMph || 0} mph
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operational Clearance:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    selectedDriver.operationalClearance === 'cleared'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedDriver.operationalClearance}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition"
                >
                  Call Driver
                </a>
                <button
                  onClick={() => alert(`Opening dispatch assignment modal for ${selectedDriver.name}`)}
                  className="flex-1 py-2 text-center rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white transition"
                >
                  Dispatch Job
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Assigned Vehicle</th>
                  <th className="p-3">Duty Status</th>
                  <th className="p-3">GPS Freshness</th>
                  <th className="p-3">Clearance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDrivers.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
                      <div className="text-[11px] text-slate-400">{d.staffId} • {d.phone}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {d.currentVehicleReg || '—'}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {d.dutyStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      {d.currentLocation?.isFresh ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fresh
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Stale (&gt;60s)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.operationalClearance === 'cleared'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {d.operationalClearance}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedDriver(d)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100"
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
