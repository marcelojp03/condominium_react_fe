import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { Login } from '../pages/auth/Login';
import { LogoutHandler, PrivateRoute } from '../shared/components';
import { LayoutBaseDePagina } from '@/shared/layouts';
import { MenuLateral } from '@/shared/components';
import { UsuariosList } from '@/pages/usuarios/UsuariosList';
import { UsuariosDetail } from '@/pages/usuarios/UsuariosDetail';
import { Dashboard } from '@mui/icons-material';
import { DashboardPage } from '@/pages/condominios';
import { RolesList } from '@/pages/roles/RolesList';
import { RolesDetail } from '@/pages/roles/RolesDetail';
import { UnidadesList } from '@/pages/unidades/UnidadesList';
import { UnidadesDetail } from '@/pages/unidades/UnidadesDetail';
import { ResidentesList } from '@/pages/residentes/ResidentesList';
import { ResidentesDetail } from '@/pages/residentes/ResidentesDetail';
import { AvisosList } from '@/pages/avisos/AvisosList';
import { AvisosDetail } from '@/pages/avisos/AvisosDetail';
import { FacesList } from '@/pages/faces/FacesList';
import { FacesDetail } from '@/pages/faces/FacesDetail';
import { PlacasList } from '@/pages/placas/PlacasList';
import { PlacasDetail } from '@/pages/placas/PlacasDetail';
import { AlertasDetail } from '@/pages/alertas/AlertasDetail';

const MainLayout = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      { icon: 'home', path: '/condominio-dashboard', label: 'Dashboard' },
      { icon: 'apartment', path: '/condominios', label: 'Condominios' },
      { icon: 'domain', path: '/unidades', label: 'Unidades' },
      { icon: 'pool', path: '/areas', label: 'Áreas Comunes' },
      { icon: 'attach_money', path: '/finanzas', label: 'Finanzas' },
      { icon: 'campaign', path: '/avisos', label: 'Avisos' },
      { icon: 'report_problem', path: '/incidentes', label: 'Incidentes' },
      { icon: 'people', path: '/usuarios', label: 'Usuarios' },
    ]);
  }, [setDrawerOptions]);

  return (
    <MenuLateral>
      <LayoutBaseDePagina titulo="">
        <Outlet />
      </LayoutBaseDePagina>
    </MenuLateral>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogoutHandler />} />

      {/* Rutas privadas - Protegidas con PrivateRoute */}
      <Route 
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/condominio-dashboard" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/usuarios" element={<UsuariosList />} />
        <Route path="/usuarios/detalle/:id" element={<UsuariosDetail />} />        

        <Route path="/roles" element={<RolesList />} />
        <Route path="/roles/detalle/:id" element={<RolesDetail />} />        

        <Route path="/unidades" element={<UnidadesList />} />
        <Route path="/unidades/detalle/:id" element={<UnidadesDetail />} />   

        <Route path="/residentes" element={<ResidentesList />} />
        <Route path="/residentes/detalle/:id" element={<ResidentesDetail />} />         

        <Route path="/avisos" element={<AvisosList />} />
        <Route path="/avisos/detalle/:id" element={<AvisosDetail />} />   

        <Route path="/faces" element={<FacesDetail  />} />
        <Route path="/faces/detalle/:id" element={<FacesDetail />} />  

        <Route path="/placas" element={<PlacasDetail/>} />
        <Route path="/placas/detalle/:id" element={<PlacasDetail />} />          

        <Route path="/alertas" element={<AlertasDetail  />} />
        <Route path="/alertas/detalle/:id" element={<AlertasDetail />} /> 
      </Route>

      {/* Fallback - Redirige a login si no está autenticado */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
