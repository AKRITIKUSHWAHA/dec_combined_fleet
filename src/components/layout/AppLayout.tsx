import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCarPlay = location.pathname.includes('carplay');
  const isMobileCockpit = (location.pathname.includes('driver-cockpit') || location.pathname.includes('pa-cockpit') || location.pathname.startsWith('/app/')) && !isCarPlay;
  const isDedicatedCockpit = isMobileCockpit || isCarPlay;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-180">
      
      {/* Top Header */}
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Desktop Sidebar (hidden on mobile & tablet, and in full dedicated cockpits) */}
        {!isDedicatedCockpit && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile Slideout Drawer */}
        <MobileDrawer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Area: Mobile cockpits are max-w-2xl, CarPlay is wide max-w-7xl, standard is full-width */}
        <main className={`flex-1 min-w-0 pb-20 lg:pb-10 p-3 sm:p-6 lg:p-8 ${
          isMobileCockpit ? 'max-w-2xl mx-auto' : isCarPlay ? 'w-full max-w-7xl mx-auto' : ''
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isDedicatedCockpit && <BottomNav />}
    </div>
  );
};
