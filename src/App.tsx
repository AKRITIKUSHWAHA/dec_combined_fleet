import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { CompanyProvider } from './context/CompanyContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';
import { RoleGuard } from './components/common/RoleGuard';

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
import { DriverCockpitPage, PACockpitPage } from './pages/StaffCockpitPages';
import { DesignSystemPage } from './pages/DesignSystemPage';

export function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <CompanyProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  {/* Dashboard: All roles allowed (data is tailored to role) */}
                  <Route path="/" element={<DashboardPage />} />

                  {/* Design System Specimen (Night Road) */}
                  <Route path="/design-system" element={<DesignSystemPage />} />

                  {/* Live Dispatch Map: Controller & Owner */}
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
                    path="/bookings" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin', 'controller']} featureName="Bookings & Dispatch Board">
                        <BookingsPage />
                      </RoleGuard>
                    } 
                  />

                  {/* School Transport & SEN: Owner, Controller, HR, PA */}
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
                    path="/fleet" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin', 'controller', 'mechanic', 'hr_vetting']} featureName="Fleet & MOT Management">
                        <FleetPage />
                      </RoleGuard>
                    } 
                  />

                  {/* Daily Checks Builder: Owner, Controller, Mechanic */}
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
                    path="/maintenance" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin', 'mechanic', 'controller']} featureName="Defects & Workshop Maintenance">
                        <MaintenancePage />
                      </RoleGuard>
                    } 
                  />

                  {/* Workforce (Drivers & PAs): Owner, Controller, HR */}
                  <Route 
                    path="/workforce" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting']} featureName="Workforce Staff Directory">
                        <WorkforcePage />
                      </RoleGuard>
                    } 
                  />

                  {/* Compliance & DBS Assurance: Owner & HR ONLY (Restricted from Controller!) */}
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
                    path="/tariffs" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin']} featureName="Tariff & Pricing Engine">
                        <TariffsPage />
                      </RoleGuard>
                    } 
                  />

                  {/* Finance, Invoicing & Settlements: Owner & Controller */}
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
                    path="/reports" 
                    element={
                      <RoleGuard allowedRoles={['owner_admin', 'controller', 'hr_vetting', 'mechanic']} featureName="Reports & Compliance Audits">
                        <ReportsPage />
                      </RoleGuard>
                    } 
                  />
                  
                  {/* Dedicated Staff App Cockpit routes */}
                  <Route 
                    path="/driver-cockpit" 
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
                </Route>
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </CompanyProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
