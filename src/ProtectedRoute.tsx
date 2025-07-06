import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/authContext';
import { Role } from './models/Role';

interface ProtectedRouteProps {
  element: JSX.Element;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  const hasAccess = (userRoles: Role[]) => {
    return userRoles.some((role) => roles.includes(role.name));
  };

  if (isLoading) {
    // we can add a loading spinner or something here
    return null;
  }

  if (!user || !hasAccess(user.roles)) {
    return null;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
