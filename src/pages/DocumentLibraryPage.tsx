import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useRole } from '../context/RoleContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Link as LinkIcon, 
  ShieldCheck, 
  Clock, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  Trash2, 
  FileCheck,
  Calendar,
  Lock,
  UserCheck,
  Tag,
  Car,
  Users,
  Building2,
  PenTool
} from 'lucide-react';
import { DocumentItem, DocumentCategory, PolicyAcknowledgement } from '../types';

export const DocumentLibraryPage: React.FC = () => {
  const { 
    documents, 
    policyAcknowledgements, 
    createExpiringShareLink, 
    revokeExpiringShareLink, 
    signPolicyAcknowledgement,
    updateDocumentVerification,
    staff 
  } = useData();
  const { currentRole, canViewDBS } = useRole();

  const [activeTab, setActiveTab] = useState<'documents' | 'policies'>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Expiring Share Link Modal
  const [selectedDocForLink, setSelectedDocForLink] = useState<DocumentItem | null>(null);
  const [shareHours, setShareHours] = useState(4);
  const [generatedLinkUrl, setGeneratedLinkUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Policy Sign Modal
  const [selectedPolicyForSign, setSelectedPolicyForSign] = useState<PolicyAcknowledgement | null>(null);
  const [signConsent, setSignConsent] = useState(false);

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (entityTypeFilter !== 'all' && doc.linkedType !== entityTypeFilter) return false;
    if (statusFilter !== 'all' && doc.verifiedStatus !== statusFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchEntity = doc.linkedEntityName.toLowerCase().includes(q);
      const matchOwner = doc.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchEntity && !matchOwner) return false;
    }
    return true;
  });

  const handleCreateShareLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForLink) return;

    const link = createExpiringShareLink(selectedDocForLink.id, shareHours, currentRole === 'owner_admin' ? 'Arthur Pendelton' : 'Compliance Lead');
    setGeneratedLinkUrl(link.url);
  };

  const handleCopyLink = () => {
    if (!generatedLinkUrl) return;
    navigator.clipboard.writeText(generatedLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSignPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicyForSign || !signConsent) return;

    const signatureHash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    signPolicyAcknowledgement(selectedPolicyForSign.id, selectedPolicyForSign.staffId, signatureHash, '194.73.112.45');
    setSelectedPolicyForSign(null);
    setSignConsent(false);
    alert('Policy acknowledgement signed and recorded with cryptographic timestamp!');
  };

  const getStatusBadge = (status: DocumentItem['verifiedStatus']) => {
    switch (status) {
      case 'verified':
        return <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Verified</span>;
      case 'pending_verification':
        return <span className="chip-pending px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Pending Review</span>;
      case 'rejected':
        return <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Rejected</span>;
      case 'expired':
        return <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Expired</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Document Library &amp; Policy Registry</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              GDPR Retained
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Searchable repository linked to drivers, PAs, vehicles, and companies with statutory retention limits and expiring pre-signed links.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
              activeTab === 'documents' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Vault ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 ${
              activeTab === 'policies' ? 'bg-[var(--surface)] text-[#08201C] dark:text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Policy Acknowledgements ({policyAcknowledgements.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'documents' ? (
        <div className="space-y-3.5">
          
          {/* Filters Bar */}
          <div className="nr-card p-3.5 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search title, linked entity, owner..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="nr-input !h-[38px] !pl-9 !text-xs w-full"
                />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="nr-input !h-[38px] !text-xs w-full"
                >
                  <option value="all">All Categories</option>
                  <option value="dbs_certificate">DBS Certificates</option>
                  <option value="driving_licence">Driving Licences</option>
                  <option value="insurance">Insurance Schedules</option>
                  <option value="mot_vt20">VT20 MOT Certificates</option>
                  <option value="council_badge">Council Badges</option>
                  <option value="training_cert">Training &amp; Qualifications</option>
                </select>
              </div>

              <div>
                <select
                  value={entityTypeFilter}
                  onChange={e => setEntityTypeFilter(e.target.value)}
                  className="nr-input !h-[38px] !text-xs w-full"
                >
                  <option value="all">All Entity Types</option>
                  <option value="driver">Drivers</option>
                  <option value="pa">Passenger Assistants</option>
                  <option value="vehicle">Vehicles</option>
                  <option value="sub_company">Sub-Companies</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="nr-input !h-[38px] !text-xs w-full"
                >
                  <option value="all">All Verification Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="pending_verification">Pending Review</option>
                  <option value="expired">Expired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>
          </div>

          {/* Documents Grid / Table */}
          <div className="nr-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="py-3 px-4">Document Details</th>
                    <th className="py-3 px-4">Linked Entity</th>
                    <th className="py-3 px-4">Version &amp; Owner</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">GDPR Retention</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredDocs.map(doc => {
                    // Check if restricted DBS
                    const isRestrictedDBS = doc.category === 'dbs_certificate' && !canViewDBS && currentRole !== 'owner_admin' && currentRole !== 'hr_vetting';
                    const activeShareLinks = doc.expiringLinks.filter(l => !l.isRevoked && new Date(l.expiresAt) > new Date());

                    return (
                      <tr key={doc.id} className="hover:bg-[var(--surface-2)]/60 transition">
                        {/* Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                              <FileText className="w-4 h-4 text-[#3FE0C5]" />
                            </div>
                            <div className="truncate max-w-xs">
                              <p className="font-heading font-bold text-xs text-[var(--text)] truncate">
                                {isRestrictedDBS ? '[RESTRICTED: Enhanced DBS Certificate]' : doc.title}
                              </p>
                              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                                {doc.category.replace('_', ' ')} • {Math.round(doc.fileSizeBytes / 1024)} KB
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Linked Entity */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <p className="font-heading font-medium text-[var(--text)]">
                            {doc.linkedEntityName}
                          </p>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                            Linked {doc.linkedType}
                          </span>
                        </td>

                        {/* Version & Owner */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="chip-pending px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                            {doc.version}
                          </span>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1">
                            {doc.ownerName}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(doc.verifiedStatus)}
                        </td>

                        {/* Retention Date */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[var(--text)]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>{doc.retentionDate}</span>
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            Statutory retention
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDocForLink(doc);
                                setGeneratedLinkUrl('');
                              }}
                              className="btn-secondary !h-[30px] px-2.5 rounded-[8px] text-[11px] font-heading font-bold flex items-center gap-1"
                              title="Generate temporary expiring pre-signed URL"
                            >
                              <LinkIcon className="w-3 h-3 text-[#3FE0C5]" />
                              <span>Share Link</span>
                              {activeShareLinks.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active links exist" />
                              )}
                            </button>

                            <button
                              onClick={() => alert(`Simulating file download for ${doc.title}`)}
                              disabled={isRestrictedDBS}
                              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition disabled:opacity-30 disabled:cursor-not-allowed"
                              title={isRestrictedDBS ? 'Access restricted from your role' : 'Download document'}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[var(--text-muted)]">
                        No documents matched the specified filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* Tab 2: Policy Acknowledgements */
        <div className="space-y-3.5">
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-[16px] flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-heading font-bold text-blue-300">
                Mandatory Operational Policies &amp; Staff Compliance Registry:
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                All drivers and passenger assistants must acknowledge current operational policies before clearance for duties. Cryptographic hashes and IP addresses verify acceptance under council compliance standards.
              </p>
            </div>
          </div>

          <div className="nr-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="py-3 px-4">Policy Document</th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Required Scope</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Signed Stamp &amp; IP</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {policyAcknowledgements.map(policy => (
                    <tr key={policy.id} className="hover:bg-[var(--surface-2)]/60 transition">
                      <td className="py-3 px-4">
                        <p className="font-heading font-bold text-xs text-[var(--text)]">
                          {policy.policyTitle}
                        </p>
                        <span className="text-[10px] font-mono text-[#3FE0C5]">
                          Version {policy.policyVersion}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-heading font-bold text-[var(--text)]">
                          {policy.staffName}
                        </p>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                          {policy.staffRole}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="chip-pending px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                          {policy.requiredFor.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {policy.status === 'acknowledged' && (
                          <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                            Signed &amp; Acknowledged
                          </span>
                        )}
                        {policy.status === 'pending_signature' && (
                          <span className="chip-pending px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                            Pending Signature
                          </span>
                        )}
                        {policy.status === 'overdue' && (
                          <span className="chip-blocked px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold animate-pulse">
                            Overdue / Blocked
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {policy.acknowledgedAt ? (
                          <div className="space-y-0.5 font-mono text-[10px]">
                            <p className="text-[var(--text)]">
                              {new Date(policy.acknowledgedAt).toLocaleString('en-GB')}
                            </p>
                            <span className="text-[var(--text-muted)] block truncate max-w-[140px]">
                              {policy.signatureHash}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">Unsigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {policy.status !== 'acknowledged' ? (
                          <button
                            onClick={() => setSelectedPolicyForSign(policy)}
                            className="btn-primary !h-[30px] px-3 rounded-[8px] text-[11px] font-heading font-bold flex items-center gap-1 shadow-lime-glow ml-auto"
                          >
                            <PenTool className="w-3 h-3" />
                            <span>Sign Declaration</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Showing cryptographic signature proof for ${policy.staffName}: ${policy.signatureHash}`)}
                            className="btn-secondary !h-[30px] px-2.5 rounded-[8px] text-[11px] font-heading font-bold ml-auto"
                          >
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: EXPIRING SECURE SHARE LINK
          ====================================================================== */}
      {selectedDocForLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-lg w-full border border-[var(--border)] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#3FE0C5]" />
                <span>Expiring Pre-Signed Share Link</span>
              </h3>
              <button
                onClick={() => setSelectedDocForLink(null)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Generate a temporary, pre-signed URL with cryptographic token expiry for external council auditors or vehicle inspection centres.
            </p>

            <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">Selected Document</span>
              <p className="text-xs font-heading font-bold text-[var(--text)]">
                {selectedDocForLink.title}
              </p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Linked to {selectedDocForLink.linkedEntityName} ({selectedDocForLink.linkedType})
              </span>
            </div>

            <form onSubmit={handleCreateShareLink} className="space-y-3.5">
              <div>
                <label className="text-xs font-heading font-bold text-[var(--text)] block mb-1">
                  Access Expiry Duration
                </label>
                <select
                  value={shareHours}
                  onChange={e => setShareHours(Number(e.target.value))}
                  className="nr-input w-full !h-[38px] !text-xs"
                >
                  <option value={1}>1 Hour (Strict One-time Inspection)</option>
                  <option value={4}>4 Hours (Standard Audit Window)</option>
                  <option value={24}>24 Hours (Full Working Day)</option>
                  <option value={168}>7 Days (Council Bi-annual Contract Audit)</option>
                </select>
              </div>

              {!generatedLinkUrl ? (
                <button
                  type="submit"
                  className="btn-primary w-full !h-[38px] rounded-[12px] text-xs font-heading font-bold shadow-lime-glow"
                >
                  Generate Expiring Token Link
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-heading font-bold text-emerald-400 block">
                    Temporary Pre-Signed Link Generated:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLinkUrl}
                      className="nr-input w-full !h-[38px] !text-xs font-mono select-all bg-[var(--surface-2)]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn-primary !h-[38px] px-3.5 rounded-[10px] text-xs font-heading font-bold shrink-0"
                    >
                      {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    Automatically revokes in {shareHours} hours. Activity recorded in audit trail.
                  </span>
                </div>
              )}
            </form>

            {/* Existing Active Links for this document */}
            {selectedDocForLink.expiringLinks.length > 0 && (
              <div className="pt-3 border-t border-[var(--border)] space-y-2">
                <span className="text-[11px] font-heading font-bold text-[var(--text)]">Active &amp; Historical Links:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedDocForLink.expiringLinks.map(link => (
                    <div key={link.id} className="p-2.5 bg-[var(--surface-2)] rounded-lg border border-[var(--border)] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          Expires: {new Date(link.expiresAt).toLocaleTimeString('en-GB')} ({new Date(link.expiresAt).toLocaleDateString('en-GB')})
                        </span>
                        <p className="text-[10px] text-[var(--text)]">Created by {link.createdBy}</p>
                      </div>

                      {link.isRevoked ? (
                        <span className="text-[10px] text-rose-500 font-bold">Revoked</span>
                      ) : (
                        <button
                          onClick={() => revokeExpiringShareLink(selectedDocForLink.id, link.id)}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Revoke Now</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: SIGN POLICY DECLARATION
          ====================================================================== */}
      {selectedPolicyForSign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full border border-[var(--border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#B6F23C]" />
              <span>Sign Statutory Policy Declaration</span>
            </h3>

            <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-1 text-xs">
              <p className="font-heading font-bold text-[var(--text)]">{selectedPolicyForSign.policyTitle}</p>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Version: {selectedPolicyForSign.policyVersion}</span>
              <p className="text-[11px] text-[var(--text-muted)] pt-1">
                Signing on behalf of: <strong>{selectedPolicyForSign.staffName}</strong> ({selectedPolicyForSign.staffRole.toUpperCase()})
              </p>
            </div>

            <form onSubmit={handleSignPolicy} className="space-y-4">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed select-none">
                <input
                  type="checkbox"
                  required
                  checked={signConsent}
                  onChange={e => setSignConsent(e.target.checked)}
                  className="mt-0.5 rounded accent-[#B6F23C] w-4 h-4 shrink-0"
                />
                <span className="text-[var(--text)]">
                  "I confirm that I have read, understood, and agree to adhere strictly to the terms of this operational policy. I acknowledge that breach may result in operational clearance suspension under council transport licensing."
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPolicyForSign(null)}
                  className="btn-secondary !h-[38px] px-4 rounded-[12px] text-xs font-heading font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!signConsent}
                  className="btn-primary !h-[38px] px-5 rounded-[12px] text-xs font-heading font-bold shadow-lime-glow disabled:opacity-40"
                >
                  Sign &amp; Verify Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

