'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'agent' | 'admin' | 'client' | 'investor';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('lumina_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Keep auth state in sync across tabs and after manual storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lumina_user') {
        if (!e.newValue) {
          setUser(null);
        } else {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            setUser(null);
          }
        }
      }
    };
    const handleLogoutEvent = () => setUser(null);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        try {
          const current = localStorage.getItem('lumina_user');
          if (!current) {
            setUser(null);
          } else {
            try {
              setUser(JSON.parse(current));
            } catch {
              setUser(null);
            }
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lumina:logout', handleLogoutEvent as EventListener);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lumina:logout', handleLogoutEvent as EventListener);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app this would be actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine user role based on email
      let userRole: User['role'] = 'user';
      let userName = email.split('@')[0];
      
      // Special handling for demo accounts
      if (email === 'agent@lumina.ge') {
        userRole = 'agent';
        userName = 'Agent Demo';
      } else if (email === 'client@lumina.ge') {
        userRole = 'client';
        userName = 'Client Demo';
      } else if (email === 'investor@lumina.ge') {
        userRole = 'investor';
        userName = 'Investor Demo';
      } else if (email === 'admin@lumina.ge') {
        userRole = 'admin';
        userName = 'Admin Demo';
      }
      
      // Special handling for social logins
      if (email === 'google.user@gmail.com') {
        userName = 'Google User';
        userRole = 'user';
      } else if (email === 'facebook.user@facebook.com') {
        userName = 'Facebook User';
        userRole = 'user';
      }
      
      // Mock user data - in real app this would come from API
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: userName,
        role: userRole
      };
      
      setUser(mockUser);
      localStorage.setItem('lumina_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app this would be actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app this would come from API
      const mockUser: User = {
        id: '1',
        email: email,
        name: name,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('lumina_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('lumina_user');
      // Clear potential admin session leftovers
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      try { sessionStorage.removeItem('lumina_session'); } catch {}
    } catch {}
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lumina:logout'));
      }
    } catch {}
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 