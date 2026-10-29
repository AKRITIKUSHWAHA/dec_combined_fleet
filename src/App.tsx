import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth, getRoleHomeRoute } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { CompanyProvider } from './context/CompanyContext';
import { DataProvider } from './context/DataContext';

import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerBookingPage } from './pages/public/CustomerBookingPage';
import { CustomerTrackingPage } from './pages/public/CustomerTrackingPage';
import { CorporatePortalPage } from './pages/public/CorporatePortalPage';
import { ParentTrackingPage } from './pages/public/ParentTrackingPage';
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute';
import { RoleGuard } from './components/common/RoleGuard';
import { LogoutConfirmModal } from './components/common/LogoutConfirmModal';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { BookingsPage } from './pages/BookingsPage';
import { FleetPage } from './pages/FleetPage';
import { ChecksPage } from './pages/ChecksPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { WorkforcePage } from './pages/WorkforcePage';
import { CompliancePage } from './pages/CompliancePage';
import { SchoolTransportPage } from './pages/SchoolTransportPage';
import { TariffsPage } from './pages/TariffsPage';
import { FinancePage } from './pages/FinancePage';
import { ReportsPage } from './pages/ReportsPage';
import { AirportExecutivePage } from './pages/AirportExecutivePage';
import { OfficeExtrasPage } from './pages/OfficeExtrasPage';
import { AutoDispatchSettingsPage } from './pages/AutoDispatchSettingsPage';
import { ExpensesIncidentsPage } from './pages/ExpensesIncidentsPage';
import { ReminderCentrePage } from './pages/ReminderCentrePage';
import { SafeguardingPage } from './pages/SafeguardingPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { DocumentLibraryPage } from './pages/DocumentLibraryPage';
import { SubCompaniesPage } from './pages/SubCompaniesPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { RolesAndUsersPage } from './pages/RolesAndUsersPage';
import { DriverCockpitPage, PACockpitPage } from './pages/StaffCockpitPages';
import { EnhancementsHubPage } from './pages/EnhancementsHubPage';
import { DriverCarPlayCockpitPage } from './pages/DriverCarPlayCockpitPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { NotFoundPage, AccessDeniedPage } from './pages/NotFoundPage';

// Root redirect handler: "/" -> /login if unauthenticated, else role home
const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getRoleHomeRoute(user.role)} replace />;
};

