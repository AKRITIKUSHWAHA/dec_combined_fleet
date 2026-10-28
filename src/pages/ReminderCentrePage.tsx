import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  ArrowUpRight, 
  ShieldAlert, 
  Calendar, 
  Car, 
  UserCheck, 
  FileText, 
  Check, 
  Filter,
  RefreshCw,
  Users
} from 'lucide-react';
import { mockReminders } from '../data/mockDataPhase10';
import { ReminderNotificationItem } from '../types/phase10';

export const ReminderCentrePage: React.FC = () => {
  const { currentRole } = useRole();
  const { user } = useAuth();

  const [reminders, setReminders] = useState<ReminderNotificationItem[]>(mockReminders);
  const [filterState, setFilterState] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Escalation Modal
  const [escalatingItem, setEscalatingItem] = useState<ReminderNotificationItem | null>(null);
  const [escalationReason, setEscalationReason] = useState<string>('');

  const handleAcknowledge = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? {
      ...r,
      state: 'acknowledged',
      acknowledgedAt: '28/10/2026 17:25',
      acknowledgedBy: user?.name || 'Office Manager'
    } : r));
  };

  const handleConfirmEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalatingItem) return;
    setReminders(prev => prev.map(r => r.id === escalatingItem.id ? {
      ...r,
      escalated: true,
      escalationReason: escalationReason || 'Manual escalation triggered by dispatch controller.'
    } : r));
    setEscalatingItem(null);
    setEscalationReason('');
  };

  const filtered = reminders.filter(r => {
    if (filterState === 'escalated' && !r.escalated) return false;
    if (filterState !== 'all' && filterState !== 'escalated' && r.state !== filterState) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    return true;
  });

  const queuedCount = reminders.filter(r => r.state === 'queued').length;
  const sentCount = reminders.filter(r => r.state === 'sent').length;
  const failedCount = reminders.filter(r => r.state === 'failed').length;
  const acknowledgedCount = reminders.filter(r => r.state === 'acknowledged').length;
  const escalatedCount = reminders.filter(r => r.escalated).length;

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Automated Reminder &amp; Escalation Centre</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Dispatch &amp; Fleet SLA
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Multi-channel notifications for MOTs, 6-month council tests, service wear, and DBS renewals with manager escalation failover.
          </p>
        </div>

        {/* State Quick-Filter Pills */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              filterState === 'all' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            All ({reminders.length})
          </button>
          <button
            onClick={() => setFilterState('sent')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              filterState === 'sent' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Sent ({sentCount})
          </button>
          <button
            onClick={() => setFilterState('failed')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              filterState === 'failed' ? 'bg-[var(--surface)] shadow-sm text-[#FF5D6C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Failed ({failedCount})
          </button>
          <button
            onClick={() => setFilterState('escalated')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              filterState === 'escalated' ? 'bg-[var(--surface)] shadow-sm text-[#FF9F6B]' : 'text-[var(--text-muted)]'
            }`}
          >
            Escalated ({escalatedCount})
          </button>
          <button
            onClick={() => setFilterState('acknowledged')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap ${
              filterState === 'acknowledged' ? 'bg-[var(--surface)] shadow-sm text-[#34D399]' : 'text-[var(--text-muted)]'
            }`}
          >
            Signed Off ({acknowledgedCount})
          </button>
        </div>
      </div>

      {/* Escalation Ladder Banner */}
      {escalatedCount > 0 && (
        <div className="bg-[#FF9F6B]/15 border-2 border-[#FF9F6B] p-4 rounded-[18px] text-xs text-[var(--text)] flex items-start gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-[#FF9F6B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-heading font-bold text-sm text-[#FF9F6B] uppercase tracking-wider block">
              Active Management Escalations ({escalatedCount} Items)
            </span>
            <p className="text-[12px]">
              Reminders where standard recipient delivery failed or SLA deadline elapsed have automatically escalated to Senior Fleet Director Arthur Pendergast.
            </p>
          </div>
        </div>
      )}

      {/* Main Reminders Table */}
      <div className="nr-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
          <div>
            <h3 className="font-heading font-bold text-[var(--text)] text-sm">
              Live Compliance &amp; Operations Reminder Queue
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Real-time pipeline states: Queued &rarr; Sent &rarr; Failed &rarr; Acknowledged / Escalated.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-muted)] font-semibold">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="nr-input !h-[36px] !text-xs font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="dvsa_mot">DVSA Annual MOT</option>
              <option value="council_6m">Council 6-Month Test</option>
              <option value="service_mileage">Service Wear / Mileage</option>
              <option value="licence_add_check">DVLA ADD Licence</option>
              <option value="dbs_review">DBS Annual Review</option>
              <option value="insurance_expiry">Insurance Expiry</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
            <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
              <tr>
                <th className="p-3.5">Category &amp; Target Entity</th>
                <th className="p-3.5">Due Deadline</th>
                <th className="p-3.5">Days Left</th>
                <th className="p-3.5">Assigned Manager</th>
                <th className="p-3.5">Alternative Escalation Manager</th>
                <th className="p-3.5">State &amp; Transmission</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(item => {
                const isOverdue = item.daysRemaining < 0;
                const isUrgent = item.daysRemaining >= 0 && item.daysRemaining <= 7;

                return (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    
                    <td className="p-3.5">
                      <div className="font-heading font-bold text-sm text-[var(--text)]">{item.targetEntity}</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        {item.category.replace(/_/g, ' ')}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-[var(--text)]">
                      {item.dueDeadline}
                    </td>

                    <td className="p-3.5">
                      {isOverdue ? (
                        <span className="chip-blocked px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase animate-pulse">
                          {Math.abs(item.daysRemaining)} Days Overdue
                        </span>
                      ) : isUrgent ? (
                        <span className="chip-due-soon px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
                          {item.daysRemaining} Days Left
                        </span>
                      ) : (
                        <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
                          {item.daysRemaining} Days
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--text)]">{item.assignedManager}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{item.recipientRole}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--text)]">{item.alternativeEscalationManager}</div>
                      {item.escalated && (
                        <div className="text-[10px] text-[#FF9F6B] font-bold uppercase font-mono mt-0.5">
                          Escalated Failover Active
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        {item.state === 'queued' && (
                          <span className="bg-[#8B9CFF]/20 text-[#8B9CFF] border border-[#8B9CFF]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Queued
                          </span>
                        )}
                        {item.state === 'sent' && (
                          <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Sent (Awaiting Ack)
                          </span>
                        )}
                        {item.state === 'failed' && (
                          <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Failed Delivery
                          </span>
                        )}
                        {item.state === 'acknowledged' && (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                            Acknowledged
                          </span>
                        )}
                        {item.sentAt && (
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">Sent: {item.sentAt}</div>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.state !== 'acknowledged' && (
                          <button
                            type="button"
                            onClick={() => handleAcknowledge(item.id)}
                            className="btn-primary !text-[11px] !py-1 !px-2.5 !min-h-[30px]"
                            title="Sign off and acknowledge reminder"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Sign Off</span>
                          </button>
                        )}

                        {!item.escalated && item.state !== 'acknowledged' && (
                          <button
                            type="button"
                            onClick={() => setEscalatingItem(item)}
                            className="btn-secondary !text-[11px] !py-1 !px-2.5 !min-h-[30px]"
                            title="Escalate immediately to alternative manager"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9F6B]" />
                            <span>Escalate</span>
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation Modal Dialog */}
      {escalatingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text)]">
                  Escalate Reminder to Senior Manager
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">Target: {escalatingItem.targetEntity}</p>
              </div>
              <button 
                onClick={() => setEscalatingItem(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmEscalation} className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] space-y-1">
                <span className="text-[var(--text-muted)] block text-[10px] font-semibold">New Assigned Senior Manager</span>
                <span className="font-heading font-bold text-sm text-[#FF9F6B] block">
                  {escalatingItem.alternativeEscalationManager}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  High-priority push alert will be delivered immediately to alternative manager's console.
                </span>
              </div>

              <div>
                <label className="font-heading font-semibold block mb-1 text-[var(--text)]">
                  Mandatory Escalation Reason
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Standard controller SLA deadline passed; urgent vehicle compliance action required."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] focus:border-[#B6F23C] outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex gap-2">
                <button
                  type="button"
                  onClick={() => setEscalatingItem(null)}
                  className="btn-ghost flex-1 !text-xs !min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 !text-xs !min-h-[42px]"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

