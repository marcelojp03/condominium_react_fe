# ============================================
# Configuración para Deploy
# ============================================
# Copia este archivo a 'deploy.config.ps1' y configura tus valores
# El archivo deploy.config.ps1 será ignorado por git

# Información del Bucket S3
$BUCKET_NAME = "si2-condominium-fe"

# ID de la Distribución de CloudFront
$DISTRIBUTION_ID = "E9XVRLYA5T8EU"

# Directorio de build (no cambiar a menos que modifiques vite.config.ts)
$BUILD_DIR = "build"

# Región de AWS (opcional)
$AWS_REGION = "us-east-1"

# ============================================
# Ejemplos de configuración:
# ============================================
# $BUCKET_NAME = "condominium-app-prod"
# $DISTRIBUTION_ID = "E1234567890ABC"
# $BUILD_DIR = "build"
# $AWS_REGION = "us-east-1"
