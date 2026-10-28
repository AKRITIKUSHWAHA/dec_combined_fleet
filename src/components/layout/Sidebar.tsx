import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
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
  LogOut, 
  Clock, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavSection {
  title: string;
  items: {
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    roles: string[];
    isRestrictedForController?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentRole, canViewDBS } = useRole();
  const { currentUser, openLogoutDialog, triggerSessionExpired, offlineDraftsCount } = useAuth();
  const { bookings, defects, vehicles } = useData();

  // Badges calculation
  const unallocatedJobs = bookings.filter(b => b.status === 'unallocated').length;
  const criticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released').length;
  const dueMots = vehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length;

  const sections: NavSection[] = [
    {
      title: 'Dispatch & Operations',
      items: [
        {
          to: '/office/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic']
        },
        {
          to: '/office/live-map',
          label: 'Live Dispatch Map',
          icon: MapPin,
          roles: ['owner_admin', 'controller']
        },
        {
          to: '/office/bookings',
          label: 'Bookings & Allocation',
          icon: CalendarCheck,
          badge: unallocatedJobs > 0 ? `${unallocatedJobs} pending` : undefined,
          badgeColor: 'bg-rose-500 text-white',
          roles: ['owner_admin', 'controller']
        },
        {
          to: '/office/schools',
          label: 'School Runs & SEN',
          icon: GraduationCap,
          roles: ['owner_admin', 'controller', 'hr_vetting']
        }
      ]
    },
    {
      title: 'Fleet & Maintenance',
      items: [
        {
          to: '/office/fleet',
          label: 'Fleet & Dual MOTs',
          icon: Car,
          badge: dueMots > 0 ? `${dueMots} due` : undefined,
          badgeColor: 'bg-amber-500 text-slate-900',
          roles: ['owner_admin', 'controller', 'mechanic', 'hr_vetting']
        },
        {
          to: '/office/checks',
          label: 'Daily Checks Builder',
          icon: CheckSquare,
          roles: ['owner_admin', 'controller', 'mechanic']
        },
        {
          to: '/office/maintenance',
          label: 'Defects & Workshop',
          icon: Wrench,
          badge: criticalDefects > 0 ? `${criticalDefects} VOR` : undefined,
          badgeColor: 'bg-rose-600 text-white animate-pulse',
          roles: ['owner_admin', 'controller', 'mechanic']
        }
      ]
    },
    {
      title: 'Workforce & Vetting',
      items: [
        {
          to: '/office/workforce',
          label: 'Drivers & PAs Roster',
          icon: Users,
          roles: ['owner_admin', 'controller', 'hr_vetting']
        },
        {
          to: '/office/compliance',
          label: 'DVLA & DBS Assurance',
          icon: ShieldAlert,
          isRestrictedForController: !canViewDBS,
          roles: ['owner_admin', 'hr_vetting', 'controller']
        }
      ]
    },
    {
      title: 'Commercial & Tariffs',
      items: [
        {
          to: '/office/tariffs',
          label: 'Tariff Engine',
          icon: Tag,
          roles: ['owner_admin']
        },
        {
          to: '/office/finance',
          label: 'Finance & Payouts',
          icon: PoundSterling,
          roles: ['owner_admin', 'controller']
        },
        {
          to: '/office/reports',
          label: 'Reports & Audits',
          icon: FileSpreadsheet,
          roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic']
        }
      ]
    }
  ];

  // Mobile App Dedicated Entry Points
  const staffAppItems = [
    {
      to: '/app/home',
      label: 'Staff App Home Portal',
      icon: Smartphone,
      highlight: true
    },
    {
      to: '/app/driver-cockpit',
      label: 'Driver Mobile Cockpit',
      icon: Smartphone,
      highlight: true
    },
    {
      to: '/app/pa-cockpit',
      label: 'PA School Run Cockpit',
      icon: Smartphone,
      highlight: true
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors">
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((section) => {
          const visibleItems = section.items.filter(item => item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 py-1">
                {section.title}
              </div>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {item.isRestrictedForController && (
                            <span title="DBS & Medical details restricted for controllers">
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
            </div>
          );
        })}

        {/* Separator for Staff Cockpit simulators */}
        <div className="space-y-1 pt-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-3 py-1">
            Mobile Staff Apps (PWA)
          </div>

          {staffAppItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50'
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
      </div>

      {/* User Session Footer & Sign Out Card */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 space-y-2">
          
          <div className="flex items-center gap-2.5">
            <img 
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>
            
            <button
              onClick={openLogoutDialog}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
              title="Sign out of shared terminal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="flex items-center justify-between pt-1 text-[10px]">
            <button
              type="button"
              onClick={triggerSessionExpired}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
              title="Test session expiry modal with re-login"
            >
              <Clock className="w-3 h-3" />
              <span>Simulate Expiry</span>
            </button>

            {offlineDraftsCount > 0 && (currentUser.role === 'driver' || currentUser.role === 'pa') && (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> {offlineDraftsCount} drafts
              </span>
            )}
          </div>

        </div>
      )}

    </aside>
  );
};
