import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS, getRoleHomeRoute } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8">
      
      {/* Split Card Container */}
      <div className="max-w-5xl w-full rounded-[24px] overflow-hidden border border-[var(--border)] shadow-2xl grid grid-cols-1 lg:grid-cols-12 bg-[var(--surface)]">
        
        {/* Left Column: Night Road Hero Section (Desktop lg:col-span-5) */}
        <div 
          style={{ background: 'var(--hero-bg)' }}
          className="lg:col-span-5 p-8 sm:p-10 text-[#EAF7F2] flex flex-col justify-between relative overflow-hidden space-y-8"
        >
          {/* Subtle grid pattern & glow */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B6F23C_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-white flex items-baseline">
                DEC
                <span className="w-5 h-1.5 bg-[#B6F23C] rounded-full inline-block ml-1" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B6F23C] bg-[#B6F23C]/10 px-2 py-0.5 rounded border border-[#B6F23C]/30">
                UK GATEWAY
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight leading-snug">
              Every journey, on track.
            </h2>
            <p className="text-xs sm:text-sm text-[#8FB5AA] mt-2 leading-relaxed">
              Unified fleet roadworthiness, automated DVLA/DVSA compliance, real-time live dispatch, and council school transport safety.
            </p>
          </div>

          {/* Compliance Badges */}
          <div className="relative z-10 space-y-2 text-xs font-mono text-[#8FB5AA] pt-4 border-t border-[#24574D]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span>DVSA MOT History &amp; DVLA ADD APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3FE0C5]" />
              <span>DBS Update Service &amp; Safeguarding</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9F6B]" />
              <span>End-of-Run Child Safety Sweeps</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (Desktop lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-[var(--surface)]">
          
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)]">
              Sign in to your station
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Select your persona below for one-click demo credentials, or enter your staff details.
            </p>
          </div>

          {/* Quick Demo Role Picker Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] tracking-wider block">
              Quick-Fill Demo Persona:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((r) => {
                const acc = DEMO_ACCOUNTS[r];
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`p-2.5 rounded-[12px] text-left transition-all duration-180 border ${
                      isSelected
                        ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)] shadow-sm'
                        : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#3FE0C5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs">{acc.demoLabel.split('/')[0]}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F23C]" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block truncate mt-0.5">{acc.user.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-[14px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-xs text-[#FF5D6C] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-heading font-bold">Sign-in Error</p>
                <p className="text-[11px] mt-0.5 opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Main Login Form */}
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
                  className="nr-input font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-semibold text-[var(--text)] block">
                  Security Password
                </label>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Demo: Password123!</span>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="nr-input pr-12 font-mono"
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
              <div className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] space-y-2.5 animate-in fade-in duration-180">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold text-[var(--text)] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#B6F23C]" />
                    <span>2-Factor Staff MFA Verification (6 Digits)</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#3FE0C5]">Any 6 digits accepted</span>
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
                      className="w-10 h-12 text-center font-mono font-bold text-base rounded-[10px] bg-[var(--surface)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 text-[var(--text)] outline-none transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !text-sm !py-3 !min-h-[52px] font-heading font-bold shadow-lime-glow mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.replace('_', ' ').toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick info note */}
          <div className="text-[11px] text-[var(--text-muted)] text-center border-t border-[var(--border)] pt-4">
            <span>DEC Fleet UK • Protected Session (Auto-saves in <code>localStorage: dec_session</code>)</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;
