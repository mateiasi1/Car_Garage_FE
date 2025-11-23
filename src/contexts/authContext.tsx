import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthTokens } from '../models/AuthTokens';
import { User } from '../models/User';
import { useFetchUserProfileQuery, userApi } from '../rtk/services/user-service';
import { useLogoutMutation } from '../rtk/services/auth-service';

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

        dispatch(userApi.util.resetApiState());
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
