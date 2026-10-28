import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  PoundSterling, 
  FileText, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  TrendingUp 
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { bookings, staff } = useData();
  const { selectedCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'invoices' | 'driver_statements'>('invoices');

  // Filter bookings for corporate invoicing
  const corporateBookings = bookings.filter(b => b.paymentStatus === 'account_invoice');

  // Driver settlement demo for Tariq Mahmood
  const tariqBookings = bookings.filter(b => b.assignedDriverId === 'drv-01');
  const tariqGross = tariqBookings.reduce((sum, b) => sum + b.fareGbp, 0);
  const commissionDeduction = tariqGross * 0.15; // 15% operator commission
  const vehicleRentWeekly = 125.00; // Mercedes V-Class weekly lease
  const netDriverPayout = tariqGross - commissionDeduction - vehicleRentWeekly;

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <span>Finance, Invoicing &amp; Driver Settlements</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              GBP (£) Accounting
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Corporate invoicing, weekly driver settlement statements, commission &amp; rent reconciliations (Requirement 7 &amp; FIN-01).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'invoices' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Corporate Invoices
          </button>
          <button
            onClick={() => setActiveTab('driver_statements')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition ${
              activeTab === 'driver_statements' ? 'bg-[var(--surface)] shadow-sm text-[#08201C] dark:text-[#B6F23C]' : 'text-[var(--text-muted)]'
            }`}
          >
            Driver Settlements
          </button>
        </div>
      </div>

      {activeTab === 'invoices' ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="nr-card p-5 space-y-1">
              <span className="text-xs text-[var(--text-muted)] font-heading font-medium">Pending Corporate Invoices</span>
              <p className="text-2xl font-heading font-bold text-[var(--text)] font-mono tabular-nums">£337.50 GBP</p>
              <span className="text-[10px] text-[#FFC24B] font-bold">2 Account Clients</span>
            </div>
            <div className="nr-card p-5 space-y-1">
              <span className="text-xs text-[var(--text-muted)] font-heading font-medium">Settled This Week</span>
              <p className="text-2xl font-heading font-bold text-[#34D399] font-mono tabular-nums">£1,420.00 GBP</p>
              <span className="text-[10px] text-[var(--text-muted)]">Card &amp; Bank Transfer</span>
            </div>
            <div className="nr-card p-5 space-y-1">
              <span className="text-xs text-[var(--text-muted)] font-heading font-medium">VAT Remittance (20%)</span>
              <p className="text-2xl font-heading font-bold text-[var(--text)] font-mono tabular-nums">£284.00 GBP</p>
              <span className="text-[10px] text-[#3FE0C5] font-bold">HMRC Compliant</span>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="nr-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-heading font-bold text-[var(--text)] text-sm">
                Itemised Corporate Bookings &amp; Accounts
              </h3>
              <button
                onClick={() => alert('Exporting batch invoice ledger as CSV/Excel...')}
                className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-[var(--border)]">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-heading font-semibold">
                  <tr>
                    <th className="p-3.5">Invoice Ref / Booking</th>
                    <th className="p-3.5">Account Client</th>
                    <th className="p-3.5">Journey Details</th>
                    <th className="p-3.5">Fare + Extras</th>
                    <th className="p-3.5">Billing Status</th>
                    <th className="p-3.5 text-right">PDF Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {corporateBookings.map(b => (
                    <tr key={b.id} className="hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[var(--text)]">INV-{b.bookingRef.split('-')[2]}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono">{b.bookingRef}</div>
                      </td>
                      <td className="p-3.5 font-heading font-bold text-[var(--text)]">
                        {b.customerName}
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)] font-mono">
                        {b.pickupPostcode} &rarr; {b.destinationPostcode}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[var(--text)] tabular-nums">
                        £{b.totalGbp.toFixed(2)} GBP
                      </td>
                      <td className="p-3.5">
                        <span className="chip-due-soon px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          Account Ledger
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => alert(`Generated PDF invoice for ${b.bookingRef} - Itemised VAT, booking reference, and council contract schedule.`)}
                          className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Driver Settlement View */
        <div className="nr-card p-6 space-y-5 max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#3FE0C5] tracking-wider block">
                Weekly Driver Payout Statement (Week 43)
              </span>
              <h3 className="text-lg font-heading font-bold text-[var(--text)] mt-0.5">
                Tariq Mahmood (DEC-DRV-01)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Vehicle: Mercedes-Benz V-Class (LT73 XKL)</p>
            </div>

            <button
              onClick={() => alert('Downloading Driver Weekly Settlement Sheet (PDF)...')}
              className="btn-secondary !text-xs !py-1 !px-3 !min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement PDF</span>
            </button>
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)] font-sans">Total Fares Logged:</span>
              <span className="font-bold text-[var(--text)] text-sm">£{tariqGross.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--border)] text-[#FF5D6C]">
              <span className="font-sans">Less: Operator Commission (15%):</span>
              <span className="font-bold">-£{commissionDeduction.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--border)] text-[#FF5D6C]">
              <span className="font-sans">Less: Weekly Vehicle Fleet Lease Rent:</span>
              <span className="font-bold">-£{vehicleRentWeekly.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-[16px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#065F46] dark:text-[#34D399] text-base font-bold font-heading">
              <span className="text-sm font-heading">Net Driver Payout Due:</span>
              <span className="text-lg font-mono tabular-nums">£{netDriverPayout.toFixed(2)} GBP</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
