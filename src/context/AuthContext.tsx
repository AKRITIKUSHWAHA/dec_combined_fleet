import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, OfflineDraftAction, UserRole } from '../types';
import { MOCK_ACCOUNTS, findMockAccountByEmail, getDefaultRedirectPath } from '../data/mockAuth';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpired: boolean;
  isLogoutDialogOpen: boolean;
  offlineDraftsCount: number;
  logoutMessage: string | null;
  rememberDevice: boolean;
  isOnline: boolean;
  lastSyncTime: string;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; targetPath?: string }>;
  logout: (offlineAction?: OfflineDraftAction) => Promise<void>;
  openLogoutDialog: () => void;
  closeLogoutDialog: () => void;
  triggerSessionExpired: () => void;
  reauthenticateSession: (password: string) => Promise<{ success: boolean; error?: string }>;
  syncOfflineDrafts: () => Promise<void>;
  discardOfflineDrafts: () => void;
  toggleOnlineStatus: () => void;
  setRememberDevice: (remember: boolean) => void;
  clearLogoutMessage: () => void;
  switchRoleQuick: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'dec_fleet_auth_user';
const REMEMBER_KEY = 'dec_fleet_remember_device';
const OFFLINE_DRAFTS_KEY = 'dec_fleet_offline_drafts_count';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remember device is OFF by default as per requirement
  const [rememberDevice, setRememberDevice] = useState<boolean>(() => {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    // Default to owner_admin for initial demo load if nothing stored
    return MOCK_ACCOUNTS.owner_admin.user;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  // Network connectivity simulator for Driver/PA field apps
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:35:10');

  // For driver and PA roles, mock unsent offline drafts (e.g., vehicle walkaround draft, SEN student rollcall draft)
  const [offlineDraftsCount, setOfflineDraftsCount] = useState<number>(() => {
    const saved = localStorage.getItem(OFFLINE_DRAFTS_KEY);
    return saved !== null ? parseInt(saved, 10) : 2;
  });

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
  };

  // Keep offline drafts count updated
  useEffect(() => {
    localStorage.setItem(OFFLINE_DRAFTS_KEY, offlineDraftsCount.toString());
  }, [offlineDraftsCount]);

  // Persist or clean storage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (rememberDevice) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        localStorage.setItem(REMEMBER_KEY, 'true');
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(REMEMBER_KEY);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser, rememberDevice]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; targetPath?: string }> => {
    setIsLoading(true);
    setLogoutMessage(null);

    // Realistic API network delay
    await new Promise(res => setTimeout(res, 550));

    const account = findMockAccountByEmail(credentials.email);

    if (!account) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No DEC Fleet account registered with this email address. Please check your credentials or pick a demo role account.'
      };
    }

    if (credentials.password !== account.defaultPassword && credentials.password !== 'Password123!') {
      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid password. Please ensure correct casing or reset your credentials.'
      };
    }

    // Set user
    setCurrentUser(account.user);
    setRememberDevice(credentials.rememberDevice);
    setIsSessionExpired(false);
    setIsLoading(false);

    // If driver or pa, reset default drafts for demo demonstration
    if (account.user.role === 'driver' || account.user.role === 'pa') {
      setOfflineDraftsCount(2);
    }

    return {
      success: true,
      targetPath: getDefaultRedirectPath(account.user.role)
    };
  };

  const syncOfflineDrafts = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate sync
    await new Promise(res => setTimeout(res, 900));
    setOfflineDraftsCount(0);
    localStorage.setItem(OFFLINE_DRAFTS_KEY, '0');
    setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsLoading(false);
  };


  const discardOfflineDrafts = (): void => {
    setOfflineDraftsCount(0);
    localStorage.setItem(OFFLINE_DRAFTS_KEY, '0');
  };

  const logout = async (offlineAction?: OfflineDraftAction): Promise<void> => {
    if (offlineAction === 'sync') {
      await syncOfflineDrafts();
    } else if (offlineAction === 'discard') {
      discardOfflineDrafts();
    }
    // If 'keep', we leave offlineDraftsCount untouched for next session

    // Shared device security: wipe state completely
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setIsLogoutDialogOpen(false);
    setIsSessionExpired(false);
    
    // Set banner message for login screen
    setLogoutMessage('You have been signed out.');
  };

  const reauthenticateSession = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));

    if (password === 'Password123!' || (currentUser && password.length >= 6)) {
      setIsSessionExpired(false);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Incorrect password for current session' };
  };

  const triggerSessionExpired = () => {
    setIsSessionExpired(true);
  };

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const clearLogoutMessage = () => {
    setLogoutMessage(null);
  };

  const switchRoleQuick = (role: UserRole) => {
    const acc = MOCK_ACCOUNTS[role];
    if (acc) {
      setCurrentUser(acc.user);
      if (role === 'driver' || role === 'pa') {
        setOfflineDraftsCount(2);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        isSessionExpired,
        isLogoutDialogOpen,
        offlineDraftsCount,
        logoutMessage,
        rememberDevice,
        isOnline,
        lastSyncTime,
        login,
        logout,
        openLogoutDialog,
        closeLogoutDialog,
        triggerSessionExpired,
        reauthenticateSession,
        syncOfflineDrafts,
        discardOfflineDrafts,
        toggleOnlineStatus,
        setRememberDevice,
        clearLogoutMessage,
        switchRoleQuick
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
