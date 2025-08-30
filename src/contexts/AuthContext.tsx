'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();

  // Verificar se está na página de login
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    try {
      const token = localStorage.getItem('fishnet_token');
      const savedUser = localStorage.getItem('fishnet_user');
      
      if (token && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('fishnet_token');
      localStorage.removeItem('fishnet_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular uma chamada de API
      // Em produção, você faria uma chamada real para sua API
      if (email && password) {
        const mockUser = {
          id: 1,
          email,
          name: 'Usuário FishNet',
          role: 'admin'
        };

        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Salvar no localStorage
        localStorage.setItem('fishnet_token', 'mock_token_123');
        localStorage.setItem('fishnet_user', JSON.stringify(mockUser));

        setIsAuthenticated(true);
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('fishnet_token');
    localStorage.removeItem('fishnet_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
