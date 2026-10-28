import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useCompany } from '../../context/CompanyContext';
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
  Building2
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { currentRole, canViewDBS } = useRole();
  const { subCompanies, selectedCompanyId, setSelectedCompanyId } = useCompany();

  if (!isOpen) return null;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner_admin', 'controller', 'hr_vetting', 'mechanic'] },
    { to: '/live-map', label: 'Live Dispatch Map', icon: MapPin, roles: ['owner_admin', 'controller'] },
    { to: '/bookings', label: 'Bookings & Dispatch', icon: CalendarCheck, roles: ['owner_admin', 'controller'] },
    { to: '/schools', label: 'School Transport', icon: GraduationCap, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/fleet', label: 'Fleet & Dual MOTs', icon: Car, roles: ['owner_admin', 'controller', 'mechanic', 'hr_vetting'] },
    { to: '/checks', label: 'Daily Checks', icon: CheckSquare, roles: ['owner_admin', 'controller', 'mechanic'] },
    { to: '/maintenance', label: 'Defects & Workshop', icon: Wrench, roles: ['owner_admin', 'controller', 'mechanic'] },
    { to: '/workforce', label: 'Staff (Drivers & PAs)', icon: Users, roles: ['owner_admin', 'controller', 'hr_vetting'] },
    { to: '/compliance', label: 'Compliance & DBS', icon: ShieldAlert, roles: ['owner_admin', 'hr_vetting', 'controller'] },
    { to: '/tariffs', label: 'Tariff Engine', icon: Tag, roles: ['owner_admin'] },
    { to: '/finance', label: 'Finance & Invoices', icon: PoundSterling, roles: ['owner_admin', 'controller'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 p-4 flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              DEC
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">DEC Fleet Menu</h2>
              <p className="text-[10px] text-slate-500">Navigation & Operations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Switcher (Mobile) */}
        <div className="py-3 border-b border-slate-100 dark:border-slate-800">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Operating Entity
          </label>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Sub-Companies (DEC HQ)</option>
              {subCompanies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1">
          {visibleItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Staff Apps
            </p>
            <NavLink
              to="/driver-cockpit"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 mb-1"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Driver Mobile Cockpit</span>
            </NavLink>
            <NavLink
              to="/pa-cockpit"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40"
            >
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>PA School Run Cockpit</span>
            </NavLink>
          </div>
        </div>

      </div>
    </div>
  );
};

