import { createContext, useState, ReactNode } from 'react';

// Define the props type for AuthProvider
type AuthProviderProps = {
  children?: ReactNode;
}

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Create the AuthProvider component
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Implement your login logic here
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Implement your logout logic here
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the AuthContext and AuthProvider
export { AuthContext, AuthProvider };
