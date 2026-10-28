import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CalendarCheck, 
  PoundSterling, 
  PieChart, 
  Download, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { 
  mockCustomerBookings, 
  mockCorporateCostCentres 
} from '../../data/mockDataPhase12';
import { mockInvoices } from '../../data/mockDataPhase9';
import { CorporateCostCentre } from '../../types/phase12';

export const CorporatePortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices' | 'cost_centres'>('bookings');
  const [costCentres, setCostCentres] = useState<CorporateCostCentre[]>(mockCorporateCostCentres);
  const [searchQuery, setSearchQuery] = useState('');

  const account = {
    name: 'AstraZeneca UK Operations Ltd',
    accountNumber: 'AZ-CORP-4091',
    creditLimitGbp: 30000,
    availableCreditGbp: 24620,
    paymentTerms: 'Net 30 Days Monthly Invoiced',
    poMandate: true,
    accountManager: 'Arthur Pendergast (DEC Head Office)'
  };

  const corporateBookings = mockCustomerBookings;
  const corporateInvoices = mockInvoices.filter(i => i.accountName.toLowerCase().includes('astrazeneca') || true);

  return (
    <div className="space-y-6">
      
      {/* Corporate Account Header Banner */}
      <div className="nr-card p-6 space-y-4 border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#3FE0C5]/20 text-[#3FE0C5] flex items-center justify-center font-heading font-extrabold text-xl border border-[#3FE0C5]/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#3FE0C5] font-bold uppercase tracking-wider block">
                Corporate Master Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)]">
                {account.name}
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Account: {account.accountNumber} • Terms: {account.paymentTerms}
              </p>
            </div>
          </div>

          {/* Credit Limit KPI */}
          <div className="bg-[var(--surface-2)] p-3 rounded-[16px] border border-[var(--border)] text-left sm:text-right">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Available Credit Line
            </span>
            <span className="text-2xl font-mono font-extrabold text-[#34D399] block mt-0.5">
              £{account.availableCreditGbp.toLocaleString()}.00
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono block">
              of £{account.creditLimitGbp.toLocaleString()}.00 Limit
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[14px] border border-[var(--border)] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
              activeTab === 'bookings' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Corporate Bookings ({corporateBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
              activeTab === 'invoices' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Itemised Invoices &amp; Statements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cost_centres')}
            className={`px-4 py-1.5 rounded-[10px] text-xs font-heading font-bold transition whitespace-nowrap nr-focus ${
              activeTab === 'cost_centres' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Cost Centres &amp; Budgets ({costCentres.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CORPORATE BOOKINGS (Requirement 3) */}
      {activeTab === 'bookings' && (
        <div className="nr-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--text)]">
                Active &amp; Historical Corporate Bookings
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Track ongoing executive journeys with authorized PO numbers and passenger details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Corporate Quick-Booking Form — Auto-applied PO & Cost Centre')}
              className="btn-primary !text-xs !py-1.5 !px-3"
            >
              <Plus className="w-4 h-4" />
              <span>Create Corporate Booking</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Booking Ref</th>
                  <th className="p-3.5">Passenger Name</th>
                  <th className="p-3.5">Route</th>
                  <th className="p-3.5">Schedule</th>
                  <th className="p-3.5">PO / Cost Centre</th>
                  <th className="p-3.5 font-mono">Fare (£)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {corporateBookings.map(b => (
                  <tr key={b.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[var(--text)]">{b.bookingRef}</td>
                    <td className="p-3.5">
                      <div className="font-heading font-semibold text-[var(--text)]">{b.customerName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{b.customerPhone}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-medium text-[var(--text)] truncate">{b.pickupAddress}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">&rarr; {b.destinationAddress}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-[var(--text)]">{b.dateTime}</td>
                    <td className="p-3.5 font-mono text-[11px]">
                      <div className="font-bold text-[#3FE0C5]">{b.corporatePoNumber || 'PO-AZ-9912'}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{b.corporateCostCentre || 'AZ-ONCOLOGY-RD'}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#34D399]">£{b.quoteGbp.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                        {b.state}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={b.trackingLinkUrl}
                        className="text-[#3FE0C5] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Live Status</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES (Requirement 3) */}
      {activeTab === 'invoices' && (
        <div className="nr-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--text)]">
                Consolidated Monthly Invoices &amp; Statements
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Official VAT statements itemised by cost centre and passenger journey reference.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Exporting all corporate invoices as consolidated CSV statement...')}
              className="btn-secondary !text-xs !py-1.5 !px-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statements CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                <tr>
                  <th className="p-3.5">Invoice Number</th>
                  <th className="p-3.5">Billing Period</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 font-mono">Subtotal (£)</th>
                  <th className="p-3.5 font-mono">20% VAT (£)</th>
                  <th className="p-3.5 font-mono">Total Billed (£)</th>
                  <th className="p-3.5">Payment Status</th>
                  <th className="p-3.5 text-right">PDF Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {corporateInvoices.slice(0, 4).map(inv => (
                  <tr key={inv.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[var(--text)]">{inv.invoiceNumber}</td>
                    <td className="p-3.5 text-[var(--text)]">{inv.billingPeriod}</td>
                    <td className="p-3.5 font-mono text-[var(--text-muted)]">{inv.dueDate}</td>
                    <td className="p-3.5 font-mono text-[var(--text)]">£{inv.subtotalGbp.toFixed(2)}</td>
                    <td className="p-3.5 font-mono text-[var(--text-muted)]">£{inv.vatAmountGbp.toFixed(2)}</td>
                    <td className="p-3.5 font-mono font-bold text-sm text-[#34D399]">£{inv.totalDueGbp.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        inv.paymentStatus === 'paid' ? 'chip-ready' : 'chip-due-soon'
                      }`}>
                        {inv.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Downloading VAT Invoice PDF for ${inv.invoiceNumber}`)}
                        className="btn-ghost !text-xs !py-1 !px-2.5 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COST CENTRES (Requirement 3) */}
      {activeTab === 'cost_centres' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {costCentres.map(cc => {
              const percentUsed = Math.round((cc.currentSpendGbp / cc.monthlyBudgetGbp) * 100);
              return (
                <div key={cc.id} className="nr-card p-5 space-y-4 border border-[var(--border)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#3FE0C5] block">{cc.code}</span>
                      <h3 className="font-heading font-bold text-sm text-[var(--text)] mt-0.5">{cc.name}</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">{cc.department}</p>
                    </div>
                    <span className="chip-ready px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {cc.activeBookingsCount} Bookings
                    </span>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">Monthly Spend:</span>
                      <span className="font-bold text-[var(--text)]">£{cc.currentSpendGbp.toLocaleString()} / £{cc.monthlyBudgetGbp.toLocaleString()}</span>
                    </div>

                    <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          percentUsed > 85 ? 'bg-[#FF5D6C]' : percentUsed > 60 ? 'bg-[#FFC24B]' : 'bg-[#34D399]'
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span>{percentUsed}% utilised</span>
                      <span>£{(cc.monthlyBudgetGbp - cc.currentSpendGbp).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
