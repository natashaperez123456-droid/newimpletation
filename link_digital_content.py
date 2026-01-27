import os
import json
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Configuración de Saleor
SALEOR_API_URL = "http://localhost:8000/graphql/"
AUTH_TOKEN = "24KxQ3Qe7S63o97jB1o7C5v9r8d4t1" 

# Directorio de archivos
ASSETS_DIR = "extracted_assets"

# Mapeo manual de nombres de archivo a slugs (basado en list_products.py)
SLUG_MAPPING = {
    "a-day-with-my-meow-coloring-book": "a-day-with-my-meow",
    "adventure-cozy-bear-coloring-book": "adventure-cozy",
    "animals-mandala-coloring-book": "animals-mandala-coloring",
    "COZY-ANIMALS-coloring-book": "COZY-ANIMALS",
    "dog-and-cats-coloring-pages-book": "dog-and-cats-coloring-pages",
    "floral-potraits-coloring-book": "floral-potraits",
    "kawaii-home-coloring-book": "kawaii-coloring"
}

def get_saleor_client():
    transport = RequestsHTTPTransport(
        url=SALEOR_API_URL,
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        verify=False,
        retries=3,
    )
    return Client(transport=transport, fetch_schema_from_transport=False)

def find_product_variant_id(client, slug):
    print(f"Buscando producto con slug: {slug}")
    query = gql("""
    query ProductVariant($slug: String!) {
        product(slug: $slug, channel: "default-channel") {
            id
            name
            variants {
                id
            }
        }
    }
    """)
    params = {"slug": slug}
    try:
        result = client.execute(query, variable_values=params)
        if result["product"]:
            print(f"  Encontrado: {result['product']['name']}")
            if result["product"]["variants"]:
                return result["product"]["variants"][0]["id"]
        return None
    except Exception as e:
        print(f"  Error buscando producto {slug}: {e}")
        return None

def upload_digital_content(client, variant_id, file_path):
    print(f"Subiendo contenido digital para variante {variant_id} desde {os.path.basename(file_path)}")
    
    mutation = gql("""
    mutation CreateDigitalContent($variantId: ID!, $file: Upload!, $useDefaultSettings: Boolean!) {
        digitalContentCreate(input: {
            variantId: $variantId,
            useDefaultSettings: $useDefaultSettings,
            file: $file
        }) {
            digitalContent {
                id
                contentFile
            }
            errors {
                field
                message
            }
        }
    }
    """)
    
    try:
        with open(file_path, "rb") as f:
            params = {
                "variantId": variant_id,
                "useDefaultSettings": True,
                "file": f
            }
            result = client.execute(mutation, variable_values=params, upload_files=True)
            
            data = result.get("digitalContentCreate", {})
            if data.get("errors"):
                print(f"  Error creando contenido digital: {data['errors']}")
                return False
            
            if data.get("digitalContent"):
                print(f"  ÉXITO: Contenido digital creado (ID: {data['digitalContent']['id']})")
                return True
            
            return False

    except Exception as e:
        print(f"  Excepción subiendo {file_path}: {e}")
        return False

def main():
    if not os.path.exists(ASSETS_DIR):
        print(f"Directorio {ASSETS_DIR} no encontrado.")
        return

    client = get_saleor_client()
    
    files = [f for f in os.listdir(ASSETS_DIR) if os.path.isfile(os.path.join(ASSETS_DIR, f))]
    
    for filename in files:
        # Determinar slug base del nombre del archivo
        name_without_ext = os.path.splitext(filename)[0]
        
        # Buscar el slug correcto en el mapeo
        target_slug = None
        
        # Estrategia 1: Coincidencia directa en el mapa
        if name_without_ext in SLUG_MAPPING:
            target_slug = SLUG_MAPPING[name_without_ext]
        
        # Estrategia 2: Si es un zip con el mismo nombre base que un pdf ya mapeado
        if not target_slug:
             # A veces el nombre del archivo en el zip tiene sufijos diferentes o es igual
             # Por ahora usaremos el mapa que parece cubrir todos los casos base
             pass

        if not target_slug:
            print(f"⚠️ No se encontró mapeo para el archivo: {filename}")
            continue

        # Buscar variant_id
        variant_id = find_product_variant_id(client, target_slug)
        
        if variant_id:
            upload_digital_content(client, variant_id, os.path.join(ASSETS_DIR, filename))
        else:
            print(f"❌ No se encontró variante para el slug {target_slug} (Archivo: {filename})")

if __name__ == "__main__":
    main()
