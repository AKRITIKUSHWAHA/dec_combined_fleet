import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { LogOut, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { 
    showLogoutModal, 
    setShowLogoutModal, 
    logout, 
    hasUnsentWorkWarning, 
    toastMessage, 
    setToastMessage,
    offlineDraftsCount,
    syncOfflineDrafts
  } = useAuth();

  const isCarPlay = location.pathname.includes('carplay');
  const isMobileCockpit = (location.pathname.includes('driver-cockpit') || location.pathname.includes('pa-cockpit') || location.pathname.startsWith('/app/')) && !isCarPlay;
  const isDedicatedCockpit = isMobileCockpit || isCarPlay;

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-180 overflow-x-hidden">
      
      {/* Top Header with Safe Area Inset */}
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Desktop Sidebar (hidden on mobile & tablet, and in full dedicated cockpits) */}
        {!isDedicatedCockpit && (
          <div className="hidden lg:block shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Mobile / Tablet Collapsible Slideout Drawer */}
        <MobileDrawer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Area: Exactly 16px mobile, 24px tablet, 32px desktop. pb-28 ensures no overlap with bottom nav */}
        <main className={`flex-1 min-w-0 pb-28 sm:pb-24 lg:pb-10 ${
          isMobileCockpit 
            ? 'max-w-2xl mx-auto p-3 sm:p-6' 
            : isCarPlay 
            ? 'w-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6' 
            : 'p-4 sm:p-6 lg:p-8'
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Responsive Bottom Navigation (Office or Driver/PA Tab Bar, hidden only on landscape CarPlay) */}
      {!isCarPlay && <BottomNav />}

      {/* GLOBAL TOAST BANNER (Requirement: Appears at bottom above bottom nav, never covering primary buttons) */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#B6F23C] text-[#08201C] font-heading font-extrabold px-5 py-3 rounded-full shadow-2xl text-center text-xs sm:text-sm border-2 border-white flex items-center justify-center gap-2 pointer-events-auto">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* CENTERED CONFIRMATION DIALOG: LOGOUT (Requirement: Confirmation dialogs centered with large buttons) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#FF5D6C]/15 text-[#FF5D6C] flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-lg text-[var(--text)]">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {hasUnsentWorkWarning || offlineDraftsCount > 0 ? (
                  <span className="text-[#FF5D6C] font-semibold block">
                    You have {offlineDraftsCount} unsaved/offline drafts on this device.
                  </span>
                ) : (
                  'Are you sure you want to end your active dispatch session?'
                )}
              </p>
            </div>

            {/* Offline draft warning action */}
            {offlineDraftsCount > 0 && (
              <button
                type="button"
                onClick={async () => {
                  await syncOfflineDrafts();
                  logout('sync');
                }}
                className="w-full min-h-[48px] rounded-[14px] bg-[#3FE0C5] text-[#08201C] font-heading font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Save Drafts &amp; Sign Out</span>
              </button>
            )}

            {/* Action Buttons: min 48px touch targets */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="btn-ghost flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => logout('discard')}
                className="btn-danger flex-1 !min-h-[48px] !text-xs font-bold"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
