import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Car, 
  Smartphone,
  Palette
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export const BottomNav: React.FC = () => {
  const { currentRole } = useRole();

  const staffAppRoute = currentRole === 'pa' ? '/pa-cockpit' : '/driver-cockpit';

  const items = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/live-map', label: 'Live Map', icon: MapPin },
    { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/fleet', label: 'Fleet', icon: Car },
    { to: staffAppRoute, label: 'Staff App', icon: Smartphone, highlight: true }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] pb-safe">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-180 min-h-[48px] ${
                  isActive
                    ? 'text-[#08201C] dark:text-[#B6F23C] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-[10px] transition-all ${isActive ? 'bg-[#B6F23C]/20 text-[#B6F23C]' : ''}`}>
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-[#34D399]' : ''}`} />
                  </div>
                  <span className="truncate max-w-[58px] font-heading">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
