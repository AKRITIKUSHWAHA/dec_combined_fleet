import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  mockCorporateAccounts, 
  mockInvoices, 
  mockDriverSettlements 
} from '../data/mockDataPhase9';
import { 
  CorporateAccount, 
  InvoiceRecord, 
  DriverWeeklySettlement, 
  PaymentStatus 
} from '../types/phase9';
import { 
  PoundSterling, 
  FileText, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Building2,
  AlertTriangle,
  RotateCcw,
  Check,
  FileSpreadsheet,
  Plus,
  X
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { bookings } = useData();
  const { selectedCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'invoices' | 'corporate_accounts' | 'driver_settlements'>('invoices');
  
  // Invoices & Accounts State
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(mockInvoices[0]);
  const [accounts, setAccounts] = useState<CorporateAccount[]>(mockCorporateAccounts);
  const [settlements, setSettlements] = useState<DriverWeeklySettlement[]>(mockDriverSettlements);

  // Partial Refund Dialog State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundBookingRef, setRefundBookingRef] = useState('DEC-LTN-2026-904');
  const [refundOriginalFare, setRefundOriginalFare] = useState<number>(145.00);
  const [refundAmount, setRefundAmount] = useState<number>(30.00);
  const [refundReason, setRefundReason] = useState<string>('Flight delay inconvenience goodwill voucher');
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setRefundSuccessMsg(`£${refundAmount.toFixed(2)} refunded successfully against ${refundBookingRef}. Payment status updated to PART-PAID. Credit note CN-2026-014 logged.`);
    setShowRefundModal(false);
    setTimeout(() => setRefundSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <PoundSterling className="w-5 h-5 text-[#B6F23C]" />
            <span>Payments, Accounts &amp; Driver Settlements</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              UK Accounting Ledger
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Separate payment &amp; journey statuses, partial refund dialog, corporate accounts with PO/Cost Centres, itemised invoices, and weekly driver settlement statements.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] shrink-0">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'invoices' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            Invoices &amp; Ledger
          </button>
          <button
            onClick={() => setActiveTab('corporate_accounts')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'corporate_accounts' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            Corporate Accounts
          </button>
          <button
            onClick={() => setActiveTab('driver_settlements')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'driver_settlements' ? 'bg-[var(--surface)] text-[#B6F23C] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            Driver Settlements
          </button>
        </div>
      </div>

      {refundSuccessMsg && (
        <div className="p-3.5 rounded-[14px] bg-[#34D399]/15 border border-[#34D399]/40 text-xs text-[#065F46] dark:text-[#34D399] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>{refundSuccessMsg}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold block text-[11px]">Outstanding Corporate Invoices</span>
          <p className="text-xl font-heading font-bold text-[#FFC24B] font-mono tabular-nums">£2,220.00 GBP</p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">AstraZeneca UK • Due in 28 days</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold block text-[11px]">Settled Card &amp; Bank Payments</span>
          <p className="text-xl font-heading font-bold text-[#34D399] font-mono tabular-nums">£4,840.00 GBP</p>
          <span className="text-[10px] font-mono text-[#34D399]">100% Cleared via Gateway</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold block text-[11px]">Driver Payouts Authorized</span>
          <p className="text-xl font-heading font-bold text-[#3FE0C5] font-mono tabular-nums">£1,652.40 GBP</p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">2 Weekly Driver Statements</span>
        </div>

        <div className="nr-card p-4 space-y-1">
          <span className="text-[var(--text-muted)] font-heading font-semibold block text-[11px]">HMRC VAT Collected (20%)</span>
          <p className="text-xl font-heading font-bold text-[var(--text)] font-mono tabular-nums">£605.00 GBP</p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Quarter Q4 Provision</span>
        </div>
      </div>

      {/* TAB 1: INVOICES & REVENUE LEDGER */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Invoices List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Corporate Invoices ({invoices.length})
              </span>
              <button
                onClick={() => {
                  setRefundBookingRef('DEC-LTN-2026-904');
                  setRefundOriginalFare(145.00);
                  setRefundAmount(30.00);
                  setShowRefundModal(true);
                }}
                className="text-[11px] font-heading font-bold text-[#FF9F6B] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Issue Partial Refund</span>
              </button>
            </div>

            {invoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`nr-card p-4 cursor-pointer transition-all duration-180 border ${
                    isSelected
                      ? 'border-[#B6F23C] shadow-lime-glow bg-[var(--surface-2)]/80'
                      : 'hover:border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-heading font-bold text-sm text-[var(--text)]">
                        {inv.invoiceNumber}
                      </span>
                      <p className="text-xs font-semibold text-[var(--text)] mt-0.5">
                        {inv.accountName}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-[#34D399]/20 text-[#34D399]'
                        : 'bg-[#FFC24B]/20 text-[#FFC24B]'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 mt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">{inv.billingPeriod}</span>
                    <span className="font-bold text-[#B6F23C] text-sm">£{inv.totalDueGbp.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Invoice Detail Dossier (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="nr-card p-6 space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                      INVOICE DETAIL • {selectedInvoice.billingPeriod}
                    </span>
                    <h2 className="text-xl font-heading font-bold text-[var(--text)] mt-0.5">
                      {selectedInvoice.invoiceNumber}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      Billed to: <strong className="text-[var(--text)]">{selectedInvoice.accountName}</strong> ({selectedInvoice.accountCode})
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Exporting ${selectedInvoice.invoiceNumber} itemised PDF breakdown...`)}
                      className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                {/* Itemised Journey Table */}
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs text-[var(--text)]">
                    Itemised Journeys &amp; Cost Centre Allocation:
                  </h4>
                  <div className="overflow-x-auto border border-[var(--border)] rounded-[14px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Ref / Passenger</th>
                          <th className="p-2.5">Cost Centre / PO</th>
                          <th className="p-2.5 text-right">Net</th>
                          <th className="p-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)] font-mono text-[11px]">
                        {selectedInvoice.items.map((it) => (
                          <tr key={it.id}>
                            <td className="p-2.5 text-[var(--text-muted)]">{it.journeyDate}</td>
                            <td className="p-2.5">
                              <span className="font-bold text-[var(--text)]">{it.bookingRef}</span>
                              <span className="block text-[10px] text-[var(--text-muted)]">{it.passengerName}</span>
                            </td>
                            <td className="p-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text)] text-[10px]">
                                {it.costCentre || 'N/A'}
                              </span>
                              <span className="block text-[10px] text-[var(--text-muted)]">{it.poNumber}</span>
                            </td>
                            <td className="p-2.5 text-right text-[var(--text-muted)]">£{it.fareGbp.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-bold text-[#B6F23C]">£{it.totalGbp.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Credit Notes if any */}
                {selectedInvoice.creditNotes && selectedInvoice.creditNotes.length > 0 && (
                  <div className="p-3.5 rounded-[14px] bg-[#FF9F6B]/10 border border-[#FF9F6B]/30 text-xs space-y-1 font-mono">
                    <span className="font-heading font-bold text-[#FF9F6B]">Applied Credit Notes:</span>
                    {selectedInvoice.creditNotes.map(cn => (
                      <div key={cn.creditNoteRef} className="flex justify-between text-[11px]">
                        <span>{cn.creditNoteRef} - {cn.reason} ({cn.issueDate})</span>
                        <span className="font-bold text-[#FF9F6B]">-£{cn.amountGbp.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotals & VAT */}
                <div className="p-4 rounded-[14px] bg-[var(--surface-2)] text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Subtotal Excl. VAT:</span>
                    <span>£{selectedInvoice.subtotalGbp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>UK VAT @ 20.0%:</span>
                    <span>£{selectedInvoice.vatAmountGbp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--text)] pt-1 border-t border-[var(--border)]">
                    <span>Total Due (GBP £):</span>
                    <span className="text-[#B6F23C]">£{selectedInvoice.totalDueGbp.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="nr-card p-8 text-center text-xs text-[var(--text-muted)]">
                Select an invoice on the left to view itemised journey receipts.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: CORPORATE ACCOUNTS WITH PO / COST CENTRES */}
      {activeTab === 'corporate_accounts' && (
        <div className="nr-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Corporate Account Ledger &amp; Credit Limits
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Manage credit ceilings, mandatory PO requirements, and department cost centre codes.
              </p>
            </div>

            <button
              onClick={() => alert('New Corporate Account onboarding wizard initiated.')}
              className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Corporate Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Corporate Client</th>
                  <th className="p-3">Account Code</th>
                  <th className="p-3">Credit Limit</th>
                  <th className="p-3">Current Balance</th>
                  <th className="p-3">PO Mandate</th>
                  <th className="p-3">Registered Cost Centres</th>
                  <th className="p-3">Payment Terms</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-mono text-[11px]">
                {accounts.map(acc => {
                  const usagePercent = Math.round((acc.currentBalanceGbp / acc.creditLimitGbp) * 100);
                  return (
                    <tr key={acc.id} className="hover:bg-[var(--surface-2)] transition">
                      <td className="p-3 font-heading font-bold text-[var(--text)]">
                        {acc.accountName}
                        <span className="block text-[10px] text-[var(--text-muted)] font-normal">{acc.contactPerson}</span>
                      </td>
                      <td className="p-3 text-[#3FE0C5] font-bold">{acc.accountCode}</td>
                      <td className="p-3 text-[var(--text)]">£{acc.creditLimitGbp.toLocaleString()}.00</td>
                      <td className="p-3">
                        <span className="font-bold text-[#FFC24B]">£{acc.currentBalanceGbp.toFixed(2)}</span>
                        <span className="text-[10px] text-[var(--text-muted)] block">({usagePercent}% used)</span>
                      </td>
                      <td className="p-3">
                        {acc.poNumberMandatory ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399] font-bold text-[10px]">
                            Required
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)]">Optional</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {acc.costCentres.map(cc => (
                            <span key={cc} className="px-1.5 py-0.2 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[9px]">
                              {cc}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-[var(--text-muted)]">{acc.paymentTermsDays} Days Net</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399] uppercase font-bold text-[10px]">
                          {acc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER WEEKLY SETTLEMENT STATEMENTS */}
      {activeTab === 'driver_settlements' && (
        <div className="space-y-4">
          <div className="nr-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                  Weekly Driver Financial Settlements &amp; Remittances
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Gross fares, operator commission deduction, vehicle lease rent, and cash collections offset (Requirement 3).
                </p>
              </div>

              <button
                onClick={() => alert('Batch BACS payout file generated for Barclays Corporate Banking.')}
                className="btn-primary !text-xs !py-1 !px-3.5 !min-h-[36px]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Authorize BACS Payout Batch</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Driver Staff Member</th>
                    <th className="p-3">Assigned Vehicle</th>
                    <th className="p-3">Week Ending</th>
                    <th className="p-3 text-right">Gross Fares</th>
                    <th className="p-3 text-right">DEC Commission (20%)</th>
                    <th className="p-3 text-right">Vehicle Rent</th>
                    <th className="p-3 text-right">Cash in Hand Offset</th>
                    <th className="p-3 text-right font-bold text-[#B6F23C]">Net Bank Transfer</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-mono text-[11px]">
                  {settlements.map(st => (
                    <tr key={st.driverId} className="hover:bg-[var(--surface-2)] transition">
                      <td className="p-3 font-heading font-bold text-[var(--text)]">
                        {st.driverName}
                        <span className="block text-[10px] text-[var(--text-muted)] font-mono font-normal">{st.staffId} • {st.completedJobsCount} trips</span>
                      </td>
                      <td className="p-3 text-[var(--text-muted)]">{st.vehicleReg}</td>
                      <td className="p-3 text-[var(--text-muted)]">{st.weekEndingDate}</td>
                      <td className="p-3 text-right font-bold text-[var(--text)]">£{st.grossFaresGbp.toFixed(2)}</td>
                      <td className="p-3 text-right text-[#FF5D6C]">-£{st.operatorCommissionGbp.toFixed(2)}</td>
                      <td className="p-3 text-right text-[var(--text-muted)]">-£{st.vehicleRentWeeklyGbp.toFixed(2)}</td>
                      <td className="p-3 text-right text-[#FF9F6B]">-£{st.cashFaresCollectedByDriverGbp.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-[#B6F23C] text-sm">
                        £{st.netBankTransferPayoutGbp.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          st.paymentStatus === 'settled'
                            ? 'bg-[#34D399]/20 text-[#34D399]'
                            : 'bg-[#3FE0C5]/20 text-[#3FE0C5]'
                        }`}>
                          {st.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PARTIAL REFUND DIALOG MODAL (Requirement 3) */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="nr-card p-6 max-w-md w-full space-y-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-[#FF9F6B]/20 text-[#FF9F6B] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--text)]">
                    Issue Partial Client Refund
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Ref: {refundBookingRef} (Original: £{refundOriginalFare.toFixed(2)})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRefundModal(false)}
                className="p-1 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">
                  Refund Amount to Return (£ GBP)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[var(--text)]">£</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={refundOriginalFare}
                    required
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="nr-input !h-[42px] pl-8 font-mono font-bold text-sm"
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                  Remaining journey balance retained: £{(refundOriginalFare - refundAmount).toFixed(2)} (Status: PART-PAID)
                </span>
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-semibold block mb-1">
                  Mandatory Audit Reason for Refund
                </label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="nr-input !h-auto p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="btn-ghost flex-1 !text-xs !min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 !text-xs !min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Authorize £{refundAmount.toFixed(2)} Refund</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FinancePage;
