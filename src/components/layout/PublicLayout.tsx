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
  Lock,
  ArrowRight
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-180 selection:bg-[#B6F23C] selection:text-[#08201C]">
      
      {/* Public Header (Strictly NO staff menus or office sidebars) */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-3 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* DEC Brand Wordmark */}
          <Link to="/book" className="flex items-center gap-3 group nr-focus rounded-[12px] p-1">
            <div className="flex items-baseline">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[var(--text)] group-hover:text-[#B6F23C] transition-colors">
                DEC
              </span>
              <span className="w-5 h-1 bg-[#B6F23C] rounded-full inline-block ml-1 group-hover:w-6 transition-all" />
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[14px] border border-[var(--border)]" aria-label="Public portals">
            {publicNavLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-xs font-heading font-semibold transition-all duration-180 nr-focus ${
                      isActive
                        ? 'bg-[#B6F23C] text-[#08201C] font-bold shadow-lime-glow'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Staff Portal Login */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[#B6F23C] transition nr-focus"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Night Road theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFC24B]" /> : <Moon className="w-4 h-4 text-[#3FE0C5]" />}
            </button>

            <Link
              to="/login"
              className="btn-ghost !text-xs !py-1.5 !px-3 !min-h-[36px] hidden sm:flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </Link>
          </div>

        </div>

        {/* Mobile Nav Pills on Small Screens */}
        <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2.5 mt-2 border-t border-[var(--border)]">
          {publicNavLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[11px] font-heading font-semibold py-1 px-2.5 rounded-[8px] whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#B6F23C] text-[#08201C] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content (Isolated from staff UI) */}
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
