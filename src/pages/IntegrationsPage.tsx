import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  PoundSterling, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  Server,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';
import { IntegrationService } from '../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, testIntegrationPing } = useData();

  const [testingId, setTestingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredIntegrations = integrations.filter(i => {
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    return true;
  });

  const handlePing = async (id: string) => {
    setTestingId(id);
    await testIntegrationPing(id);
    setTimeout(() => {
      setTestingId(null);
    }, 600);
  };

  const operationalCount = integrations.filter(i => i.status === 'operational').length;
  const manualCount = integrations.filter(i => i.isManualVerification).length;

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>External Integrations &amp; Telematics Register</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>{operationalCount}/{integrations.length} Active</span>
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Official government portals (DVLA, DVSA, VES, Council), DBS Update Service, payment gateways, telematics, and live aviation feeds.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] text-xs flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
              filterCategory === 'all' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            All Services ({integrations.length})
          </button>
          <button
            onClick={() => setFilterCategory('government')}
            className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
              filterCategory === 'government' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            Government / Regulators
          </button>
          <button
            onClick={() => setFilterCategory('telematics')}
            className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
              filterCategory === 'telematics' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            GPS Telematics
          </button>
          <button
            onClick={() => setFilterCategory('finance')}
            className={`px-3 py-1.5 rounded-[10px] font-heading font-bold transition ${
              filterCategory === 'finance' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            Payments &amp; Banking
          </button>
        </div>
      </div>

      {/* Manual Verification Banner Requirement */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[16px] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-heading font-bold text-amber-400">
            Manual Verification Transparency Label (Requirement INT-05):
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {manualCount} services in this register rely on manual officer verification workflows rather than direct automated real-time APIs (e.g. Council SEN passenger rosters and DBS Update Service certificates). These items are clearly marked with a high-visibility amber <strong>"Manual verification required"</strong> badge to ensure transparency for compliance auditors.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map(item => {
          const isPinging = testingId === item.id;

          return (
            <div
              key={item.id}
              className="nr-card p-4.5 flex flex-col justify-between space-y-4 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[#3FE0C5]">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs text-[var(--text)] leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {item.status === 'operational' ? (
                    <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                      <span>Live</span>
                    </span>
                  ) : (
                    <span className="chip-blocked px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {item.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {item.purpose}
                </p>

                {/* Clear "Manual Verification" Label where not live */}
                {item.isManualVerification ? (
                  <div className="p-2 bg-amber-500/15 border border-amber-500/40 rounded-lg flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item.manualVerificationLabel || 'Manual verification'}</span>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Direct REST API Active</span>
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {item.latencyMs} ms
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Specs & Ping */}
              <div className="pt-3 border-t border-[var(--border)] space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last Success:</span>
                  </span>
                  <span className="font-mono text-[var(--text)]">
                    {new Date(item.lastSuccessIso).toLocaleTimeString('en-GB')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <PoundSterling className="w-3 h-3 text-emerald-500" />
                    <span>Cost Model:</span>
                  </span>
                  <span className="font-bold text-[var(--text)] truncate max-w-[170px]" title={item.costModel}>
                    {item.costModel}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[140px]">
                    {item.endpointUrl || 'Portal Endpoint'}
                  </span>

                  <button
                    onClick={() => handlePing(item.id)}
                    disabled={isPinging}
                    className="btn-secondary !h-[30px] px-2.5 rounded-[8px] text-[11px] font-heading font-bold flex items-center gap-1 text-[#08201C] dark:text-[#B6F23C] hover:bg-[var(--surface-2)]"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>{isPinging ? 'Pinging...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

