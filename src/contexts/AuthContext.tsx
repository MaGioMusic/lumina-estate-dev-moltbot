'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// User role type matching the database schema
export type UserRole = 'USER' | 'AGENT' | 'ADMIN' | 'CLIENT' | 'INVESTOR';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider using NextAuth.js session
 * 
 * SECURITY: All authentication is handled server-side via NextAuth.
 * No localStorage or client-side storage is used for auth state.
 * JWT tokens are stored in HTTP-only cookies.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Map NextAuth session to our User type
  const user: User | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    role: session.user.accountRole || 'USER',
  } : null;

  const isAuthenticated = !!session && status === 'authenticated';

  useEffect(() => {
    // Auth status is determined by NextAuth session
    setIsLoading(status === 'loading');
  }, [status]);

  /**
   * Login using NextAuth credentials provider
   * SECURITY: Credentials are sent to the server, not stored client-side
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        return { 
          success: false, 
          error: 'Invalid email or password. Please try again.' 
        };
      }

      if (result?.ok) {
        // Refresh the page to get the new session
        router.refresh();
        return { success: true };
      }

      return { 
        success: false, 
        error: 'Authentication failed. Please try again.' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   * SECURITY: Registration is handled via API route
   */
  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password, 
          name 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Registration failed. Please try again.' 
        };
      }

      // Auto-login after successful registration
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred during registration.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   * SECURITY: Server-side session is destroyed via NextAuth
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.refresh();
    } catch (error) {
      // Silently handle logout errors - user will be redirected anyway
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
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
