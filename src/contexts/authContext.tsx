import { createContext, ReactNode, useEffect, useState } from 'react';
import { AuthTokens } from '../models/AuthTokens';
import { useFetchUserProfileQuery } from '../rtk/services/user-service';
import { User } from '../models/User';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const { data: user } = useFetchUserProfileQuery(undefined, {
    skip: !isAuthenticated || !authChecked,
  });

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
    setAuthChecked(true);
  }, []);

  const login = ({ accessToken, refreshToken }: AuthTokens): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading: !authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
