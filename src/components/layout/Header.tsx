import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useRole, ROLE_CONFIGS } from '../../context/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Building2,
  ShieldCheck,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Smartphone,
  Clock,
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const location = useLocation();
  const { subCompanies, selectedCompanyId, setSelectedCompanyId } = useCompany();
  const { currentRole, setCurrentRole, roleConfig } = useRole();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead } = useData();
  const { user, requestLogout, toastMessage } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileCompanySheet, setShowMobileCompanySheet] = useState(false);

  // Automatically close menus on route change
  useEffect(() => {
    setShowRoleMenu(false);
    setShowNotifMenu(false);
    setShowUserMenu(false);
    setShowMobileCompanySheet(false);
  }, [location.pathname]);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Short clean display for persona role
  const getCleanRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'owner_admin':
        return 'Head Office Admin';
      case 'controller':
        return 'Dispatcher';
      case 'driver':
        return 'Driver';
      case 'pa':
        return 'Passenger Assistant';
      case 'mechanic':
        return 'Fleet Mechanic';
      case 'hr_vetting':
        return 'HR & Vetting';
      default:
        return 'Staff';
    }
  };

  const selectedCompanyObj = subCompanies.find(c => c.id === selectedCompanyId);

  return (
    <>
      <header 
        className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-180 select-none"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">

            {/* ========================================================
                LEFT: Hamburger + Brand Wordmark + Entity Switcher
               ======================================================== */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 min-w-0">
              
              {/* Mobile Menu Toggle Button (Min 48px touch target) */}
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden w-11 h-11 rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] flex items-center justify-center nr-focus shrink-0"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Brand Wordmark */}
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                <div className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[var(--text)] flex items-baseline">
                  DEC
                  <span className="w-3 sm:w-3.5 h-1 bg-[#B6F23C] rounded-full inline-block ml-1 group-hover:w-5 transition-all duration-180" />
                </div>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] whitespace-nowrap">
                  FLEET UK
                </span>
              </Link>

              {/* Subtle Vertical Divider */}
              <div className="hidden md:block h-5 w-[1px] bg-[var(--border)]" />

              {/* Desktop Operating Company / Sub-Company Selector */}
              <div className="hidden md:flex items-center gap-2 bg-[var(--surface-2)] px-2.5 h-10 rounded-[12px] border border-[var(--border)] hover:border-[#3FE0C5]/50 transition max-w-[240px] lg:max-w-[270px]">
                <Building2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[var(--text)] pr-4 focus:outline-none cursor-pointer truncate w-full"
                  aria-label="Filter by Operating Company"
                >
                  <option value="all">All Entities (DEC HQ)</option>
                  {subCompanies.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Company Switcher Compact Pill (Tapping opens bottom sheet) */}
              <button
                type="button"
                onClick={() => setShowMobileCompanySheet(true)}
                className="md:hidden flex items-center gap-1.5 px-2.5 h-10 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs font-semibold truncate max-w-[120px] active:scale-95 transition"
                title="Switch operating company"
                aria-label="Switch operating company"
              >
                <Building2 className="w-3.5 h-3.5 text-[#3FE0C5] shrink-0" />
                <span className="truncate text-[11px] font-mono font-bold">
                  {selectedCompanyId === 'all' ? 'DEC HQ' : selectedCompanyObj?.code || 'HQ'}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </button>

              {/* Live Status Indicator */}
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                <span>ONLINE</span>
              </div>

            </div>

            {/* ========================================================
                RIGHT: Persona Switcher + Alerts + Theme + Profile
               ======================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {/* Quick Staff Cockpit Shortcut (Only shown when persona is Driver or PA) */}
              {(currentRole === 'driver' || currentRole === 'pa') && (
                <Link
                  to={currentRole === 'driver' ? '/driver-cockpit' : '/pa-cockpit'}
                  className="btn-primary text-xs !h-10 !py-0 !px-2.5 sm:!px-3 !min-h-0 whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Active App</span>
                </Link>
              )}

              {/* Persona / Role Quick Switcher Pill (Tablet / Desktop) */}
              <div className="relative shrink-0 hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-1.5 px-3 h-10 rounded-[12px] text-xs font-heading font-semibold border transition-all duration-180 whitespace-nowrap nr-focus bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[#B6F23C]"
                  title="Active Role / Persona - Click to switch"
                  aria-label="Switch active role"
                >
                  <ShieldCheck className="w-4 h-4 text-[#3FE0C5]" />
                  <span>{getCleanRoleLabel(currentRole)}</span>
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                </button>

                {showRoleMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-[var(--surface)] text-[var(--text)] rounded-[18px] shadow-2xl border border-[var(--border)] py-2 z-50 text-left animate-in fade-in duration-180">
                      <div className="px-3 py-1.5 border-b border-[var(--border)] flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Active Persona
                        </span>
                        <span className="text-[10px] font-mono text-[#3FE0C5]">Switch Role</span>
                      </div>
                      <div className="p-1 space-y-0.5">
                        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                          const r = ROLE_CONFIGS[rKey];
                          const isSelected = currentRole === rKey;
                          return (
                            <button
                              key={rKey}
                              type="button"
                              onClick={() => {
                                setCurrentRole(rKey);
                                setShowRoleMenu(false);
                              }}
                              className={`w-full text-left px-2.5 py-2.5 rounded-[10px] text-xs transition flex items-center justify-between min-h-[44px] ${
                                isSelected
                                  ? 'bg-[#B6F23C]/20 text-[var(--text)] font-bold'
                                  : 'hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                              }`}
                            >
                              <span className="truncate">{r.label}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B6F23C] shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications Alert Dropdown (Min 48px touch area) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="w-11 h-11 rounded-[12px] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] flex items-center justify-center relative transition nr-focus shrink-0"
                  aria-label="View notifications"
                  title="Operational alerts"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5D6C] rounded-full ring-2 ring-[var(--surface)]" />
                  )}
                </button>

                {showNotifMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-[var(--surface)] text-[var(--text)] rounded-[20px] shadow-2xl border border-[var(--border)] py-2 z-50 animate-in fade-in duration-180">
                      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
                        <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Operational Alerts ({unreadNotifs.length} unread)
                        </span>
                        <span className="text-[11px] text-[#3FE0C5] font-semibold cursor-pointer hover:underline">
                          Mark all read
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto nr-scrollbar divide-y divide-[var(--border)]">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-xs text-center text-[var(--text-muted)]">No active alerts</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              className={`p-3 text-xs transition cursor-pointer hover:bg-[var(--surface-2)] ${
                                !n.read ? 'bg-[#B6F23C]/5' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {n.severity === 'critical' ? (
                                  <AlertTriangle className="w-4 h-4 text-[#FF5D6C] shrink-0 mt-0.5" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#FFC24B] shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className={`font-semibold ${!n.read ? 'text-[var(--text)] font-bold' : 'text-[var(--text-muted)]'}`}>
                                    {n.title}
                                  </p>
                                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                                    {n.description}
                                  </p>
                                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block font-mono">
                                    {n.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Dark / Light Theme Toggle Button (Min 48px touch area) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-11 h-11 rounded-[12px] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] flex items-center justify-center transition nr-focus shrink-0"
                aria-label="Toggle dark/light theme"
                title={`Switch to ${theme === 'dark' ? 'Light Mode (Soft Mint)' : 'Dark Mode (Night Road)'}`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-[#B6F23C]" /> : <Moon className="w-5 h-5 text-[#0B2B26]" />}
              </button>

              {/* Subtle Vertical Divider */}
              <div className="hidden sm:block h-5 w-[1px] bg-[var(--border)]" />

              {/* User Avatar Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1 sm:pr-2.5 h-11 rounded-[12px] bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 text-[var(--text)] transition-all duration-180 nr-focus border border-[var(--border)] hover:border-[var(--text-muted)]"
                  title="Staff account & session options"
                  aria-label="User account menu"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--border)] shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] font-heading font-bold text-xs flex items-center justify-center border border-[#B6F23C]/40 shrink-0">
                      {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-heading font-semibold max-w-[110px] truncate whitespace-nowrap">
                    {user?.name || 'Arthur Pendelton'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-[var(--surface)] text-[var(--text)] rounded-[18px] shadow-2xl border border-[var(--border)] py-2 z-50 text-left animate-in fade-in duration-180">
                      
                      {/* User Header Details */}
                      <div className="px-3.5 py-2.5 border-b border-[var(--border)] space-y-1">
                        <p className="font-heading font-bold text-xs text-[var(--text)] truncate">
                          {user?.name || 'DEC Staff Member'}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                          {user?.email || 'session@decgroup.co.uk'}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
                            {getCleanRoleLabel(currentRole)}
                          </span>
                          <span className="text-[10px] font-mono text-[#3FE0C5]">
                            {user?.badgeNumber || 'VERIFIED'}
                          </span>
                        </div>
                      </div>

                      {/* Role Switcher in User Menu */}
                      <div className="p-1.5 border-b border-[var(--border)]">
                        <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                          Switch Active Role / Persona
                        </p>
                        <div className="max-h-48 overflow-y-auto nr-scrollbar space-y-0.5">
                          {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                            const r = ROLE_CONFIGS[rKey];
                            const isSelected = currentRole === rKey;
                            return (
                              <button
                                key={rKey}
                                type="button"
                                onClick={() => {
                                  setCurrentRole(rKey);
                                  setShowUserMenu(false);
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-[10px] text-xs transition flex items-center justify-between min-h-[44px] ${
                                  isSelected
                                    ? 'bg-[#B6F23C]/15 text-[var(--text)] font-bold'
                                    : 'hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                              >
                                <span className="truncate">{r.label}</span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F23C] shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Logout Action */}
                      <div className="p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            requestLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-xs font-heading font-semibold text-[#FF5D6C] hover:bg-[#FF5D6C]/15 transition-all duration-180 cursor-pointer min-h-[44px]"
                        >
                          <LogOut className="w-4 h-4 text-[#FF5D6C]" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE COMPANY SWITCHER BOTTOM SHEET (For small screens)
         ======================================================== */}
      {showMobileCompanySheet && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileCompanySheet(false)}
          />
          <div 
            className="fixed inset-x-0 bottom-0 bg-[var(--surface)] text-[var(--text)] rounded-t-[28px] border-t border-[var(--border)] p-4 shadow-2xl max-h-[75dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
          >
            <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto mb-3 shrink-0" />
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#3FE0C5]" />
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                  Select Operating Entity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileCompanySheet(false)}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto nr-scrollbar py-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCompanyId('all');
                  setShowMobileCompanySheet(false);
                }}
                className={`w-full p-3 rounded-[14px] border text-left flex items-center justify-between min-h-[48px] ${
                  selectedCompanyId === 'all'
                    ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)] font-bold'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <div>
                  <p className="font-heading font-bold text-xs text-[var(--text)]">All Entities (DEC HQ)</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">Consolidated group view</p>
                </div>
                {selectedCompanyId === 'all' && <CheckCircle2 className="w-4 h-4 text-[#B6F23C]" />}
              </button>

              {subCompanies.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCompanyId(c.id);
                    setShowMobileCompanySheet(false);
                  }}
                  className={`w-full p-3 rounded-[14px] border text-left flex items-center justify-between min-h-[48px] ${
                    selectedCompanyId === c.id
                      ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)] font-bold'
                      : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  <div>
                    <p className="font-heading font-bold text-xs text-[var(--text)]">{c.name}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">Code: {c.code} • {c.council}</p>
                  </div>
                  {selectedCompanyId === c.id && <CheckCircle2 className="w-4 h-4 text-[#B6F23C]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Toast Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#08201C] text-[#EAF7F2] border border-[#B6F23C]/50 px-4 py-2 rounded-[12px] shadow-2xl flex items-center gap-2.5 text-xs font-heading font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B6F23C] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
