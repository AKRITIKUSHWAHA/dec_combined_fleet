import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Car, 
  GraduationCap, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffAppTopBar: React.FC = () => {
  const { 
    currentUser, 
    isOnline, 
    toggleOnlineStatus, 
    lastSyncTime, 
    syncOfflineDrafts, 
    offlineDraftsCount, 
    openLogoutDialog, 
    isLoading 
  } = useAuth();
  const { currentRole } = useRole();
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  const isDriver = currentRole === 'driver';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-xl select-none">
      
      {/* Primary Status Banner */}
      <div className="max-w-2xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2 text-xs">
        
        {/* Left: Branding & Role Identity */}
        <div className="flex items-center gap-2">
          <Link 
            to="/app/home" 
            className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 text-white"
          >
            DEC
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-xs tracking-tight">
                {isDriver ? 'Driver App' : 'PA Staff App'}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                v1.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-none">
              {currentUser?.name} • {isDriver ? 'LT73 XKL (V-Class)' : 'Route CBC-SEN-01'}
            </p>
          </div>
        </div>

        {/* Center / Right: Online/Offline indicator + Sync Status */}
        <div className="flex items-center gap-2">
          
          {/* Online / Offline Network Badge with Interactive Toggle */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/80'
                : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900/80 animate-pulse'
            }`}
            title="Click to simulate offline / online network changes"
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline</span>
              </>
            )}
          </button>

          {/* Last Sync Indicator & Manual Trigger */}
          <button
            type="button"
            onClick={() => syncOfflineDrafts()}
            disabled={isLoading || !isOnline}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700 transition disabled:opacity-50"
            title="Last sync time (Click to sync now)"
          >
            <RefreshCw className={`w-3 h-3 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline text-slate-400">Sync:</span>
            <span>{lastSyncTime}</span>
            {offlineDraftsCount > 0 && (
              <span className="ml-0.5 px-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold">
                {offlineDraftsCount}
              </span>
            )}
          </button>

          {/* Emergency / Panic trigger for field crew safety */}
          <button
            type="button"
            onClick={() => alert('🚨 Emergency Signal Sent to DEC Central Dispatch Control. GPS coordinates locked.')}
            className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900 transition"
            title="Emergency Alert to Dispatch"
            aria-label="Emergency Panic Button"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </button>

          {/* Sign Out Trigger with unsent work protection */}
          <button
            type="button"
            onClick={openLogoutDialog}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 transition"
            title="Sign out of mobile terminal"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Offline Alert Strip if network is simulated offline or pending drafts */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-3 py-1 text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE: Changes saved locally. Will sync when reconnected.</span>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className="underline text-[10px] uppercase tracking-wider font-extrabold"
          >
            Reconnect
          </button>
        </div>
      )}

    </header>
  );
};
