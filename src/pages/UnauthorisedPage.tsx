import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIGS } from '../context/RoleContext';
import { ShieldAlert, ArrowLeft, Home, LogOut, Lock, RefreshCw } from 'lucide-react';
import { getDefaultRedirectPath } from '../data/mockAuth';

export const UnauthorisedPage: React.FC = () => {
  const { currentUser, openLogoutDialog, switchRoleQuick } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { from?: string; requiredRoles?: string[]; userRole?: string } | undefined;
  const currentRole = currentUser?.role || 'controller';
  const roleConfig = ROLE_CONFIGS[currentRole];

  const handleReturnHome = () => {
    if (currentUser) {
      navigate(getDefaultRedirectPath(currentUser.role));
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 shadow-xl shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[10px] font-bold uppercase tracking-wider">
            HTTP 403 • Forbidden
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Restricted Access
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You do not have the required security clearance or role permissions to view the requested resource.
          </p>
          {state?.from && (
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 py-1 px-2 rounded-lg truncate">
              Target: {state.from}
            </p>
          )}
        </div>

        {/* Current Active User Info */}
        {currentUser && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3 text-left">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-300 dark:ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${roleConfig.badgeColor}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regulatory Note */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-300 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Transport Regulation Safeguard</span>
          </div>
          <p className="leading-relaxed">
            In compliance with UK Council Licensing and DBS Update Service standards, sensitive safeguarding data is strictly restricted to vetted personnel.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleReturnHome}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                switchRoleQuick('owner_admin');
                navigate('/office/dashboard');
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
              <span>Switch to Admin</span>
            </button>

            <button
              onClick={openLogoutDialog}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
