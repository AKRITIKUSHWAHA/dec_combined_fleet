import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { CompanyProvider } from './context/CompanyContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { 
  LiveMapPage, 
  BookingsPage, 
  FleetPage, 
  ChecksPage, 
  MaintenancePage, 
  WorkforcePage, 
  CompliancePage, 
  SchoolTransportPage, 
  TariffsPage, 
  FinancePage 
} from './pages/PlaceholderPages';
import { DriverCockpitPage, PACockpitPage } from './pages/StaffCockpitPages';

export function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <CompanyProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/live-map" element={<LiveMapPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/schools" element={<SchoolTransportPage />} />
                  <Route path="/fleet" element={<FleetPage />} />
                  <Route path="/checks" element={<ChecksPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/workforce" element={<WorkforcePage />} />
                  <Route path="/compliance" element={<CompliancePage />} />
                  <Route path="/tariffs" element={<TariffsPage />} />
                  <Route path="/finance" element={<FinancePage />} />
                  
                  {/* Dedicated Staff App Cockpit routes */}
                  <Route path="/driver-cockpit" element={<DriverCockpitPage />} />
                  <Route path="/pa-cockpit" element={<PACockpitPage />} />
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
