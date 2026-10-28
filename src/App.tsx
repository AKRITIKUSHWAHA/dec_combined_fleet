import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { CompanyProvider } from './context/CompanyContext';
import { DataProvider } from './context/DataContext';

import { OfficeLayout } from './components/layout/OfficeLayout';
import { StaffAppLayout } from './components/layout/StaffAppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionExpiredModal } from './components/auth/SessionExpiredModal';
import { LogoutDialog } from './components/auth/LogoutDialog';

import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UnauthorisedPage } from './pages/UnauthorisedPage';
import { StaffAppHomePage } from './pages/StaffAppHomePage';
import { 
  StaffChecksPage, 
  StaffDefectsPage, 
  StaffPupilsPage, 
  StaffSweepPage, 
  StaffSyncPage 
} from './pages/StaffExtraPages';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { FleetPage } from './pages/FleetPage';
import { ChecksPage } from './pages/ChecksPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { WorkforcePage } from './pages/WorkforcePage';
import { 
  CompliancePage, 
  SchoolTransportPage, 
  TariffsPage, 
  FinancePage 
} from './pages/PlaceholderPages';
import { DriverCockpitPage, PACockpitPage } from './pages/StaffCockpitPages';

import { getDefaultRedirectPath } from './data/mockAuth';

function RootRedirect() {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getDefaultRedirectPath(currentUser.role)} replace />;
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <CompanyProvider>
            <DataProvider>
              <BrowserRouter>
                {/* Global Modals */}
                <SessionExpiredModal />
                <LogoutDialog />

                <Routes>
                  {/* Public Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  
                  {/* Smart Root Redirect by Role */}
                  <Route path="/" element={<RootRedirect />} />

                  {/* =========================================================
                      1. OFFICE DISPATCH SHELL (/office/*)
                      ========================================================= */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <OfficeLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* 403 Unauthorised View within Office Shell */}
                    <Route path="/unauthorised" element={<UnauthorisedPage />} />

                    <Route 
                      path="/office/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']}>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/live-map" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller']}>
                          <LiveMapPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/bookings" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller']}>
                          <BookingsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/schools" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'hr_vetting']}>
                          <SchoolTransportPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/fleet" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'mechanic', 'hr_vetting']}>
                          <FleetPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/checks" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'mechanic']}>
                          <ChecksPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/maintenance" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'mechanic']}>
                          <MaintenancePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/workforce" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller', 'hr_vetting']}>
                          <WorkforcePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/compliance" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'hr_vetting']}>
                          <CompliancePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/tariffs" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin']}>
                          <TariffsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/office/finance" 
                      element={
                        <ProtectedRoute allowedRoles={['owner_admin', 'controller']}>
                          <FinancePage />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* =========================================================
                      2. DRIVER & PA STAFF APP SHELL (/app/*)
                      ========================================================= */}
                  <Route
                    element={
                      <ProtectedRoute allowedRoles={['driver', 'pa', 'owner_admin']}>
                        <StaffAppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/app/home" element={<StaffAppHomePage />} />
                    <Route path="/app/driver-cockpit" element={<DriverCockpitPage />} />
                    <Route path="/app/pa-cockpit" element={<PACockpitPage />} />
                    <Route path="/app/checks" element={<StaffChecksPage />} />
                    <Route path="/app/defects" element={<StaffDefectsPage />} />
                    <Route path="/app/pupils" element={<StaffPupilsPage />} />
                    <Route path="/app/sweep" element={<StaffSweepPage />} />
                    <Route path="/app/sync" element={<StaffSyncPage />} />
                  </Route>

                  {/* Convenient Legacy Aliases */}
                  <Route path="/live-map" element={<Navigate to="/office/live-map" replace />} />
                  <Route path="/bookings" element={<Navigate to="/office/bookings" replace />} />
                  <Route path="/schools" element={<Navigate to="/office/schools" replace />} />
                  <Route path="/fleet" element={<Navigate to="/office/fleet" replace />} />
                  <Route path="/checks" element={<Navigate to="/office/checks" replace />} />
                  <Route path="/maintenance" element={<Navigate to="/office/maintenance" replace />} />
                  <Route path="/workforce" element={<Navigate to="/office/workforce" replace />} />
                  <Route path="/compliance" element={<Navigate to="/office/compliance" replace />} />
                  <Route path="/tariffs" element={<Navigate to="/office/tariffs" replace />} />
                  <Route path="/finance" element={<Navigate to="/office/finance" replace />} />
                  <Route path="/driver-cockpit" element={<Navigate to="/app/driver-cockpit" replace />} />
                  <Route path="/pa-cockpit" element={<Navigate to="/app/pa-cockpit" replace />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
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