// Staff app home router: /app/home -> PA Cockpit or Driver Cockpit depending on active persona
const StaffAppHomeRouter: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'pa') {
    return <PACockpitPage />;
  }
  return <DriverCockpitPage />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <CompanyProvider>
            <DataProvider>
              <BrowserRouter>
                {/* Global Shared-Device Safe Logout Confirmation Modal */}
                <LogoutConfirmModal />

                <Routes>
                  {/* Public-only routes: redirect to role dashboard if already signed in */}
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <LoginPage />
                      </PublicOnlyRoute>
                    }
                  />

                  {/* 403 Access Denied explicit route */}
                  <Route path="/403" element={<AccessDeniedPage />} />

                  {/* Phase 12: Public Customer & Guardian Portals under PublicLayout (Strictly no staff menus) */}
                  <Route element={<PublicLayout />}>
                    <Route path="/book" element={<CustomerBookingPage />} />
                    <Route path="/track" element={<CustomerTrackingPage />} />
                    <Route path="/track/:bookingRef" element={<CustomerTrackingPage />} />
                    <Route path="/corporate" element={<CorporatePortalPage />} />
                    <Route path="/parent" element={<ParentTrackingPage />} />
                  </Route>

                  {/* Root path: authenticated role home redirect */}
                  <Route path="/" element={<RootRedirect />} />

                  {/* Protected Application Routes under AppLayout Shell */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Operational Dashboard: All roles allowed */}
                    <Route path="/office/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Design System Specimen (Night Road) */}
                    <Route path="/design-system" element={<DesignSystemPage />} />

                    {/* Live Dispatch Map: Controller & Owner */}
                    <Route
                      path="/office/live-map"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Live Dispatch Map">
                          <LiveMapPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/live-map"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Live Dispatch Map">
                          <LiveMapPage />
                        </RoleGuard>
                      }
                    />

                    {/* Bookings & Dispatch: Controller & Owner */}
                    <Route
                      path="/office/bookings"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Bookings & Dispatch Board">
                          <BookingsPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Bookings & Dispatch Board">
                          <BookingsPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 9.1: Airport & Executive Chauffeur Dispatch */}
                    <Route
                      path="/office/airport"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Airport & Executive Dispatch">
                          <AirportExecutivePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/airport"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Airport & Executive Dispatch">
                          <AirportExecutivePage />
                        </RoleGuard>
                      }
                    />

                    {/* School Transport & SEN: Owner, Controller, HR, PA */}
                    <Route
                      path="/office/schools"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'pa']} featureName="School Transport Module">
                          <SchoolTransportPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/schools"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'pa']} featureName="School Transport Module">
                          <SchoolTransportPage />
                        </RoleGuard>
                      }
                    />

                    {/* Fleet & Dual MOTs: Owner, Controller, Mechanic, HR */}
                    <Route
                      path="/office/fleet"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'mechanic', 'hr_vetting']} featureName="Fleet & MOT Management">
                          <FleetPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/fleet"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'mechanic', 'hr_vetting']} featureName="Fleet & MOT Management">
                          <FleetPage />
                        </RoleGuard>
                      }
                    />

                    {/* Daily Checks Builder: Owner, Controller, Mechanic */}
                    <Route
                      path="/office/checks"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'mechanic']} featureName="Daily Checks Builder">
                          <ChecksPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/checks"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'mechanic']} featureName="Daily Checks Builder">
                          <ChecksPage />
                        </RoleGuard>
                      }
                    />

                    {/* Defects & Workshop: Owner, Mechanic, Controller */}
                    <Route
                      path="/office/maintenance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'mechanic', 'controller']} featureName="Defects & Workshop Maintenance">
                          <MaintenancePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/maintenance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'mechanic', 'controller']} featureName="Defects & Workshop Maintenance">
                          <MaintenancePage />
                        </RoleGuard>
                      }
                    />

                    {/* Workforce (Drivers & PAs): Owner, Controller, HR */}
                    <Route
                      path="/office/workforce"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Workforce Staff Directory">
                          <WorkforcePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/workforce"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Workforce Staff Directory">
                          <WorkforcePage />
                        </RoleGuard>
                      }
                    />

                    {/* Compliance & DBS Assurance: Owner & HR (Full), Controller (Restricted DBS) */}
                    <Route
                      path="/office/compliance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="DVLA & DBS Assurance Portal">
                          <CompliancePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/compliance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="DVLA & DBS Assurance Portal">
                          <CompliancePage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 9.5: Auto-Dispatch Settings */}
                    <Route
                      path="/office/auto-dispatch"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Auto-Dispatch Engine & Settings">
                          <AutoDispatchSettingsPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 9.2: Tariffs & Pricing Engine: DEC Owner/Admin ONLY */}
                    <Route
                      path="/office/tariffs"
                      element={
                        <RoleGuard allowedRoles={['owner_admin']} featureName="Tariff & Pricing Engine">
                          <TariffsPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/tariffs"
                      element={
                        <RoleGuard allowedRoles={['owner_admin']} featureName="Tariff & Pricing Engine">
                          <TariffsPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 9.3: Finance, Invoicing & Settlements: Owner & Controller */}
                    <Route
                      path="/office/finance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Finance & Accounts">
                          <FinancePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/finance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Finance & Accounts">
                          <FinancePage />
                        </RoleGuard>
                      }
                    />

                    {/* Reports & Audits: Owner, Controller, HR, Mechanic */}
                    <Route
                      path="/office/reports"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']} featureName="Reports & Compliance Audits">
                          <ReportsPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']} featureName="Reports & Compliance Audits">
                          <ReportsPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 9.4: Office Extras & Operations (Templates, Lost Property, Complaints, Chat) */}
                    <Route
                      path="/office/operations"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Office Operations & Support">
                          <OfficeExtrasPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/office/extras"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Office Operations & Support">
                          <OfficeExtrasPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 10: Expenses, Accidents & Grey Fleet */}
                    <Route
                      path="/office/expenses-incidents"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Staff Expenses & Incidents">
                          <ExpensesIncidentsPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/office/expenses"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Staff Expenses & Incidents">
                          <ExpensesIncidentsPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 10: Reminder & Escalation Centre */}
                    <Route
                      path="/office/reminders"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']} featureName="Automated Reminder & Escalation Centre">
                          <ReminderCentrePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/reminders"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']} featureName="Automated Reminder & Escalation Centre">
                          <ReminderCentrePage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Safeguarding Cases Area (Restricted to Safeguarding Officers) */}
                    <Route
                      path="/office/safeguarding"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Safeguarding Cases Portal">
                          <SafeguardingPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/safeguarding"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Safeguarding Cases Portal">
                          <SafeguardingPage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Audit Log Viewer (Filtered & Sensitive Highlighted) */}
                    <Route
                      path="/office/audit-logs"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Security & Compliance Audit Logs">
                          <AuditLogPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/audit-logs"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Security & Compliance Audit Logs">
                          <AuditLogPage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Document Library & Policies (Retentions & Expiring Links) */}
                    <Route
                      path="/office/documents"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting', 'controller', 'mechanic']} featureName="Document Library & Policies">
                          <DocumentLibraryPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting', 'controller', 'mechanic']} featureName="Document Library & Policies">
                          <DocumentLibraryPage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Sub-Company Multi-Tenancy (Admin Only) */}
                    <Route
                      path="/office/sub-companies"
                      element={
                        <RoleGuard allowedRoles={['owner_admin']} featureName="Sub-Company Multi-Tenancy">
                          <SubCompaniesPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/sub-companies"
                      element={
                        <RoleGuard allowedRoles={['owner_admin']} featureName="Sub-Company Multi-Tenancy">
                          <SubCompaniesPage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Integrations Register (Status, Latency, Manual Verification) */}
                    <Route
                      path="/office/integrations"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Integrations & Telematics Register">
                          <IntegrationsPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/integrations"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Integrations & Telematics Register">
                          <IntegrationsPage />
                        </RoleGuard>
                      }
                    />

                    {/* PHASE 11: Roles Matrix & User Management (MFA & Session Revocation) */}
                    <Route
                      path="/office/roles-users"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Roles Matrix & User Management">
                          <RolesAndUsersPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/roles-users"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="Roles Matrix & User Management">
                          <RolesAndUsersPage />
                        </RoleGuard>
                      }
                    />

                    {/* Phase 13: Enhancements Hub (Bidding, Destination Mode, CarPlay, Split Payment, Passenger Privacy) */}
                    <Route
                      path="/office/enhancements"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa']} featureName="Phase 13 Enhancements Suite">
                          <EnhancementsHubPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/enhancements"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic', 'driver', 'pa']} featureName="Phase 13 Enhancements Suite">
                          <EnhancementsHubPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/carplay-cockpit"
                      element={
                        <RoleGuard allowedRoles={['driver', 'owner_admin', 'controller']} featureName="CarPlay Large Control Cockpit">
                          <DriverCarPlayCockpitPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/driver/carplay"
                      element={
                        <RoleGuard allowedRoles={['driver', 'owner_admin', 'controller']} featureName="CarPlay Large Control Cockpit">
                          <DriverCarPlayCockpitPage />
                        </RoleGuard>
                      }
                    />

                    {/* Mobile Staff App routes (Driver & PA Home) */}
                    <Route path="/app/home" element={<StaffAppHomeRouter />} />

                    <Route
                      path="/driver-cockpit"
                      element={
                        <RoleGuard allowedRoles={['driver', 'owner_admin', 'controller']} featureName="Driver Mobile Cockpit">
                          <DriverCockpitPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/app/driver"
                      element={
                        <RoleGuard allowedRoles={['driver', 'owner_admin', 'controller']} featureName="Driver Mobile Cockpit">
                          <DriverCockpitPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/app/driver-cockpit"
                      element={
                        <RoleGuard allowedRoles={['driver', 'owner_admin', 'controller']} featureName="Driver Mobile Cockpit">
                          <DriverCockpitPage />
                        </RoleGuard>
                      }
                    />

                    <Route
                      path="/pa-cockpit"
                      element={
                        <RoleGuard allowedRoles={['pa', 'owner_admin', 'controller']} featureName="Passenger Assistant Cockpit">
                          <PACockpitPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/app/pa"
                      element={
                        <RoleGuard allowedRoles={['pa', 'owner_admin', 'controller']} featureName="Passenger Assistant Cockpit">
                          <PACockpitPage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/app/pa-cockpit"
                      element={
                        <RoleGuard allowedRoles={['pa', 'owner_admin', 'controller']} featureName="Passenger Assistant Cockpit">
                          <PACockpitPage />
                        </RoleGuard>
                      }
                    />
                  </Route>

                  {/* Wildcard unknown routes -> 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </DataProvider>
          </CompanyProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
