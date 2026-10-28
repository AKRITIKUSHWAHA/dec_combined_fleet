import { UserRole } from './index';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  requiresMfa?: boolean;
  assignedDepot?: string;
  badgeNumber?: string;
  companyId?: string;
}

export interface MockAccount {
  user: AuthUser;
  defaultPassword: string;
  demoLabel: string;
  roleTitle: string;
  category: 'office' | 'app';
  targetPath: string;
  description: string;
}

export type OfflineDraftAction = 'sync' | 'keep' | 'discard';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberDevice: boolean;
}
