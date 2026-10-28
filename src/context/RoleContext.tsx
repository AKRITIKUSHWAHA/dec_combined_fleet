import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { useAuth } from './AuthContext';

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
    badgeColor: 'bg-[#B6F23C]/15 text-[#08201C] dark:text-[#B6F23C] border-[#B6F23C]/40',
    description: 'Full oversight, company creation, all reports, tariffs & audits.',
    isMobileCockpit: false
  },
  controller: {
    id: 'controller',
    label: 'Dispatcher / Controller',
    badgeColor: 'bg-[#3FE0C5]/15 text-[#0B2B26] dark:text-[#3FE0C5] border-[#3FE0C5]/40',
    description: 'Live map, allocation, flight tracking. Restricted: No DBS or medical view.',
    isMobileCockpit: false
  },
  driver: {
    id: 'driver',
    label: 'Driver (Mobile Staff App)',
    badgeColor: 'bg-[#34D399]/15 text-[#065F46] dark:text-[#34D399] border-[#34D399]/40',
    description: 'En-route, Arrived, POB, Job Clear, Walkaround check, defect submission.',
    isMobileCockpit: true
  },
  pa: {
    id: 'pa',
    label: 'Passenger Assistant - PA',
    badgeColor: 'bg-[#FF9F6B]/15 text-[#9A3412] dark:text-[#FF9F6B] border-[#FF9F6B]/40',
    description: 'School runs, pupil attendance, and vehicle end-of-run safety sweep.',
    isMobileCockpit: true
  },
  mechanic: {
    id: 'mechanic',
    label: 'Mechanic / Garage Staff',
    badgeColor: 'bg-[#FFC24B]/15 text-[#92400E] dark:text-[#FFC24B] border-[#FFC24B]/40',
    description: 'Workshop portal, defect repair, parts/labour logging, vehicle release.',
    isMobileCockpit: false
  },
  hr_vetting: {
    id: 'hr_vetting',
    label: 'HR / Compliance / Vetting',
    badgeColor: 'bg-[#8B9CFF]/15 text-[#3730A3] dark:text-[#8B9CFF] border-[#8B9CFF]/40',
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
  const { role: authRole } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>(authRole || 'owner_admin');

  // Sync with auth role changes (e.g. upon login or account switch)
  useEffect(() => {
    if (authRole) {
      setCurrentRole(authRole);
    }
  }, [authRole]);

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
