import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Car, 
  MoreHorizontal,
  Home,
  MessageSquare,
  Navigation,
  Sliders,
  X,
  LogOut,
  Users,
  Wrench,
  ShieldAlert,
  CheckSquare,
  GraduationCap,
  Plane,
  Receipt,
  Bell,
  Sparkles,
  FileText,
  Building2,
  Shield,
  Layers,
  Fuel,
  Camera,
  AlertTriangle,
  Flame,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, roleConfig } = useRole();
  const { user, requestLogout } = useAuth();
  const { bookings, defects, vehicles } = useData();

  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showDriverMoreSheet, setShowDriverMoreSheet] = useState(false);

  // Close sheets on route change
  useEffect(() => {
    setShowMoreSheet(false);
    setShowDriverMoreSheet(false);
  }, [location.pathname]);

  const isDriverOrPACockpit = 
    location.pathname.includes('driver-cockpit') || 
    location.pathname.includes('pa-cockpit') || 
    location.pathname.startsWith('/app/');

  const unallocatedJobs = bookings.filter(b => b.status === 'unallocated').length;
  const criticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released').length;

  // Office standard bottom nav items (Max 5)
  const officeItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/live-map', label: 'Live Map', icon: MapPin },
    { 
      to: '/bookings', 
      label: 'Bookings', 
      icon: CalendarCheck,
      badge: unallocatedJobs > 0 ? unallocatedJobs : undefined
    },
    { to: '/fleet', label: 'Fleet', icon: Car },
  ];

  // All secondary modules for the Office "More" sheet
  const allMoreModules = [
    { to: '/airport', label: 'Airport & Chauffeur', icon: Plane, roles: ['owner_admin', 'controller'] },
    { to: '/schools', label: 'School Transport (SEN)', icon: GraduationCap, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/checks', label: 'Daily Checks Builder', icon: CheckSquare, roles: ['owner_admin', 'controller', 'mechanic'] },
    { to: '/maintenance', label: 'Defects & Workshop', icon: Wrench, badge: criticalDefects > 0 ? `${criticalDefects} VOR` : undefined, roles: ['owner_admin', 'controller', 'mechanic'] },
    { to: '/workforce', label: 'Staff Directory', icon: Users, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/compliance', label: 'Compliance & DBS', icon: ShieldAlert, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/office/expenses-incidents', label: 'Expenses & Incidents', icon: Receipt, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/office/reminders', label: 'Reminder Centre', icon: Bell, roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic'] },
    { to: '/tariffs', label: 'Tariff Engine', icon: Layers, roles: ['owner_admin'] },
    { to: '/finance', label: 'Finance & Invoices', icon: Receipt, roles: ['owner_admin', 'controller'] },
    { to: '/office/operations', label: 'Operations & Chat', icon: Sparkles, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/safeguarding', label: 'Safeguarding Cases', icon: Shield, roles: ['owner_admin', 'hr_vetting'] },
    { to: '/documents', label: 'Document Library', icon: FileText, roles: ['owner_admin', 'hr_vetting', 'controller'] },
    { to: '/office/enhancements', label: 'Enhancements Hub', icon: Sparkles, roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa'] },
    { to: '/sub-companies', label: 'Sub-Companies', icon: Building2, roles: ['owner_admin'] },
    { to: '/integrations', label: 'UK APIs & Telematics', icon: Sliders, roles: ['owner_admin', 'controller', 'hr_vetting'] },
  ];

  const visibleMoreModules = allMoreModules.filter(m => m.roles.includes(currentRole));

  // Staff Driver/PA bottom nav items (5 items)
  const staffItems = [
    { 
      to: currentRole === 'pa' ? '/pa-cockpit' : '/driver-cockpit', 
      label: 'Home', 
      icon: Home 
    },
    { 
      to: currentRole === 'pa' ? '/pa-cockpit#roster' : '/driver-cockpit#active-job', 
      label: 'Jobs', 
      icon: CalendarCheck 
    },
    { 
      to: '/carplay-cockpit', 
      label: 'Cockpit HUD', 
      icon: Navigation,
      highlight: true
    },
    { 
      to: '/office/operations', 
      label: 'Messages', 
      icon: MessageSquare 
    },
  ];

  return (
    <>
      {/* Fixed Bottom Tab Bar with Safe-Area Padding */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] transition-colors duration-180"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 h-14 max-w-lg mx-auto">
          
          {/* ========================================================
              BRANCH 1: Office Bottom Navigation
             ======================================================== */}
          {!isDriverOrPACockpit ? (
            <>
              {officeItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center min-h-[48px] py-1 text-[11px] font-heading transition-all duration-180 relative ${
                        isActive
                          ? 'text-[#08201C] dark:text-[#B6F23C] font-bold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1.5 rounded-[10px] transition-all relative ${
                          isActive ? 'bg-[#B6F23C]/20 text-[#B6F23C]' : ''
                        }`}>
                          <Icon className="w-5 h-5" />
                          {item.badge && item.badge > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5D6C] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center ring-1 ring-[var(--surface)]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="truncate max-w-[64px] mt-0.5">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* 5th Item: Office "More" Sheet Trigger */}
              <button
                type="button"
                onClick={() => setShowMoreSheet(true)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 text-[11px] font-heading transition-all duration-180 ${
                  showMoreSheet
                    ? 'text-[#B6F23C] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                aria-label="Open more modules and options"
              >
                <div className={`p-1.5 rounded-[10px] transition-all ${showMoreSheet ? 'bg-[#B6F23C]/20 text-[#B6F23C]' : ''}`}>
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="truncate max-w-[64px] mt-0.5">More</span>
              </button>
            </>
          ) : (
            /* ========================================================
               BRANCH 2: Driver / PA Cockpit Mobile Bottom Navigation
               ======================================================== */
            <>
              {staffItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center min-h-[48px] py-1 text-[11px] font-heading transition-all duration-180 relative ${
                        isActive
                          ? 'text-[#08201C] dark:text-[#B6F23C] font-bold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1.5 rounded-[10px] transition-all ${
                          isActive 
                            ? 'bg-[#B6F23C]/20 text-[#B6F23C]' 
                            : item.highlight 
                            ? 'bg-[#3FE0C5]/15 text-[#3FE0C5]' 
                            : ''
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="truncate max-w-[64px] mt-0.5">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* 5th Item: Staff "More" Sheet Trigger */}
              <button
                type="button"
                onClick={() => setShowDriverMoreSheet(true)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 text-[11px] font-heading transition-all duration-180 ${
                  showDriverMoreSheet
                    ? 'text-[#B6F23C] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                aria-label="Open staff actions and options"
              >
                <div className={`p-1.5 rounded-[10px] transition-all ${showDriverMoreSheet ? 'bg-[#B6F23C]/20 text-[#B6F23C]' : ''}`}>
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="truncate max-w-[64px] mt-0.5">Tools</span>
              </button>
            </>
          )}

        </div>
      </nav>

      {/* ========================================================
          OFFICE "MORE" BOTTOM SHEET
         ======================================================== */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMoreSheet(false)}
          />

          {/* Sheet Container */}
          <div 
            className="fixed inset-x-0 bottom-0 bg-[var(--surface)] text-[var(--text)] rounded-t-[28px] border-t border-[var(--border)] p-4 sm:p-6 shadow-2xl max-h-[85dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text)]">
                  More Operations
                </h3>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  DEC Platform Modules • {roleConfig.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreSheet(false)}
                className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] nr-focus"
                aria-label="Close more options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Grid of All Modules */}
            <div className="flex-1 overflow-y-auto nr-scrollbar py-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {visibleMoreModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <NavLink
                    key={mod.to}
                    to={mod.to}
                    onClick={() => setShowMoreSheet(false)}
                    className="flex flex-col items-start justify-between p-3 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[#B6F23C] transition active:scale-95 text-left min-h-[72px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-[10px] bg-[var(--surface)] flex items-center justify-center text-[var(--text)]">
                        <Icon className="w-4 h-4 text-[#3FE0C5]" />
                      </div>
                      {mod.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#FF5D6C] text-white">
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-heading font-bold text-[var(--text)] line-clamp-1 mt-2">
                      {mod.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>

            {/* Bottom Actions: User identity & Logout */}
            <div className="pt-3 border-t border-[var(--border)] shrink-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-10 h-10 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
                <div className="truncate">
                  <p className="text-xs font-heading font-bold text-[var(--text)] truncate">
                    {user?.name || 'Staff User'}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                    {roleConfig.label}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMoreSheet(false);
                  requestLogout();
                }}
                className="btn-danger !text-xs !py-2 !px-4 !min-h-[44px] flex items-center gap-2 shrink-0 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          DRIVER / PA STAFF "TOOLS" BOTTOM SHEET
         ======================================================== */}
      {showDriverMoreSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDriverMoreSheet(false)}
          />

          {/* Sheet Container */}
          <div 
            className="fixed inset-x-0 bottom-0 bg-[var(--surface)] text-[var(--text)] rounded-t-[28px] border-t border-[var(--border)] p-4 sm:p-6 shadow-2xl max-h-[85dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--text)]">
                  Driver &amp; In-Cab Tools
                </h3>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Fast Actions • Fuel, Checklists &amp; Safety
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDriverMoreSheet(false)}
                className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] nr-focus"
                aria-label="Close driver tools"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of In-Cab Quick Tools */}
            <div className="flex-1 overflow-y-auto nr-scrollbar py-4 space-y-2.5">
              
              <NavLink
                to="/checks"
                onClick={() => setShowDriverMoreSheet(false)}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[#B6F23C] transition active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#34D399]/20 text-[#34D399] flex items-center justify-center shrink-0">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-[var(--text)]">
                      Daily Vehicle Walkaround Check
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      DVSA required pre-shift vehicle inspection
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </NavLink>

              <NavLink
                to="/office/expenses-incidents"
                onClick={() => setShowDriverMoreSheet(false)}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[#B6F23C] transition active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#FF9F6B]/20 text-[#FF9F6B] flex items-center justify-center shrink-0">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-[var(--text)]">
                      Fuel / Charging Receipt Upload
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Instant mobile photo expense filing
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </NavLink>

              <NavLink
                to="/office/enhancements"
                onClick={() => setShowDriverMoreSheet(false)}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[#B6F23C] transition active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#B6F23C]/20 text-[#B6F23C] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-[var(--text)]">
                      Bidding &amp; Destination Mode
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Filter rides towards home postcodes
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </NavLink>

              <NavLink
                to="/carplay-cockpit"
                onClick={() => setShowDriverMoreSheet(false)}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#0F2F29] border border-[#24574D] hover:border-[#3FE0C5] transition active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#3FE0C5]/20 text-[#3FE0C5] flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-[#EAF7F2]">
                      CarPlay Cockpit (80px Controls)
                    </h4>
                    <p className="text-[11px] text-[#8FB5AA]">
                      Full-screen landscape in-car navigation
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#3FE0C5]" />
              </NavLink>

            </div>

            {/* Bottom Actions: Safe Return & Logout */}
            <div className="pt-3 border-t border-[var(--border)] shrink-0 flex items-center justify-between gap-3">
              <NavLink
                to="/dashboard"
                onClick={() => setShowDriverMoreSheet(false)}
                className="btn-secondary !text-xs !py-2 !px-4 !min-h-[44px] flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Office View</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setShowDriverMoreSheet(false);
                  requestLogout();
                }}
                className="btn-danger !text-xs !py-2 !px-4 !min-h-[44px] flex items-center gap-2 shrink-0 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
