import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, getRoleHomeRoute } from '../context/AuthContext';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();
  const homeRoute = user ? getRoleHomeRoute(user.role) : '/login';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <div className="nr-card p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-2xl border border-[var(--border)]">
        
        <div className="w-16 h-16 rounded-[20px] bg-[#FF5D6C]/15 text-[#FF5D6C] flex items-center justify-center mx-auto border border-[#FF5D6C]/40 shadow-coral-glow">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5D6C]/15 text-[#FF5D6C] border border-[#FF5D6C]/30">
            HTTP 403 • Role Gate Restriction
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)] mt-2">
            Access Prohibited
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            Your current staff persona does not possess the compliance permissions or licensing required to access this system module.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            to={homeRoute}
            className="btn-secondary !text-xs !py-2 !px-4 !min-h-[46px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Station Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AccessDeniedPage;
