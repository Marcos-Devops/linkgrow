import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('@LinkGrow:token');
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('http://localhost:5000/api/auth/me');
          
          if (response.data.status === 'success') {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('@LinkGrow:token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          localStorage.removeItem('@LinkGrow:token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        localStorage.setItem('@LinkGrow:token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
      } else {
        throw new Error(response.data.message || 'Falha na autenticação');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Falha na autenticação');
      } else {
        throw new Error('Erro ao conectar com o servidor');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('@LinkGrow:token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        localStorage.setItem('@LinkGrow:token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
      } else {
        throw new Error(response.data.message || 'Falha no registro');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Falha no registro');
      } else {
        throw new Error('Erro ao conectar com o servidor');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
