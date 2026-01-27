import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { routes } from './constants/routes';
import { customerSession } from './utils/customerSession';

interface CustomerProtectedRouteProps {
  element: JSX.Element;
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ element }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = customerSession.get();
    setIsAuthenticated(!!session);
    setIsChecking(false);

    // Refresh session expiry on each page visit
    if (session) {
      customerSession.refresh();
    }
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.CUSTOMER_LOGIN} replace />;
  }

  return element;
};

export default CustomerProtectedRoute;
