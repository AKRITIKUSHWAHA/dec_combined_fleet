import React from 'react';
import { useRole } from '../../context/RoleContext';
import { UserRole } from '../../types';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  featureName?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, featureName }) => {
  const { currentRole } = useRole();
  const location = useLocation();

  if (!allowedRoles.includes(currentRole)) {
    return (
      <Navigate 
        to="/403" 
        state={{ 
          from: location.pathname, 
          requiredRoles: allowedRoles,
          featureName 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
