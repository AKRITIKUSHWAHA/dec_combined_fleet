import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Trash2, 
  LogOut, 
  X, 
  Loader2,
  FileCheck2,
  Lock
} from 'lucide-react';

export const LogoutDialog: React.FC = () => {
  const { 
    isLogoutDialogOpen, 
    closeLogoutDialog, 
    currentUser, 
    offlineDraftsCount, 
    logout,
    isLoading 
  } = useAuth();
  
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!isLogoutDialogOpen || !currentUser) {
    return null;
  }

  const isFieldStaff = currentUser.role === 'driver' || currentUser.role === 'pa';
  const hasUnsentDrafts = isFieldStaff && offlineDraftsCount > 0;

  const handleAction = async (action?: 'sync' | 'keep' | 'discard') => {
    setActiveAction(action || 'signout');
    await logout(action);
    navigate('/login');
    setActiveAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              hasUnsentDrafts 
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border border-amber-300 dark:border-amber-800' 
                : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
            }`}>
              {hasUnsentDrafts ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <LogOut className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {hasUnsentDrafts ? 'You have unsent work' : 'Confirm Sign Out'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.name} ({currentUser.department})
              </p>
            </div>
          </div>

          <button
            onClick={closeLogoutDialog}
            disabled={!!activeAction}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unsent Drafts Warning Box for Driver / PA */}
        {hasUnsentDrafts ? (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs space-y-2 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <FileCheck2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{offlineDraftsCount} Pending Offline Record(s) Stored Locally</span>
              </div>
              <p className="leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                You have unsent vehicle walkaround check items and/or passenger sweep logs that have not yet synced with DEC Dispatch Servers.
              </p>
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1 border border-amber-200/60 dark:border-amber-800/60">
                <div>• Draft 1: Pre-use Walkaround Defect Notes (LT73 XKL)</div>
                <div>• Draft 2: AM Route Pupil Boarding Roster (SEN-402)</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please choose how to handle your unsent work before exiting:
            </p>

            {/* 3 Options */}
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Option 1: Sync now */}
              <button
                type="button"
                onClick={() => handleAction('sync')}
                disabled={!!activeAction}
                className="w-full text-left p-3.5 rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60 transition group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                  {activeAction === 'sync' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                      Sync now & Sign Out
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Upload all logs immediately to Head Office, then safely close your session.
                  </p>
                </div>
              </button>

              {/* Option 2: Keep securely */}
              <button
                type="button"
                onClick={() => handleAction('keep')}
                disabled={!!activeAction}
                className="w-full text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  {activeAction === 'keep' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Keep securely on this device
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Save encrypted draft on this tablet/phone to sync during your next login.
                  </p>
                </div>
              </button>

              {/* Option 3: Discard */}
              <button
                type="button"
                onClick={() => handleAction('discard')}
                disabled={!!activeAction}
                className="w-full text-left p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  {activeAction === 'discard' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm text-rose-700 dark:text-rose-400">
                    Discard unsent drafts
                  </span>
                  <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                    Permanently delete pending local drafts and sign out immediately.
                  </p>
                </div>
              </button>

            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to end your current dispatch session?
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Shared terminal safety: all session tokens and cached user data will be wiped from this browser upon sign out.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeLogoutDialog}
                disabled={!!activeAction}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleAction()}
                disabled={!!activeAction}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 transition"
              >
                {activeAction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
