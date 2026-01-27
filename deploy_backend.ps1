$DB_PASSWORD = Read-Host -Prompt "Ingresa la contraseña de la base de datos (la que pusiste en el paso anterior)"
$PROJECT_ID = "tiny-bright-store-2026"
$REGION = "us-east1"
$INSTANCE_NAME = "saleor-db-v2"
$CONNECTION_NAME = "$PROJECT_ID:$REGION:$INSTANCE_NAME"
$REDIS_IP = "10.177.214.187"

Write-Host "Iniciando despliegue de Saleor API en Cloud Run..." -ForegroundColor Green

gcloud run deploy saleor-api `
  --image=ghcr.io/saleor/saleor:3.19 `
  --region=$REGION `
  --platform=managed `
  --allow-unauthenticated `
  --add-cloudsql-instances=$CONNECTION_NAME `
  --set-env-vars "DATABASE_URL=postgres://postgres:$DB_PASSWORD@/saleor?host=/cloudsql/$CONNECTION_NAME" `
  --set-env-vars "REDIS_URL=redis://$REDIS_IP:6379/1" `
  --set-env-vars "SECRET_KEY=temporalsecretkey123" `
  --set-env-vars "ALLOWED_HOSTS=*" `
  --set-env-vars "ALLOWED_CLIENT_HOSTS=*" `
  --memory=1Gi

Write-Host "¡Despliegue finalizado!" -ForegroundColor Green
