import json
import requests

# Configuración
SALEOR_API_URL = "http://localhost:8000/graphql/"
AUTH_TOKEN = "juw86XY3mcmzEu9hk9Z8IPUlHQnDIX"
ASSETS_DIR = "extracted_assets"

# Mapeo de slugs de producto a los nombres de archivo exactos en R2
SLUG_TO_FILE_MAPPING = {
    "a-day-with-my-meow": {
        "pdf": "a-day-with-my-meow-coloring-book.pdf",
        "zip": "a-day-with-my-meow-coloring-book.zip"
    },
    "adventure-cozy": {
        "pdf": "adventure-cozy-bear-coloring-book.pdf",
        "zip": "adventure-cozy-bear-coloring-book.zip"
    },
    "animals-mandala-coloring": {
        "pdf": "animals-mandala-coloring-book.pdf",
        "zip": "animals-mandala-coloring-book.zip"
    },
    "COZY-ANIMALS": {
        "pdf": "COZY-ANIMALS-coloring-book.pdf",
        "zip": "COZY-ANIMALS-coloring-book.zip"
    },
    "dog-and-cats-coloring-pages": {
        "pdf": "dog-and-cats-coloring-pages-book.pdf",
        "zip": "dog-and-cats-coloring-pages-book.zip"
    },
    "floral-potraits": {
        "pdf": "floral-potraits-coloring-book.pdf",
        "zip": "floral-potraits-coloring-book.zip"
    },
    "kawaii-coloring": {
        "pdf": "kawaii-home-coloring-book.pdf",
        "zip": "kawaii-home-coloring-book.zip"
    }
}

def execute_graphql(query, variables=None):
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    
    try:
        response = requests.post(SALEOR_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e.response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

def get_products_with_variants():
    query = """
    query GetProducts {
        products(first: 100, channel: "default-channel") {
            edges {
                node {
                    id
                    name
                    slug
                    variants {
                        id
                        name
                    }
                }
            }
        }
    }
    """
    data = execute_graphql(query)
    if data and "errors" not in data:
        return [edge["node"] for edge in data["data"]["products"]["edges"]]
    print(f"Error fetching products: {data.get('errors')}")
    return []

def delete_existing_digital_content(variant_id):
    # En Saleor 3+, digitalContentDelete requiere el ID del contenido, no de la variante.
    # Pero no podemos obtenerlo fácilmente si el producto no es digital.
    # El método más robusto es asegurar que el producto es digital y LUEGO limpiar.
    # Por ahora, omitiremos la limpieza y la creación fallará si ya existe contenido.
    pass

def link_digital_content(variant_id, file_key):
    print(f"  Vinculando variante {variant_id} con R2 key: {file_key}")
    # Esta es la parte que no es posible con la API estándar.
    # No hay una mutación para "apuntar" a una URL externa o S3 key.
    # La API requiere una subida de archivo para crear el objeto DigitalContent.
    # La solución es una modificación directa en la base de datos.
    return False # Indicamos que la vinculación API no es posible

def main():
    print("Iniciando protocolo de vinculación final...")
    products = get_products_with_variants()
    
    if not products:
        print("No se pudieron obtener los productos de Saleor.")
        return

    print("\n--- PASO 1: Mapeo de IDs ---")
    product_map = {p['slug']: p for p in products}
    print("Mapeo de productos y variantes obtenido.")

    print("\n--- PASO 2: Preparación de Comandos SQL ---")
    sql_commands = []
    
    for slug, files in SLUG_TO_FILE_MAPPING.items():
        if slug in product_map:
            product = product_map[slug]
            
            # Asumimos una variante para PDF y otra para ZIP si existen
            pdf_variant = next((v for v in product['variants'] if 'pdf' in v['name'].lower() or len(product['variants']) == 1 or 'digital' in v['name'].lower()), None)
            zip_variant = next((v for v in product['variants'] if 'zip' in v['name'].lower() or 'images' in v['name'].lower()), None)
            
            if pdf_variant:
                # El formato de la URL guardada debe ser la KEY del bucket, ya que `django-storages` la usará.
                file_key = files['pdf']
                # Comando para crear o actualizar el DigitalContent
                # `on_conflict` es para postgres, asegura que si ya existe, se actualice.
                sql = (
                    f"INSERT INTO product_digitalcontent (product_variant_id, content_file, use_default_settings, max_downloads, url_valid_days, automatic_fulfillment, content_type) "
                    f"VALUES ((SELECT id FROM product_productvariant WHERE private_metadata->>'saleor.graphql.id' = '{pdf_variant['id']}'), '{file_key}', true, 5, 30, true, 'application/pdf') "
                    f"ON CONFLICT (product_variant_id) DO UPDATE SET content_file = EXCLUDED.content_file, content_type = 'application/pdf';"
                )
                sql_commands.append(sql)
                print(f"  [PDF] Preparado SQL para {product['name']} ({pdf_variant['name']}) -> {file_key}")
            
            if zip_variant:
                file_key = files['zip']
                sql = (
                    f"INSERT INTO product_digitalcontent (product_variant_id, content_file, use_default_settings, max_downloads, url_valid_days, automatic_fulfillment) "
                    f"VALUES ('{zip_variant['id'].replace('UHJvZHVjdFZhcmlhbnQ6', '')}', '{file_key}', true, 5, 30, true) "
                    f"ON CONFLICT (product_variant_id) DO UPDATE SET content_file = EXCLUDED.content_file;"
                )
                sql_commands.append(sql)
                print(f"  [ZIP] Preparado SQL para {product['name']} ({zip_variant['name']}) -> {file_key}")

    print("\n--- PASO 3: Ejecución de Comandos ---")
    if not sql_commands:
        print("No se generaron comandos SQL. Verifica los slugs y nombres de variantes.")
        return
        
    # Construir el comando final para ejecutar en el contenedor de Docker
    full_sql_query = " ".join(sql_commands)
    # Importante: Escapar comillas simples dentro del SQL si las hubiera (no en nuestro caso)
    
    docker_command = f"docker exec -i saleor-platform-db-1 psql -U saleor -d saleor -c \"{full_sql_query}\""

    print("\nPor favor, ejecuta el siguiente comando en tu terminal para vincular los archivos:")
    print("===================================================================================")
    print(docker_command)
    print("===================================================================================")
    print("\nDespués de ejecutarlo, la vinculación estará completa.")

if __name__ == "__main__":
    main()
