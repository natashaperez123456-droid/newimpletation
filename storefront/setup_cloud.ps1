# Configuración
$PROJECT_ID = "tiny-bright-store-2026"
$REGION = "us-east1"
$REPO_NAME = "saleor-repo"
$IMAGE_NAME = "saleor-api"
$IMAGE_TAG = "3.19"
$FULL_IMAGE_PATH = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME`:$IMAGE_TAG"
$DB_INSTANCE = "tiny-bright-store-2026:us-east1:saleor-db-v2"
$REDIS_URL = "redis://10.177.214.187:6379/1"

Write-Host "=== REPARANDO DESPLIEGUE (PUERTO 8000) ===" -ForegroundColor Cyan

# 0. Asegurar proyecto
gcloud config set project $PROJECT_ID | Out-Null

# 1. Pedir contraseña
$DB_PASSWORD = Read-Host -Prompt "Introduce la contraseña de la BD y presiona ENTER"

# 2. Variables
$ENV_VARS = "DATABASE_URL=postgres://postgres:$DB_PASSWORD@/saleor?host=/cloudsql/$DB_INSTANCE,REDIS_URL=$REDIS_URL,SECRET_KEY=supersecretkey_change_me_later,ALLOWED_HOSTS=*,ALLOWED_CLIENT_HOSTS=*"

# 3. MIGRACION (Solo si no se hizo antes, no hace daño repetir)
Write-Host "1. Asegurando migraciones..." -ForegroundColor Yellow
gcloud run jobs deploy saleor-migrate `
  --image=$FULL_IMAGE_PATH `
  --region=$REGION `
  --set-cloudsql-instances=$DB_INSTANCE `
  --set-env-vars $ENV_VARS `
  --command "python" `
  --args "manage.py,migrate" `
  --memory=2Gi `
  --task-timeout=10m `
  --quiet

gcloud run jobs execute saleor-migrate --region=$REGION --wait

# 4. SKIPPED POPULATE (Falla y no es critico ahora)
Write-Host "2. Saltando 'populate' para evitar errores..." -ForegroundColor DarkGray

# 5. DESPLIEGUE FINAL (CORRECCION: PUERTO 8000)
Write-Host "3. Desplegando API (Corrigiendo Puerto)..." -ForegroundColor Green

gcloud run deploy saleor-api `
  --image=$FULL_IMAGE_PATH `
  --region=$REGION `
  --platform=managed `
  --allow-unauthenticated `
  --add-cloudsql-instances=$DB_INSTANCE `
  --set-env-vars $ENV_VARS `
  --memory=2Gi `
  --cpu=2 `
  --timeout=5m `
  --port=8000

Write-Host "=== SI VES LA URL ABAJO, YA GANAMOS ===" -ForegroundColor Cyan
