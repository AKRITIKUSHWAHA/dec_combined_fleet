import React, { useState } from 'react';
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
  Palette,
  Clock,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { subCompanies, selectedCompanyId, setSelectedCompanyId } = useCompany();
  const { currentRole, setCurrentRole, roleConfig } = useRole();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead } = useData();
  const { user, requestLogout, toastMessage } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-180">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: Mobile hamburger & Logo with Lime Road Dash */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] nr-focus"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="font-heading font-extrabold text-2xl tracking-tight text-[var(--text)] flex items-baseline">
                  DEC
                  <span className="w-4 h-1 bg-[#B6F23C] rounded-full inline-block ml-1 group-hover:w-6 transition-all duration-180" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-xs tracking-tight text-[var(--text)]">
                      FLEET PLATFORM
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/40">
                      NIGHT ROAD
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                    UK Fleet, Dispatch &amp; Workforce
                  </p>
                </div>
              </Link>
            </div>

            {/* Center: Company Switcher */}
            <div className="hidden md:flex items-center gap-2 bg-[var(--surface-2)] px-2.5 py-1.5 rounded-[14px] border border-[var(--border)]">
              <Building2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[var(--text)] pr-6 focus:outline-none cursor-pointer"
                aria-label="Filter by Operating Company"
              >
                <option value="all">🏢 All Sub-Companies (DEC Head Office)</option>
                {subCompanies.map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2">

              {/* Design System Link */}
              <Link
                to="/design-system"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-heading font-bold bg-[#3FE0C5]/15 text-[#0B2B26] dark:text-[#3FE0C5] border border-[#3FE0C5]/40 hover:bg-[#3FE0C5]/25 transition-all duration-180 nr-focus"
              >
                <Palette className="w-3.5 h-3.5 text-[#3FE0C5]" />
                <span>Design System</span>
              </Link>

              {/* Quick Staff Mode shortcut */}
              {(currentRole === 'driver' || currentRole === 'pa') && (
                <Link
                  to={currentRole === 'driver' ? '/driver-cockpit' : '/pa-cockpit'}
                  className="btn-primary text-xs !py-1 !px-2.5 !min-h-[36px]"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Active Staff App</span>
                </Link>
              )}

              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[12px] text-xs font-heading font-semibold border transition-all duration-180 nr-focus ${roleConfig.badgeColor}`}
                  title="Switch test persona"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">{roleConfig.label}</span>
                  <span className="sm:hidden font-bold">{roleConfig.id.substring(0, 4).toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                </button>

                {/* Role Dropdown */}
                {showRoleMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowRoleMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-[var(--surface)] text-[var(--text)] rounded-[18px] shadow-2xl border border-[var(--border)] py-2 z-50 text-left">
                      <div className="px-3.5 py-2 border-b border-[var(--border)]">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Select Active Persona / Role
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Filters data &amp; controls visibility automatically
                        </p>
                      </div>

                      <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                          const r = ROLE_CONFIGS[rKey];
                          const isSelected = currentRole === rKey;
                          return (
                            <button
                              key={rKey}
                              onClick={() => {
                                setCurrentRole(rKey);
                                setShowRoleMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-[12px] text-xs transition-all duration-180 flex items-start justify-between ${isSelected
                                  ? 'bg-[#B6F23C]/15 text-[var(--text)] font-bold border border-[#B6F23C]/40'
                                  : 'hover:bg-[var(--surface-2)] text-[var(--text)]'
                                }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-heading font-semibold">{r.label}</span>
                                  {r.isMobileCockpit && (
                                    <span className="text-[10px] bg-[var(--surface-2)] px-1.5 py-0.2 rounded font-mono text-[var(--text-muted)]">
                                      App
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-normal line-clamp-1">
                                  {r.description}
                                </p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B6F23C] shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-2 rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] relative nr-focus"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF5D6C] rounded-full animate-ping" />
                  )}
                </button>

                {showNotifMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--surface)] text-[var(--text)] rounded-[20px] shadow-2xl border border-[var(--border)] py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
                        <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Operational Alerts ({unreadNotifs.length} unread)
                        </span>
                        <span className="text-[11px] text-[#3FE0C5] font-semibold cursor-pointer hover:underline">
                          Mark all read
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-xs text-center text-[var(--text-muted)]">No active alerts</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              className={`p-3 text-xs transition cursor-pointer hover:bg-[var(--surface-2)] ${!n.read ? 'bg-[#B6F23C]/5' : ''
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

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-[12px] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] nr-focus"
                aria-label="Toggle dark/light theme"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFC24B]" /> : <Moon className="w-4 h-4 text-[var(--text)]" />}
              </button>

              {/* User Avatar Dropdown (Required: Name, Role, Logout) */}
              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-[12px] hover:bg-[var(--surface-2)] text-[var(--text)] transition-all duration-180 nr-focus border border-transparent hover:border-[var(--border)]"
                  title="Staff account & session options"
                  aria-label="User account menu"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-[10px] object-cover ring-1 ring-[var(--border)]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-[10px] bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] font-heading font-bold text-xs flex items-center justify-center border border-[#B6F23C]/40">
                      {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-heading font-semibold max-w-[100px] truncate">
                    {user?.name || 'Staff User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-[var(--surface)] text-[var(--text)] rounded-[18px] shadow-2xl border border-[var(--border)] py-2 z-50 text-left animate-in fade-in duration-180">
                      
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
                            {roleConfig.label.split('/')[0]}
                          </span>
                          <span className="text-[10px] font-mono text-[#3FE0C5]">
                            {user?.badgeNumber || 'VERIFIED'}
                          </span>
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
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-heading font-semibold text-[#FF5D6C] hover:bg-[#FF5D6C]/15 transition-all duration-180"
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

      {/* Persistent Toast Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#08201C] text-[#EAF7F2] border border-[#B6F23C]/50 px-4 py-2.5 rounded-[14px] shadow-2xl flex items-center gap-2.5 text-xs font-heading font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B6F23C] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
