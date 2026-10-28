import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Smartphone
} from 'lucide-react';
import { isMfaRole, findMockAccountByEmail } from '../data/mockAuth';

type FlowStep = 'email' | 'mfa' | 'new_password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<FlowStep>('email');
  const [email, setEmail] = useState('');
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Submit email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered DEC Fleet email address.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);

    const account = findMockAccountByEmail(email);
    // Check if account is admin or hr role
    const needsMfa = account ? isMfaRole(account.user.role) : email.toLowerCase().includes('admin') || email.toLowerCase().includes('hr');
    
    setRequiresMfa(needsMfa);

    if (needsMfa) {
      setCurrentStep('mfa');
    } else {
      setCurrentStep('new_password');
    }
  };

  // Step 2: Submit MFA code
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mfaCode.trim().length < 6) {
      setError('Please enter a valid 6-digit MFA verification code.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);

    // Accept 482910 or any 6 digit for demo
    if (mfaCode === '482910' || mfaCode.length === 6) {
      setCurrentStep('new_password');
    } else {
      setError('Invalid code. For this demo, please use code 482910.');
    }
  };

  // Step 3: Set new password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 650));
    setIsLoading(false);

    setCurrentStep('success');
  };

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[\d\W]/.test(newPassword);
  const hasMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Step progress calculation
  const totalSteps = requiresMfa ? 4 : 3;
  const stepIndex = currentStep === 'email' ? 1 : (currentStep === 'mfa' ? 2 : (currentStep === 'new_password' ? (requiresMfa ? 3 : 2) : totalSteps));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-6 relative z-10">
        
        {/* Top Back Link & Step Progress */}
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          <span className="text-xs font-mono font-semibold text-slate-400">
            Step {stepIndex} of {totalSteps}
          </span>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* SCREEN 1: Enter Email */}
          {currentStep === 'email' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-md">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white">Reset Password</h2>
                <p className="text-xs text-slate-400">
                  Enter your verified staff email. Admin & HR accounts with sensitive DBS oversight will be prompted for an extra MFA code.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@decfleet.co.uk or driver@decfleet.co.uk"
                      autoFocus
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Quick Fill suggestions for testing */}
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-700/60 space-y-1.5 text-left">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Demo Preset Test Options:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEmail('admin@decfleet.co.uk')}
                      className="text-[11px] px-2 py-0.5 rounded bg-purple-900/50 hover:bg-purple-900 text-purple-300 border border-purple-700 transition"
                    >
                      Admin (MFA role)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmail('hr@decfleet.co.uk')}
                      className="text-[11px] px-2 py-0.5 rounded bg-rose-900/50 hover:bg-rose-900 text-rose-300 border border-rose-700 transition"
                    >
                      HR / DBS (MFA role)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmail('driver@decfleet.co.uk')}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 transition"
                    >
                      Driver (Standard 3-screen)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking account status...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 2 (EXTRA): MFA Verification Code (Only for Admin & HR roles) */}
          {currentStep === 'mfa' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-md">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold uppercase tracking-wider">
                  MFA Verification Required
                </div>
                <h2 className="text-xl font-black text-white">Enter Security Token</h2>
                <p className="text-xs text-slate-400">
                  Because this account has <strong className="text-purple-300">Admin or HR / DBS Safeguarding clearance</strong>, a 6-digit MFA code is required before password reset.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-semibold text-slate-300 block">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="482910"
                    autoFocus
                    className="w-48 mx-auto text-center font-mono tracking-widest text-2xl font-bold bg-slate-900 border border-slate-700 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <span>Demo test code:</span>
                    <button
                      type="button"
                      onClick={() => setMfaCode('482910')}
                      className="font-mono font-bold text-purple-400 hover:text-purple-300 underline"
                    >
                      482910
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying MFA token...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 3: Set New Password */}
          {currentStep === 'new_password' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white">Create New Password</h2>
                <p className="text-xs text-slate-400">
                  Choose a robust password to protect vehicle and passenger dispatch records.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoFocus
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-4 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
                  <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Minimum 8 characters in length</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>At least 1 uppercase character (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasNumberOrSymbol ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumberOrSymbol ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>At least 1 number or special symbol</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasMatch ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${hasMatch ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>Passwords match exactly</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !hasMinLength || !hasMatch}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: Success Message */}
          {currentStep === 'success' && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-white">Password Reset Complete</h2>
                <p className="text-xs text-slate-300">
                  Your credentials have been updated securely in the DEC fleet directory. You may now sign in with your new password.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audited update • Device sessions reset</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
