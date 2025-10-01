import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../services/api/auth/AuthService';

interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any | void>;
}

const AuthContext = createContext({} as IAuthContextData);

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'token'; // ✅ Cambiado para coincidir con Login.tsx



interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    if (token) {
      // El token ya viene como string, no necesita JSON.parse
      setAccessToken(token);
    } else {
      setAccessToken(undefined);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    console.info("AuthContext::RESULTADO: ", result);
    
    // Si hay error
    if (result instanceof Error) {
        return result;
    }
    
    // Si el codigo es 0 (exitoso)
    if (result.codigo === 0) {
      // Guarda el token en localStorage y actualiza el estado
      localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, result.token);
      localStorage.setItem('usuario_id', result.usuario_id);
      setAccessToken(result.token);
      return result;
    }
    
    // Si hay algun otro codigo de error
    return result;
  }, []);

 

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    localStorage.removeItem('usuario_id');
    setAccessToken(undefined);
  }, []);

  const isAuthenticated = useMemo(() => {
    // Development bypass - set to false when backend is ready
    const DEVELOPMENT_BYPASS = false; // ✅ Cambiado a false para activar el guard
    return DEVELOPMENT_BYPASS || !!accessToken;
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
