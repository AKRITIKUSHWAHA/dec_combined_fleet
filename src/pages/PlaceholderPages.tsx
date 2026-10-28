import React from 'react';
import { MapPin, Info } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Live Dispatch Map</h1>
          <p className="text-xs text-slate-500">Real-time driver GPS tracking, freshness indicators (&gt;60s stale warning), and zone allocation.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <MapPin className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Live Map View Ready for Phase 2</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Phase 1 layout and foundation are active. Phase 2 will deliver the interactive map simulation, stale-driver warnings, and click-to-dispatch controls.
        </p>
      </div>
    </div>
  );
};

export const BookingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bookings & Dispatch Board</h1>
      <p className="text-xs text-slate-500">Kanban and table views of journeys: Unallocated, Allocated, En-Route, Arrived, POB, and Completed.</p>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Info className="w-10 h-10 text-blue-500 mx-auto mb-2" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Bookings Module (Phase 2 Focus)</h2>
        <p className="text-xs text-slate-500 mt-1">Ready for full interactive Kanban and booking modal integration.</p>
      </div>
    </div>
  );
};

export const FleetPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Fleet & Dual MOT Tracking</h1>
    <p className="text-xs text-slate-500">Independent tracking of Annual DVSA MOT vs Council 6-Month Inspections (Phase 3).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 3: Vehicle master, reminder schedules, and availability gates.
    </div>
  </div>
);

export const ChecksPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daily Checks & Builder</h1>
    <p className="text-xs text-slate-500">Self-service checklist builder and roadside audit inspection review (Phase 3).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 3: No-code checklist authoring and photo verification.
    </div>
  </div>
);

export const MaintenancePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Defects & Workshop Maintenance</h1>
    <p className="text-xs text-slate-500">Defect lifecycle, garage bookings, downtime reservations, and return-to-service sign-offs (Phase 4).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 4: Full workshop portal with parts, labour, and 2-person release verification.
    </div>
  </div>
);

export const WorkforcePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Staff Management (Drivers & PAs)</h1>
    <p className="text-xs text-slate-500">Authorised driver and passenger assistant directories, dual roles, and workforce shift planner (Phase 5).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 5: Driver profiles, dedicated PA records without driving licence prerequisite.
    </div>
  </div>
);

export const CompliancePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Compliance, DVLA & DBS Assurance</h1>
    <p className="text-xs text-slate-500">DVLA automated check schedules, restricted DBS metadata, and safeguarding cases (Phase 5).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 5: Controller vs HR field masking and Update Service verification.
    </div>
  </div>
);

export const SchoolTransportPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">School Transport & SEN Operations</h1>
    <p className="text-xs text-slate-500">Council contract management, AM/PM runs, PA pairings, and end-of-run child sweeps (Phase 6).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 6: Student attendance manifests, wheelchair restraint compliance, and route clashing.
    </div>
  </div>
);

export const TariffsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tariffs & Pricing Engine</h1>
    <p className="text-xs text-slate-500">Mileage formulas, airport drop fees, waiting rules, and versioned customer tiers (Phase 6).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 6: Pricing calculations, meet-and-greet surcharges, and VAT rules.
    </div>
  </div>
);

export const FinancePage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Finance, Invoicing & Driver Accounts</h1>
    <p className="text-xs text-slate-500">Corporate invoice generation, driver commission statements, and fuel/charging logs (Phase 6).</p>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      Scheduled for Phase 6: Driver settlements, weekly invoices, and accounting exports.
    </div>
  </div>
);

