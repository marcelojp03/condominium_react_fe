# ============================================
# Script de Deploy para React + Vite a AWS S3 y CloudFront
# ============================================

param(
    [string]$BucketName,
    [string]$DistributionId,
    [string]$BuildDir = "build"
)

# Intentar cargar configuracion desde archivo externo
$configFile = Join-Path $PSScriptRoot "deploy.config.ps1"
if (Test-Path $configFile) {
    Write-Host "Cargando configuracion desde deploy.config.ps1..." -ForegroundColor Cyan
    . $configFile
    # Si los parametros no fueron pasados, usar los del archivo de config
    if (-not $BucketName -and $BUCKET_NAME) { $BucketName = $BUCKET_NAME }
    if (-not $DistributionId -and $DISTRIBUTION_ID) { $DistributionId = $DISTRIBUTION_ID }
    if ($BUILD_DIR) { $BuildDir = $BUILD_DIR }
}

# Si aun no hay valores, usar defaults
if (-not $BucketName) { $BucketName = "tu-bucket-nombre" }
if (-not $DistributionId) { $DistributionId = "TU_DISTRIBUTION_ID" }

# Colores para output
$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Banner
Write-ColorOutput "`n============================================" "Cyan"
Write-ColorOutput "  AWS S3 + CloudFront Deployment Script    " "Cyan"
Write-ColorOutput "============================================`n" "Cyan"

# Verificar que AWS CLI esta instalado
try {
    $awsVersion = aws --version
    Write-ColorOutput "[OK] AWS CLI detectado: $awsVersion" "Green"
} catch {
    Write-ColorOutput "[ERROR] AWS CLI no esta instalado o no esta en el PATH" "Red"
    Write-ColorOutput "  Instalar desde: https://aws.amazon.com/cli/" "Yellow"
    exit 1
}

# Verificar configuracion
if ($BucketName -eq "tu-bucket-nombre" -or $DistributionId -eq "TU_DISTRIBUTION_ID") {
    Write-ColorOutput "`n[ADVERTENCIA] Debes configurar el nombre del bucket y distribution ID" "Yellow"
    Write-ColorOutput "   Edita el archivo deploy.ps1 o pasa los parametros:" "Yellow"
    Write-ColorOutput "   ./deploy.ps1 -BucketName 'mi-bucket' -DistributionId 'E1234567890ABC'`n" "Yellow"
    $continue = Read-Host "Continuar de todas formas? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 0
    }
}

Write-ColorOutput "`nConfiguracion:" "Cyan"
Write-ColorOutput "   Bucket: $BucketName" "White"
Write-ColorOutput "   Distribution: $DistributionId" "White"
Write-ColorOutput "   Build Dir: $BuildDir`n" "White"

# Paso 1: Limpiar build anterior
Write-ColorOutput "[PASO 1/7] Limpiando build anterior..." "Cyan"
if (Test-Path $BuildDir) {
    Remove-Item -Path $BuildDir -Recurse -Force
    Write-ColorOutput "[OK] Build anterior eliminado" "Green"
}

# Paso 2: Instalar/Verificar dependencias
Write-ColorOutput "`n[PASO 2/7] Verificando dependencias..." "Cyan"
if (-not (Test-Path "node_modules") -or -not (Test-Path "node_modules\.bin\tsc.cmd")) {
    Write-ColorOutput "Instalando dependencias..." "Yellow"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "[ERROR] Error al instalar dependencias" "Red"
        exit 1
    }
} else {
    Write-ColorOutput "Dependencias ya instaladas" "Green"
}
Write-ColorOutput "[OK] Dependencias listas" "Green"

# Paso 3: Build de produccion
Write-ColorOutput "`n[PASO 3/7] Building React app (Produccion)..." "Cyan"

# Asegurarse de usar los binarios locales de node_modules
$env:PATH = "$PSScriptRoot\node_modules\.bin;$env:PATH"

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[ERROR] Error al hacer build" "Red"
    exit 1
}
Write-ColorOutput "[OK] Build completado exitosamente" "Green"

