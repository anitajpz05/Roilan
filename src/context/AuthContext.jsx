import { createContext, useState, useEffect } from 'react';
import { db } from '../db/db';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('authSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setUser(sessionData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authSession');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const usuario = await db.usuarios.where('email').equals(email).first();
      
      if (!usuario || usuario.password !== password) {
        throw new Error('Credenciales inválidas');
      }

      const userData = {
        id: usuario.id,
        email: usuario.email
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authSession', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authSession');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
