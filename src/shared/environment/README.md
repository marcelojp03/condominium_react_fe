# 🌍 Sistema de Environments

Este proyecto usa un sistema de configuración por ambiente que cambia automáticamente según el modo de build.

## 📁 Archivos de Configuración

### Archivos de Environment Variables
- `.env.development` - Variables para desarrollo local
- `.env.production` - Variables para producción
- `.env.example` - Template de ejemplo

### Archivo de Configuración
- `src/shared/environment/index.ts` - Configuración central que consume las variables

## 🔧 Cómo Funciona

### 1. Variables de Entorno (`.env.*`)

Vite carga automáticamente las variables según el modo:

```env
# .env.development
VITE_API_URL=http://127.0.0.1:8000

# .env.production
VITE_API_URL=https://api-produccion.tudominio.com
```

⚠️ **IMPORTANTE**: Solo las variables que empiezan con `VITE_` son expuestas al cliente.

### 2. Configuración Tipada (`index.ts`)

El archivo `index.ts` consume estas variables y provee una configuración tipada:

```typescript
export const Environment = {
  LIMITE_DE_LINHAS: 5,
  INPUT_DE_BUSCA: 'Buscar...',
  LISTAGEM_VAZIA: 'Ningún registro encontrado.',
  URL_BASE: import.meta.env.VITE_API_URL,
  API_TIMEOUT: 30000,
  ENABLE_LOGS: true  // solo en desarrollo
}
```

### 3. Detección Automática

El sistema detecta automáticamente el ambiente:

```typescript
const currentEnv = import.meta.env.MODE; // 'development' o 'production'
```

## 💻 Uso en tu Código

### Importar la configuración

```typescript
import { Environment } from '@/shared/environment';

// Usar la URL base
const apiUrl = Environment.URL_BASE;

// Hacer petición
fetch(`${Environment.URL_BASE}/api/condominios`)
```

### Ejemplo en un servicio

```typescript
// src/shared/services/api.ts
import axios from 'axios';
import { Environment } from '@/shared/environment';

export const api = axios.create({
  baseURL: Environment.URL_BASE,
  timeout: Environment.API_TIMEOUT,
});

// Logs solo en desarrollo
if (Environment.ENABLE_LOGS) {
  api.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
  });
}
```

### Ejemplo en un componente

```typescript
// src/pages/condominios/CondosList.tsx
import { Environment } from '@/shared/environment';

function CondosList() {
  const fetchCondos = async () => {
    const response = await fetch(
      `${Environment.URL_BASE}/api/condominios`
    );
    return response.json();
  };

  return (
    <DataTable
      rowsPerPage={Environment.LIMITE_DE_LINHAS}
      emptyMessage={Environment.LISTAGEM_VAZIA}
    />
  );
}
```

## 🚀 Comandos de Build

```bash
# Desarrollo (usa .env.development)
npm run dev

# Build de desarrollo
npm run build:dev

# Build de producción (usa .env.production)
npm run build
npm run build:prod
```

## 🔐 Seguridad

### ✅ Hacer

- Usar `VITE_` prefix para variables públicas
- Mantener URLs y configuración pública
- Versionar `.env.development` y `.env.production`

### ❌ NO Hacer

- **NUNCA** incluir API keys o secretos en archivos `.env.*`
- **NUNCA** exponer tokens de autenticación
- **NUNCA** incluir contraseñas o credenciales

### 🔒 Para Secretos

Si necesitas manejar secretos:

1. Usa AWS Secrets Manager o similar
2. Obtén los secretos desde el backend
3. Usa variables de entorno del servidor (no del cliente)

```typescript
// ❌ MAL - El token está expuesto en el cliente
const API_KEY = import.meta.env.VITE_API_KEY;

// ✅ BIEN - El token está en el backend
const response = await fetch('/api/secure-endpoint', {
  // El backend maneja el API key
});
```

## 📝 Agregar Nuevas Variables

### 1. Agregar al archivo `.env.*`

```env
# .env.development
VITE_API_URL=http://127.0.0.1:8000
VITE_APP_NAME=Condominium Management
VITE_FEATURE_FLAG=true
```

### 2. Agregar tipos en `vite-env.d.ts`

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_FEATURE_FLAG: string
}
```

### 3. Usar en `environment/index.ts`

```typescript
const environments = {
  development: {
    ...baseConfig,
    URL_BASE: import.meta.env.VITE_API_URL,
    APP_NAME: import.meta.env.VITE_APP_NAME,
    FEATURE_FLAG: import.meta.env.VITE_FEATURE_FLAG === 'true',
  },
  // ...
}
```

### 4. Usar en tu código

```typescript
import { Environment } from '@/shared/environment';

console.log(Environment.APP_NAME);
if (Environment.FEATURE_FLAG) {
  // mostrar nueva feature
}
```

## 🧪 Testing

Para tests, puedes mockear el módulo:

```typescript
// __tests__/setup.ts
vi.mock('@/shared/environment', () => ({
  Environment: {
    URL_BASE: 'http://localhost:3000',
    LIMITE_DE_LINHAS: 10,
    // ...
  }
}));
```

## 🌐 Múltiples Ambientes

Si necesitas más ambientes (staging, qa, etc.):

### 1. Crear archivo `.env.staging`

```env
VITE_API_URL=https://api-staging.tudominio.com
```

### 2. Agregar modo en `environment/index.ts`

```typescript
const environments = {
  development: { /* ... */ },
  staging: {
    ...baseConfig,
    URL_BASE: import.meta.env.VITE_API_URL || 'https://api-staging.tudominio.com',
  },
  production: { /* ... */ },
};
```

### 3. Agregar script en `package.json`

```json
{
  "scripts": {
    "build:staging": "vite build --mode staging"
  }
}
```

## 🔍 Debug

Ver qué variables están cargadas:

```typescript
// En desarrollo, puedes hacer:
console.log('Environment:', Environment);
console.log('Mode:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);
```

## 📚 Referencias

- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript with Vite](https://vitejs.dev/guide/features.html#typescript)
