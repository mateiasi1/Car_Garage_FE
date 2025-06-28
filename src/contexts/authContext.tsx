import { createContext, ReactNode, useEffect, useState } from 'react';
import { AuthTokens } from '../models/AuthTokens';
import { useFetchUserProfileQuery } from '../rtk/services/user-service';

type AuthProviderProps = {
  children?: ReactNode;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [shouldFetchProfile, setShouldFetchProfile] = useState<boolean>(!!localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

  const { data, isFetching, isUninitialized } = useFetchUserProfileQuery(undefined, {
    skip: !shouldFetchProfile,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setIsAuthenticated(true);
      setHasCheckedAuth(true);
    } else if (!isFetching && !isUninitialized) {
      setUser(null);
      setIsAuthenticated(false);
      setHasCheckedAuth(true);
    }
  }, [data, isFetching, isUninitialized]);

  const isLoading = !hasCheckedAuth;

  const login = ({ accessToken, refreshToken }: AuthTokens): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
    setShouldFetchProfile(true);
    setHasCheckedAuth(false);
  };

  const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    setShouldFetchProfile(false);
    setHasCheckedAuth(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
