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
  Lock
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentRole, canViewDBS, canViewSafeguarding } = useRole();
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
      badgeColor: 'bg-rose-500 text-white',
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
      badgeColor: 'bg-amber-500 text-slate-900',
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
      badgeColor: 'bg-rose-600 text-white animate-pulse',
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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors">
      
      {/* Role Notice Banner */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Persona
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              Role Filter Active
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
            {currentRole.replace('_', ' ').toUpperCase()}
          </p>
          {currentRole === 'controller' && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
              <Lock className="w-3 h-3 shrink-0" />
              <span>DBS/Medical records restricted</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
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
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.isRestrictedForController && (
                      <span title="Restricted view for controllers">
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                      </span>
                    )}
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 dark:bg-slate-700'}`}>
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
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
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
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
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>UK DVSA / DVLA Connected</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System operational" />
      </div>
    </aside>
  );
};
