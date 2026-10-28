import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Navigation, 
  Home, 
  ClipboardCheck, 
  Wrench, 
  RefreshCw, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';

export const StaffAppTabBar: React.FC = () => {
  const { currentRole } = useRole();
  const { offlineDraftsCount } = useAuth();

  const isDriver = currentRole === 'driver';

  const driverTabs = [
    { to: '/app/driver-cockpit', label: 'Cockpit', icon: Navigation, highlight: true },
    { to: '/app/home', label: 'My Runs', icon: Home },
    { to: '/app/checks', label: 'Checks', icon: ClipboardCheck },
    { to: '/app/defects', label: 'Defects', icon: Wrench },
    { 
      to: '/app/sync', 
      label: 'Sync', 
      icon: RefreshCw, 
      badge: offlineDraftsCount > 0 ? offlineDraftsCount : undefined 
    }
  ];

  const paTabs = [
    { to: '/app/pa-cockpit', label: 'Cockpit', icon: Smartphone, highlight: true },
    { to: '/app/home', label: 'Contract', icon: GraduationCap },
    { to: '/app/pupils', label: 'Pupils SEN', icon: Users },
    { to: '/app/sweep', label: 'Sweep', icon: ShieldCheck },
    { 
      to: '/app/sync', 
      label: 'Sync', 
      icon: RefreshCw, 
      badge: offlineDraftsCount > 0 ? offlineDraftsCount : undefined 
    }
  ];

  const activeTabs = isDriver ? driverTabs : paTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg select-none">
      <div className="max-w-2xl mx-auto grid grid-cols-5 h-16 px-1">
        {activeTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/80 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${tab.highlight ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
                  </div>
                  
                  <span className="text-[10px] tracking-tight truncate max-w-[58px]">
                    {tab.label}
                  </span>

                  {/* Badge */}
                  {tab.badge && (
                    <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center shadow-md">
                      {tab.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
