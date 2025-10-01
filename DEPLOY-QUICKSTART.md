# 🚀 Quick Start - Deploy a AWS

## ⚡ Setup Rápido (5 minutos)

### 1. Configurar AWS CLI

```powershell
# Instalar AWS CLI si no lo tienes
# Descargar: https://aws.amazon.com/cli/

# Configurar credenciales
aws configure
```

### 2. Configurar Environment de Producción

Edita `.env.production` y cambia la URL de tu API:

```env
VITE_API_URL=https://tu-api-de-produccion.com
```

### 3. Configurar Deploy

**Opción A: Crear archivo de configuración (RECOMENDADO)**

```powershell
# Copiar el archivo de ejemplo
Copy-Item deploy.config.example.ps1 deploy.config.ps1

# Editar deploy.config.ps1 con tus valores:
# $BUCKET_NAME = "tu-bucket-s3"
# $DISTRIBUTION_ID = "E1234567890ABC"
```

**Opción B: Editar deploy.ps1 directamente**

Abre `deploy.ps1` y cambia las líneas 17-18:
```powershell
if (-not $BucketName) { $BucketName = "tu-bucket-real" }
if (-not $DistributionId) { $DistributionId = "E1234567890ABC" }
```

### 4. ¡Deployar!

```powershell
# Opción 1: Usar npm script
npm run deploy

# Opción 2: Ejecutar el script directamente
./deploy.ps1

# Opción 3: Pasar parámetros manualmente
./deploy.ps1 -BucketName "mi-bucket" -DistributionId "E1234567890ABC"
```

## 🎯 Comandos Principales

```powershell
# Desarrollo local
npm run dev

# Build de desarrollo
npm run build:dev

# Build de producción (sin deploy)
npm run build:prod

# Deploy completo a AWS
npm run deploy

# Preview del build localmente
npm run build && npm run preview
```

## 📋 Checklist Pre-Deploy

- [ ] AWS CLI instalado y configurado (`aws configure`)
- [ ] Bucket S3 creado y configurado para hosting estático
- [ ] Distribución CloudFront creada apuntando al bucket
- [ ] `.env.production` configurado con la URL correcta de API
- [ ] `deploy.config.ps1` creado con bucket y distribution ID correctos
- [ ] Credenciales AWS con permisos de S3 y CloudFront

## 🔍 Verificar Deploy

1. **Archivos en S3:**
   ```powershell
   aws s3 ls s3://tu-bucket --recursive
   ```

2. **Estado de invalidación:**
   ```powershell
   aws cloudfront list-invalidations --distribution-id TU_ID
   ```

3. **Abrir el sitio:**
   - URL de CloudFront: `https://d1234567890.cloudfront.net`
   - O tu dominio personalizado si lo configuraste

## ❓ Problemas Comunes

### "AWS CLI no encontrado"
```powershell
# Instalar desde: https://aws.amazon.com/cli/
# Reiniciar PowerShell después de instalar
```

### "Access Denied" en S3
- Verifica permisos IAM: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`
- Verifica política del bucket

### "Access Denied" en CloudFront
- Verifica permiso IAM: `cloudfront:CreateInvalidation`

### El sitio no se actualiza
- Espera 3-5 minutos para la invalidación
- Limpia caché del navegador (Ctrl + Shift + R)
- Abre en ventana incógnita

### Variables de entorno no se aplican
```powershell
# Asegúrate de hacer build de producción
npm run build:prod

# O simplemente
npm run build  # usa producción por defecto
```

## 📚 Más Info

Ver `DEPLOY-README.md` para documentación completa.

## 💡 Tips

1. **Primera vez:** Usa `npm run build && npm run preview` para probar el build localmente
2. **Variables de entorno:** NUNCA incluyas secretos en archivos `.env.*`
3. **Costos:** El script optimiza para minimizar costos de invalidación
4. **Cache:** Los assets tienen caché de 1 año, `index.html` solo 60 segundos
5. **Rollback:** Mantén backups del bucket S3 activados
