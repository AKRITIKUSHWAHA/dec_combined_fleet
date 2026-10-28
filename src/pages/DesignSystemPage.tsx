import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Car, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera, 
  Phone, 
  Navigation, 
  ChevronRight, 
  Loader2, 
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  FileText
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Interactive Form State
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['5', '2', '8', '', '', '']);
  const [toggleActive, setToggleActive] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('executive');
  const [jobState, setJobState] = useState<'accept' | 'en_route' | 'arrived' | 'pob' | 'clear'>('en_route');
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const jobStatesConfig = {
    accept: { label: 'Slide to Accept Booking', color: 'bg-[#B6F23C] text-[#08201C]', next: 'en_route' as const, step: '1. Accept' },
    en_route: { label: 'Slide to Mark En Route', color: 'bg-[#3FE0C5] text-[#08201C]', next: 'arrived' as const, step: '2. En Route' },
    arrived: { label: 'Slide to Mark Arrived at Pickup', color: 'bg-[#FF9F6B] text-[#08201C]', next: 'pob' as const, step: '3. Arrived' },
    pob: { label: 'Slide to Confirm POB (Passenger On Board)', color: 'bg-[#34D399] text-[#08201C]', next: 'clear' as const, step: '4. POB' },
    clear: { label: 'Slide to Complete & Clear Job', color: 'bg-[#B6F23C] text-[#08201C]', next: 'accept' as const, step: '5. Job Clear' },
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Design System Hero Header */}
      <div 
        style={{ background: 'var(--hero-bg)' }}
        className="rounded-[20px] p-6 sm:p-10 text-[#EAF7F2] relative overflow-hidden border border-[var(--border)] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-white flex items-baseline gap-1">
                DEC
                <span className="w-8 h-1.5 bg-[#B6F23C] rounded-full inline-block ml-1" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[#B6F23C]/20 text-[#B6F23C] border border-[#B6F23C]/40">
                Theme: Night Road
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              DEC Unified Design System &amp; Component Specification
            </h1>
            <p className="text-sm text-[#8FB5AA] max-w-2xl leading-relaxed">
              Official design tokens, typography, interactive states, driver ergonomics, and WCAG AA accessible components. Strict restriction: No default Tailwind blue, indigo, or purple.
            </p>
          </div>

          {/* Theme Mode Toggle Pill */}
          <div className="bg-[#0F2F29]/80 backdrop-blur-md p-2 rounded-2xl border border-[#24574D] flex items-center gap-3 shrink-0">
            <div className="text-xs">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#8FB5AA]">Active Mode</p>
              <p className="font-heading font-bold text-white capitalize">{theme} Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-[14px] bg-[#B6F23C] text-[#08201C] font-bold shadow-lime-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 nr-focus"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-xs font-heading font-bold">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: COLOR TOKENS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-[var(--text)]">
              1. Color Tokens &amp; Theme Palettes
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Defined as CSS variables with dual support for Dark mode (Driver App default: Ink Teal) and Light mode (Office default: Soft Mint).
            </p>
          </div>
        </div>

        {/* Current Theme Variables */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--bg</span>
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              {theme === 'dark' ? '#08201C' : '#F3F8F5'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Canvas Background</span>
          </div>

          <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--surface</span>
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              {theme === 'dark' ? '#0F2F29' : '#FFFFFF'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Card Surface</span>
          </div>

          <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--surface-2</span>
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              {theme === 'dark' ? '#164038' : '#E6F1EC'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Input / Zebra</span>
          </div>

          <div className="p-4 rounded-[14px] border-2 border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--border</span>
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              {theme === 'dark' ? '#24574D' : '#CFE2DA'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Structural 1px</span>
          </div>

          <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--text</span>
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              {theme === 'dark' ? '#EAF7F2' : '#0B2B26'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Primary Text</span>
          </div>

          <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">--text-muted</span>
            <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
              {theme === 'dark' ? '#8FB5AA' : '#4F6F66'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Secondary Muted</span>
          </div>
        </div>

        {/* Brand & Status Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Brand Accents */}
          <div className="nr-card p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[var(--text)]">
              Brand Accent Tokens
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-[12px] bg-[#B6F23C] text-[#08201C] space-y-0.5">
                <span className="text-[10px] font-bold block uppercase tracking-wider">Primary</span>
                <span className="font-mono text-xs font-bold">#B6F23C</span>
                <span className="text-[11px] block">Signal Lime</span>
              </div>
              <div className="p-3 rounded-[12px] bg-[#FF9F6B] text-[#08201C] space-y-0.5">
                <span className="text-[10px] font-bold block uppercase tracking-wider">Secondary</span>
                <span className="font-mono text-xs font-bold">#FF9F6B</span>
                <span className="text-[11px] block">Apricot</span>
              </div>
              <div className="p-3 rounded-[12px] bg-[#3FE0C5] text-[#08201C] space-y-0.5">
                <span className="text-[10px] font-bold block uppercase tracking-wider">Accent</span>
                <span className="font-mono text-xs font-bold">#3FE0C5</span>
                <span className="text-[11px] block">Aqua</span>
              </div>
            </div>
          </div>

          {/* Status Tokens (WCAG AA Compliant) */}
          <div className="nr-card p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[var(--text)]">
              Status Palette (Icon + Label Required)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-[12px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#10B981] dark:text-[#34D399] text-center">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] font-bold block">#34D399</span>
                <span className="text-[11px] font-bold block">Ready</span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-[#FFC24B]/15 border border-[#FFC24B]/40 text-[#D97706] dark:text-[#FFC24B] text-center">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] font-bold block">#FFC24B</span>
                <span className="text-[11px] font-bold block">Due soon</span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-[#FF5D6C]/15 border border-[#FF5D6C]/40 text-[#E11D48] dark:text-[#FF5D6C] text-center">
                <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] font-bold block">#FF5D6C</span>
                <span className="text-[11px] font-bold block">Blocked</span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-[#8B9CFF]/15 border border-[#8B9CFF]/40 text-[#4F46E5] dark:text-[#8B9CFF] text-center">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] font-bold block">#8B9CFF</span>
                <span className="text-[10px] font-bold block">Pending</span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-[#94A3A0]/15 border border-[#94A3A0]/40 text-[#4B5563] dark:text-[#94A3A0] text-center col-span-2 sm:col-span-1">
                <Car className="w-4 h-4 mx-auto mb-1" />
                <span className="font-mono text-[10px] font-bold block">#94A3A0</span>
                <span className="text-[11px] font-bold block">Offline</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: TYPOGRAPHY SPECIFICATION */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            2. Typography Specimen (Sora, Inter, JetBrains Mono)
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Headings in Sora (600/700), Body/UI in Inter, and tabular numbers &amp; timestamps in JetBrains Mono.
          </p>
        </div>

        <div className="nr-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sora */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B6F23C] bg-[#B6F23C]/10 px-2 py-0.5 rounded font-bold">
                Heading Font: Sora (600/700)
              </span>
              <p className="font-heading font-bold text-2xl text-[var(--text)]">
                The Quick Dispatcher
              </p>
              <p className="font-heading font-semibold text-lg text-[var(--text)]">
                Every Journey, On Track
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Used for module titles, KPI metric numbers, card headers, and brand logomark.
              </p>
            </div>

            {/* Inter */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#FF9F6B] bg-[#FF9F6B]/10 px-2 py-0.5 rounded font-bold">
                Body Font: Inter (400/500/600)
              </span>
              <p className="font-sans text-sm text-[var(--text)] leading-relaxed">
                Standard interface copy, labels, form descriptions, and table rows. Driver app base text is tuned to 16px+ for legible readability under road conditions.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Optimized for accessibility with high x-height and clear letterforms.
              </p>
            </div>

            {/* JetBrains Mono */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#3FE0C5] bg-[#3FE0C5]/10 px-2 py-0.5 rounded font-bold">
                Tabular Numbers: JetBrains Mono
              </span>
              <div className="font-mono text-xl font-bold text-[var(--text)] tabular-nums space-y-1">
                <p>£197.50 GBP</p>
                <p>42,150 miles</p>
                <p>28/10/2026 • 13:30:45</p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Tabular numeric figures prevent UI jitter during real-time GPS speed and fare meter updates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: BUTTONS & INTERACTIVE CONTROLS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            3. Buttons &amp; Action States
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            14px border radius, 48px+ touch targets on mobile, 180ms smooth transitions, and aqua focus-visible rings.
          </p>
        </div>

        <div className="nr-card p-6 space-y-6">
          
          {/* Button Styles Row */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Standard Button Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary nr-focus">
                <Sparkles className="w-4 h-4" />
                <span>Primary (Signal Lime)</span>
              </button>

              <button className="btn-secondary nr-focus">
                <span>Secondary (Apricot)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button className="btn-danger nr-focus">
                <AlertTriangle className="w-4 h-4" />
                <span>Danger (Coral)</span>
              </button>

              <button className="btn-ghost nr-focus">
                <span>Ghost Text Link</span>
              </button>

              {/* Icon 44px Button */}
              <button 
                className="w-11 h-11 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center hover:border-[#B6F23C] transition-all nr-focus"
                title="44px Circular Icon Action"
              >
                <Navigation className="w-5 h-5 text-[#3FE0C5]" />
              </button>
            </div>
          </div>

          {/* Interactive States: Disabled & Loading */}
          <div className="pt-4 border-t border-[var(--border)]">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
              States: Loading, Disabled &amp; Focus
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => {
                  setIsLoadingBtn(true);
                  setTimeout(() => setIsLoadingBtn(false), 2000);
                }}
                className="btn-primary nr-focus"
              >
                {isLoadingBtn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Click to Test Loading State</span>
                )}
              </button>

              <button disabled className="btn-primary">
                <span>Disabled Button (40% Opacity)</span>
              </button>

              <button disabled className="btn-secondary">
                <span>Disabled Secondary</span>
              </button>
            </div>
          </div>

          {/* Emergency Button with Live Pulse Ring */}
          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[14px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30">
              <div>
                <h4 className="font-heading font-bold text-sm text-[#FF5D6C] flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>Emergency SOS Panic Button</span>
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Always-visible emergency control with dual-ring acoustic wave pulse animation for instant controller dispatch.
                </p>
              </div>

              <button 
                onClick={() => alert('Emergency SOS trigger simulated! Office Controller alerted.')}
                className="relative inline-flex items-center justify-center min-h-[52px] px-6 rounded-[14px] bg-[#FF5D6C] text-white font-heading font-bold text-sm shadow-coral-glow hover:bg-[#FF4254] transition-all active:scale-95 shrink-0 nr-focus"
              >
                <span className="absolute -inset-1 rounded-[16px] bg-[#FF5D6C]/40 animate-ping pointer-events-none" />
                <span className="relative flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>EMERGENCY SOS</span>
                </span>
              </button>
            </div>
          </div>

          {/* Driver Job-Flow Stepper (64px Slide-to-Confirm) */}
          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-[var(--text)]">
                  Driver Job-Flow Stepper Button (64px Touch Target)
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  State-specific color coding: Accept (Lime) &rarr; En Route (Aqua) &rarr; Arrived (Apricot) &rarr; POB (Mint) &rarr; Job Clear (Lime with confirm sheet).
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text)]">
                Active: {jobStatesConfig[jobState].step}
              </span>
            </div>

            <div className="bg-[var(--surface-2)] p-2 rounded-[18px] border border-[var(--border)]">
              <button
                onClick={() => setJobState(jobStatesConfig[jobState].next)}
                className={`w-full min-h-[64px] rounded-[14px] font-heading font-bold text-base transition-all duration-180 flex items-center justify-between px-6 shadow-md hover:opacity-95 active:scale-[0.98] ${jobStatesConfig[jobState].color} nr-focus`}
              >
                <span className="flex items-center gap-2">
                  <Car className="w-6 h-6" />
                  <span>{jobStatesConfig[jobState].label}</span>
                </span>
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: FORM CONTROLS & INPUTS */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            4. Form Components &amp; Validation States
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            52px high inputs, 12px radius, floating labels, left inside icons, lime focus glow, and inline error/success messages.
          </p>
        </div>

        <div className="nr-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Standard Input with Left Icon */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[var(--text)]">
                Passenger Name (Normal State)
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Lady Catherine Howard"
                  defaultValue="Lord Alistair Sterling"
                  className="nr-input font-medium"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Full name as stated on travel documents.</p>
            </div>

            {/* Error State Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[#FF5D6C]">
                UK Pickup Postcode (Error State)
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#FF5D6C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  defaultValue="INVALID_POSTCODE_99"
                  className="nr-input nr-input-error font-mono text-[#FF5D6C]"
                />
              </div>
              <p className="text-[11px] text-[#FF5D6C] flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Invalid UK postcode format. Expected: LU1 2TR or similar.</span>
              </p>
            </div>

            {/* Password Field with Show/Hide */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[var(--text)]">
                Portal Security PIN / Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="secretDriverPass2026!"
                  className="nr-input pr-12 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Minimum 8 characters with letter &amp; symbol.</p>
            </div>

            {/* Success State Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[#34D399]">
                Verified Vehicle Registration (Success)
              </label>
              <div className="relative">
                <Car className="w-5 h-5 text-[#34D399] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  defaultValue="LT73 XKL"
                  className="nr-input font-mono font-bold text-[#34D399] border-[#34D399]/60"
                />
                <CheckCircle2 className="w-5 h-5 text-[#34D399] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#34D399] font-medium flex items-center gap-1">
                <span>✓ DVLA database matched: Mercedes-Benz V-Class (Valid MOT)</span>
              </p>
            </div>

          </div>

          {/* 6-Digit OTP / MFA Input Boxes */}
          <div className="pt-4 border-t border-[var(--border)] space-y-2">
            <label className="text-xs font-heading font-semibold text-[var(--text)] block">
              6-Digit Staff MFA Code (Auto-Advance)
            </label>
            <div className="flex gap-2 sm:gap-3 max-w-sm">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 text-center font-mono font-bold text-lg rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] focus:border-[#B6F23C] focus:ring-2 focus:ring-[#B6F23C]/30 text-[var(--text)] outline-none transition"
                />
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Used for authorized HR Safeguarding &amp; Driver Sign-in verification.</p>
          </div>

          {/* Toggles, Checkboxes & Radios */}
          <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Toggle */}
            <div className="space-y-2">
              <span className="text-xs font-heading font-semibold text-[var(--text)] block">
                Signal Lime Toggle
              </span>
              <button
                type="button"
                onClick={() => setToggleActive(!toggleActive)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-180 flex items-center ${
                  toggleActive ? 'bg-[#B6F23C]' : 'bg-[var(--surface-2)] border border-[var(--border)]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full transition-transform duration-180 shadow-md ${
                    toggleActive ? 'translate-x-6 bg-[#08201C]' : 'translate-x-0 bg-[var(--text-muted)]'
                  }`}
                />
              </button>
              <p className="text-[11px] text-[var(--text-muted)]">{toggleActive ? 'Automatic GPS tracking enabled' : 'GPS off'}</p>
            </div>

            {/* Custom Rounded Checkbox */}
            <div className="space-y-2">
              <span className="text-xs font-heading font-semibold text-[var(--text)] block">
                Custom Checkbox
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={e => setCheckboxChecked(e.target.checked)}
                  className="w-5 h-5 rounded-[6px] accent-[#B6F23C] cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--text)]">
                  Wheelchair Ramp Inspected
                </span>
              </label>
              <p className="text-[11px] text-[var(--text-muted)]">Signed by authorized driver.</p>
            </div>

            {/* Radio Group */}
            <div className="space-y-2">
              <span className="text-xs font-heading font-semibold text-[var(--text)] block">
                Vehicle Category Radios
              </span>
              <div className="space-y-1.5 text-xs text-[var(--text)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    value="saloon"
                    checked={radioSelected === 'saloon'}
                    onChange={() => setRadioSelected('saloon')}
                    className="accent-[#B6F23C]"
                  />
                  <span>Standard Saloon</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    value="executive"
                    checked={radioSelected === 'executive'}
                    onChange={() => setRadioSelected('executive')}
                    className="accent-[#B6F23C]"
                  />
                  <span>Executive Chauffeur</span>
                </label>
              </div>
            </div>

          </div>

          {/* Dashed Lime Photo Upload Drop-Zone */}
          <div className="pt-4 border-t border-[var(--border)] space-y-2">
            <span className="text-xs font-heading font-semibold text-[var(--text)] block">
              Dashed Lime Defect Photo Drop-Zone (Requirement CHK-01 / DEF-01)
            </span>
            <div 
              onClick={() => setUploadedPhoto(uploadedPhoto ? null : 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80')}
              className="border-2 border-dashed border-[#B6F23C]/60 hover:border-[#B6F23C] bg-[var(--surface-2)] p-6 rounded-[20px] text-center cursor-pointer transition-all duration-180 hover:bg-[#B6F23C]/5"
            >
              {uploadedPhoto ? (
                <div className="flex items-center justify-center gap-3">
                  <img src={uploadedPhoto} alt="Thumbnail preview" className="w-16 h-16 rounded-[12px] object-cover border border-[#B6F23C]" />
                  <div className="text-left text-xs">
                    <p className="font-bold text-[var(--text)]">brake_caliper_leak_photo.jpg</p>
                    <p className="text-[11px] text-[#34D399]">✓ Evidence attached • Click to reset</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#B6F23C]/20 text-[#B6F23C] flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-heading font-bold text-[var(--text)]">
                    Tap to Capture or Upload Defect Photo Evidence
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Mandatory for critical brake, tyre, or ramp failures before dispatch clearance.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: STATUS CHIPS & BADGES */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            5. Status Chips (Icon + Label Required)
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Every chip includes a 15% tinted background, colored dot, icon, and distinct label. Color alone is never used to convey status.
          </p>
        </div>

        <div className="nr-card p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Ready */}
            <span className="chip-ready px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready / Active</span>
            </span>

            {/* Due soon */}
            <span className="chip-due-soon px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFC24B]" />
              <Clock className="w-3.5 h-3.5" />
              <span>Due Soon (1-Mo Reminder)</span>
            </span>

            {/* Blocked */}
            <span className="chip-blocked px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF5D6C] animate-ping" />
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Blocked (Safety Gate)</span>
            </span>

            {/* Verification pending */}
            <span className="chip-pending px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#8B9CFF]" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification Pending</span>
            </span>

            {/* Offline/Stale */}
            <span className="chip-stale px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#94A3A0]" />
              <Car className="w-3.5 h-3.5" />
              <span>Offline / Stale &gt;60s</span>
            </span>

          </div>
        </div>
      </section>

      {/* SECTION 6: CARDS & GLASSMORPHISM */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            6. Surface Elevation &amp; Glassmorphism
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Cards feature a 2px hover lift, 20px radius, 1px border. Glassmorphism is used exclusively on login sheets and bottom drawers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Lift Card */}
          <div className="nr-card p-6 space-y-3 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#B6F23C]">
                LT73 XKL • FLEET RECORD
              </span>
              <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[var(--text)]">
              Hover-Lift Surface Card (2px Lift)
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Hover over this card to observe the smooth 180ms ease-out translateY(-2px) elevation and soft depth shadow.
            </p>
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text)] font-mono">
              <span>Annual DVSA MOT: 28/11/2026</span>
              <span className="text-[#3FE0C5]">42,150 miles &rarr;</span>
            </div>
          </div>

          {/* Glass Card Demonstration */}
          <div 
            style={{ background: 'var(--hero-bg)' }}
            className="rounded-[20px] p-6 border border-[#24574D] text-white space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'var(--accent-glow)' }} />

            <div className="nr-glass rounded-[18px] p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#3FE0C5] tracking-wider block">
                Glassmorphic Sheet Specimen
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                Backdrop Blur 24px + White/5 Tint
              </h3>
              <p className="text-xs text-[#8FB5AA]">
                Reserved for driver job acceptance overlays, login credentials, and modal sheets to maintain contextual awareness of the background road network.
              </p>
              <button className="btn-primary w-full text-xs font-bold">
                Accept Sheet Action &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: LOGIN SCREEN ARCHITECTURE PREVIEW */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-xl font-heading font-bold text-[var(--text)]">
            7. Login Screen Specification (Split Desktop Hero + Mobile Glass)
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Split layout on desktop (left: hero gradient with DEC wordmark + "Every journey, on track", right: glassmorphic login card).
          </p>
        </div>

        <div className="rounded-[20px] overflow-hidden border border-[var(--border)] shadow-2xl grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Hero */}
          <div 
            style={{ background: 'var(--hero-bg)' }}
            className="p-8 sm:p-12 text-[#EAF7F2] flex flex-col justify-between space-y-8 relative"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B6F23C_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-heading font-extrabold text-3xl tracking-tight text-white flex items-baseline gap-1">
                  DEC
                  <span className="w-8 h-1.5 bg-[#B6F23C] rounded-full inline-block ml-1" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B6F23C] bg-[#B6F23C]/10 px-2 py-0.5 rounded">
                  OFFICIAL PORTAL
                </span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight leading-snug">
                Every journey, on track.
              </h3>
              <p className="text-sm text-[#8FB5AA] mt-2 max-w-sm">
                Unified live booking dispatch, continuous fleet roadworthiness, and safeguarding assurance.
              </p>
            </div>

            <div className="relative z-10 text-xs text-[#8FB5AA] space-y-1">
              <p>✓ DVSA &amp; DVLA Authorized Direct Connection</p>
              <p>✓ Council SEN Passenger Assistance Safeguards</p>
              <p>✓ 24/7 Integrated Live Dispatch Gateway</p>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="bg-[var(--surface)] p-8 sm:p-12 flex flex-col justify-center space-y-4">
            <div>
              <h4 className="font-heading font-bold text-lg text-[var(--text)]">
                Sign in to your station
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Select your assigned personnel role or enterprise credentials.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-heading font-semibold text-[var(--text)]">
                  Operating Sub-Company
                </label>
                <select className="nr-input px-3">
                  <option>DEC Group Head Office (DEC-HQ)</option>
                  <option>DEC Luton Airport Transfers Ltd</option>
                  <option>DEC Central Beds School Transport</option>
                  <option>DEC Executive &amp; Chauffeur Services</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-semibold text-[var(--text)]">
                  Staff ID / Badge Number
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" defaultValue="DEC-DRV-01" className="nr-input" />
                </div>
              </div>

              <button className="btn-primary w-full mt-2 font-heading font-bold">
                <span>Authorize &amp; Begin Shift</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

