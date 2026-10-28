import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  GraduationCap, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  User, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { mockParentChildJourney } from '../../data/mockDataPhase12';
import { ParentChildJourney } from '../../types/phase12';

export const ParentTrackingPage: React.FC = () => {
  const [journey, setJourney] = useState<ParentChildJourney>(mockParentChildJourney);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-[var(--border)]">
        <div className="w-14 h-14 rounded-full bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] flex items-center justify-center mx-auto border border-[#B6F23C]/40">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3FE0C5] bg-[#3FE0C5]/10 px-2.5 py-0.5 rounded-full border border-[#3FE0C5]/30">
          SEN Home-to-School Guardian Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text)]">
          {journey.childFirstName}'s School Transit
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Live journey progress to <strong>{journey.schoolName}</strong> ({journey.routeRef})
        </p>
      </div>

      {/* Live Status Card */}
      <div className="nr-card p-6 space-y-5 border-2 border-[var(--border)] shadow-xl">
        
        {/* Top Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Current Journey State
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-[#34D399] animate-pulse" />
              <h2 className="text-xl font-heading font-bold text-[var(--text)]">
                On Board &amp; In Transit
              </h2>
            </div>
            <p className="text-xs text-[#34D399] font-medium mt-0.5">
              {journey.childFirstName} was safely collected and secured in harness.
            </p>
          </div>

          <div className="bg-[var(--surface-2)] p-3 rounded-[16px] border border-[var(--border)] text-center sm:text-right shrink-0">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              School Arrival ETA
            </span>
            <span className="text-3xl font-mono font-extrabold text-[#B6F23C] block leading-none mt-1">
              {journey.etaTimestamp}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-1">
              approx. {journey.minutesRemaining} mins remaining
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Bar */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { label: 'Collected', done: true, time: '08:15' },
              { label: 'In Transit', active: true, time: 'Now' },
              { label: 'Arrived School', pending: true, time: '08:42' },
              { label: 'Handed Over', pending: true, time: '08:45' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className={`h-2.5 rounded-full transition-all ${
                  step.done ? 'bg-[#34D399]' : step.active ? 'bg-[#B6F23C] shadow-lime-glow animate-pulse' : 'bg-[var(--surface-2)]'
                }`} />
                <div>
                  <span className={`text-[10px] font-heading font-bold block ${
                    step.active ? 'text-[#B6F23C]' : step.done ? 'text-[#34D399]' : 'text-[var(--text-muted)]'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocated Escort & Driver Team */}
        <div className="p-4 bg-[var(--surface-2)] rounded-[16px] border border-[var(--border)] space-y-3 text-xs">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
            Allocated Route Crew ({journey.routeRef})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Passenger Assistant (PA)</span>
                <span className="font-heading font-bold text-[var(--text)] text-sm">{journey.paFirstName}</span>
                <span className="text-[10px] text-[#34D399] block">In-Cab Pupil Care</span>
              </div>
              <a
                href={`tel:${journey.escortContactNumber}`}
                className="btn-primary !p-2 !rounded-full !min-h-[38px] text-[#08201C]"
                title="Call Passenger Assistant"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            <div className="p-2.5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] block">Driver</span>
              <span className="font-heading font-bold text-[var(--text)] text-sm">{journey.driverFirstName}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">Approved Council Escort Badge</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[var(--text-muted)] pt-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#3FE0C5]" />
            <span>Last Checkpoint: {journey.lastCheckpoint}</span>
          </div>
        </div>

        {/* Strict GDPR Safeguarding Notice (Requirement 4: never other pupils' info) */}
        <div className="p-4 rounded-[14px] bg-[#3FE0C5]/10 border border-[#3FE0C5]/40 text-xs text-[var(--text)] space-y-1.5">
          <div className="flex items-center gap-2 font-heading font-bold text-[#3FE0C5]">
            <Lock className="w-4 h-4" />
            <span>Strict Safeguarding &amp; Child Privacy Gate (PEO-06)</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            In strict compliance with UK SEN Transport Safeguarding Regulations, this portal exclusively displays transit tracking for <strong>{journey.childFirstName}</strong>. Other children onboard, their home addresses, and special medical support needs are confidential and strictly withheld.
          </p>
        </div>

      </div>

    </div>
  );
};
