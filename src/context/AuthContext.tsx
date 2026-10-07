import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BakerUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: BakerUser | null;
  login: (token: string, user: BakerUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BakerUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('sweet_crumbs_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);

  const login = (token: string, userData: BakerUser) => {
    setUser(userData);
    sessionStorage.setItem('sweet_crumbs_token', token);
    sessionStorage.setItem('sweet_crumbs_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('sweet_crumbs_token');
    sessionStorage.removeItem('sweet_crumbs_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
