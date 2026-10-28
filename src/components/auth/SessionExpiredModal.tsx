import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_CONFIGS } from '../../context/RoleContext';
import { Lock, Eye, EyeOff, ShieldAlert, LogOut, ArrowRight, Loader2 } from 'lucide-react';

export const SessionExpiredModal: React.FC = () => {
  const { isSessionExpired, currentUser, reauthenticateSession, logout, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSessionExpired || !currentUser) {
    return null;
  }

  const roleConfig = ROLE_CONFIGS[currentUser.role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter your password to unlock the session.');
      return;
    }

    const result = await reauthenticateSession(password);
    if (!result.success) {
      setError(result.error || 'Incorrect password.');
    } else {
      setPassword('');
    }
  };

  const handleSwitchAccount = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header with security icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Session Expired
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            To protect passenger data and operational confidentiality on shared terminals, your active session has timed out.
          </p>
        </div>

        {/* User Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          <img 
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'} 
            alt={currentUser.name} 
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/30"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {currentUser.email}
            </p>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleConfig.badgeColor}`}>
              {roleConfig.label}
            </span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Re-auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password to Resume
              </label>
              <span className="text-[10px] text-slate-400">
                Demo hint: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">Password123!</code>
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                autoFocus
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Unlock & Resume Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Switch user */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Not {currentUser.name}?</span>
          <button
            type="button"
            onClick={handleSwitchAccount}
            className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Completely</span>
          </button>
        </div>

      </div>
    </div>
  );
};
