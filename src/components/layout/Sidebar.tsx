import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Car, 
  CheckSquare, 
  Wrench, 
  Users, 
  ShieldAlert, 
  GraduationCap, 
  PoundSterling, 
  Tag, 
  Smartphone,
  ChevronRight,
  Lock,
  Palette,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentRole, canViewDBS } = useRole();
  const { bookings, defects, vehicles } = useData();

  // Badges calculation
  const unallocatedJobs = bookings.filter(b => b.status === 'unallocated').length;
  const criticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released').length;
  const dueMots = vehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length;

  const navItems = [
    {
      to: '/',
      label: 'Operational Dashboard',
      icon: LayoutDashboard,
      roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic']
    },
    {
      to: '/live-map',
      label: 'Live Dispatch Map',
      icon: MapPin,
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/bookings',
      label: 'Bookings & Dispatch',
      icon: CalendarCheck,
      badge: unallocatedJobs > 0 ? `${unallocatedJobs} unassigned` : undefined,
      badgeColor: 'bg-[#FF5D6C] text-white',
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/schools',
      label: 'School Transport & SEN',
      icon: GraduationCap,
      roles: ['owner_admin', 'controller', 'hr_vetting']
    },
    {
      to: '/fleet',
      label: 'Fleet & Dual MOTs',
      icon: Car,
      badge: dueMots > 0 ? `${dueMots} due` : undefined,
      badgeColor: 'bg-[#FFC24B] text-[#08201C]',
      roles: ['owner_admin', 'controller', 'mechanic', 'hr_vetting']
    },
    {
      to: '/checks',
      label: 'Daily Checks Builder',
      icon: CheckSquare,
      roles: ['owner_admin', 'controller', 'mechanic']
    },
    {
      to: '/maintenance',
      label: 'Defects & Workshop',
      icon: Wrench,
      badge: criticalDefects > 0 ? `${criticalDefects} VOR` : undefined,
      badgeColor: 'bg-[#FF5D6C] text-white animate-pulse',
      roles: ['owner_admin', 'controller', 'mechanic']
    },
    {
      to: '/workforce',
      label: 'Staff (Drivers & PAs)',
      icon: Users,
      roles: ['owner_admin', 'controller', 'hr_vetting']
    },
    {
      to: '/compliance',
      label: 'DVLA & DBS Assurance',
      icon: ShieldAlert,
      isRestrictedForController: !canViewDBS,
      roles: ['owner_admin', 'hr_vetting', 'controller']
    },
    {
      to: '/tariffs',
      label: 'Tariff & Pricing Engine',
      icon: Tag,
      roles: ['owner_admin']
    },
    {
      to: '/finance',
      label: 'Finance & Driver Payouts',
      icon: PoundSterling,
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/reports',
      label: 'Reports & Audits',
      icon: FileSpreadsheet,
      roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic']
    },
    {
      to: '/design-system',
      label: 'Night Road Design System',
      icon: Palette,
      highlight: true,
      roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa']
    }
  ];

  // Mobile App Dedicated Entry Points
  const staffAppItems = [
    {
      to: '/driver-cockpit',
      label: 'Driver Mobile Cockpit',
      icon: Smartphone,
      highlight: true
    },
    {
      to: '/pa-cockpit',
      label: 'Passenger Assistant Cockpit',
      icon: Smartphone,
      highlight: true
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors duration-180">
      
      {/* Role Notice Banner */}
      <div className="p-3 border-b border-[var(--border)]">
        <div className="bg-[var(--surface-2)] p-2.5 rounded-[14px] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Active Persona
            </span>
            <span className="text-[10px] font-bold text-[#3FE0C5]">
              Role Filter Active
            </span>
          </div>
          <p className="text-xs font-heading font-bold text-[var(--text)] mt-0.5 truncate">
            {currentRole.replace('_', ' ').toUpperCase()}
          </p>
          {currentRole === 'controller' && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#FFC24B] font-medium">
              <Lock className="w-3 h-3 shrink-0" />
              <span>DBS/Medical records restricted</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 py-1">
          Office Management
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-180 group nr-focus ${
                  isActive
                    ? 'bg-[#B6F23C] text-[#08201C] font-heading font-bold shadow-lime-glow'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#08201C]' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.isRestrictedForController && (
                      <span title="Restricted view for controllers">
                        <Lock className="w-3 h-3 text-[#FFC24B] shrink-0" />
                      </span>
                    )}
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Separator for Staff Cockpit simulators */}
        <div className="pt-4 pb-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-3">
            Mobile Staff Apps (PWA/iOS)
          </div>
        </div>

        {staffAppItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-180 ${
                  isActive
                    ? 'bg-[#34D399] text-[#08201C] font-heading font-bold shadow-md'
                    : 'text-[#34D399] bg-[#34D399]/10 hover:bg-[#34D399]/20'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Info */}
      <div className="p-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
        <span>UK DVSA / DVLA Live</span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" title="System operational" />
      </div>
    </aside>
  );
};