# Verificar que el directorio build existe
if (-not (Test-Path $BuildDir)) {
    Write-ColorOutput "[ERROR] El directorio '$BuildDir' no fue creado" "Red"
    exit 1
}

# Paso 4: Subir assets con cache largo
Write-ColorOutput "`n[PASO 4/7] Subiendo assets con cache largo (JS, CSS, imagenes)..." "Cyan"
aws s3 cp $BuildDir s3://$BucketName --recursive `
    --exclude "*" `
    --include "*.js" `
    --include "*.css" `
    --include "*.png" `
    --include "*.jpg" `
    --include "*.jpeg" `
    --include "*.gif" `
    --include "*.svg" `
    --include "*.ico" `
    --include "*.woff" `
    --include "*.woff2" `
    --include "*.ttf" `
    --include "*.eot" `
    --cache-control "public,max-age=31536000,immutable" `
    --metadata-directive REPLACE

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[ERROR] Error al subir assets" "Red"
    exit 1
}
Write-ColorOutput "[OK] Assets subidos correctamente" "Green"

# Paso 5: Subir index.html con cache corto
Write-ColorOutput "`n[PASO 5/7] Subiendo index.html con cache corto..." "Cyan"
aws s3 cp $BuildDir/index.html s3://$BucketName/index.html `
    --cache-control "public,max-age=60,no-transform" `
    --metadata-directive REPLACE `
    --content-type "text/html"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[ERROR] Error al subir index.html" "Red"
    exit 1
}
Write-ColorOutput "[OK] index.html subido correctamente" "Green"

# Paso 6: Sincronizar archivos restantes
Write-ColorOutput "`n[PASO 6/7] Sincronizando archivos restantes..." "Cyan"
aws s3 sync $BuildDir s3://$BucketName --delete `
    --exclude "*.js" `
    --exclude "*.css" `
    --exclude "*.png" `
    --exclude "*.jpg" `
    --exclude "*.jpeg" `
    --exclude "*.gif" `
    --exclude "*.svg" `
    --exclude "*.ico" `
    --exclude "*.woff" `
    --exclude "*.woff2" `
    --exclude "*.ttf" `
    --exclude "*.eot" `
    --exclude "index.html"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[ERROR] Error al sincronizar archivos" "Red"
    exit 1
}
Write-ColorOutput "[OK] Archivos sincronizados correctamente" "Green"

# Paso 7: Invalidar CloudFront
Write-ColorOutput "`n[PASO 7/7] Invalidando cache de CloudFront..." "Cyan"
$invalidation = aws cloudfront create-invalidation `
    --distribution-id $DistributionId `
    --paths "/index.html" "/" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "[ERROR] Error al invalidar CloudFront" "Red"
    Write-ColorOutput "  $invalidation" "Red"
    exit 1
}

# Extraer el ID de invalidacion
$invalidationJson = $invalidation | ConvertFrom-Json
$invalidationId = $invalidationJson.Invalidation.Id

Write-ColorOutput "[OK] Invalidacion creada: $invalidationId" "Green"

# Resumen final
Write-ColorOutput "`n============================================" "Green"
Write-ColorOutput "     DEPLOYMENT COMPLETADO EXITOSAMENTE    " "Green"
Write-ColorOutput "============================================" "Green"
Write-ColorOutput "`nResumen:" "Cyan"
Write-ColorOutput "   * Build generado en: $BuildDir" "White"
Write-ColorOutput "   * Archivos subidos a: s3://$BucketName" "White"
Write-ColorOutput "   * CloudFront invalidado: $invalidationId" "White"
Write-ColorOutput "`nTu aplicacion estara disponible en unos minutos" "Yellow"
Write-ColorOutput "Verifica el estado en la consola de CloudFront`n" "Yellow"
