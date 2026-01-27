import json
import requests
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Configuración de Saleor
SALEOR_API_URL = "http://localhost:8000/graphql/"
AUTH_TOKEN = "24KxQ3Qe7S63o97jB1o7C5v9r8d4t1"

def get_saleor_client():
    transport = RequestsHTTPTransport(
        url=SALEOR_API_URL,
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        verify=False,
        retries=3,
    )
    return Client(transport=transport, fetch_schema_from_transport=False)

def list_products(client):
    query = gql("""
    query {
        products(first: 100, channel: "default-channel") {
            edges {
                node {
                    name
                    slug
                    id
                    variants {
                        id
                    }
                }
            }
        }
    }
    """)
    try:
        result = client.execute(query)
        print("Productos encontrados:")
        for edge in result["products"]["edges"]:
            product = edge["node"]
            print(f"Name: {product['name']}, Slug: {product['slug']}, ID: {product['id']}")
            if product['variants']:
                 print(f"  Variant ID: {product['variants'][0]['id']}")
            else:
                 print("  No variants")
    except Exception as e:
        print(f"Error listing products: {e}")

if __name__ == "__main__":
    client = get_saleor_client()
    list_products(client)
