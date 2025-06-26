import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/authContext';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // If user is authenticated, render the element, otherwise redirect to login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
