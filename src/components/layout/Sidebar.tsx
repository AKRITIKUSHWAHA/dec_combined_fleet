import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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
  ChevronLeft,
  Lock,
  Palette,
  FileSpreadsheet,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plane,
  Zap,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed: controlledCollapsed, onToggleCollapse }) => {
  const { currentRole, canViewDBS } = useRole();
  const { bookings, defects, vehicles } = useData();
  const { user, requestLogout } = useAuth();

  // Internal state if not controlled externally, persisted in localStorage
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dec_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('dec_sidebar_collapsed', String(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    }
  };

  // Compact Badges calculation
  const unallocatedJobs = bookings.filter(b => b.status === 'unallocated').length;
  const criticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released').length;
  const dueMots = vehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      fullLabel: 'Operational Dashboard',
      icon: LayoutDashboard,
      roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic']
    },
    {
      to: '/live-map',
      label: 'Live Map',
      fullLabel: 'Live Dispatch Map',
      icon: MapPin,
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/bookings',
      label: 'Bookings',
      fullLabel: 'Bookings & Dispatch',
      icon: CalendarCheck,
      badge: unallocatedJobs > 0 ? `${unallocatedJobs}` : undefined,
      badgeTitle: `${unallocatedJobs} unassigned booking${unallocatedJobs > 1 ? 's' : ''}`,
      badgeColor: 'bg-[#FF5D6C] text-white',
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/airport',
      label: 'Airport & Exec',
      fullLabel: 'Airport & Executive Chauffeur',
      icon: Plane,
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/office/auto-dispatch',
      label: 'Auto-Dispatch',
      fullLabel: 'Auto-Dispatch Rules & Zones',
      icon: Zap,
      roles: ['owner_admin', 'controller']
    },
    {
      to: '/schools',
      label: 'School Transport',
      fullLabel: 'School Transport & SEN',
      icon: GraduationCap,
      roles: ['owner_admin', 'controller', 'hr_vetting']
    },
    {
      to: '/fleet',
      label: 'Fleet & MOTs',
      fullLabel: 'Fleet & Dual MOTs',
      icon: Car,
      badge: dueMots > 0 ? `${dueMots}` : undefined,
      badgeTitle: `${dueMots} MOT${dueMots > 1 ? 's' : ''} due soon`,
      badgeColor: 'bg-[#FFC24B] text-[#08201C]',
      roles: ['owner_admin', 'controller', 'mechanic', 'hr_vetting']
    },
    {
      to: '/checks',
      label: 'Daily Checks',
      fullLabel: 'Daily Checks Builder',
      icon: CheckSquare,
      roles: ['owner_admin', 'controller', 'mechanic']
    },
    {
      to: '/maintenance',
      label: 'Defects & Workshop',
      fullLabel: 'Defects & Workshop',
      icon: Wrench,
      badge: criticalDefects > 0 ? `${criticalDefects} VOR` : undefined,
      badgeTitle: `${criticalDefects} vehicle${criticalDefects > 1 ? 's' : ''} off road`,
      badgeColor: 'bg-[#FF5D6C] text-white animate-pulse',
      roles: ['owner_admin', 'controller', 'mechanic']
    },
    {
      to: '/workforce',
      label: 'Staff Directory',
      fullLabel: 'Staff (Drivers & PAs)',
      icon: Users,
      roles: ['owner_admin', 'controller', 'hr_vetting']
    },
    {
      to: '/compliance',
      label: 'Compliance & DBS',
      fullLabel: 'DVLA & DBS Assurance',
      icon: ShieldAlert,
      isRestrictedForController: !canViewDBS,
      roles: ['owner_admin', 'hr_vetting', 'controller']
    },
    {
      to: '/office/operations',
      label: 'Office Operations',
      fullLabel: 'Operations (Lost, Complaints, Chat)',
      icon: Sparkles,
      roles: ['owner_admin', 'controller', 'hr_vetting']
    },
    {
      to: '/tariffs',
      label: 'Tariff Engine',
      fullLabel: 'Tariff & Pricing Engine',
      icon: Tag,
      roles: ['owner_admin']
    },
    {
      to: '/finance',
      label: 'Finance & Payouts',
      fullLabel: 'Finance & Driver Payouts',
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
      label: 'Design System',
      fullLabel: 'Night Road Design System',
      icon: Palette,
      highlight: true,
      roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa']
    }
  ];

  // Mobile App Dedicated Entry Points
  const staffAppItems = [
    {
      to: '/driver-cockpit',
      label: 'Driver Cockpit',
      fullLabel: 'Driver Mobile Cockpit',
      icon: Smartphone,
      highlight: true
    },
    {
      to: '/pa-cockpit',
      label: 'PA Cockpit',
      fullLabel: 'Passenger Assistant Cockpit',
      icon: Smartphone,
      highlight: true
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside 
      className={`bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-200 z-30 ${
        isCollapsed ? 'w-20' : 'w-64 xl:w-72'
      }`}
    >
      {/* Top Sidebar Header with Compact Collapse Toggle */}
      <div className="h-12 px-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse shrink-0" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">
                Station Dispatch
              </span>
            </div>
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-[10px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition nr-focus"
              title="Collapse sidebar to mini-rail"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleCollapse}
            className="w-full h-8 flex items-center justify-center rounded-[10px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition nr-focus"
            title="Expand full sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links with Custom Slim Scrollbar */}
      <div className="flex-1 overflow-y-auto nr-scrollbar px-2.5 py-3 space-y-1">
        
        {/* Section Heading */}
        {!isCollapsed && (
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-2.5 py-1">
            Dispatch Operations
          </div>
        )}

        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={isCollapsed ? item.fullLabel : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-[14px] text-xs font-medium transition-all duration-180 group nr-focus min-h-[44px] ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#B6F23C] text-[#08201C] font-heading font-bold shadow-lime-glow'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0 flex-1'}`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-180 ${
                      isActive ? 'text-[#08201C] scale-105' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate font-heading text-[12px]">{item.label}</span>
                    )}
                  </div>

                  {/* Badges / Restriction Indicators */}
                  {!isCollapsed ? (
                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {item.isRestrictedForController && (
                        <span title="Restricted DBS view for controllers">
                          <Lock className="w-3.5 h-3.5 text-[#FFC24B] shrink-0" />
                        </span>
                      )}
                      {item.badge && (
                        <span 
                          title={item.badgeTitle}
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ) : (
                    // In collapsed mode: display subtle dot if badge exists
                    item.badge && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5D6C] ring-2 ring-[var(--surface)]" />
                    )
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Separator for Staff Cockpit simulators */}
        <div className="pt-3 pb-1">
          {!isCollapsed ? (
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-2.5">
              Mobile Staff Apps
            </div>
          ) : (
            <div className="border-t border-[var(--border)] my-1 mx-2" />
          )}
        </div>

        {staffAppItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.fullLabel : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-[14px] text-xs font-medium transition-all duration-180 min-h-[44px] ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#34D399] text-[#08201C] font-heading font-bold shadow-md'
                    : 'text-[#34D399] bg-[#34D399]/10 hover:bg-[#34D399]/20'
                }`
              }
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="font-heading text-[12px] truncate">{item.label}</span>}
              </div>
              {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />}
            </NavLink>
          );
        })}
      </div>

      {/* Clean Bottom Footer with Fixed Log Out Button */}
      <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface)] shrink-0 space-y-2">
        {!isCollapsed ? (
          <>
            <button
              type="button"
              onClick={() => requestLogout()}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-heading font-semibold text-[#FF5D6C] hover:bg-[#FF5D6C]/15 border border-[#FF5D6C]/30 hover:border-[#FF5D6C]/60 transition-all duration-180 group nr-focus cursor-pointer"
              aria-label="Log out of DEC Fleet System"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-[#FF5D6C] group-hover:scale-110 transition-transform duration-180 shrink-0" />
                <span className="font-bold">Log Out</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[#FF5D6C] truncate max-w-[90px]">
                {user?.name ? user.name.split(' ')[0] : 'Sign Out'}
              </span>
            </button>

            {/* Live Telematics Indicator */}
            <div className="px-1 pt-0.5 text-[10px] text-[var(--text-muted)] flex items-center justify-between font-mono">
              <span>DVSA • Live</span>
              <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                ONLINE
              </span>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => requestLogout()}
            className="w-full h-10 flex items-center justify-center rounded-[12px] text-[#FF5D6C] hover:bg-[#FF5D6C]/15 border border-[#FF5D6C]/30 hover:border-[#FF5D6C]/60 transition-all duration-180 nr-focus cursor-pointer"
            title="Log out of DEC Fleet System"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 text-[#FF5D6C]" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
