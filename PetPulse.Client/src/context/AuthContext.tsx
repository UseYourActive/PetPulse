import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { extractUserFromToken, isTokenExpired } from '@/utils/jwt';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  ownerId: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  register: (userName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set API base URL
const API_BASE_URL = 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        console.warn('Token expired, clearing storage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      // Decode token to extract user info
      const tokenData = extractUserFromToken(storedToken);
      if (tokenData) {
        // Try to get additional info from stored user (like email, id)
        let userData: User;
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userData = {
              id: parsedUser.id || '',
              username: tokenData.username,
              email: parsedUser.email || '',
              role: tokenData.role,
              token: storedToken,
            };
          } catch {
            // Fallback if stored user is invalid
            userData = {
              id: '',
              username: tokenData.username,
              email: '',
              role: tokenData.role,
              token: storedToken,
            };
          }
        } else {
          userData = {
            id: '',
            username: tokenData.username,
            email: '',
            role: tokenData.role,
            token: storedToken,
          };
        }
        
        setUser(userData);
        // Set token in axios headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } else {
        // Invalid token, clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const loginRequest: LoginRequest = { username, password };
      const response = await apiClient.post<AuthResponse>('/api/Auth/login', loginRequest);
      
      // Decode token to verify and extract user info
      const tokenData = extractUserFromToken(response.data.token);
      if (!tokenData) {
        throw new Error('Invalid token received from server');
      }

      const userData: User = {
        id: response.data.ownerId,
        username: tokenData.username || response.data.username,
        email: response.data.email,
        role: tokenData.role || response.data.role,
        token: response.data.token,
      };

      setUser(userData);
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      }));
      localStorage.setItem('token', response.data.token);
      
      // Set token in axios headers for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const registerRequest: RegisterRequest = {
        username,
        email,
        password,
      };
      
      const response = await apiClient.post<AuthResponse>('/api/Auth/register', registerRequest);
      
      // Decode token to verify and extract user info
      const tokenData = extractUserFromToken(response.data.token);
      if (!tokenData) {
        throw new Error('Invalid token received from server');
      }

      const userData: User = {
        id: response.data.ownerId,
        username: tokenData.username || response.data.username,
        email: response.data.email,
        role: tokenData.role || response.data.role,
        token: response.data.token,
      };
      setUser(userData);
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      }));
      localStorage.setItem('token', response.data.token);
      
      // Set token in axios headers for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 * @returns Authentication context with user, login, logout, etc.
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
