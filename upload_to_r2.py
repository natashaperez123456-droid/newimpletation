import boto3
import os
import mimetypes
from botocore.config import Config
from botocore.exceptions import ClientError

# Credenciales de Cloudflare R2
R2_ACCOUNT_ID = 'b218735f35f1b527681edbcbf608c887'
R2_ACCESS_KEY_ID = '1469a62592bb61cdb4561c70c5082c04'
R2_SECRET_ACCESS_KEY = '7ffd4586400aebc0fa63a488c137ebb9a110d7260e36e091458082236802e3d6'
BUCKET_NAME = 'coloring-pages'
ENDPOINT_URL = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com'

# Configuración del cliente S3 para R2
s3_client = boto3.client(
    's3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4'),
    region_name='auto' # Cloudflare R2 no usa regiones tradicionales, 'auto' es comúnmente aceptado o se puede omitir/usar 'us-east-1'
)

ASSETS_DIR = 'extracted_assets'

def upload_file_to_r2(file_path, object_name=None):
    """Sube un archivo a un bucket S3/R2."""
    if object_name is None:
        object_name = os.path.basename(file_path)

    # Determinar Content-Type
    content_type, _ = mimetypes.guess_type(file_path)
    if content_type is None:
        content_type = 'application/octet-stream'

    try:
        print(f"Subiendo {object_name}...")
        s3_client.upload_file(
            file_path, 
            BUCKET_NAME, 
            object_name,
            ExtraArgs={'ContentType': content_type}
        )
        print(f"¡Subido con éxito: {object_name}")
        return True
    except ClientError as e:
        print(f"Error subiendo {object_name}: {e}")
        return False

def main():
    if not os.path.exists(ASSETS_DIR):
        print(f"El directorio {ASSETS_DIR} no existe. Ejecuta primero process_zip.py.")
        return

    files_uploaded = 0
    for filename in os.listdir(ASSETS_DIR):
        file_path = os.path.join(ASSETS_DIR, filename)
        if os.path.isfile(file_path):
            if upload_file_to_r2(file_path, filename):
                files_uploaded += 1

    print(f"\nProceso completado. Archivos subidos: {files_uploaded}")

if __name__ == "__main__":
    main()
