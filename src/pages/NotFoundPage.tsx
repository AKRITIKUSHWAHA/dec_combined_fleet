import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, getRoleHomeRoute } from '../context/AuthContext';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const homeRoute = user ? getRoleHomeRoute(user.role) : '/login';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <div className="nr-card p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-2xl border border-[var(--border)]">
        
        <div className="w-16 h-16 rounded-[20px] bg-[#3FE0C5]/15 text-[#3FE0C5] flex items-center justify-center mx-auto border border-[#3FE0C5]/40 shadow-aqua-glow">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#3FE0C5]/15 text-[#3FE0C5] border border-[#3FE0C5]/30">
            HTTP 404 • Route Lost
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)] mt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            The requested dispatch screen or resource does not exist in the DEC fleet system.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            to={homeRoute}
            className="btn-primary !text-xs !py-2 !px-4 !min-h-[46px]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Station Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();
  const homeRoute = user ? getRoleHomeRoute(user.role) : '/login';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <div className="nr-card p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-2xl border border-[var(--border)]">
        
        <div className="w-16 h-16 rounded-[20px] bg-[#FF5D6C]/15 text-[#FF5D6C] flex items-center justify-center mx-auto border border-[#FF5D6C]/40 shadow-coral-glow">
          <span className="font-heading font-extrabold text-2xl">403</span>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5D6C]/15 text-[#FF5D6C] border border-[#FF5D6C]/30">
            Access Prohibited (Role Barrier)
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)] mt-2">
            Access Denied
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            You do not have the required role clearance to view this restricted dispatch or personnel section.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            to={homeRoute}
            className="btn-secondary !text-xs !py-2 !px-4 !min-h-[46px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Allowed Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

