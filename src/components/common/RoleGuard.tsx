import React from 'react';
import { useRole, ROLE_CONFIGS } from '../../context/RoleContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  featureName?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, featureName }) => {
  const { currentRole, setCurrentRole } = useRole();

  if (allowedRoles.includes(currentRole)) {
    return <>{children}</>;
  }

  const currentRoleInfo = ROLE_CONFIGS[currentRole];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-xl space-y-5">
        
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/60 shadow-sm">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Permission Restricted (UK Role Gate)
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2">
            Access Restricted to {featureName || 'This Screen'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your active persona <strong className="text-slate-800 dark:text-slate-200">"{currentRoleInfo.label}"</strong> does not have permission to view or manage this section.
          </p>
        </div>

        {/* Roles allowed */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Authorized Personas for this Section:
          </p>
          <div className="space-y-1.5">
            {allowedRoles.map(rKey => {
              const r = ROLE_CONFIGS[rKey];
              return (
                <div key={rKey} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {r.label}
                  </span>
                  <button
                    onClick={() => setCurrentRole(rKey)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 focus:outline-none"
                  >
                    Switch to this role <CheckCircle2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
