import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas privadas
 * Redirige a /login si el usuario no está autenticado
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guarda la ubicación a la que intentaba acceder
    // para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
