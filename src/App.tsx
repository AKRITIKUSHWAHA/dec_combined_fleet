import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth, getRoleHomeRoute } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { CompanyProvider } from './context/CompanyContext';
import { DataProvider } from './context/DataContext';

import { AppLayout } from './components/layout/AppLayout';
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
import { DriverCockpitPage, PACockpitPage } from './pages/StaffCockpitPages';
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
                {/* Global Logout Confirmation Modal */}
                <LogoutConfirmModal />

                <Routes>
                  {/* Public Route: /login */}
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <LoginPage />
                      </PublicOnlyRoute>
                    }
                  />

                  {/* Root route: redirects based on auth & role */}
                  <Route path="/" element={<RootRedirect />} />

                  {/* 403 & 404 Dedicated Pages */}
                  <Route path="/403" element={<AccessDeniedPage />} />
                  <Route path="/unauthorised" element={<AccessDeniedPage />} />

                  {/* ALL Office & App Routes Wrapped in ProtectedRoute */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Office Dashboard (Admin/Controller/HR/Mechanic home) */}
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

                    {/* Compliance & DBS Assurance: Owner & HR ONLY */}
                    <Route
                      path="/office/compliance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="DVLA & DBS Assurance Portal">
                          <CompliancePage />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="/compliance"
                      element={
                        <RoleGuard allowedRoles={['owner_admin', 'hr_vetting']} featureName="DVLA & DBS Assurance Portal">
                          <CompliancePage />
                        </RoleGuard>
                      }
                    />

                    {/* Tariffs & Pricing Engine: DEC Owner/Admin ONLY */}
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

                    {/* Finance, Invoicing & Settlements: Owner & Controller */}
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
