# 📦 Sistema de Deploy y Environments - Resumen

## ✅ Archivos Creados

### 🌍 Sistema de Environments
```
✓ .env.development          → Variables para desarrollo
✓ .env.production           → Variables para producción  
✓ .env.example              → Template de ejemplo
✓ src/vite-env.d.ts         → Tipos TypeScript para variables
✓ src/shared/environment/   → Sistema de configuración mejorado
  └── index.ts              → Configuración por ambiente
  └── README.md             → Documentación de uso
```

### 🚀 Sistema de Deploy
```
✓ deploy.ps1                      → Script principal de deploy
✓ deploy.config.example.ps1       → Template de configuración
✓ DEPLOY-README.md                → Documentación completa
✓ DEPLOY-QUICKSTART.md            → Guía rápida de inicio
```

### ⚙️ Configuración
```
✓ package.json              → Scripts npm agregados
✓ .gitignore                → Archivos sensibles protegidos
```

---

## 🎯 Flujo de Trabajo

### Desarrollo Local
```powershell
npm run dev
# Usa: .env.development
# API: http://127.0.0.1:8000
```

### Build de Producción
```powershell
npm run build
# Usa: .env.production
# API: https://api-produccion.tudominio.com
```

### Deploy a AWS
```powershell
npm run deploy
# 1. Build de producción
# 2. Sube a S3
# 3. Invalida CloudFront
```

---

## 📋 Setup Inicial (Una Sola Vez)

### 1️⃣ Configurar API de Producción

Edita `.env.production`:
```env
VITE_API_URL=https://tu-api-real.com
```

### 2️⃣ Configurar AWS Deploy

**Opción A:** Crear `deploy.config.ps1`:
```powershell
Copy-Item deploy.config.example.ps1 deploy.config.ps1
# Editar con tus valores de S3 y CloudFront
```

**Opción B:** Editar `deploy.ps1` directamente (líneas 17-18)

### 3️⃣ Configurar AWS CLI
```powershell
aws configure
# Ingresar: Access Key, Secret Key, Region
```

---

## 🔧 Comandos Disponibles

### NPM Scripts
```powershell
npm run dev           # Desarrollo local
npm run build         # Build producción
npm run build:dev     # Build desarrollo
npm run build:prod    # Build producción (explícito)
npm run preview       # Preview del build
npm run deploy        # Deploy completo a AWS
```

### Deploy Manual
```powershell
# Con configuración en deploy.config.ps1
./deploy.ps1

# Con parámetros
./deploy.ps1 -BucketName "mi-bucket" -DistributionId "E123..."
```

---

## 📊 Estructura de Environments

```typescript
// Automático según el modo
import { Environment } from '@/shared/environment';

// Desarrollo
Environment.URL_BASE  // → http://127.0.0.1:8000
Environment.ENABLE_LOGS // → true

// Producción
Environment.URL_BASE  // → https://api-produccion.com
Environment.ENABLE_LOGS // → false
```

---

## 🎨 Uso en Código

### En Servicios
```typescript
import { Environment } from '@/shared/environment';

const api = axios.create({
  baseURL: Environment.URL_BASE
});
```

### En Componentes
```typescript
import { Environment } from '@/shared/environment';

function MyComponent() {
  const fetchData = () => {
    fetch(`${Environment.URL_BASE}/api/data`);
  };
}
```

---

## 🔐 Seguridad

### ✅ Versionados en Git
- `.env.development`
- `.env.production`
- `.env.example`
- `deploy.ps1`
- `deploy.config.example.ps1`

### ❌ Ignorados en Git
- `.env` (variables locales)
- `.env.local`
- `.env.*.local`
- `deploy.config.ps1` (puede tener info sensible)

### ⚠️ IMPORTANTE
- Solo URLs públicas en archivos `.env.*`
- Nunca API keys o tokens
- Nunca contraseñas o secretos

---

## 📈 Estrategia de Caché en AWS

### Assets (JS, CSS, imágenes)
```
Cache-Control: public, max-age=31536000, immutable
→ 1 año de caché (archivos hasheados por Vite)
```

### index.html
```
Cache-Control: public, max-age=60, no-transform
→ 60 segundos (permite actualizaciones rápidas)
```

### Invalidación CloudFront
```
Solo /index.html y /
→ Minimiza costos (primeras 1000 gratis/mes)
```

---

## ✅ Checklist Pre-Deploy

- [ ] AWS CLI instalado
- [ ] AWS CLI configurado (`aws configure`)
- [ ] Bucket S3 creado
- [ ] CloudFront distribution creada
- [ ] `.env.production` con API correcta
- [ ] `deploy.config.ps1` creado y configurado
- [ ] Build local exitoso (`npm run build`)
- [ ] Preview local funciona (`npm run preview`)

---

## 🆘 Troubleshooting Rápido

| Error | Solución |
|-------|----------|
| AWS CLI no encontrado | Instalar desde aws.amazon.com/cli |
| Access Denied (S3) | Verificar permisos IAM |
| Access Denied (CloudFront) | Agregar permiso CreateInvalidation |
| Variables no se aplican | Hacer `npm run build` (no `npm run dev`) |
| Sitio no actualiza | Esperar 3-5 min, limpiar caché navegador |

---

## 📚 Documentación

- `DEPLOY-QUICKSTART.md` → Guía rápida 5 minutos
- `DEPLOY-README.md` → Documentación completa
- `src/shared/environment/README.md` → Uso de environments
- Este archivo → Resumen visual

---

## 🚀 Deploy en 3 Pasos

```powershell
# 1. Primera vez: Configurar
Copy-Item deploy.config.example.ps1 deploy.config.ps1
# Editar deploy.config.ps1 con tus valores

# 2. Cada vez que quieras deployar
npm run deploy

# 3. ¡Listo! 🎉
```

---

## 💡 Tips Pro

1. **Primera vez:** Prueba con `npm run build && npm run preview`
2. **Debug:** Usa `console.log(Environment)` para ver config
3. **Rollback:** Activa versionado del bucket S3
4. **Costos:** Script optimizado para minimizar invalidaciones
5. **CI/CD:** Puedes usar este script en GitHub Actions o similar

---

## 🎓 Siguiente Nivel

### Multiple Environments
Agregar staging, QA, etc.:
```powershell
# .env.staging
npm run build -- --mode staging
```

### Custom Domain
Configurar dominio personalizado en CloudFront

### CI/CD
Automatizar deploy con GitHub Actions

### Monitoring
Configurar AWS CloudWatch para logs

---

**¿Preguntas?** Ver documentación completa en los archivos README 📖
