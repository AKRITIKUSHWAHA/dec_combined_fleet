import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  CalendarCheck, 
  MapPin, 
  Building2, 
  HeartHandshake, 
  Sun, 
  Moon, 
  PhoneCall, 
  ShieldCheck, 
  Lock
} from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const publicNavLinks = [
    { to: '/book', label: 'Book a Ride', icon: CalendarCheck },
    { to: '/track', label: 'Live Tracking', icon: MapPin },
    { to: '/corporate', label: 'Corporate Portal', icon: Building2 },
    { to: '/parent', label: 'Parent SEN Portal', icon: HeartHandshake }
  ];

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-180 selection:bg-[#B6F23C] selection:text-[#08201C] overflow-x-hidden">
      
      {/* Public Header with Safe Area Inset */}
      <header 
        className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] px-3 sm:px-6 lg:px-8 py-3 transition-colors select-none"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* DEC Brand Wordmark */}
          <Link to="/book" className="flex items-center gap-2.5 sm:gap-3 group nr-focus rounded-[12px] p-1">
            <div className="flex items-baseline">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[var(--text)] group-hover:text-[#B6F23C] transition-colors">
                DEC
              </span>
              <span className="w-4 h-1 bg-[#B6F23C] rounded-full inline-block ml-1 group-hover:w-6 transition-all" />
            </div>
            <div className="hidden sm:block border-l border-[var(--border)] pl-3">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[var(--text)] block">
                Passenger Transport Portal
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Executive • Airport • SEN School Runs
              </span>
            </div>
          </Link>

          {/* Desktop/Tablet Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[14px] border border-[var(--border)]" aria-label="Public portals">
            {publicNavLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-heading font-semibold transition-all duration-180 nr-focus min-h-[44px] ${
                      isActive
                        ? 'bg-[#B6F23C] text-[#08201C] font-bold shadow-lime-glow'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Staff Portal Login */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-11 h-11 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[#B6F23C] transition nr-focus flex items-center justify-center shrink-0"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Night Road theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-[#FFC24B]" /> : <Moon className="w-5 h-5 text-[#3FE0C5]" />}
            </button>

            <Link
              to="/login"
              className="btn-ghost !text-xs !py-2 !px-3.5 !min-h-[44px] hidden sm:flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Staff Login</span>
            </Link>
          </div>

        </div>

        {/* Mobile Navigation Scrollable Pills (Min 44px Touch Targets) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto nr-scrollbar pt-2.5 mt-2 border-t border-[var(--border)] pb-1">
          {publicNavLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-heading font-semibold px-3 py-2 rounded-[10px] whitespace-nowrap transition flex items-center gap-1.5 min-h-[44px] shrink-0 ${
                  isActive
                    ? 'bg-[#B6F23C] text-[#08201C] font-bold shadow-sm'
                    : 'text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] hover:text-[var(--text)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content (Responsive Padding: 16px mobile, 24px tablet, 32px desktop) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Public UK Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-6 text-xs text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-heading font-bold text-[var(--text)]">
              DEC Passenger Services Ltd • Operating Entity
            </p>
            <p className="text-[11px]">
              Licenced Private Hire &amp; School Transport Operator • Luton Borough &amp; Central Bedfordshire Councils
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-[#34D399]">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span className="flex items-center gap-1 text-[var(--text)]">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>24/7 Desk: 01582 999 888</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
