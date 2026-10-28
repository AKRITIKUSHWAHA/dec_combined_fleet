import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';

export const OfficeLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      
      {/* Top Bar with Company Switcher, Notifications Bell, User Menu with Logout */}
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar with Role-Based Menus & Badges */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Slideout Drawer */}
        <MobileDrawer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-8 p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
