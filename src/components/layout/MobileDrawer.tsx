import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useCompany } from '../../context/CompanyContext';
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
  X,
  Building2,
  Palette,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { currentRole } = useRole();
  const { subCompanies, selectedCompanyId, setSelectedCompanyId } = useCompany();
  const { bookings, defects, vehicles } = useData();
  const { user, requestLogout } = useAuth();

  if (!isOpen) return null;

  const unallocatedJobs = bookings.filter(b => b.status === 'unallocated').length;
  const criticalDefects = defects.filter(d => d.severity === 'critical_safety' && d.status !== 'verified_released').length;
  const dueMots = vehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length;

  const navItems = [
    { to: '/', label: 'Operational Dashboard', icon: LayoutDashboard, roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic'] },
    { to: '/live-map', label: 'Live Dispatch Map', icon: MapPin, roles: ['owner_admin', 'controller'] },
    { 
      to: '/bookings', 
      label: 'Bookings & Dispatch', 
      icon: CalendarCheck, 
      badge: unallocatedJobs > 0 ? `${unallocatedJobs}` : undefined,
      badgeColor: 'bg-[#FF5D6C] text-white',
      roles: ['owner_admin', 'controller'] 
    },
    { to: '/schools', label: 'School Transport & SEN', icon: GraduationCap, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { 
      to: '/fleet', 
      label: 'Fleet & Dual MOTs', 
      icon: Car, 
      badge: dueMots > 0 ? `${dueMots}` : undefined,
      badgeColor: 'bg-[#FFC24B] text-[#08201C]',
      roles: ['owner_admin', 'controller', 'mechanic', 'hr_vetting'] 
    },
    { to: '/checks', label: 'Daily Checks Builder', icon: CheckSquare, roles: ['owner_admin', 'controller', 'mechanic'] },
    { 
      to: '/maintenance', 
      label: 'Defects & Workshop', 
      icon: Wrench, 
      badge: criticalDefects > 0 ? `${criticalDefects} VOR` : undefined,
      badgeColor: 'bg-[#FF5D6C] text-white animate-pulse',
      roles: ['owner_admin', 'controller', 'mechanic'] 
    },
    { to: '/workforce', label: 'Staff (Drivers & PAs)', icon: Users, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/compliance', label: 'Compliance & DBS', icon: ShieldAlert, roles: ['owner_admin', 'hr_vetting', 'controller'] },
    { to: '/tariffs', label: 'Tariff Engine', icon: Tag, roles: ['owner_admin'] },
    { to: '/finance', label: 'Finance & Invoices', icon: PoundSterling, roles: ['owner_admin', 'controller'] },
    { to: '/design-system', label: 'Design System', icon: Palette, roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa'] }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  const handleLogoutClick = () => {
    onClose();
    requestLogout();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[var(--surface)] text-[var(--text)] p-4 flex flex-col shadow-2xl border-r border-[var(--border)] animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-2xl text-[var(--text)] flex items-baseline">
              DEC
              <span className="w-4 h-1 bg-[#B6F23C] rounded-full inline-block ml-1" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-xs text-[var(--text)]">Navigation</h2>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">Night Road Fleet System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] nr-focus"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Entity Selector */}
        <div className="py-3 border-b border-[var(--border)] shrink-0">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
            Operating Entity
          </label>
          <div className="flex items-center gap-2 bg-[var(--surface-2)] p-2 rounded-[12px] border border-[var(--border)]">
            <Building2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[var(--text)] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[var(--surface)]">All Sub-Companies (DEC HQ)</option>
              {subCompanies.map(c => (
                <option key={c.id} value={c.id} className="bg-[var(--surface)]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Links with custom slim scrollbar */}
        <div className="flex-1 overflow-y-auto nr-scrollbar py-3 space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 pb-1">
            Dispatch Modules
          </div>

          {visibleItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-medium transition-all duration-180 min-h-[44px] ${
                    isActive
                      ? 'bg-[#B6F23C] text-[#08201C] font-heading font-bold shadow-lime-glow'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-heading truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-[var(--border)] mt-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 pb-1.5">
              Mobile Staff Cockpits
            </p>
            <NavLink
              to="/driver-cockpit"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-heading font-bold text-[#34D399] bg-[#34D399]/10 hover:bg-[#34D399]/20 mb-2 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-[#34D399]" />
                <span>Driver Mobile Cockpit</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </NavLink>
            <NavLink
              to="/pa-cockpit"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-heading font-bold text-[#FF9F6B] bg-[#FF9F6B]/10 hover:bg-[#FF9F6B]/20 min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-[#FF9F6B]" />
                <span>PA School Run Cockpit</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </NavLink>
          </div>
        </div>

        {/* Clean Fixed Logout Button at bottom of Mobile Drawer */}
        <div className="pt-3 border-t border-[var(--border)] shrink-0 space-y-1.5">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-heading font-bold text-[#FF5D6C] hover:bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 transition-all duration-180 min-h-[44px] cursor-pointer"
            aria-label="Log Out"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-[#FF5D6C]" />
              <span>Log Out</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[120px]">
              {user?.name ? user.name.split(' ')[0] : 'Sign Out'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
