import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, AlertTriangle, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LogoutConfirmModal: React.FC = () => {
  const { showLogoutModal, setShowLogoutModal, hasUnsentWorkWarning, logout } = useAuth();
  const navigate = useNavigate();

  if (!showLogoutModal) return null;

  const handleConfirmLogout = (action?: 'sync' | 'keep' | 'discard') => {
    logout(action);
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="nr-card p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-180 border border-[var(--border)]">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${
              hasUnsentWorkWarning 
                ? 'bg-[#FFC24B]/20 text-[#FFC24B] border border-[#FFC24B]/40' 
                : 'bg-[#FF5D6C]/20 text-[#FF5D6C] border border-[#FF5D6C]/40'
            }`}>
              {hasUnsentWorkWarning ? <AlertTriangle className="w-6 h-6" /> : <LogOut className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[var(--text)]">
                {hasUnsentWorkWarning ? 'Unsent Work Detected' : 'Confirm Sign Out'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                DEC Combined Fleet Gateway
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(false)}
            className="p-1.5 rounded-[10px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {hasUnsentWorkWarning ? (
          <div className="p-3.5 rounded-[14px] bg-[#FFC24B]/15 border border-[#FFC24B]/30 text-xs text-[var(--text)] space-y-1.5">
            <p className="font-heading font-bold text-[#D97706] dark:text-[#FFC24B]">
              You have unsent work / offline drafts.
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Unsynchronized vehicle checks, GPS pings or passenger attendance records are stored in local device cache. Choose how to handle your pending work before signing out:
            </p>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Are you sure you want to log out of your DEC dispatch session? Your active vehicle allocations and telematics stream will be securely closed.
          </p>
        )}

        {/* Action Buttons */}
        {hasUnsentWorkWarning ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleConfirmLogout('sync')}
              className="btn-primary w-full !text-xs !py-2.5 !min-h-[46px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Now &amp; Logout</span>
            </button>

            <button
              onClick={() => handleConfirmLogout('keep')}
              className="btn-secondary w-full !text-xs !py-2.5 !min-h-[46px]"
            >
              <ShieldCheck className="w-4 h-4 text-[#3FE0C5]" />
              <span>Keep Securely on Device &amp; Logout</span>
            </button>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn-ghost flex-1 !text-xs !min-h-[42px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmLogout('discard')}
                className="btn-danger flex-1 !text-xs !min-h-[42px]"
              >
                Discard &amp; Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2.5 pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="btn-ghost flex-1 !text-xs !min-h-[46px]"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmLogout()}
              className="btn-danger flex-1 !text-xs !min-h-[46px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
