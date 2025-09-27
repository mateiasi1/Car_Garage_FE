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
    // optional: show spinner instead
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !hasAccess(user.roles)) {
    // optional: change this to a <Navigate to="/forbidden" /> or something similar
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
