# Script para Configurar S3 y CloudFront
# Ejecutar este script para solucionar el Access Denied

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Configuracion de S3 + CloudFront" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$BUCKET_NAME = "si2-condominium-fe"
$DISTRIBUTION_ID = "E9XVRLYA5T8EU"
$REGION = "us-east-1"

# Paso 1: Desbloquear acceso publico
Write-Host "[PASO 1/5] Desbloqueando acceso publico del bucket..." -ForegroundColor Yellow
Write-Host "IMPORTANTE: Necesitas permisos de administrador para esto" -ForegroundColor Red
Write-Host "Si falla, hazlo manualmente en la consola de AWS`n" -ForegroundColor Red

aws s3api put-public-access-block `
    --bucket $BUCKET_NAME `
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Acceso publico desbloqueado" -ForegroundColor Green
} else {
    Write-Host "[ERROR] No se pudo desbloquear. Hazlo manualmente:" -ForegroundColor Red
    Write-Host "1. Ve a: https://s3.console.aws.amazon.com/s3/buckets/$BUCKET_NAME" -ForegroundColor Yellow
    Write-Host "2. Pestaña Permissions > Block public access > Edit" -ForegroundColor Yellow
    Write-Host "3. Desmarca 'Block all public access'" -ForegroundColor Yellow
    Write-Host "4. Guarda los cambios`n" -ForegroundColor Yellow
    Read-Host "Presiona Enter cuando hayas terminado"
}

# Paso 2: Aplicar politica publica
Write-Host "`n[PASO 2/5] Aplicando politica publica al bucket..." -ForegroundColor Yellow
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://aws-bucket-policy.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Politica aplicada correctamente" -ForegroundColor Green
} else {
    Write-Host "[ERROR] No se pudo aplicar la politica" -ForegroundColor Red
    Write-Host "Hazlo manualmente:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://s3.console.aws.amazon.com/s3/buckets/$BUCKET_NAME" -ForegroundColor Yellow
    Write-Host "2. Pestaña Permissions > Bucket policy > Edit" -ForegroundColor Yellow
    Write-Host "3. Copia el contenido de 'aws-bucket-policy.json'" -ForegroundColor Yellow
    Write-Host "4. Pega y guarda`n" -ForegroundColor Yellow
    Read-Host "Presiona Enter cuando hayas terminado"
}

# Paso 3: Habilitar hosting de sitio web
Write-Host "`n[PASO 3/5] Habilitando static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$BUCKET_NAME/ --index-document index.html --error-document index.html

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Website hosting habilitado" -ForegroundColor Green
    Write-Host "Endpoint: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor Cyan
} else {
    Write-Host "[ERROR] No se pudo habilitar website hosting" -ForegroundColor Red
    Write-Host "Hazlo manualmente:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://s3.console.aws.amazon.com/s3/buckets/$BUCKET_NAME" -ForegroundColor Yellow
    Write-Host "2. Pestaña Properties > Static website hosting > Edit" -ForegroundColor Yellow
    Write-Host "3. Enable > Index: index.html, Error: index.html" -ForegroundColor Yellow
    Write-Host "4. Guarda`n" -ForegroundColor Yellow
    Read-Host "Presiona Enter cuando hayas terminado"
}

# Paso 4: Invalidar cache de CloudFront
Write-Host "`n[PASO 4/5] Invalidando cache de CloudFront..." -ForegroundColor Yellow
$invalidation = aws cloudfront create-invalidation `
    --distribution-id $DISTRIBUTION_ID `
    --paths "/*" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Invalidacion creada" -ForegroundColor Green
} else {
    Write-Host "[AVISO] Error al invalidar CloudFront" -ForegroundColor Yellow
}

# Paso 5: Instrucciones finales
Write-Host "`n[PASO 5/5] Configuracion de CloudFront (MANUAL)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "IMPORTANTE: Debes configurar CloudFront manualmente:`n" -ForegroundColor Red

Write-Host "1. Ve a CloudFront:" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/cloudfront/v3/home#/distributions/$DISTRIBUTION_ID`n" -ForegroundColor Cyan

Write-Host "2. En la pestaña Origins:" -ForegroundColor White
Write-Host "   - Edita el origen S3" -ForegroundColor Yellow
Write-Host "   - Origin domain: Cambia a $BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor Green
Write-Host "   - Origin access: Public" -ForegroundColor Yellow
Write-Host "   - Guarda`n" -ForegroundColor Yellow

Write-Host "3. En la pestaña Error pages:" -ForegroundColor White
Write-Host "   - Crea custom error response para 403:" -ForegroundColor Yellow
Write-Host "     * HTTP Error Code: 403" -ForegroundColor Yellow
Write-Host "     * Response Page: /index.html" -ForegroundColor Yellow
Write-Host "     * HTTP Response Code: 200" -ForegroundColor Yellow
Write-Host "   - Crea custom error response para 404:" -ForegroundColor Yellow
Write-Host "     * HTTP Error Code: 404" -ForegroundColor Yellow
Write-Host "     * Response Page: /index.html" -ForegroundColor Yellow
Write-Host "     * HTTP Response Code: 200`n" -ForegroundColor Yellow

Write-Host "4. Espera 5-10 minutos para que CloudFront se actualice`n" -ForegroundColor White

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "URLs para verificar:" -ForegroundColor White
Write-Host "  S3 directo: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor Cyan
Write-Host "  CloudFront: https://dqvdny7nrh8me.cloudfront.net" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "Para mas detalles, revisa: AWS-TROUBLESHOOTING.md" -ForegroundColor Yellow
