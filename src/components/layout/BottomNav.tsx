import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Car, 
  Smartphone 
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export const BottomNav: React.FC = () => {
  const { currentRole } = useRole();

  // On driver or PA role, direct to cockpit or staff home
  const staffAppRoute = currentRole === 'pa' ? '/app/pa-cockpit' : '/app/driver-cockpit';

  const items = [
    { to: '/office/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/office/live-map', label: 'Live Map', icon: MapPin },
    { to: '/office/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/office/fleet', label: 'Fleet', icon: Car },
    { to: currentRole === 'driver' || currentRole === 'pa' ? '/app/home' : staffAppRoute, label: 'Staff App', icon: Smartphone, highlight: true }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-emerald-500' : ''}`} />
                  </div>
                  <span className="truncate max-w-[56px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
