import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, AuthUser, MockAccount, OfflineDraftAction } from '../types';
import { MOCK_ACCOUNTS, findMockAccountByEmail, getDefaultRedirectPath, isMfaRole } from '../data/mockAuth';

export interface AuthSessionData {
  user: AuthUser;
  token: string;
  loginTime: string;
}

export const getRoleHomeRoute = (role: UserRole): string => {
  return getDefaultRedirectPath(role);
};

export const DEMO_ACCOUNTS = MOCK_ACCOUNTS;

interface AuthContextType {
  // Required core properties
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (
    email: string, 
    pass: string, 
    roleHint?: UserRole, 
    mfaCode?: string
  ) => Promise<{ success: boolean; error?: string; requiresMfa?: boolean }>;
  logout: (draftAction?: OfflineDraftAction) => Promise<void> | void;
  requestLogout: (hasUnsentWork?: boolean) => void;
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  hasUnsentWorkWarning: boolean;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;

  // Backwards compatibility & staff app extensions
  currentUser: AuthUser | null;
  isLogoutDialogOpen: boolean;
  openLogoutDialog: () => void;
  closeLogoutDialog: () => void;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  lastSyncTime: string;
  syncOfflineDrafts: () => Promise<void>;
  offlineDraftsCount: number;
  isLoading: boolean;
  isSessionExpired: boolean;
  reauthenticateSession: (password?: string) => Promise<{ success: boolean; error?: string }>;
  switchRoleQuick: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SESSION_STORAGE_KEY = 'dec_session';
const OFFLINE_DRAFTS_KEY = 'dec_offline_drafts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialise user session strictly from localStorage ("dec_session")
  // If there is no session on first load, isAuthenticated = false.
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed: AuthSessionData = JSON.parse(stored);
        if (parsed && parsed.user && parsed.user.role) {
          return parsed.user;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored session:', e);
    }
    return null;
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasUnsentWorkWarning, setHasUnsentWorkWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Field Staff Offline / Sync states
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineDraftsCount, setOfflineDraftsCount] = useState<number>(() => {
    try {
      const drafts = localStorage.getItem(OFFLINE_DRAFTS_KEY);
      return drafts ? JSON.parse(drafts).length : 2; // Default 2 simulated drafts for driver/PA demo
    } catch {
      return 2;
    }
  });
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:32:05');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAuthenticated = Boolean(user);
  const role = user ? user.role : null;

  // Auto-dismiss toast notifications after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Login handler
  const login = async (
    email: string,
    pass: string,
    roleHint?: UserRole,
    mfaCode?: string
  ): Promise<{ success: boolean; error?: string; requiresMfa?: boolean }> => {
    setIsLoading(true);
    // Realistic short delay for feedback
    await new Promise((r) => setTimeout(r, 450));

    const trimmed = email.trim().toLowerCase();

    // 1. Find account by email match or fallback to roleHint or demo map
    let matchedAccount: MockAccount | undefined = findMockAccountByEmail(trimmed);

    if (!matchedAccount && roleHint && MOCK_ACCOUNTS[roleHint]) {
      matchedAccount = MOCK_ACCOUNTS[roleHint];
    }

    // Also support @decgroup.co.uk alias
    if (!matchedAccount) {
      const prefix = trimmed.split('@')[0];
      matchedAccount = Object.values(MOCK_ACCOUNTS).find((acc) => {
        const accPrefix = acc.user.email.split('@')[0];
        return accPrefix === prefix;
      });
    }

    if (!matchedAccount) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Unrecognised staff email address. Please select a demo persona or verify your details.'
      };
    }

    if (pass.trim().length < 4) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Password must be at least 4 characters.'
      };
    }

    // MFA Check for Admin and HR
    if (isMfaRole(matchedAccount.user.role)) {
      if (!mfaCode || mfaCode.trim().length < 6) {
        setIsLoading(false);
        return {
          success: false,
          requiresMfa: true,
          error: 'Please enter the 6-digit MFA security code sent to your authorized mobile terminal.'
        };
      }
    }

    // Save session in localStorage with key "dec_session"
    const sessionData: AuthSessionData = {
      user: matchedAccount.user,
      token: `dec_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    setUser(matchedAccount.user);
    setIsLoading(false);
    setToastMessage(`Welcome back, ${matchedAccount.user.name}`);

    return { success: true };
  };

  // Logout request modal trigger
  const requestLogout = useCallback((hasUnsentWork?: boolean) => {
    // If hasUnsentWork is not explicitly passed, determine from current role & pending drafts
    const isField = user?.role === 'driver' || user?.role === 'pa';
    const warning = typeof hasUnsentWork === 'boolean' ? hasUnsentWork : (isField && offlineDraftsCount > 0);
    setHasUnsentWorkWarning(warning);
    setShowLogoutModal(true);
  }, [user, offlineDraftsCount]);

  // Confirm logout
  const logout = useCallback((draftAction?: OfflineDraftAction) => {
    // Handle offline draft decisions
    if (draftAction === 'discard') {
      localStorage.removeItem(OFFLINE_DRAFTS_KEY);
      setOfflineDraftsCount(0);
    } else if (draftAction === 'sync') {
      // Simulate sync
      setOfflineDraftsCount(0);
    }
    // 'keep' retains the offline items in local storage

    // Clear session from localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setShowLogoutModal(false);
    setHasUnsentWorkWarning(false);

    // Show toast "You have been signed out"
    setToastMessage('You have been signed out');
  }, []);

  // Offline / sync simulator helpers
  const toggleOnlineStatus = () => {
    setIsOnline((prev) => {
      const next = !prev;
      setToastMessage(next ? 'Network restored. Reconnected to Central Dispatch.' : 'Network offline. Using device local cache.');
      return next;
    });
  };

  const syncOfflineDrafts = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setOfflineDraftsCount(0);
    const now = new Date();
    setLastSyncTime(now.toTimeString().split(' ')[0]);
    setIsLoading(false);
    setToastMessage('All offline records synchronized successfully with Central Dispatch.');
  };

  const switchRoleQuick = (newRole: UserRole) => {
    const acc = MOCK_ACCOUNTS[newRole];
    if (acc) {
      const sessionData: AuthSessionData = {
        user: acc.user,
        token: `dec_jwt_${Date.now()}_quick`,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setUser(acc.user);
      setToastMessage(`Active persona switched to ${acc.demoLabel}`);
    }
  };

  const reauthenticateSession = async (pass?: string): Promise<{ success: boolean; error?: string }> => {
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        role,
        isAuthenticated,
        login,
        logout,
        requestLogout,
        openLogoutDialog: () => requestLogout(),
        closeLogoutDialog: () => setShowLogoutModal(false),
        showLogoutModal,
        setShowLogoutModal,
        isLogoutDialogOpen: showLogoutModal,
        hasUnsentWorkWarning,
        toastMessage,
        setToastMessage,
        isOnline,
        toggleOnlineStatus,
        lastSyncTime,
        syncOfflineDrafts,
        offlineDraftsCount,
        isLoading,
        isSessionExpired: false,
        reauthenticateSession,
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
