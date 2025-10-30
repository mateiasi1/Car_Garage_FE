import { createContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthTokens } from '../models/AuthTokens';
import { User } from '../models/User';
import { useFetchUserProfileQuery, userApi } from '../rtk/services/user-service';

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

    const { data: user, error } = useFetchUserProfileQuery(undefined, {
        skip: !isAuthenticated || !authChecked,
    });

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('access_token'));
        setAuthChecked(true);

        if (localStorage.getItem('refresh_token')) {
            console.log('🧹 Removing old refresh_token from localStorage (now using httpOnly cookie)');
            localStorage.removeItem('refresh_token');
        }
    }, []);

    useEffect(() => {
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
            logout();
        }
    }, [error]);

    const login = ({ accessToken }: { accessToken: string }): void => {
        localStorage.setItem('access_token', accessToken);
        dispatch(userApi.util.invalidateTags(['User']));
        setIsAuthenticated(true);
    };

    const logout = (): void => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
    };

    const isLoading = !authChecked || (isAuthenticated && !user && !error);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading }}>{children}</AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };