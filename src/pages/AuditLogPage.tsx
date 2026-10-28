import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldAlert, 
  Download, 
  Clock, 
  User, 
  Database, 
  AlertTriangle,
  Lock,
  CheckCircle2,
  Calendar,
  Layers,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { SystemAuditLogEntry } from '../types';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, addAuditLogEntry } = useData();
  const { currentRole, canViewDBS } = useRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [sensitiveOnly, setSensitiveOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');

  // Filter audit records
  const filteredLogs = auditLogs.filter(log => {
    if (actorFilter !== 'all' && log.actorName !== actorFilter) return false;
    if (entityFilter !== 'all' && log.entityType !== entityFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (sensitiveOnly && !log.isSensitive) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchEntity = log.entityName?.toLowerCase().includes(q) || log.entityId.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchIp = log.ipAddress.includes(q);
      if (!matchActor && !matchEntity && !matchDetails && !matchIp) return false;
    }
    return true;
  });

  const uniqueActors = Array.from(new Set(auditLogs.map(l => l.actorName)));
  const uniqueEntities = Array.from(new Set(auditLogs.map(l => l.entityType)));
  const sensitiveCount = auditLogs.filter(l => l.isSensitive).length;

  const handleExportAuditLogs = () => {
    // Respect permissions: if user cannot view DBS / sensitive, redact sensitive columns
    const canExportSensitive = currentRole === 'owner_admin' || currentRole === 'hr_vetting';

    const headers = ['Timestamp (UTC)', 'Actor', 'Role', 'Action', 'Entity Type', 'Entity Name', 'Sensitive?', 'IP Address', 'Details'];
    
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.actorName,
      l.actorRole,
      l.action,
      l.entityType,
      l.entityName || l.entityId,
      l.isSensitive ? (canExportSensitive ? `YES: ${l.sensitiveTag || 'Classified'}` : 'REDACTED [No Clearance]') : 'No',
      l.ipAddress,
      canExportSensitive || !l.isSensitive ? `"${l.details.replace(/"/g, '""')}"` : '"[SENSITIVE ACCESS NARRATIVE REDACTED UNDER GDPR ROLE RESTRICTION]"'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dec_fleet_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Record the export in the audit log itself!
    addAuditLogEntry({
      actorId: 'current-user',
      actorName: currentRole === 'owner_admin' ? 'Arthur Pendelton' : 'Compliance Lead',
      actorRole: currentRole,
      action: 'EXPORT_DATA',
      entityType: 'Document',
      entityId: `audit-export-${Date.now()}`,
      entityName: 'System Audit Trail CSV',
      isSensitive: true,
      sensitiveTag: canExportSensitive ? 'Full Sensitive Audit Log Export' : 'Masked Non-sensitive Audit Export',
      ipAddress: '194.73.112.45',
      details: `User exported ${filteredLogs.length} audit records to CSV file. Sensitive redaction applied: ${!canExportSensitive}.`
    });

    alert(`Audit trail exported successfully! ${filteredLogs.length} records processed.`);
  };

  const getActionBadge = (action: SystemAuditLogEntry['action'], isSensitive: boolean) => {
    switch (action) {
      case 'VIEW_SENSITIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">VIEW SENSITIVE</span>;
      case 'REVOKE_SESSION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">REVOKE SESSION</span>;
      case 'OFFBOARD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">STAFF OFFBOARD</span>;
      case 'EXPORT_DATA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">EXPORT DATA</span>;
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">CREATE</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/20 text-slate-300">{action}</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Security &amp; Compliance Audit Log Viewer</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Immutable Trail
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Full chronological actor history across users, entities, and actions. Sensitive PII &amp; safeguarding access highlighted with export permission checks.
          </p>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="btn-primary !h-[42px] px-4 rounded-[12px] text-xs font-heading font-bold flex items-center gap-2 shadow-lime-glow self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Sensitive Access Highlight Notice */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[16px] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-heading font-bold text-amber-400">
            Sensitive Access Tracking Gate (DBS, Medical, Safeguarding &amp; Financial PII):
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {sensitiveCount} access events in the log involve restricted statutory data. All views of unredacted driver DBS disclosures, child Section 47 files, and BACS bank exports are highlighted with tamper-resistant audit stamps.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="nr-card p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search actor, entity, IP, details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="nr-input !h-[38px] !pl-9 !text-xs w-full"
            />
          </div>

          {/* User / Actor */}
          <div>
            <select
              value={actorFilter}
              onChange={e => setActorFilter(e.target.value)}
              className="nr-input !h-[38px] !text-xs w-full"
            >
              <option value="all">All Users / Actors</option>
              {uniqueActors.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Entity */}
          <div>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="nr-input !h-[38px] !text-xs w-full"
            >
              <option value="all">All Entities</option>
              {uniqueEntities.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="nr-input !h-[38px] !text-xs w-full"
            >
              <option value="all">All Actions</option>
              <option value="VIEW_SENSITIVE">VIEW SENSITIVE</option>
              <option value="EXPORT_DATA">EXPORT DATA</option>
              <option value="REVOKE_SESSION">REVOKE SESSION</option>
              <option value="OFFBOARD">OFFBOARD</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] flex-wrap gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sensitiveOnly}
              onChange={e => setSensitiveOnly(e.target.checked)}
              className="rounded accent-[#B6F23C] w-4 h-4 cursor-pointer"
            />
            <span className="font-heading font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Show sensitive-access entries only ({sensitiveCount})</span>
            </span>
          </label>

          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Showing {filteredLogs.length} of {auditLogs.length} audit trail records
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="nr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor &amp; Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Sensitive Flag</th>
                <th className="py-3 px-4">IP &amp; Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredLogs.map(log => (
                <tr 
                  key={log.id} 
                  className={`hover:bg-[var(--surface-2)]/60 transition ${
                    log.isSensitive ? 'bg-amber-500/5' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[var(--text)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      <span>{new Date(log.timestamp).toLocaleString('en-GB')}</span>
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="font-heading font-bold text-[var(--text)]">
                      {log.actorName}
                    </p>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                      {log.actorRole.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getActionBadge(log.action, log.isSensitive)}
                  </td>

                  {/* Entity */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
                        {log.entityType}
                      </span>
                      <p className="font-heading font-medium text-[var(--text)] truncate max-w-[140px]">
                        {log.entityName || log.entityId}
                      </p>
                    </div>
                  </td>

                  {/* Sensitive Flag */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {log.isSensitive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{log.sensitiveTag || 'PII Restricted'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Standard</span>
                    )}
                  </td>

                  {/* IP & Details */}
                  <td className="py-3 px-4">
                    <p className="text-xs text-[var(--text)] leading-relaxed max-w-md">
                      {log.details}
                    </p>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 block">
                      IP: {log.ipAddress}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--text-muted)]">
                    No audit records found matching the active filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

