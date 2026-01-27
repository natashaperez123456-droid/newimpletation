import json
import requests
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Configuración
SALEOR_API_URL = "http://localhost:8000/graphql/"
AUTH_TOKEN = "24KxQ3Qe7S63o97jB1o7C5v9r8d4t1"

def get_client():
    transport = RequestsHTTPTransport(
        url=SALEOR_API_URL,
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        verify=False,
        retries=3,
    )
    return Client(transport=transport, fetch_schema_from_transport=False)

def create_digital_product_type(client):
    print("Creando Product Type 'Digital Book'...")
    query = gql("""
    mutation {
        productTypeCreate(
            input: {
                name: "Digital Book"
                slug: "digital-book"
                isShippingRequired: false
                hasVariants: true
                kind: NORMAL
            }
        ) {
            productType {
                id
                name
            }
            errors {
                field
                message
            }
        }
    }
    """)
    try:
        result = client.execute(query)
        data = result["productTypeCreate"]
        if data["errors"]:
            print(f"Error creando Product Type: {data['errors']}")
            # Si ya existe, intentamos buscarlo
            return find_product_type(client, "digital-book")
        
        print(f"Product Type creado: {data['productType']['id']}")
        return data["productType"]["id"]
    except Exception as e:
        print(f"Excepción: {e}")
        return None

def find_product_type(client, slug):
    query = gql("""
    query($slug: String!) {
        productType(slug: $slug) {
            id
        }
    }
    """)
    try:
        result = client.execute(query, variable_values={"slug": slug})
        if result["productType"]:
            return result["productType"]["id"]
    except:
        pass
    return None

def get_coloring_books(client):
    query = gql("""
    query {
        products(first: 100, channel: "default-channel") {
            edges {
                node {
                    id
                    name
                    productType {
                        id
                        name
                    }
                }
            }
        }
    }
    """)
    result = client.execute(query)
    return [edge["node"] for edge in result["products"]["edges"]]

def update_product_type(client, product_id, type_id):
    # Nota: No hay una mutación directa para cambiar el productType de un producto existente de forma trivial si tienen atributos diferentes.
    # Pero podemos intentarlo con productUpdate si el esquema lo permite, o recrear.
    # Saleor NO permite cambiar el ProductType de un producto vía mutation standard `productUpdate`.
    # Solo permite cambiar atributos.
    
    # Si no se puede cambiar, el usuario tendrá que recrearlos.
    # PERO, verifiquemos si `productUpdate` acepta `productType`.
    # En versiones recientes, NO lo acepta.
    
    print(f"Intentando actualizar producto {product_id}...")
    return False 

# Si no podemos actualizar, al menos creamos el tipo para que el usuario pueda crear nuevos o intentemos una migración manual.
# Pero espera, si el usuario ya tiene los productos, recrearlos es doloroso.
# Tal vez podamos actualizar el ProductType EXISTENTE para que no requiera envío?

def update_existing_product_type(client, type_id):
    print(f"Actualizando Product Type existente {type_id} para ser digital...")
    query = gql("""
    mutation($id: ID!) {
        productTypeUpdate(
            id: $id,
            input: {
                isShippingRequired: false
            }
        ) {
            productType {
                id
                isShippingRequired
            }
            errors {
                field
                message
            }
        }
    }
    """)
    try:
        result = client.execute(query, variable_values={"id": type_id})
        if result["productTypeUpdate"]["errors"]:
            print(f"Error actualizando: {result['productTypeUpdate']['errors']}")
        else:
            print("¡Éxito! Product Type actualizado a 'No Shipping'.")
    except Exception as e:
        print(f"Excepción: {e}")

def main():
    client = get_client()
    products = get_coloring_books(client)
    
    if not products:
        print("No se encontraron productos.")
        return

    # Agrupar por Product Type
    type_ids = set()
    for p in products:
        print(f"Producto: {p['name']} - Tipo: {p['productType']['name']} ({p['productType']['id']})")
        type_ids.add(p['productType']['id'])
    
    # Actualizar los tipos de producto existentes para que sean digitales (no shipping)
    for type_id in type_ids:
        update_existing_product_type(client, type_id)

if __name__ == "__main__":
    main()
