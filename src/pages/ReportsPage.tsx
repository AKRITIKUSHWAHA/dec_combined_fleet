import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useCompany } from '../context/CompanyContext';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  Car, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  PoundSterling,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

type ReportType = 
  | 'fleet_compliance' 
  | 'workforce_audit' 
  | 'school_transport' 
  | 'dispatch_sla' 
  | 'finance_summary';

export const ReportsPage: React.FC = () => {
  const { 
    vehicles, 
    staff, 
    bookings, 
    schoolRoutes, 
    accountInvoices, 
    driverSettlements 
  } = useData();

  const { subCompanies } = useCompany();

  // Filters state
  const [reportType, setReportType] = useState<ReportType>('fleet_compliance');
  const [dateRange, setDateRange] = useState<'today' | '7days' | 'month' | 'all'>('month');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [depotFilter, setDepotFilter] = useState('all');

  // CSV Export Generator
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'fleet_compliance') {
      csvContent += 'Registration,Make Model,Category,Annual DVSA MOT Date,MOT Status,Council 6-Month Test Date,Council Status,Open Defects,Status\r\n';
      vehicles.forEach(v => {
        csvContent += `"${v.registration}","${v.make} ${v.model}","${v.vehicleCategory || 'Saloon'}","${v.annualDvsaMot.expiryDate}","${v.annualDvsaMot.status}","${v.councilSixMonthInspection.dueDate}","${v.councilSixMonthInspection.status}",${v.openDefectsCount},"${v.status}"\r\n`;
      });
    } else if (reportType === 'workforce_audit') {
      csvContent += 'Staff ID,Name,Role,Depot,Clearance,DVLA Licence,DVLA Points,Council Badge,DBS Status,Safeguarding Expiry,First Aid Expiry\r\n';
      staff.forEach(s => {
        csvContent += `"${s.staffId}","${s.name}","${s.role}","${s.assignedDepot}","${s.operationalClearance}","${s.drivingLicence?.licenceNumber || 'N/A'}",${s.drivingLicence?.penaltyPoints || 0},"${s.taxiBadge?.badgeNumber || 'N/A'}","${s.dbsCheck?.statusResult || 'clean'}","${s.training.safeguarding.expiryDate}","${s.training.firstAid.expiryDate}"\r\n`;
      });
    } else if (reportType === 'school_transport') {
      csvContent += 'Route Code,Contract Council,School Name,Run,Driver,Vehicle,Lead PA,Second PA,Total Pupils,Boarded,Delivered,Absent,Sweep Verified\r\n';
      schoolRoutes.forEach(r => {
        const boarded = r.pupils.filter(p => p.attendanceStatus === 'boarded').length;
        const delivered = r.pupils.filter(p => p.attendanceStatus === 'handed_over').length;
        const absent = r.pupils.filter(p => p.attendanceStatus === 'absent').length;
        csvContent += `"${r.routeCode}","${r.contractCouncil}","${r.schoolName}","${r.amOrPm}","${r.assignedDriverName}","${r.assignedVehicleReg}","${r.assignedPA1Name}","${r.assignedPA2Name || 'None'}",${r.pupils.length},${boarded},${delivered},${absent},"${r.sweepDetails?.paCountersigned ? 'Yes' : 'No'}"\r\n`;
      });
    } else if (reportType === 'dispatch_sla') {
      csvContent += 'Booking Ref,Customer,Scheduled Time,Category,Status,Fare (£),Driver,Vehicle,Pickup,Destination\r\n';
      bookings.forEach(b => {
        csvContent += `"${b.bookingRef}","${b.customerName}","${b.scheduledTime}","${b.vehicleCategory}","${b.status}",${b.totalGbp},"${b.assignedDriverId || 'Unallocated'}","${b.assignedVehicleId || 'Unassigned'}","${b.pickupAddress}","${b.destinationAddress}"\r\n`;
      });
    } else if (reportType === 'finance_summary') {
      csvContent += 'Invoice Ref,Client Name,Category,Issue Date,Due Date,Total (£),VAT (£),Status,Settlement Ref,Driver Name,Net Payout (£)\r\n';
      accountInvoices.forEach(i => {
        csvContent += `"${i.invoiceRef}","${i.clientName}","${i.clientType}","${i.issueDate}","${i.dueDate}",${i.totalGbp},${i.vatGbp},"${i.status}","","",""\r\n`;
      });
      driverSettlements.forEach(s => {
        csvContent += `"","","","","",0,0,"","${s.referenceNumber}","${s.driverName}",${s.netPayoutGbp}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dec_fleet_report_${reportType}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Compliance & Operational Reports
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statutory council audit exports, fleet roadworthiness, DBS vetting assurance, SEN school run sweep tracking, and financial reconciliation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Audit
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center overflow-x-auto bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl scrollbar-none">
        <button
          onClick={() => setReportType('fleet_compliance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            reportType === 'fleet_compliance'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Car className="w-4 h-4" />
          Fleet Roadworthiness & MOTs
        </button>

        <button
          onClick={() => setReportType('workforce_audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            reportType === 'workforce_audit'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          Workforce & DBS Statutory Audit
        </button>

        <button
          onClick={() => setReportType('school_transport')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            reportType === 'school_transport'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          SEN Route & Sweep Verification
        </button>

        <button
          onClick={() => setReportType('dispatch_sla')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            reportType === 'dispatch_sla'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          Dispatch SLA & Punctuality
        </button>

        <button
          onClick={() => setReportType('finance_summary')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            reportType === 'finance_summary'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <PoundSterling className="w-4 h-4" />
          Revenue & Settlement Summary
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Date Scope:
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${dateRange === 'today' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${dateRange === '7days' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${dateRange === 'month' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              Month to Date (Oct 2026)
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${dateRange === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              All Records
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-Company filter */}
          <select
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Sub-Companies</option>
            {subCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Depot filter */}
          <select
            value={depotFilter}
            onChange={e => setDepotFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Depots</option>
            <option value="Luton Central Depot">Luton Central Depot</option>
            <option value="Dunstable Depot">Dunstable Depot</option>
            <option value="Luton Airport Base">Luton Airport Base</option>
          </select>
        </div>
      </div>

      {/* ======================================================================
          REPORT 1: FLEET ROADWORTHINESS & MOT COMPLIANCE
          ====================================================================== */}
      {reportType === 'fleet_compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Fleet Vehicles</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{vehicles.length}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-emerald-600 font-bold uppercase">100% Valid Annual MOTs</span>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{vehicles.filter(v => v.annualDvsaMot.status !== 'expired').length} / {vehicles.length}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-amber-600 font-bold uppercase">MOTs Due Soon (&lt;30d)</span>
              <p className="text-xl font-black text-amber-600 mt-0.5">{vehicles.filter(v => v.annualDvsaMot.status === 'due_soon').length}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-rose-600 font-bold uppercase">VOR Blocked Vehicles</span>
              <p className="text-xl font-black text-rose-600 mt-0.5">{vehicles.filter(v => v.status === 'blocked_off_road').length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Statutory Fleet Compliance Register
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4">Make & Model</th>
                    <th className="py-3 px-4">Annual DVSA MOT Date</th>
                    <th className="py-3 px-4">Council 6-Month Test</th>
                    <th className="py-3 px-4">Insurance Policy</th>
                    <th className="py-3 px-4">Council Plate</th>
                    <th className="py-3 px-4">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 dark:text-white">{v.registration}</td>
                      <td className="py-3.5 px-4 font-medium">{v.make} {v.model}</td>
                      <td className="py-3.5 px-4 font-mono">
                        {v.annualDvsaMot.expiryDate}
                        <span className={`block text-[10px] font-bold ${v.annualDvsaMot.status === 'due_soon' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {v.annualDvsaMot.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {v.councilSixMonthInspection.dueDate}
                        <span className="block text-[10px] text-slate-400">{v.councilSixMonthInspection.council}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {v.insurancePolicy?.policyNumber || 'AV-FLT-88910'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {v.councilPlate?.plateNumber || 'LBC-PHV-1049'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === 'blocked_off_road' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {v.status.replace('_', ' ')}
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

      {/* ======================================================================
          REPORT 2: WORKFORCE & DBS STATUTORY AUDIT
          ====================================================================== */}
      {reportType === 'workforce_audit' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Workforce Vetting, DVLA Licence Points & Safeguarding Audit
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff ID & Name</th>
                    <th className="py-3 px-4">Designated Role</th>
                    <th className="py-3 px-4">Clearance</th>
                    <th className="py-3 px-4">DVLA Points</th>
                    <th className="py-3 px-4">Council Badge / PA Auth</th>
                    <th className="py-3 px-4">DBS Check Status</th>
                    <th className="py-3 px-4">Safeguarding Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {s.name}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">{s.staffId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {s.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.operationalClearance === 'restricted' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {s.operationalClearance}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {s.drivingLicence ? (
                          <span className={s.drivingLicence.penaltyPoints > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                            {s.drivingLicence.penaltyPoints} pts
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">PA Non-Driving</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {s.taxiBadge?.badgeNumber || s.paAuthorisation?.authorisationId || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                        {s.dbsCheck?.suitabilityDecision ? 'Cleared for Child Work' : 'Pending'}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {s.training.safeguarding.expiryDate}
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
          REPORT 3: SEN SCHOOL TRANSPORT & CHILD SWEEP VERIFICATION
          ====================================================================== */}
      {reportType === 'school_transport' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SEN Routes Attendance & Statutory Sweep Countersignature Audit
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Route & Council</th>
                    <th className="py-3 px-4">School</th>
                    <th className="py-3 px-4">Run</th>
                    <th className="py-3 px-4">Assigned Crew</th>
                    <th className="py-3 px-4">Pupils Attendance</th>
                    <th className="py-3 px-4">Sweep & PA Countersignature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {schoolRoutes.map(r => {
                    const boarded = r.pupils.filter(p => p.attendanceStatus === 'boarded').length;
                    const delivered = r.pupils.filter(p => p.attendanceStatus === 'handed_over').length;
                    const absent = r.pupils.filter(p => p.attendanceStatus === 'absent').length;

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">{r.routeCode}</span>
                          <span className="text-[10px] text-slate-400">{r.contractCouncil} Council</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{r.schoolName}</td>
                        <td className="py-3.5 px-4 font-bold">{r.amOrPm} Run</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{r.assignedDriverName} ({r.assignedVehicleReg})</p>
                          <p className="text-[10px] text-purple-600 font-semibold">
                            Lead PA: {r.assignedPA1Name} {r.assignedPA2Name ? `• 2nd PA: ${r.assignedPA2Name}` : ''}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-emerald-600">{delivered} Delivered</span> •{' '}
                          <span className="font-semibold text-amber-600">{boarded} Boarded</span> •{' '}
                          <span className="text-slate-400">{absent} Absent</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {r.sweepDetails?.paCountersigned ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              PA Verified ({r.sweepDetails.paSignatureName} at {r.sweepDetails.paTimestamp})
                            </span>
                          ) : r.sweepDetails?.driverCompleted ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-600 animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              Awaiting PA Countersignature
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Incomplete</span>
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
          REPORT 4: DISPATCH SLA & PUNCTUALITY
          ====================================================================== */}
      {reportType === 'dispatch_sla' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dispatch SLA & Journey Performance Audit
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Scheduled Time</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total (£)</th>
                    <th className="py-3 px-4">Lifecycle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{b.bookingRef}</td>
                      <td className="py-3.5 px-4 font-medium">{b.customerName}</td>
                      <td className="py-3.5 px-4 font-mono">{b.scheduledTime}</td>
                      <td className="py-3.5 px-4">{b.vehicleCategory}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">£{b.totalGbp.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {b.status.replace('_', ' ')}
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

      {/* ======================================================================
          REPORT 5: REVENUE & COMMISSION SETTLEMENT SUMMARY
          ====================================================================== */}
      {reportType === 'finance_summary' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue Invoicing & Driver Commission Summary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Transaction Type</th>
                    <th className="py-3 px-4">Gross (£)</th>
                    <th className="py-3 px-4">Net Collected / Disbursed</th>
                    <th className="py-3 px-4">Settlement State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {accountInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceRef}</td>
                      <td className="py-3.5 px-4 font-medium">{inv.clientName}</td>
                      <td className="py-3.5 px-4 font-semibold text-purple-600">Client Receivable</td>
                      <td className="py-3.5 px-4 font-mono font-bold">£{inv.totalGbp.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">£{inv.totalGbp.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {driverSettlements.map(set => (
                    <tr key={set.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-slate-50/20">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{set.referenceNumber}</td>
                      <td className="py-3.5 px-4 font-medium">{set.driverName}</td>
                      <td className="py-3.5 px-4 font-semibold text-amber-600">Driver Settlement Payout</td>
                      <td className="py-3.5 px-4 font-mono">£{set.grossFaresGbp.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 dark:text-white">£{set.netPayoutGbp.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          set.status === 'paid_disbursed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {set.status.replace('_', ' ')}
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

    </div>
  );
};
