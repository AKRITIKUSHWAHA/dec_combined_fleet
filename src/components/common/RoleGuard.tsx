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
      <div className="nr-card p-6 sm:p-8 max-w-lg w-full text-center space-y-5">
        
        <div className="w-16 h-16 rounded-[20px] bg-[#FF5D6C]/15 text-[#FF5D6C] flex items-center justify-center mx-auto border border-[#FF5D6C]/30 shadow-coral-glow">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5D6C]/20 text-[#FF5D6C] border border-[#FF5D6C]/40">
            Permission Restricted (UK Role Gate)
          </span>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] mt-2">
            Access Restricted to {featureName || 'This Screen'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            Your active persona <strong className="text-[var(--text)]">"{currentRoleInfo.label}"</strong> does not have permission to view or manage this section.
          </p>
        </div>

        {/* Roles allowed */}
        <div className="bg-[var(--surface-2)] p-4 rounded-[16px] border border-[var(--border)] text-left">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Authorized Personas for this Section:
          </p>
          <div className="space-y-2">
            {allowedRoles.map(rKey => {
              const r = ROLE_CONFIGS[rKey];
              return (
                <div key={rKey} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)] last:border-b-0">
                  <span className="font-heading font-semibold text-[var(--text)]">
                    {r.label}
                  </span>
                  <button
                    onClick={() => setCurrentRole(rKey)}
                    className="text-[11px] font-heading font-bold text-[#3FE0C5] hover:underline inline-flex items-center gap-1 focus:outline-none nr-focus"
                  >
                    <span>Switch to this role</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-secondary !text-xs !py-1.5 !min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
