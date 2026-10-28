import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, RefreshCw, CheckCircle2, WifiOff, AlertCircle } from 'lucide-react';

interface PendingSyncChipsProps {
  maxItems?: number;
  showTitle?: boolean;
}

export const PendingSyncChips: React.FC<PendingSyncChipsProps> = ({ maxItems = 4, showTitle = true }) => {
  const { pendingSyncItems, syncAllPendingItems } = useData();
  const { isOnline } = useAuth();

  const displayedItems = maxItems ? pendingSyncItems.slice(0, maxItems) : pendingSyncItems;
  const pendingCount = pendingSyncItems.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-2">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Telemetry & Sync Audit Chips
            </span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold animate-pulse">
                {pendingCount} offline queued
              </span>
            )}
          </div>

          {isOnline && pendingCount > 0 && (
            <button
              type="button"
              onClick={syncAllPendingItems}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Now</span>
            </button>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        {displayedItems.map((item) => {
          const isPending = item.status === 'pending';

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-2xl border text-xs transition ${
                isPending
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.action}
                    </span>
                    {item.bookingRef && (
                      <span className="font-mono text-[10px] px-1 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                        {item.bookingRef}
                      </span>
                    )}
                  </div>

                  {item.details && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {item.details}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-400">
                      <WifiOff className="w-3 h-3" /> Queued Offline
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Synced
                    </span>
                  )}
                </div>
              </div>

              {/* Original Time vs Received Time Comparison Badges */}
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>Original Tap: <strong className="text-slate-800 dark:text-slate-200">{item.originalTime}</strong></span>
                </span>

                <span className="flex items-center gap-1">
                  <span className="text-slate-400">Server Received:</span>
                  <strong className={isPending ? 'text-amber-600 dark:text-amber-400 italic' : 'text-emerald-600 dark:text-emerald-400'}>
                    {item.receivedTime || 'Pending Dispatch Reconnection'}
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
