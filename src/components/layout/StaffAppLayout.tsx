import React from 'react';
import { Outlet } from 'react-router-dom';
import { StaffAppTopBar } from './StaffAppTopBar';
import { StaffAppTabBar } from './StaffAppTabBar';

export const StaffAppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors">
      
      {/* Driver / PA Top Status Bar */}
      <StaffAppTopBar />

      {/* Main Touch-Optimized Content Container */}
      <main className="flex-1 w-full max-w-xl mx-auto p-3 sm:p-4 pb-24">
        <Outlet />
      </main>

      {/* Driver / PA Bottom Tab Bar */}
      <StaffAppTabBar />

    </div>
  );
};
