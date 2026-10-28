import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isDedicatedCockpit = location.pathname.includes('-cockpit');

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-180">
      
      {/* Top Header */}
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar (hidden on mobile & tablet) */}
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

        {/* Main Content Area */}
        <main className={`flex-1 min-w-0 pb-20 lg:pb-10 p-3 sm:p-6 lg:p-8 ${isDedicatedCockpit ? 'max-w-2xl mx-auto' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isDedicatedCockpit && <BottomNav />}
    </div>
  );
};
