// Authentication Types for Lumina Estate

export type UserRole = 'guest' | 'client' | 'agent' | 'investor' | 'admin';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  lastLogin: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Role-Based Access Control Matrix
export const RBAC_MATRIX = {
  guest: {
    properties: ['read'],
    agents: ['read']
  },
  client: {
    properties: ['read'],
    agents: ['read', 'contact'],
    favorites: ['create', 'read', 'delete'],
    appointments: ['create', 'read', 'update']
  },
  agent: {
    properties: ['create', 'read', 'update', 'delete'],
    clients: ['create', 'read', 'update'],
    analytics: ['read'],
    dashboard: ['read'],
    appointments: ['create', 'read', 'update', 'delete']
  },
  investor: {
    properties: ['read'],
    analytics: ['read'],
    reports: ['read'],
    portfolio: ['create', 'read', 'update']
  },
  admin: {
    '*': ['*'] // Full access
  }
} as const; 