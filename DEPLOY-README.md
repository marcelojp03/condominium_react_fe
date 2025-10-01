# 🚀 Guía de Deploy a AWS S3 + CloudFront

## Requisitos Previos

1. **AWS CLI instalado y configurado**
   ```powershell
   # Instalar AWS CLI
   # Descargar desde: https://aws.amazon.com/cli/
   
   # Configurar credenciales
   aws configure
   ```

2. **Bucket S3 creado**
   - Nombre del bucket configurado para hosting estático
   - Políticas de acceso público configuradas

3. **Distribución de CloudFront creada**
   - Apuntando al bucket S3
   - Con el Origin configurado correctamente

## Configuración Inicial

### 1. Configurar variables de entorno

Edita el archivo `.env.production` con tu URL de API de producción:

```env
VITE_API_URL=https://tu-api-de-produccion.com
```

### 2. Configurar script de deploy

Edita `deploy.ps1` y cambia estos valores:

```powershell
[string]$BucketName = "tu-bucket-s3"
[string]$DistributionId = "TU_CLOUDFRONT_DISTRIBUTION_ID"
```

## Uso del Script de Deploy

### Opción 1: Usar valores configurados en el script

```powershell
./deploy.ps1
```

### Opción 2: Pasar parámetros por línea de comandos

```powershell
./deploy.ps1 -BucketName "mi-bucket-prod" -DistributionId "E1234567890ABC"
```

## ¿Qué hace el script?

1. ✅ Verifica que AWS CLI esté instalado
2. 🧹 Limpia el build anterior
3. 📦 Instala dependencias limpias (`npm ci`)
4. 🔨 Genera el build de producción
5. 📤 Sube archivos estáticos con caché largo (JS, CSS, imágenes)
6. 📄 Sube `index.html` con caché corto
7. 🔄 Sincroniza archivos restantes
8. ⚡ Invalida el caché de CloudFront

## Estrategia de Caché

### Assets con caché largo (1 año)
- JavaScript (*.js)
- CSS (*.css)
- Imágenes (*.png, *.jpg, *.svg, etc.)
- Fuentes (*.woff, *.woff2, *.ttf)

**Razón**: Vite genera hashes en los nombres de archivo, por lo que son inmutables.

### index.html con caché corto (60 segundos)
- Permite actualizaciones rápidas sin esperar invalidación de caché

### Invalidación de CloudFront
- Solo se invalida `/index.html` y `/` para minimizar costos
- Los assets se actualizan automáticamente por sus nuevos nombres hasheados

## Comandos Individuales (Manual)

Si prefieres ejecutar los comandos manualmente:

```powershell
# Build
npm ci
npm run build

# Subir assets con caché largo
aws s3 cp build s3://tu-bucket --recursive `
  --exclude "*" --include "*.js" --include "*.css" --include "*.png" `
  --cache-control "public,max-age=31536000,immutable"

# Subir index.html
aws s3 cp build/index.html s3://tu-bucket/index.html `
  --cache-control "public,max-age=60,no-transform" --content-type "text/html"

# Sync otros archivos
aws s3 sync build s3://tu-bucket --delete `
  --exclude "*.js" --exclude "*.css" --exclude "index.html"

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id TU_ID --paths "/index.html" "/"
```

## Environments

### Desarrollo
```powershell
npm run dev
# Usa .env.development (http://127.0.0.1:8000)
```

### Producción (local preview)
```powershell
npm run build
npm run preview
# Usa .env.production
```

### Producción (deploy)
```powershell
./deploy.ps1
# Usa .env.production y sube a AWS
```

## Verificación Post-Deploy

1. Verifica que los archivos se subieron correctamente:
   ```powershell
   aws s3 ls s3://tu-bucket --recursive
   ```

2. Verifica el estado de la invalidación:
   ```powershell
   aws cloudfront get-invalidation --distribution-id TU_ID --id INVALIDATION_ID
   ```

3. Abre tu sitio en CloudFront y verifica que se muestre correctamente

## Troubleshooting

### Error: AWS CLI no encontrado
```powershell
# Instalar AWS CLI desde:
https://aws.amazon.com/cli/
```

### Error: Credenciales no configuradas
```powershell
aws configure
# Ingresa: Access Key ID, Secret Access Key, Region, Output format
```

### Error: Permisos denegados en S3
- Verifica que tu usuario IAM tenga permisos `s3:PutObject`, `s3:DeleteObject`
- Verifica las políticas del bucket

### Error: Permisos denegados en CloudFront
- Verifica que tu usuario IAM tenga permiso `cloudfront:CreateInvalidation`

### El sitio no se actualiza después del deploy
- Espera 3-5 minutos para que la invalidación se complete
- Limpia la caché del navegador (Ctrl + Shift + R)
- Verifica que la invalidación se completó en la consola de AWS

## Costos de AWS

- **S3 Storage**: ~$0.023 por GB/mes
- **S3 Requests**: ~$0.005 por 1,000 requests
- **CloudFront**: ~$0.085 por GB transferido
- **CloudFront Invalidations**: Primeras 1,000 por mes gratis, luego $0.005 por path

💡 **Tip**: El script solo invalida 2 paths para minimizar costos.

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas archivos `.env*` a S3
- El `.gitignore` debe incluir `.env.development` y `.env.production`
- Usa AWS Secrets Manager para secretos sensibles
- Configura HTTPS en CloudFront (obligatorio)

## Scripts NPM Adicionales

Puedes agregar estos scripts a `package.json`:

```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:prod": "vite build --mode production",
    "deploy": "powershell -ExecutionPolicy Bypass -File ./deploy.ps1"
  }
}
```

Luego ejecutar:
```powershell
npm run deploy
```
