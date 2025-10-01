# Solucion: Access Denied en CloudFront/S3

## Problema
Al acceder a `dqvdny7nrh8me.cloudfront.net` obtienes:
```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

## Soluciones

### Opcion 1: Configurar S3 como Sitio Web Estatico (RECOMENDADO)

#### Paso 1: Habilitar Hosting de Sitio Web en S3

1. Ve a la consola de AWS S3
2. Selecciona tu bucket: `si2-condominium-fe`
3. Ve a la pestana **Properties**
4. Scroll hasta **Static website hosting**
5. Click en **Edit**
6. Selecciona **Enable**
7. Configura:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (importante para React Router)
8. Guarda los cambios

#### Paso 2: Configurar Politica de Bucket Publica

1. Ve a la pestana **Permissions** del bucket
2. En **Block public access**, asegurate de desmarcar:
   - [ ] Block all public access
3. En **Bucket policy**, agrega esta politica:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::si2-condominium-fe/*"
        }
    ]
}
```

#### Paso 3: Configurar CloudFront

1. Ve a CloudFront en AWS Console
2. Selecciona tu distribucion: `E9XVRLYA5T8EU`
3. Ve a la pestana **Origins**
4. Edita el origen S3
5. En **Origin domain**, debes usar el endpoint del sitio web S3, no el endpoint del bucket:
   - ❌ MAL: `si2-condominium-fe.s3.amazonaws.com`
   - ✅ BIEN: `si2-condominium-fe.s3-website-us-east-1.amazonaws.com`
6. **Origin access**: selecciona **Public**
7. Guarda los cambios

#### Paso 4: Configurar Error Pages en CloudFront

Para que React Router funcione correctamente:

1. En CloudFront, ve a **Error pages**
2. Crea dos custom error responses:

**Error 1:**
- HTTP Error Code: `403`
- Customize Error Response: `Yes`
- Response Page Path: `/index.html`
- HTTP Response Code: `200`

**Error 2:**
- HTTP Error Code: `404`
- Customize Error Response: `Yes`
- Response Page Path: `/index.html`
- HTTP Response Code: `200`

---

### Opcion 2: Usar OAI (Origin Access Identity) - Mas Seguro

Si prefieres mantener el bucket privado:

#### Paso 1: Crear/Verificar OAI

1. En CloudFront, ve a **Security** > **Origin access**
2. Si no existe, crea un nuevo **Origin access identity (OAI)**
3. Copia el ID de la OAI

#### Paso 2: Actualizar Origen en CloudFront

1. Ve a **Origins** en tu distribucion
2. Edita el origen S3
3. **Origin access**: Selecciona **Legacy access identities**
4. Selecciona tu OAI
5. **Bucket policy**: Marca "Yes, update the bucket policy"
6. Guarda

#### Paso 3: Verificar Politica del Bucket

La politica debe verse asi:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontOAI",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity TU_OAI_ID"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::si2-condominium-fe/*"
        }
    ]
}
```

---

## Verificacion Rapida

### 1. Verificar que los archivos se subieron correctamente

```powershell
aws s3 ls s3://si2-condominium-fe/ --recursive
```

Deberias ver `index.html` y los archivos en `assets/`

### 2. Probar acceso directo a S3

Si configuraste como sitio web publico:
- URL: `http://si2-condominium-fe.s3-website-us-east-1.amazonaws.com`

### 3. Verificar distribucion de CloudFront

```powershell
aws cloudfront get-distribution --id E9XVRLYA5T8EU
```

---

## Pasos Recomendados (EN ORDEN)

1. **Primero**: Verificar que los archivos esten en S3
   ```powershell
   aws s3 ls s3://si2-condominium-fe/
   ```

2. **Segundo**: Configurar S3 como sitio web estatico (Opcion 1)

3. **Tercero**: Actualizar el origen en CloudFront para usar el endpoint del sitio web

4. **Cuarto**: Configurar error pages en CloudFront (403 y 404 → index.html)

5. **Quinto**: Crear invalidacion
   ```powershell
   aws cloudfront create-invalidation --distribution-id E9XVRLYA5T8EU --paths "/*"
   ```

6. **Sexto**: Esperar 5-10 minutos para que CloudFront se actualice

---

## Comandos Utiles

### Ver contenido del bucket
```powershell
aws s3 ls s3://si2-condominium-fe/ --recursive
```

### Verificar politica del bucket
```powershell
aws s3api get-bucket-policy --bucket si2-condominium-fe
```

### Verificar configuracion de sitio web
```powershell
aws s3api get-bucket-website --bucket si2-condominium-fe
```

### Invalidar toda la distribucion
```powershell
aws cloudfront create-invalidation --distribution-id E9XVRLYA5T8EU --paths "/*"
```

---

## Checklist de Verificacion

- [ ] Bucket S3 existe y tiene archivos
- [ ] Static website hosting habilitado en S3
- [ ] Bucket policy permite acceso publico O tiene OAI configurado
- [ ] CloudFront apunta al endpoint correcto (sitio web, no bucket)
- [ ] Error pages configurados en CloudFront (403/404 → index.html)
- [ ] Invalidacion de CloudFront creada
- [ ] Esperado 5-10 minutos despues de cambios

---

## Si Nada Funciona

1. **Eliminar y recrear la distribucion de CloudFront** apuntando correctamente al sitio web S3
2. **Verificar region**: Asegurate de que todo este en la misma region (us-east-1)
3. **Probar con un bucket nuevo** para descartar problemas de configuracion

---

## URLs de Referencia

- **Bucket S3**: https://s3.console.aws.amazon.com/s3/buckets/si2-condominium-fe
- **CloudFront**: https://console.aws.amazon.com/cloudfront/v3/home?#/distributions/E9XVRLYA5T8EU
