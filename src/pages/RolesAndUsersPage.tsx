import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Clock, 
  Trash2, 
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const RolesAndUsersPage: React.FC = () => {
  const { 
    userAccounts, 
    rolePermissionsMatrix, 
    updateRolePermission, 
    revokeUserSession, 
    toggleUserMfa 
  } = useData();
  const { currentRole } = useRole();

  const [activeTab, setActiveTab] = useState<'matrix' | 'users'>('matrix');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = userAccounts.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.department.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const rolesList: { id: UserRole; label: string }[] = [
    { id: 'owner_admin', label: 'Owner / Admin' },
    { id: 'controller', label: 'Controller' },
    { id: 'driver', label: 'Driver' },
    { id: 'pa', label: 'PA' },
    { id: 'mechanic', label: 'Mechanic' },
    { id: 'hr_vetting', label: 'HR / Vetting' }
  ];

  const handleRevoke = (userId: string, name: string) => {
    if (confirm(`Immediately revoke all active sessions for ${name}? The user will be required to re-authenticate with credentials & MFA.`)) {
      revokeUserSession(userId);
      alert(`Active sessions for ${name} have been revoked and logged in the immutable audit trail.`);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Roles, Permissions Matrix &amp; User Accounts</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              Access Governance
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Granular role-based access control matrix (RBAC), multi-factor authentication (MFA) enforcement, and immediate session termination.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Permissions Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts &amp; MFA ({userAccounts.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-3.5">
          {/* Matrix Description Banner */}
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-[16px] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-heading font-bold text-blue-300">
                Statutory RBAC &amp; Least Privilege Architecture:
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Controllers are strictly blocked from driver DBS certificates, medical histories, and pupil safeguarding case narratives. Mechanics are isolated to garage repair sign-offs. Owner Admins retain governance override.
              </p>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="nr-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[260px]">Capability / Security Policy</th>
                    <th className="py-3.5 px-4 min-w-[130px]">Category</th>
                    {rolesList.map(r => (
                      <th key={r.id} className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="font-heading font-bold text-xs text-[var(--text)] block">{r.label}</span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">{r.id}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {rolePermissionsMatrix.map(perm => (
                    <tr key={perm.key} className="hover:bg-[var(--surface-2)]/60 transition">
                      
                      {/* Name & description */}
                      <td className="py-3 px-4">
                        <p className="font-heading font-bold text-xs text-[var(--text)]">
                          {perm.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                          {perm.description}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="chip-pending px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          {perm.category}
                        </span>
                      </td>

                      {/* Role Checkboxes */}
                      {rolesList.map(r => {
                        const isAllowed = perm.allowedRoles[r.id];
                        // Controller protection: DBS and Safeguarding cannot be turned on for controllers
                        const isProtectedRule = (perm.key === 'view_dbs_medical' || perm.key === 'safeguarding_cases') && r.id === 'controller';

                        return (
                          <td key={r.id} className="py-3 px-3 text-center">
                            {isProtectedRule ? (
                              <div className="flex flex-col items-center justify-center gap-0.5" title="Strict statutory separation: Controllers can never access DBS or safeguarding narrative.">
                                <span className="w-6 h-6 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[9px] font-mono font-bold text-rose-400">BLOCKED</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateRolePermission(perm.key, r.id, !isAllowed)}
                                className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition ${
                                  isAllowed 
                                    ? 'bg-[#B6F23C] text-[#08201C] shadow-xs hover:bg-[#B6F23C]/80' 
                                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--surface)] border border-[var(--border)]'
                                }`}
                                title={`Toggle permission for ${r.label}`}
                              >
                                {isAllowed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4 opacity-40" />}
                              </button>
                            )}
                          </td>
                        );
                      })}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: User Accounts, MFA & Session Revoke */
        <div className="space-y-3.5">
          
          {/* User Filters Toolbar */}
          <div className="nr-card p-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search user name, email, department..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="nr-input !h-[38px] !pl-9 !text-xs w-full"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="nr-input !h-[38px] !text-xs w-44 shrink-0"
              >
                <option value="all">All Roles</option>
                {rolesList.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono text-[var(--text-muted)]">
              Showing {filteredUsers.length} user accounts
            </span>
          </div>

          {/* User Accounts List Table */}
          <div className="nr-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role &amp; Depot</th>
                    <th className="py-3 px-4">MFA Policy</th>
                    <th className="py-3 px-4">Active Sessions</th>
                    <th className="py-3 px-4">Last Authentication</th>
                    <th className="py-3 px-4 text-right">Session Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredUsers.map(user => {
                    const hasActiveSessions = user.activeSessionsCount > 0;

                    return (
                      <tr key={user.id} className="hover:bg-[var(--surface-2)]/60 transition">
                        
                        {/* Name & Email */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center font-heading font-bold text-xs text-[#B6F23C] shrink-0">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="truncate max-w-xs">
                              <p className="font-heading font-bold text-xs text-[var(--text)]">
                                {user.name}
                              </p>
                              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role & Depot */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="chip-pending px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                            {user.role.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                            {user.assignedDepot}
                          </span>
                        </td>

                        {/* MFA Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {user.mfaStatus === 'enforced' && (
                              <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#34D399]" />
                                <span>MFA Enforced</span>
                              </span>
                            )}
                            {user.mfaStatus === 'enabled' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                Enabled
                              </span>
                            )}
                            {user.mfaStatus === 'disabled' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                                Disabled
                              </span>
                            )}

                            <button
                              onClick={() => toggleUserMfa(user.id)}
                              className="text-[10px] text-[var(--text-muted)] hover:text-[#B6F23C] font-mono underline"
                              title="Toggle MFA enforcement"
                            >
                              Toggle
                            </button>
                          </div>
                        </td>

                        {/* Active Sessions */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                          {hasActiveSessions ? (
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{user.activeSessionsCount} active</span>
                            </div>
                          ) : (
                            <span className="text-[var(--text-muted)]">0 sessions (Revoked)</span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[var(--text-muted)]">
                          {new Date(user.lastLoginIso).toLocaleString('en-GB')}
                        </td>

                        {/* Revoke Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {hasActiveSessions ? (
                            <button
                              onClick={() => handleRevoke(user.id, user.name)}
                              className="btn-secondary !h-[30px] px-3 rounded-[8px] text-[11px] font-heading font-bold text-rose-400 hover:text-rose-300 border-rose-500/30 hover:border-rose-500/50 flex items-center gap-1.5 ml-auto"
                            >
                              <Lock className="w-3 h-3 text-rose-500" />
                              <span>Revoke Sessions</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              Sessions Terminated
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

