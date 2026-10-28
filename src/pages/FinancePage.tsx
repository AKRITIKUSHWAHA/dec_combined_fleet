import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AccountInvoice, DriverSettlement } from '../types';
import { 
  PoundSterling, 
  CreditCard, 
  Banknote, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Printer, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Building2, 
  ArrowUpRight, 
  Users, 
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

type FinanceTab = 'overview_invoices' | 'driver_settlements';

export const FinancePage: React.FC = () => {
  const { 
    accountInvoices, 
    driverSettlements, 
    bookings, 
    markInvoicePaid, 
    disburseDriverSettlement 
  } = useData();

  const [activeTab, setActiveTab] = useState<FinanceTab>('overview_invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState<AccountInvoice | null>(null);
  const [isPayInvoiceModalOpen, setIsPayInvoiceModalOpen] = useState(false);
  const [paymentMethodChoice, setPaymentMethodChoice] = useState('BACS Electronic Bank Transfer');

  const [selectedSettlement, setSelectedSettlement] = useState<DriverSettlement | null>(null);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);

  // Financial Calculations
  const totalBilled = accountInvoices.reduce((acc, inv) => acc + inv.totalGbp, 0);
  const totalPaid = accountInvoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.totalGbp, 0);
  const totalOverdue = accountInvoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.totalGbp, 0);
  const totalPendingSettlements = driverSettlements.filter(s => s.status === 'pending_settlement').reduce((acc, s) => acc + s.netPayoutGbp, 0);

  // Filtered Invoices
  const filteredInvoices = accountInvoices.filter(inv => {
    if (clientTypeFilter !== 'all' && inv.clientType !== clientTypeFilter) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = inv.invoiceRef.toLowerCase().includes(q);
      const matchClient = inv.clientName.toLowerCase().includes(q);
      const matchCouncil = inv.councilOrCompany.toLowerCase().includes(q);
      if (!matchRef && !matchClient && !matchCouncil) return false;
    }
    return true;
  });

  const handleOpenPayModal = (inv: AccountInvoice) => {
    setSelectedInvoice(inv);
    setIsPayInvoiceModalOpen(true);
  };

  const handleConfirmPayInvoice = () => {
    if (!selectedInvoice) return;
    markInvoicePaid(selectedInvoice.id, paymentMethodChoice);
    setIsPayInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleOpenDisburseModal = (set: DriverSettlement) => {
    setSelectedSettlement(set);
    setIsDisburseModalOpen(true);
  };

  const handleConfirmDisburse = () => {
    if (!selectedSettlement) return;
    disburseDriverSettlement(selectedSettlement.id);
    setIsDisburseModalOpen(false);
    setSelectedSettlement(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Finance, Invoices & Settlement
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Phase 7
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Council SEN frameworks billing, corporate account invoices, payment status tracking, and weekly driver commission settlements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview_invoices')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'overview_invoices'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            Invoices & Council Billing
          </button>
          <button
            onClick={() => setActiveTab('driver_settlements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'driver_settlements'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PoundSterling className="w-4 h-4 text-emerald-600" />
            Driver Earnings & Settlement
            {driverSettlements.filter(s => s.status === 'pending_settlement').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                {driverSettlements.filter(s => s.status === 'pending_settlement').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Invoiced (MTD)</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              £{totalBilled.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Collected Revenue</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              £{totalPaid.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Overdue Invoices</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                £{totalOverdue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Driver Payouts Due</p>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              £{totalPendingSettlements.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <PoundSterling className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ======================================================================
          TAB 1: INVOICES & COUNCIL BILLING
          ====================================================================== */}
      {activeTab === 'overview_invoices' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice ref, council authority, or corporate account..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={clientTypeFilter}
                onChange={e => setClientTypeFilter(e.target.value)}
                className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Client Categories</option>
                <option value="council_contract">Council SEN Contracts</option>
                <option value="corporate_account">Corporate Accounts</option>
                <option value="private_customer">Private Customers</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="sent">Sent / Awaiting Payment</option>
                <option value="paid">Paid & Reconciled</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice Ref</th>
                    <th className="py-3 px-4">Client / Authority</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total Amount (£)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInvoices.map(inv => {
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {inv.invoiceRef}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {inv.clientName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.clientType === 'council_contract'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {inv.clientType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{inv.issueDate}</td>
                        <td className="py-3.5 px-4 font-mono">{inv.dueDate}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-slate-900 dark:text-white">
                          £{inv.totalGbp.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.status === 'paid' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                              Paid ({inv.paidAt || 'Reconciled'})
                            </span>
                          )}
                          {inv.status === 'sent' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                              Sent
                            </span>
                          )}
                          {inv.status === 'overdue' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 animate-pulse">
                              Overdue
                            </span>
                          )}
                          {inv.status === 'draft' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                            >
                              View / Print
                            </button>
                            {inv.status !== 'paid' && (
                              <button
                                onClick={() => handleOpenPayModal(inv)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                              >
                                Mark Paid
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
        </div>
      )}

      {/* ======================================================================
          TAB 2: DRIVER EARNINGS & SETTLEMENTS
          ====================================================================== */}
      {activeTab === 'driver_settlements' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PoundSterling className="w-5 h-5 text-emerald-600" />
                  Weekly Driver Commission & Earnings Settlement
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculates gross fares, 20% DEC operator commission, toll reimbursements, and net disbursement balance.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Standard Operator Cut: 20%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 uppercase tracking-wider text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Settlement Ref</th>
                    <th className="py-3 px-4">Driver & Vehicle</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Completed Jobs</th>
                    <th className="py-3 px-4">Gross Fares</th>
                    <th className="py-3 px-4">Operator Comm (20%)</th>
                    <th className="py-3 px-4">Tolls & Fuel Allowance</th>
                    <th className="py-3 px-4">Net Driver Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {driverSettlements.map(set => {
                    return (
                      <tr key={set.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {set.referenceNumber}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {set.driverName}
                          <span className="block font-mono text-[10px] text-slate-400 font-normal">
                            Reg: {set.vehicleReg}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{set.period}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {set.completedJobsCount} trips
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          £{set.grossFaresGbp.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400">
                          -£{set.operatorCommissionGbp.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                          +£{(set.airportTollReimbursementsGbp + set.fuelAllowanceGbp).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-900 dark:text-white">
                          £{set.netPayoutGbp.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          {set.status === 'paid_disbursed' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                              Disbursed ({set.disbursedAt})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                              Pending Payout
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {set.status === 'pending_settlement' ? (
                            <button
                              onClick={() => handleOpenDisburseModal(set)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                            >
                              Disburse Payout
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
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

      {/* ======================================================================
          MODAL 1: VIEW / PRINT INVOICE
          ====================================================================== */}
      {selectedInvoice && !isPayInvoiceModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            {/* Invoice Top */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">TAX INVOICE</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedInvoice.invoiceRef}
                </h3>
                <p className="text-xs text-slate-500">{selectedInvoice.clientName}</p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 block">Issued: {selectedInvoice.issueDate}</span>
                <span className="text-slate-400 block">Due Date: {selectedInvoice.dueDate}</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                  selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Line Items</h4>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit (£)</th>
                      <th className="p-2.5 text-right">Total (£)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">{item.description}</td>
                        <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">£{item.unitPriceGbp.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono font-bold">£{item.totalGbp.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (Net)</span>
                <span className="font-mono">£{selectedInvoice.subtotalGbp.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>VAT (Zero-Rated / 20%)</span>
                <span className="font-mono">£{selectedInvoice.vatGbp.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Total Due</span>
                <span className="font-mono">£{selectedInvoice.totalGbp.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => alert(`Simulating PDF download for invoice ${selectedInvoice.invoiceRef}`)}
                className="px-3 py-2 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                {selectedInvoice.status !== 'paid' && (
                  <button
                    type="button"
                    onClick={() => setIsPayInvoiceModalOpen(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: RECORD PAYMENT ON INVOICE
          ====================================================================== */}
      {isPayInvoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Record Payment: {selectedInvoice.invoiceRef}
            </h3>
            <p className="text-xs text-slate-500">
              Total Amount: <strong className="text-slate-900 dark:text-white">£{selectedInvoice.totalGbp.toFixed(2)}</strong>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Settlement Method
              </label>
              <select
                value={paymentMethodChoice}
                onChange={e => setPaymentMethodChoice(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="BACS Electronic Bank Transfer">BACS Electronic Bank Transfer</option>
                <option value="Direct Council Remittance">Direct Council Remittance</option>
                <option value="Corporate Debit/Credit Card">Corporate Debit/Credit Card</option>
                <option value="Direct Debit Reconciled">Direct Debit</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPayInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayInvoice}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirm Payment & Reconcile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: DISBURSE DRIVER SETTLEMENT
          ====================================================================== */}
      {isDisburseModalOpen && selectedSettlement && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PoundSterling className="w-5 h-5 text-emerald-600" />
              Disburse Settlement: {selectedSettlement.driverName}
            </h3>
            <p className="text-xs text-slate-500">
              Period: {selectedSettlement.period} • Completed Jobs: {selectedSettlement.completedJobsCount}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Gross Customer Fares</span>
                <span className="font-mono font-bold">£{selectedSettlement.grossFaresGbp.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>DEC Operator Commission (20%)</span>
                <span className="font-mono font-bold">-£{selectedSettlement.operatorCommissionGbp.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Toll & Fuel Reimbursements</span>
                <span className="font-mono font-bold">+£{(selectedSettlement.airportTollReimbursementsGbp + selectedSettlement.fuelAllowanceGbp).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span>Net BACS Payout</span>
                <span className="font-mono">£{selectedSettlement.netPayoutGbp.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Confirming disbursement will generate payout remittance ref <strong>{selectedSettlement.referenceNumber}</strong> and transmit the settlement statement to the driver's mobile staff app.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDisburseModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisburse}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Authorize BACS Transfer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
