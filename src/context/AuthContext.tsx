import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { authApi, tokenStorage, type User } from '@/services/api';

// ==========================================
// AUTH CONTEXT TYPE
// ==========================================

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ==========================================
// CREATE CONTEXT
// ==========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// AUTH PROVIDER COMPONENT
// ==========================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // INITIALIZE: Check if user is already logged in
  // ==========================================

  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = tokenStorage.get();

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token by fetching current user
        const { user: currentUser } = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        // Token is invalid, remove it
        tokenStorage.remove();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.login(email, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // REGISTER
  // ==========================================

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await authApi.register(email, password, name);
        setUser(response.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
