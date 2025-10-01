# Sistema de Autenticacion y Route Guards

## Implementacion Completada

Se ha implementado un sistema completo de proteccion de rutas (Route Guards) para evitar acceso no autorizado.

## Componentes Creados

### 1. PrivateRoute Component
**Ubicacion**: `src/shared/components/PrivateRoute.tsx`

Componente que protege las rutas privadas verificando la autenticacion del usuario.

```tsx
<PrivateRoute>
  <MainLayout />
</PrivateRoute>
```

**Funcionalidad**:
- ✅ Verifica si el usuario esta autenticado usando `useAuthContext`
- ✅ Si NO esta autenticado → Redirige a `/login`
- ✅ Guarda la ubicacion a la que intentaba acceder
- ✅ Despues del login, redirige a la pagina original

## Cambios Realizados

### 1. AuthContext (`src/shared/contexts/AuthContext.tsx`)
```tsx
// ANTES
const DEVELOPMENT_BYPASS = true; // ❌ Permitia acceso sin autenticacion

// DESPUES
const DEVELOPMENT_BYPASS = false; // ✅ Activa la proteccion de rutas
```

### 2. Routes (`src/routes/index.tsx`)
```tsx
// ANTES - Sin proteccion
<Route element={<MainLayout />}>
  <Route path="/condominio-dashboard" element={<DashboardPage />} />
  ...
</Route>

// DESPUES - Con proteccion
<Route 
  element={
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  }
>
  <Route path="/condominio-dashboard" element={<DashboardPage />} />
  ...
</Route>
```

### 3. Login Component (`src/pages/auth/Login.tsx`)
```tsx
// Ahora redirige a la pagina que el usuario intentaba acceder
const from = location.state?.from?.pathname || '/condominio-dashboard';
navigate(from, { replace: true });
```

## Flujo de Autenticacion

### Usuario NO Autenticado

```
1. Usuario intenta acceder a: /condominio-dashboard
   ↓
2. PrivateRoute detecta: !isAuthenticated
   ↓
3. Guarda la ubicacion: { from: '/condominio-dashboard' }
   ↓
4. Redirige a: /login
   ↓
5. Usuario ingresa credenciales
   ↓
6. Login exitoso
   ↓
7. Redirige a: /condominio-dashboard (la pagina original)
```

### Usuario Autenticado

```
1. Usuario intenta acceder a: /usuarios
   ↓
2. PrivateRoute verifica: isAuthenticated === true
   ↓
3. Permite el acceso → Muestra /usuarios
```

## Rutas Protegidas

Todas las siguientes rutas ahora requieren autenticacion:

- ✅ `/condominio-dashboard`
- ✅ `/dashboard`
- ✅ `/usuarios`
- ✅ `/usuarios/detalle/:id`
- ✅ `/roles`
- ✅ `/roles/detalle/:id`
- ✅ `/unidades`
- ✅ `/unidades/detalle/:id`
- ✅ `/residentes`
- ✅ `/residentes/detalle/:id`
- ✅ `/avisos`
- ✅ `/avisos/detalle/:id`

## Rutas Publicas

Las siguientes rutas NO requieren autenticacion:

- 🌐 `/login` - Pagina de inicio de sesion
- 🚪 `/logout` - Cierre de sesion

## Comportamiento de Rutas Desconocidas

```tsx
<Route path="*" element={<Navigate to="/login" replace />} />
```

Cualquier ruta no definida redirige a `/login`

## Pruebas

### 1. Acceso sin autenticacion
```
1. Abre el navegador en modo incognito
2. Intenta acceder a: http://localhost:3000/condominio-dashboard
3. Resultado: Deberia redirigir a /login
```

### 2. Login y redireccion
```
1. Intenta acceder a: /usuarios (sin estar logeado)
2. Te redirige a /login
3. Inicias sesion correctamente
4. Resultado: Te lleva automaticamente a /usuarios
```

### 3. Acceso directo con sesion activa
```
1. Ya estas logeado
2. Navegas a: /roles
3. Resultado: Acceso permitido inmediatamente
```

### 4. Logout
```
1. Estas logeado y en /dashboard
2. Haces logout
3. Resultado: Te redirige a /login y ya no puedes acceder a rutas privadas
```

## Como Desactivar Temporalmente (Para Desarrollo)

Si necesitas desactivar la proteccion temporalmente:

En `src/shared/contexts/AuthContext.tsx`:
```tsx
const DEVELOPMENT_BYPASS = true; // Cambia a true
```

**IMPORTANTE**: NO olvides volver a `false` antes de hacer deploy a produccion.

## Verificacion en Produccion

Despues de deployar, verifica:

```bash
# 1. Intenta acceder sin login
curl -I https://dqvdny7nrh8me.cloudfront.net/dashboard

# 2. Deberia redirigir al login o mostrar el login
```

## Seguridad Adicional

### En el Backend
Asegurate de que tu API tambien valide el token en cada request:

```typescript
// En axios-config o interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Tokens Expirados
Considera implementar:
- ✅ Refresh tokens
- ✅ Auto-logout cuando el token expire
- ✅ Interceptor para capturar errores 401 (Unauthorized)

## Proximos Pasos Recomendados

1. **Implementar Role-Based Access Control (RBAC)**
   - Proteger rutas segun roles de usuario
   - Ejemplo: Solo admins pueden ver /usuarios

2. **Mejorar manejo de errores de autenticacion**
   - Mostrar mensajes mas amigables
   - Usar toast/snackbar en lugar de alert()

3. **Persistencia de sesion**
   - Implementar "Remember me"
   - Renovar tokens automaticamente

4. **Loading states**
   - Mostrar spinner mientras verifica autenticacion
   - Evitar "flash" de contenido

## Archivos Modificados

```
✅ src/shared/components/PrivateRoute.tsx (NUEVO)
✅ src/shared/components/index.ts (ACTUALIZADO)
✅ src/routes/index.tsx (ACTUALIZADO)
✅ src/pages/auth/Login.tsx (ACTUALIZADO)
✅ src/shared/contexts/AuthContext.tsx (ACTUALIZADO)
```

## Resumen

✅ Las rutas privadas ahora estan protegidas
✅ No se puede acceder sin autenticacion
✅ Redireccion automatica al login
✅ Despues del login, vuelve a la pagina original
✅ Rutas desconocidas redirigen a /login
