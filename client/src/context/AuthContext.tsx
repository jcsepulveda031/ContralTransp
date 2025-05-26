import React, { createContext, useContext, useState, useEffect } from 'react';

import { User,AuthContextType } from '../types/types';
import { useNotification } from './NotificationContext';


const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // Nuevo estado
  const { showNotification } = useNotification();

  const checkTokenExpiration = (): boolean => {
    if (!tokenExpiration) return true;
    return tokenExpiration < Math.floor(Date.now() / 1000);
  };

  const startLogoutTimer = (expiresInSeconds: number) => {
    if (logoutTimer) clearTimeout(logoutTimer);
    setLogoutTimer(
      setTimeout(() => {
        showNotification('error', 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        logout();
      }, expiresInSeconds * 1000)
    );
  };
  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const storedExpiration = localStorage.getItem('tokenExpiration');

      if (!token || !userData || !storedExpiration) {
        setIsInitializing(false);
        return;
      }

      try {
        const expiration = parseInt(storedExpiration);
        const user = JSON.parse(userData);

        if (expiration < Math.floor(Date.now() / 1000)) {
          setIsInitializing(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(user);
        setTokenExpiration(expiration);
        startLogoutTimer(expiration - Math.floor(Date.now() / 1000));
      } catch (error) {
        console.error('Error verifying auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    verifyAuth();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);
  const login = (token: string, user: User, expiresIn: number) => {
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    
    setIsAuthenticated(true);
    setUser(user);
    setTokenExpiration(expirationTime);
    startLogoutTimer(expiresIn);
  };

  const logout = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    setIsAuthenticated(false);
    setUser(null);
    setTokenExpiration(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      checkTokenExpiration,
      
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

  


