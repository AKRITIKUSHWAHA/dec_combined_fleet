import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS, getRoleHomeRoute } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import fleetHeroImg from '../assets/fleet-hero.jpg';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound,
  ShieldCheck,
  Radio,
  UserCheck,
  Wrench,
  Car,
  GraduationCap,
  Sun,
  Moon,
  Sparkles,
  Check,
  Activity,
  MapPin,
  Compass
} from 'lucide-react';

interface PersonaMetadata {
  role: UserRole;
  label: string;
  subLabel: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeText: string;
}

const PERSONA_CONFIGS: PersonaMetadata[] = [
  {
    role: 'owner_admin',
    label: 'Owner / Admin',
    subLabel: 'Head Office Control',
    name: 'Arthur Pendelton',
    icon: ShieldCheck,
    accentColor: '#B6F23C',
    badgeText: 'All Access'
  },
  {
    role: 'controller',
    label: 'Dispatcher',
    subLabel: 'Live CAD & Bidding',
    name: 'Sarah Jenkins',
    icon: Radio,
    accentColor: '#3FE0C5',
    badgeText: 'Dispatch'
  },
  {
    role: 'hr_vetting',
    label: 'HR & Vetting',
    subLabel: 'DVLA & DBS Assurance',
    name: 'Rachel Evans',
    icon: UserCheck,
    accentColor: '#34D399',
    badgeText: 'Compliance'
  },
  {
    role: 'mechanic',
    label: 'Fleet Mechanic',
    subLabel: 'Workshop & MOTs',
    name: 'Dave Miller',
    icon: Wrench,
    accentColor: '#FFC24B',
    badgeText: 'Workshop'
  },
  {
    role: 'driver',
    label: 'Driver App',
    subLabel: 'CarPlay & Mobile HUD',
    name: 'Tariq Mahmood',
    icon: Car,
    accentColor: '#B6F23C',
    badgeText: 'In-Cab'
  },
  {
    role: 'pa',
    label: 'Passenger Assistant',
    subLabel: 'SEN School Escort',
    name: 'Elena Rostova',
    icon: GraduationCap,
    accentColor: '#FF9F6B',
    badgeText: 'Safeguard'
  }
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('owner_admin');
  const initialAccount = DEMO_ACCOUNTS.owner_admin;
  const [email, setEmail] = useState(initialAccount.user.email);
  const [password, setPassword] = useState(initialAccount.defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaInput, setShowMfaInput] = useState(Boolean(initialAccount.user.requiresMfa));
  const [otp, setOtp] = useState(['5', '2', '8', '1', '9', '4']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle demo account quick-fill
  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const demo = DEMO_ACCOUNTS[r];
    if (demo) {
      setEmail(demo.user.email);
      setPassword(demo.defaultPassword);
      setShowMfaInput(Boolean(demo.user.requiresMfa));
    }
    setErrorMsg(null);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleQuickFillPassword = () => {
    const demo = DEMO_ACCOUNTS[selectedRole];
    if (demo) {
      setPassword(demo.defaultPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const mfaCode = showMfaInput ? otp.join('') : undefined;
      const res = await login(email, password, selectedRole, mfaCode);

      if (!res.success) {
        if (res.requiresMfa) {
          setShowMfaInput(true);
        }
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect by role
      const from = (location.state as any)?.from?.pathname;
      const destination = from && from !== '/login' ? from : getRoleHomeRoute(selectedRole);
      navigate(destination, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8 relative overflow-hidden select-none transition-colors duration-180">
      
      {/* Ambient background glow orbs */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3FE0C5 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #B6F23C 0%, transparent 70%)' }}
      />

      {/* Main Glassmorphic Container */}
      <div className="max-w-6xl w-full rounded-[28px] overflow-hidden border border-[var(--border)] shadow-2xl grid grid-cols-1 lg:grid-cols-12 bg-[var(--surface)] relative z-10 transition-all duration-200">
        
        {/* ========================================================
            LEFT COLUMN: Night Road Showcase & Telematics
           ======================================================== */}
        <div 
          style={{ background: 'var(--hero-bg)' }}
          className="lg:col-span-5 p-7 sm:p-10 text-[#EAF7F2] flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#24574D]"
        >
          {/* Subtle grid pattern & glow */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B6F23C_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

          {/* Top Brand Logo & Platform Title */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-3xl tracking-tight text-white flex items-baseline">
                  DEC
                  <span className="w-5 h-1.5 bg-[#B6F23C] rounded-full inline-block ml-1" />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#164038] text-[#B6F23C] border border-[#24574D] uppercase">
                  FLEET UK
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#34D399]">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                <span>SYSTEM ONLINE</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-tight">
                Every journey, <span className="text-[#B6F23C]">on track.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8FB5AA] mt-2 leading-relaxed">
                Unified roadworthiness, automated DVLA/DVSA compliance, real-time live dispatch, and council school transport safety.
              </p>
            </div>
          </div>

          {/* Executive Fleet Photograph Banner */}
          <div className="relative z-10 my-4 rounded-[20px] overflow-hidden border border-[#24574D] shadow-2xl group bg-[#08201C]">
            <img
              src={fleetHeroImg}
              alt="DEC Combined Fleet - Executive Chauffeur & Municipal Minibus"
              className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08201C] via-[#08201C]/30 to-transparent pointer-events-none" />
            
            {/* Floating Glassmorphic Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#08201C]/80 backdrop-blur-md border border-[#24574D] text-[10px] font-mono text-[#EAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="font-bold">EXECUTIVE CHAUFFEUR &amp; MINIBUS FLEET</span>
            </div>

            {/* Bottom image caption */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#8FB5AA]">
              <span>Station Base: Bedfordshire &amp; London Corridors</span>
              <span className="text-[#B6F23C] font-bold">142 Vehicles Active</span>
            </div>
          </div>

          {/* Center: Live Dispatch Telematics Card Preview */}
          <div className="relative z-10 mb-4 bg-[#0F2F29]/80 backdrop-blur-md p-4 rounded-[20px] border border-[#24574D] shadow-xl space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-[#3FE0C5] font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Dispatch Feed</span>
              </span>
              <span className="text-[#8FB5AA]">DEPOT: BEDFORD HQ</span>
            </div>

            <div className="bg-[#08201C] p-3 rounded-[14px] border border-[#24574D] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-white text-slate-900 border border-slate-300">
                    BD24 TYU
                  </span>
                  <span className="text-xs font-heading font-bold text-white">Mercedes E300e</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#34D399]">28 MPH</span>
              </div>

              <div className="text-[11px] text-[#8FB5AA] flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#3FE0C5] shrink-0" />
                <span className="truncate">Luton Airport T1 <span className="text-[#3FE0C5]">➔</span> Cambridge Science</span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-[#164038]">
                <span className="text-[#8FB5AA]">Driver: Tariq M. (DBS Verified ✓)</span>
                <span className="text-[#B6F23C] font-bold">ETA 18:24 (12m)</span>
              </div>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
              <div className="p-2 rounded-[10px] bg-[#164038]/60 border border-[#24574D]">
                <span className="block font-black text-sm text-[#34D399]">100%</span>
                <span className="text-[#8FB5AA] text-[9px] uppercase">DVSA Valid</span>
              </div>
              <div className="p-2 rounded-[10px] bg-[#164038]/60 border border-[#24574D]">
                <span className="block font-black text-sm text-[#3FE0C5]">142</span>
                <span className="text-[#8FB5AA] text-[9px] uppercase">Vehicles</span>
              </div>
              <div className="p-2 rounded-[10px] bg-[#164038]/60 border border-[#24574D]">
                <span className="block font-black text-sm text-[#B6F23C]">99.6%</span>
                <span className="text-[#8FB5AA] text-[9px] uppercase">Handover SLA</span>
              </div>
            </div>
          </div>

          {/* Bottom: Regulatory Compliance Assurances */}
          <div className="relative z-10 pt-4 border-t border-[#24574D] space-y-2 text-[11px] font-mono text-[#8FB5AA]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span>DVSA Dual MOT &amp; DVLA Automated Licence Checks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3FE0C5]" />
              <span>Enhanced DBS Update Service &amp; S47 Safeguarding</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9F6B]" />
              <span>Council SEN Transport Approved • ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: Interactive Sign-In Form & Persona Picker
           ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-[var(--surface)]">
          
          {/* Header & Theme Toggle Switch */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/40 uppercase mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Station Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[var(--text)] tracking-tight">
                Sign in to your station
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Select a demo persona for instant credentials, or enter your staff details.
              </p>
            </div>

            {/* Quick Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[#B6F23C] transition shrink-0 nr-focus"
              title={`Switch to ${theme === 'dark' ? 'Light Mode (Soft Mint)' : 'Dark Mode (Night Road)'}`}
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#B6F23C]" /> : <Moon className="w-4 h-4 text-[#0B2B26]" />}
            </button>
          </div>

          {/* Quick-Fill Demo Persona Selector (Redesigned & High-Contrast) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] tracking-wider">
                Select Demo Persona (One-Click Credentials):
              </span>
              <span className="text-[10px] font-mono text-[#3FE0C5]">Click to auto-fill</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PERSONA_CONFIGS.map(persona => {
                const isSelected = selectedRole === persona.role;
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.role}
                    type="button"
                    onClick={() => handleSelectRole(persona.role)}
                    className={`p-3 rounded-[16px] text-left transition-all duration-180 border relative flex flex-col justify-between group nr-focus ${
                      isSelected
                        ? 'border-[#B6F23C] bg-[var(--surface-2)] shadow-[0_0_16px_rgba(182,242,60,0.22)] ring-2 ring-[#B6F23C]/40'
                        : 'border-[var(--border)] bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] hover:border-[#3FE0C5]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div 
                        className={`w-7 h-7 rounded-[10px] flex items-center justify-center transition-transform ${
                          isSelected ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: `${persona.accentColor}25`,
                          color: persona.accentColor
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-[#B6F23C] text-[#08201C] flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text)]">
                          {persona.badgeText}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-heading font-bold text-xs text-[var(--text)] block truncate">
                        {persona.label}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate mt-0.5">
                        {persona.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-[16px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-xs text-[#FF5D6C] flex items-start gap-2.5 animate-bounce">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-heading font-bold">Sign-in Error</p>
                <p className="text-[11px] mt-0.5 opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[var(--text)] block">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@decfleet.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] pl-11 pr-4 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/20 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-semibold text-[var(--text)] block">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={handleQuickFillPassword}
                  className="text-[10px] font-mono text-[#3FE0C5] hover:underline"
                  title="Click to reset demo password"
                >
                  Demo: Password123!
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] pl-11 pr-12 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] p-1 nr-focus rounded-lg"
                  title="Show/hide password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 6-Digit OTP / MFA Step (Shown for Admin and HR) */}
            {showMfaInput && (
              <div className="p-4 rounded-[18px] bg-[var(--surface-2)] border border-[var(--border)] space-y-3 animate-in fade-in duration-180">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#B6F23C]" />
                    <span>2-Factor Staff MFA Verification (6 Digits)</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-[#3FE0C5] bg-[#3FE0C5]/10 px-2 py-0.5 rounded-full">
                    Any 6 digits accepted
                  </span>
                </div>
                
                <div className="flex gap-2 justify-between max-w-xs">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`login-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-10 h-12 text-center font-mono font-black text-base rounded-[12px] bg-[var(--surface)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 text-[var(--text)] outline-none transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !text-sm !h-[52px] font-heading font-black shadow-lime-glow mt-2 flex items-center justify-center gap-2 group active:scale-[0.98] transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorising Secure Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.replace('_', ' ').toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Quick info note & Trust Badge */}
          <div className="text-[11px] text-[var(--text-muted)] text-center border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <span>DEC Fleet UK • 256-bit TLS Encrypted</span>
            <span className="text-[#34D399]">✓ Session stored securely</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;
