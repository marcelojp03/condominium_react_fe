import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  // Módulos de condominio utilizados
  DashboardPage,
  CondosList,
  CondoForm,
  UnitsList,
  UnitForm,
  UnitDetail,
  AmenitiesList,
  FeesList,
  PaymentsList,
  FinesList,
  NoticesList,
  NoticeForm,
  IncidentsList,
  IncidentDetail,
} from '../pages';
import { UsuariosList } from '../pages/usuarios/UsuriosList';
import { UsuariosDetail } from '../pages/usuarios/UsuariosDetail';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/condominio-dashboard',
        label: 'Dashboard',
      },
      {
        icon: 'apartment',
        path: '/condominios',
        label: 'Condominios',
      },
      {
        icon: 'domain',
        path: '/unidades',
        label: 'Unidades',
      },
      {
        icon: 'pool',
        path: '/areas',
        label: 'Áreas Comunes',
      },
      {
        icon: 'attach_money',
        path: '/finanzas',
        label: 'Finanzas',
      },
      {
        icon: 'campaign',
        path: '/avisos',
        label: 'Avisos',
      },
      {
        icon: 'report_problem',
        path: '/incidentes',
        label: 'Incidentes',
      },
      {
        icon: 'people',
        path: '/usuarios',
        label: 'Usuarios',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/condominio-dashboard" element={<DashboardPage />} />
      
      {/* Condominios */}
      <Route path="/condominios" element={<CondosList />} />
      <Route path="/condominios/nuevo" element={<CondoForm />} />
      <Route path="/condominios/:id/editar" element={<CondoForm />} />
      
      {/* Unidades */}
      <Route path="/unidades" element={<UnitsList />} />
      <Route path="/unidades/nueva" element={<UnitForm />} />
      <Route path="/unidades/:id/editar" element={<UnitForm />} />
      <Route path="/unidades/:id" element={<UnitDetail />} />
      
      {/* Áreas Comunes */}
      <Route path="/areas" element={<AmenitiesList />} />
      
      {/* Finanzas */}
      <Route path="/finanzas" element={<FeesList />} />
      <Route path="/finanzas/pagos" element={<PaymentsList />} />
      <Route path="/finanzas/multas" element={<FinesList />} />
      
      {/* Avisos */}
      <Route path="/avisos" element={<NoticesList />} />
      <Route path="/avisos/nuevo" element={<NoticeForm />} />
      <Route path="/avisos/:id/editar" element={<NoticeForm />} />
      
      {/* Incidentes */}
      <Route path="/incidentes" element={<IncidentsList />} />
      <Route path="/incidentes/:id" element={<IncidentDetail />} />
      
      {/* Usuarios */}
      <Route path="/usuarios" element={<UsuariosList />} />
      <Route path="/usuarios/detalle/:id" element={<UsuariosDetail />} />
      
      {/* Legacy routes */}
      <Route path="/dashboard" element={<Navigate to="/condominio-dashboard" replace />} />
      <Route path="/" element={<Navigate to="/condominio-dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/condominio-dashboard" replace />} />
    </Routes>
  );
};
