import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, getRoleHomeRoute } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated user to /login and preserve requested path in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Wrong-role access goes to 403 page
    return (
      <Navigate 
        to="/403" 
        state={{ 
          from: location.pathname, 
          requiredRoles: allowedRoles,
          userRole: user.role 
        }} 
        replace 
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // If authenticated user visits public-only route like /login, redirect to their role home
    const homeRoute = getRoleHomeRoute(user.role);
    return <Navigate to={homeRoute} replace />;
  }

  return <>{children}</>;
};
