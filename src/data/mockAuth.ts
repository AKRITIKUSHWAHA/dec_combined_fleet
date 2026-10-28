import { MockAccount, UserRole, AuthUser } from '../types';

export const MOCK_ACCOUNTS: Record<UserRole, MockAccount> = {
  owner_admin: {
    user: {
      id: 'USR-ADMIN-01',
      name: 'Arthur Pendelton',
      email: 'admin@decfleet.co.uk',
      role: 'owner_admin',
      department: 'Executive Operations / Head Office',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      requiresMfa: true,
      companyId: 'all'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'Owner / Head Office Admin',
    roleTitle: 'Director of Transport',
    category: 'office',
    targetPath: '/office/dashboard',
    description: 'Full oversight across all 4 councils, audits, tariffs, vehicle release & DBS visibility.'
  },
  controller: {
    user: {
      id: 'USR-CTRL-02',
      name: 'Sarah Jenkins',
      email: 'controller@decfleet.co.uk',
      role: 'controller',
      department: 'Central Dispatch Control',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      requiresMfa: false,
      companyId: 'sub-luton'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'Dispatcher / Controller',
    roleTitle: 'Senior Flight & School Controller',
    category: 'office',
    targetPath: '/office/dashboard',
    description: 'Live dispatch map, flight delay tracking, and school vehicle allocations.'
  },
  hr_vetting: {
    user: {
      id: 'USR-HR-03',
      name: 'Rachel Evans',
      email: 'hr@decfleet.co.uk',
      role: 'hr_vetting',
      department: 'HR, Safeguarding & Vetting',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      requiresMfa: true,
      companyId: 'all'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'HR / Compliance / Vetting',
    roleTitle: 'Head of Vetting & Compliance',
    category: 'office',
    targetPath: '/office/dashboard',
    description: 'DBS Update Service oversight, licence penalty points, training & safeguarding.'
  },
  mechanic: {
    user: {
      id: 'USR-MECH-04',
      name: 'Dave Miller',
      email: 'mechanic@decfleet.co.uk',
      role: 'mechanic',
      department: 'Fleet Workshop & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
      requiresMfa: false,
      companyId: 'all'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'Mechanic / Garage Staff',
    roleTitle: 'Chief Fleet Engineer',
    category: 'office',
    targetPath: '/office/dashboard',
    description: 'Workshop job cards, parts/labour logging, critical defect sign-off & VOR clearance.'
  },
  driver: {
    user: {
      id: 'USR-DRV-05',
      name: 'Tariq Mahmood',
      email: 'driver@decfleet.co.uk',
      role: 'driver',
      department: 'Transport Operations (Driver)',
      badgeNumber: 'LT-PHV-4091',
      assignedDepot: 'Luton Central Depot',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      requiresMfa: false,
      companyId: 'sub-luton'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'Driver (Mobile Staff App)',
    roleTitle: 'Executive & SEN Transport Driver',
    category: 'app',
    targetPath: '/app/home',
    description: 'Active job lifecycle (En-route, POB, Clear), daily walkarounds and defect reporting.'
  },
  pa: {
    user: {
      id: 'USR-PA-06',
      name: 'Elena Rostova',
      email: 'pa@decfleet.co.uk',
      role: 'pa',
      department: 'Passenger Assistance (SEN)',
      badgeNumber: 'CBC-PA-108',
      assignedDepot: 'Central Bedfordshire Depot',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      requiresMfa: false,
      companyId: 'sub-central-beds'
    },
    defaultPassword: 'Password123!',
    demoLabel: 'Passenger Assistant (PA)',
    roleTitle: 'Senior Passenger Assistant',
    category: 'app',
    targetPath: '/app/home',
    description: 'Pupil attendance check-in, special medical needs, and post-run vehicle sweep sign-off.'
  }
};

export const findMockAccountByEmail = (email: string): MockAccount | undefined => {
  const normalized = email.trim().toLowerCase();
  return Object.values(MOCK_ACCOUNTS).find(acc => acc.user.email.toLowerCase() === normalized);
};

export const isMfaRole = (role: UserRole): boolean => {
  return role === 'owner_admin' || role === 'hr_vetting';
};

export const getDefaultRedirectPath = (role: UserRole): string => {
  if (role === 'driver' || role === 'pa') {
    return '/app/home';
  }
  return '/office/dashboard';
};
