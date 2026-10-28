import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { DriverPAProfile } from '../types';
import { 
  MapPin, 
  Navigation, 
  Wifi, 
  WifiOff, 
  Clock, 
  Car, 
  User, 
  Phone, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Filter, 
  RefreshCw, 
  Compass, 
  AlertTriangle,
  Building2,
  Crosshair,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const { staff, vehicles, bookings, simulateGpsUpdates, simulateStaleGps } = useData();
  const { subCompanies, selectedCompanyId } = useCompany();

  // Filters
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>(selectedCompanyId);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'on_job' | 'on_break'>('all');
  
  // Selected driver for inspection
  const [selectedDriver, setSelectedDriver] = useState<DriverPAProfile | null>(null);

  // Time ticker to update "seconds ago" counters live every 2 seconds
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(timer);
  }, []);

  // Filter ONLY ON-DUTY drivers
  const onDutyDrivers = staff.filter(s => {
    if (!s.onDuty) return false;
    if (s.role !== 'driver' && s.role !== 'dual_driver_pa') return false;

    if (selectedCompanyFilter !== 'all' && s.companyId !== selectedCompanyFilter) return false;
    if (selectedAvailability !== 'all' && s.dutyStatus !== selectedAvailability) return false;

    if (selectedCategoryFilter !== 'all') {
      const veh = vehicles.find(v => v.registration === s.currentVehicleReg);
      if (!veh) return false;
      const cat = veh.vehicleCategory || (
        veh.hasRampOrLift ? 'Wheelchair Accessible (WAV)' :
        veh.seatingCapacity >= 8 ? 'Minibus' :
        veh.model.toLowerCase().includes('executive') ? 'Executive' :
        veh.seatingCapacity >= 6 ? 'MPV' : 'Saloon'
      );
      if (cat !== selectedCategoryFilter) return false;
    }

    return true;
  });

  // Calculate age of GPS reading in seconds
  const getGpsAgeSeconds = (lastUpdateIso?: string): number => {
    if (!lastUpdateIso) return 120;
    const diff = Math.floor((now - new Date(lastUpdateIso).getTime()) / 1000);
    return Math.max(0, diff);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Dispatch Map
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {onDutyDrivers.length} On-Duty Beacons
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time GPS dispatch with strict freshness gates (&gt;60s stale warning). Old locations are never displayed as live.
          </p>
        </div>

        {/* Demo Simulation Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={simulateGpsUpdates}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
            title="Simulate vehicle GPS movements"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Live Movement</span>
          </button>

          <button
            type="button"
            onClick={simulateStaleGps}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Force a driver GPS signal to drop >60s to test stale location safety gate"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Stale GPS (&gt;60s)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2 text-xs">
        
        {/* Company Filter */}
        <select
          value={selectedCompanyFilter}
          onChange={(e) => setSelectedCompanyFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">🏢 All Sub-Companies</option>
          {subCompanies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Vehicle Category Filter */}
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">🚗 All Vehicle Types</option>
          <option value="Saloon">Saloon</option>
          <option value="Executive">Executive VIP</option>
          <option value="MPV">MPV</option>
          <option value="Wheelchair Accessible (WAV)">WAV Ramp</option>
          <option value="Minibus">Minibus</option>
        </select>

        {/* Availability Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedAvailability('all')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
              selectedAvailability === 'all' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All On-Duty ({onDutyDrivers.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedAvailability('available')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              selectedAvailability === 'available' 
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedAvailability('on_job')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              selectedAvailability === 'on_job' 
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>On Active Job</span>
          </button>
        </div>

      </div>

      {/* Main Map + Driver Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Interactive Mock Vector Map (8 cols on lg) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col select-none">
          
          {/* Map Controls Overlay */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="bg-slate-900/90 backdrop-blur border border-slate-700/80 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>UK Grid: Bedfordshire / M1 Corridor</span>
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <span className="bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-xl shadow-lg">
              Zoom: 14x • GPS Precision: ±3m
            </span>
          </div>

          {/* Stylized Vector Map Canvas */}
          <div className="flex-1 w-full relative bg-[#0b1329] overflow-hidden">
            
            {/* Grid Coordinates Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Stylized Major Roads (M1 Motorway, A5, A505 Airport Way) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* M1 Motorway (arterial highway) */}
              <path d="M 60 480 Q 220 300 380 40" fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
              <path d="M 60 480 Q 220 300 380 40" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" opacity="0.7" />

              {/* A505 Dunstable / Airport Dual Carriageway */}
              <path d="M 120 180 L 520 280" fill="none" stroke="#1e293b" strokeWidth="14" />
              <path d="M 120 180 L 520 280" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />

              {/* Airport Runway */}
              <path d="M 420 380 L 580 440" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="square" />
              <path d="M 420 380 L 580 440" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
            </svg>

            {/* Major Landmark Labels */}
            <div className="absolute left-6 bottom-8 text-[11px] font-bold text-slate-500 font-mono tracking-wider pointer-events-none">
              M1 MOTORWAY (SOUTH &rarr; LONDON)
            </div>
            <div className="absolute right-12 bottom-12 text-[11px] font-bold text-amber-400 font-mono tracking-wider flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-amber-500/30">
              ✈️ LONDON LUTON AIRPORT (LTN)
            </div>
            <div className="absolute left-8 top-12 text-[10px] font-bold text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700">
              🏢 DUNSTABLE CENTRAL DEPOT
            </div>
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700">
              🏫 THE CHILTERN SCHOOL (SEN ZONE)
            </div>

            {/* Driver Markers Placed on Map */}
            {onDutyDrivers.map((driver, index) => {
              const ageSeconds = getGpsAgeSeconds(driver.currentLocation?.lastUpdateIso);
              const isStale = ageSeconds > 60 || !driver.currentLocation?.isFresh;
              const isSelected = selectedDriver?.id === driver.id;

              // Mock visually spaced positions on the vector map
              const positions = [
                { top: '35%', left: '38%' },
                { top: '65%', left: '68%' },
                { top: '48%', left: '22%' },
                { top: '24%', left: '72%' }
              ];
              const pos = positions[index % positions.length];

              return (
                <div
                  key={driver.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedDriver(driver)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition transform hover:scale-110"
                >
                  {/* Ping circle if fresh & moving */}
                  {!isStale && driver.dutyStatus === 'on_job' && (
                    <span className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin */}
                  <div className={`p-2 rounded-2xl shadow-2xl border flex items-center gap-2 transition ${
                    isStale
                      ? 'bg-amber-950/95 border-amber-500 text-amber-200 ring-4 ring-amber-500/30'
                      : isSelected
                        ? 'bg-blue-600 border-white text-white ring-4 ring-blue-500/40'
                        : driver.dutyStatus === 'available'
                          ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
                          : 'bg-slate-900/90 border-blue-500 text-blue-100'
                  }`}>
                    {/* Directional heading compass arrow */}
                    <Navigation 
                      className="w-4 h-4 shrink-0 transition-transform" 
                      style={{ transform: `rotate(${driver.currentLocation?.heading || 0}deg)` }} 
                    />
                    
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs tracking-tight">
                          {driver.name.split(' ')[0]}
                        </span>
                        <span className="text-[9px] font-mono px-1 rounded bg-black/40">
                          {driver.currentVehicleReg}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-mono mt-0.5">
                        <span>{driver.currentLocation?.speedMph || 0} mph</span>
                        <span>•</span>
                        {isStale ? (
                          <span className="text-amber-400 font-bold">⚠️ Stale ({ageSeconds}s)</span>
                        ) : (
                          <span className="text-emerald-400">Live ({ageSeconds}s)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Marker Tooltip Popup on hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white rounded-xl p-2.5 shadow-2xl border border-slate-700 text-xs pointer-events-none z-50">
                    <p className="font-bold text-white">{driver.name}</p>
                    <p className="text-[10px] text-slate-400">{driver.assignedDepot}</p>
                    <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] space-y-0.5">
                      <p>Speed: <strong className="text-white">{driver.currentLocation?.speedMph} mph</strong></p>
                      <p>Heading: <strong className="text-white">{driver.currentLocation?.heading}°</strong></p>
                      <p>GPS Precision: <strong className="text-emerald-400">±3m</strong></p>
                      <p>Last Sync: <strong className={isStale ? 'text-amber-400' : 'text-emerald-400'}>{ageSeconds}s ago</strong></p>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Map Footer Freshness Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Live Telemetry Engine Active</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;60s Fresh
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> &gt;60s Stale / Signal Drop
              </span>
            </div>
          </div>

        </div>

        {/* Selected Driver Inspection Card (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedDriver ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn">
              
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
                    {selectedDriver.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedDriver.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Staff ID: {selectedDriver.staffId}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {selectedDriver.dutyStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDriver(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              {/* Stale Warning Badge if >60s */}
              {(() => {
                const age = getGpsAgeSeconds(selectedDriver.currentLocation?.lastUpdateIso);
                const isStale = age > 60 || !selectedDriver.currentLocation?.isFresh;

                if (isStale) {
                  return (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl space-y-1 text-xs text-amber-900 dark:text-amber-200 animate-pulse">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>GPS Location Stale ({age} seconds old)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Vehicle beacon has not transmitted within the last 60 seconds. In compliance with safety standards, this coordinate is flagged as historical.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time GPS Fresh: Last signal received {age}s ago</span>
                  </div>
                );
              })()}

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">SPEED</span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                    {selectedDriver.currentLocation?.speedMph || 0} <span className="text-xs font-normal">mph</span>
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">HEADING</span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" style={{ transform: `rotate(${selectedDriver.currentLocation?.heading || 0}deg)` }} />
                    {selectedDriver.currentLocation?.heading || 0}°
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">ACCURACY</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ±3.2 meters
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">VEHICLE REG</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {selectedDriver.currentVehicleReg || 'LT73 XKL'}
                  </span>
                </div>
              </div>

              {/* Contact & Dispatch Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => alert(`Calling driver ${selectedDriver.name} at ${selectedDriver.phone}`)}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver ({selectedDriver.phone})</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
              <Crosshair className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Driver Telemetry Inspector
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any active driver marker on the map to inspect speed, heading, GPS freshness, and assigned vehicle status.
              </p>
            </div>
          )}

          {/* Quick On-Duty Drivers Roster */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Active Fleet Beacons ({onDutyDrivers.length})
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {onDutyDrivers.map((d) => {
                const age = getGpsAgeSeconds(d.currentLocation?.lastUpdateIso);
                const isStale = age > 60 || !d.currentLocation?.isFresh;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDriver(d)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedDriver?.id === d.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.currentVehicleReg} • {d.assignedDepot}</p>
                    </div>

                    <div className="text-right">
                      {isStale ? (
                        <span className="text-[10px] font-bold text-amber-500 block">⚠️ Stale ({age}s)</span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-500 block">Live ({age}s)</span>
                      )}
                      <span className="text-[9px] text-slate-400 font-mono">{d.currentLocation?.speedMph} mph</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
