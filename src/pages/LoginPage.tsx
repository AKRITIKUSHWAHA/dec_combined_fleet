import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_ACCOUNTS } from '../data/mockAuth';
import { UserRole } from '../types';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading, logoutMessage, clearLogoutMessage, rememberDevice, setRememberDevice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localRemember, setLocalRemember] = useState(false); // Off by default as required
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole | null>(null);

  // Read query params for logout notice if applicable
  const queryNotice = new URLSearchParams(location.search).get('notice');
  const activeNotice = logoutMessage || (queryNotice === 'signed_out' ? 'You have been signed out.' : null);

  // Clear notice after interaction
  useEffect(() => {
    return () => {
      clearLogoutMessage();
    };
  }, [clearLogoutMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = await login({
      email: email.trim(),
      password,
      rememberDevice: localRemember
    });

    if (res.success && res.targetPath) {
      // Check if redirect was requested via state.from
      const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const destination = fromPath && !fromPath.includes('/login') ? fromPath : res.targetPath;
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Failed to authenticate. Please verify your details.');
    }
  };

  const handleSelectDemoRole = (roleKey: UserRole) => {
    setSelectedDemoRole(roleKey);
    const mock = MOCK_ACCOUNTS[roleKey];
    setEmail(mock.user.email);
    setPassword(mock.defaultPassword);
    setErrorMessage(null);
  };

  const handleQuickLoginAsRole = async (roleKey: UserRole) => {
    handleSelectDemoRole(roleKey);
    const mock = MOCK_ACCOUNTS[roleKey];
    const res = await login({
      email: mock.user.email,
      password: mock.defaultPassword,
      rememberDevice: localRemember
    });

    if (res.success && res.targetPath) {
      navigate(res.targetPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            DEC Combined Fleet Dispatch System • UK v1.4
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transport & Staff Portal
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Authorized sign-in for Central Office, Workshops, and Mobile Crew (Drivers & Passenger Assistants).
          </p>
        </div>

        {/* Signed Out Notification Banner */}
        {activeNotice && (
          <div className="max-w-md mx-auto p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-start gap-3 text-emerald-200 shadow-xl animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-emerald-300 text-sm">{activeNotice}</p>
              <p className="text-emerald-400/90 mt-0.5">
                All credentials and cached device data have been purged safely for terminal sharing.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Login Card (5 cols on lg) */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            
            <div className="border-b border-slate-700/60 pb-4">
              <h2 className="text-lg font-bold text-white">Sign In to Your Account</h2>
              <p className="text-xs text-slate-400">
                Enter your work credentials to access your dispatch dashboard.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/70 border border-rose-500/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Work Email Address</span>
                  <span className="text-[10px] text-slate-500 font-mono">@decfleet.co.uk</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@decfleet.co.uk"
                    autoComplete="email"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Device - OFF by default as required */}
              <div className="pt-1 flex items-start gap-2.5">
                <input
                  id="remember-device"
                  type="checkbox"
                  checked={localRemember}
                  onChange={(e) => {
                    setLocalRemember(e.target.checked);
                    setRememberDevice(e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <label htmlFor="remember-device" className="text-xs text-slate-300 cursor-pointer select-none">
                  <span className="font-semibold block">Remember this device</span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Off by default. Keep disabled when operating shared depot terminals or communal vehicles.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating secure session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-700/60 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                DVLA / DBS Compliant TLS Transport Sandbox
              </p>
            </div>

          </div>

          {/* Role Selector Card for Demo Only (6 cols on lg) */}
          <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Role Selector for Demo
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Mock Accounts
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Click any mock role below to pre-fill credentials or auto-login. The system will automatically route you to your role's view:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(MOCK_ACCOUNTS) as UserRole[]).map((rKey) => {
                const acc = MOCK_ACCOUNTS[rKey];
                const isSelected = selectedDemoRole === rKey || email === acc.user.email;
                const isField = acc.category === 'app';

                return (
                  <div
                    key={rKey}
                    onClick={() => handleSelectDemoRole(rKey)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition relative group ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/50'
                        : 'bg-slate-900/60 border-slate-700/70 hover:border-slate-600 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <img
                        src={acc.user.avatarUrl}
                        alt={acc.user.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {acc.demoLabel}
                          </h4>
                          {isField ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              /app
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">
                              /office
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                          {acc.user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate font-mono">
                          {acc.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        {isField ? <Smartphone className="w-3 h-3 text-emerald-400" /> : <Building2 className="w-3 h-3 text-purple-400" />}
                        {acc.targetPath}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLoginAsRole(rKey);
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold group-hover:underline flex items-center gap-0.5"
                      >
                        <span>Login Now</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper Note */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Role Routing Rules</span>
              </div>
              <p>
                • <strong>Admin / Controller / HR / Mechanic</strong> → Redirects to <code className="text-blue-300">/office/dashboard</code>
              </p>
              <p>
                • <strong>Driver / Passenger Assistant (PA)</strong> → Redirects to <code className="text-emerald-300">/app/home</code>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
