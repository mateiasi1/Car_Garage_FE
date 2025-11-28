import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthTokens } from '../models/AuthTokens';
import { User } from '../models/User';
import { useFetchUserProfileQuery, userApi } from '../rtk/services/user-service';
import { useLogoutMutation } from '../rtk/services/auth-service';
import { inspectionsApi } from '../rtk/services/inspections-service';
import { adminApi } from '../rtk/services/admin-service';
import { branchApi } from '../rtk/services/branch-service';
import { companyApi } from '../rtk/services/company-service';
import { customerApi } from '../rtk/services/customer-service';
import { inspectorApi } from '../rtk/services/inspector-service';
import { discountApi } from '../rtk/services/discount-service';

type AuthProviderProps = {
  children?: ReactNode;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | undefined;
  isLoading: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: undefined,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const [logoutMutation] = useLogoutMutation();

  const { data: user, error } = useFetchUserProfileQuery(undefined, {
    skip: !isAuthenticated || !authChecked,
  });

  const logout = useCallback((): void => {
    void logoutMutation()
      .unwrap()
      .catch((err) => {
        console.error('Logout request failed', err);
      })
      .finally(() => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);

        // Reset all API caches on logout
        dispatch(userApi.util.resetApiState());
        dispatch(inspectionsApi.util.resetApiState());
        dispatch(adminApi.util.resetApiState());
        dispatch(branchApi.util.resetApiState());
        dispatch(companyApi.util.resetApiState());
        dispatch(customerApi.util.resetApiState());
        dispatch(inspectorApi.util.resetApiState());
        dispatch(discountApi.util.resetApiState());
      });
  }, [dispatch, logoutMutation]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
    setAuthChecked(true);

    if (localStorage.getItem('refresh_token')) {
      localStorage.removeItem('refresh_token');
    }
  }, []);

  useEffect(() => {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      logout();
    }
  }, [error, logout]);

  const login = ({ accessToken }: { accessToken: string }): void => {
    localStorage.setItem('access_token', accessToken);
    dispatch(userApi.util.invalidateTags(['User']));
    setIsAuthenticated(true);
  };

  const isLoading = !authChecked || (isAuthenticated && !user && !error);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
