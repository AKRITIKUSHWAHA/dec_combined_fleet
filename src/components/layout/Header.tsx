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
  LogOut,
  Clock,
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
  const { currentUser, openLogoutDialog, triggerSessionExpired } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead } = useData();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const homePath = (currentRole === 'driver' || currentRole === 'pa') ? '/app/home' : '/office/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to={homePath} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 text-lg tracking-wider">
                DEC
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                    DEC FLEET
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    UK v1.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block leading-tight">
                  Integrated Fleet, Dispatch & Workforce
                </p>
              </div>
            </Link>
          </div>

          {/* Center / Mid: Company Switcher */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <Building2 className="w-4 h-4 ml-2 text-slate-500 dark:text-slate-400 shrink-0" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 py-1.5 pr-8 pl-1 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="all">🏢 All Sub-Companies (DEC Head Office)</option>
              {subCompanies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Tools: Role Switcher, Staff App Mode, Notifications, Theme, User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Quick Staff Mode shortcut */}
            {(currentRole === 'driver' || currentRole === 'pa') ? (
              <Link
                to={currentRole === 'driver' ? '/app/driver-cockpit' : '/app/pa-cockpit'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                <Smartphone className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Active Staff App</span>
              </Link>
            ) : null}

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${roleConfig.badgeColor}`}
                title="Switch test role"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">{roleConfig.label}</span>
                <span className="sm:hidden font-semibold">{roleConfig.id.substring(0, 4).toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowRoleMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-left">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Select Active Persona / Role
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Filters data & controls visibility automatically
                      </p>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-1 space-y-1">
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
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-start justify-between ${
                              isSelected 
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold' 
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{r.label}</span>
                                {r.isMobileCockpit && (
                                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1 rounded text-slate-600 dark:text-slate-400">
                                    App
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal line-clamp-1">
                                {r.description}
                              </p>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />}
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
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Operational Alerts ({unreadNotifs.length} unread)
                      </span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                        Mark all read
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-center text-slate-400">No active alerts</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {n.severity === 'critical' ? (
                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className={`font-semibold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                  {n.description}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
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
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile & Sign Out Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/50"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </p>
                        <span className={`inline-block mt-1 text-[9px] font-semibold px-2 py-0.2 rounded-full border ${roleConfig.badgeColor}`}>
                          {roleConfig.label}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            triggerSessionExpired();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-2 font-medium transition"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Simulate Session Timeout</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            openLogoutDialog();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-semibold transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};


