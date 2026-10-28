import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

export interface RoleConfig {
  id: UserRole;
  label: string;
  badgeColor: string;
  description: string;
  isMobileCockpit: boolean;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  owner_admin: {
    id: 'owner_admin',
    label: 'Owner / Head Office Admin',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'Full oversight, company creation, all reports, tariffs & audits.',
    isMobileCockpit: false
  },
  controller: {
    id: 'controller',
    label: 'Dispatcher / Controller',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'Live map, allocation, flight tracking. Restricted: No DBS or medical view.',
    isMobileCockpit: false
  },
  driver: {
    id: 'driver',
    label: 'Driver (Mobile Staff App)',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'En-route, Arrived, POB, Job Clear, Walkaround check, defect submission.',
    isMobileCockpit: true
  },
  pa: {
    id: 'pa',
    label: 'Passenger Assistant - PA',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'School runs, pupil attendance, and vehicle end-of-run safety sweep.',
    isMobileCockpit: true
  },
  mechanic: {
    id: 'mechanic',
    label: 'Mechanic / Garage Staff',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-300 dark:border-orange-800',
    description: 'Workshop portal, defect repair, parts/labour logging, vehicle release.',
    isMobileCockpit: false
  },
  hr_vetting: {
    id: 'hr_vetting',
    label: 'HR / Compliance / Vetting',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'DVLA licence checks, DBS Update Service, safeguarding cases & training.',
    isMobileCockpit: false
  }
};

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roleConfig: RoleConfig;
  canViewDBS: boolean;
  canViewSafeguarding: boolean;
  canReleaseVehicle: boolean;
  canManageTariffs: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('owner_admin');

  const roleConfig = ROLE_CONFIGS[currentRole];
  const canViewDBS = currentRole === 'owner_admin' || currentRole === 'hr_vetting';
  const canViewSafeguarding = currentRole === 'owner_admin' || currentRole === 'hr_vetting';
  const canReleaseVehicle = currentRole === 'owner_admin' || currentRole === 'mechanic';
  const canManageTariffs = currentRole === 'owner_admin';

  return (
    <RoleContext.Provider value={{
      currentRole,
      setCurrentRole,
      roleConfig,
      canViewDBS,
      canViewSafeguarding,
      canReleaseVehicle,
      canManageTariffs
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};

