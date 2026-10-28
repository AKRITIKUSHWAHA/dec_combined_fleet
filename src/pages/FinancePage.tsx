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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Finance, Invoicing &amp; Driver Settlements</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              GBP (£) Accounting
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Corporate invoicing, weekly driver settlement statements, commission &amp; rent reconciliations (Requirement 7 &amp; FIN-01).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'invoices' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
            }`}
          >
            Corporate Invoices
          </button>
          <button
            onClick={() => setActiveTab('driver_statements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'driver_statements' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500'
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
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Pending Corporate Invoices</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">£337.50 GBP</p>
              <span className="text-[10px] text-amber-600 font-semibold">2 Account Clients</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Settled This Week</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">£1,420.00 GBP</p>
              <span className="text-[10px] text-slate-400">Card &amp; Bank Transfer</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">VAT Remittance (20%)</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">£284.00 GBP</p>
              <span className="text-[10px] text-blue-600 font-semibold">HMRC Compliant</span>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Itemised Corporate Bookings &amp; Accounts
              </h3>
              <button
                onClick={() => alert('Exporting batch invoice ledger as CSV/Excel...')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Invoice Ref / Booking</th>
                    <th className="p-3">Account Client</th>
                    <th className="p-3">Journey Details</th>
                    <th className="p-3">Fare + Extras</th>
                    <th className="p-3">Billing Status</th>
                    <th className="p-3 text-right">PDF Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {corporateBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">INV-{b.bookingRef.split('-')[2]}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.bookingRef}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {b.customerName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {b.pickupPostcode} &rarr; {b.destinationPostcode}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        £{b.totalGbp.toFixed(2)} GBP
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Account Ledger
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Generated PDF invoice for ${b.bookingRef} - Itemised VAT, booking reference, and council contract schedule.`)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Weekly Driver Payout Statement (Week 43)
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tariq Mahmood (DEC-DRV-01)
              </h3>
              <p className="text-xs text-slate-500">Vehicle: Mercedes-Benz V-Class (LT73 XKL)</p>
            </div>

            <button
              onClick={() => alert('Downloading Driver Weekly Settlement Sheet (PDF)...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement PDF</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Total Fares Logged:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">£{tariqGross.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600">
              <span>Less: Operator Commission (15%):</span>
              <span className="font-mono font-bold">-£{commissionDeduction.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600">
              <span>Less: Weekly Vehicle Fleet Lease Rent:</span>
              <span className="font-mono font-bold">-£{vehicleRentWeekly.toFixed(2)} GBP</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 text-sm font-bold">
              <span>Net Driver Payout Due:</span>
              <span className="text-base font-mono">£{netDriverPayout.toFixed(2)} GBP</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
