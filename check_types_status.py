import json
import requests
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

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

def check_types(client):
    query = gql("""
    query {
        productTypes(first: 20) {
            edges {
                node {
                    name
                    isShippingRequired
                    isDigital
                    hasVariants
                }
            }
        }
    }
    """)
    result = client.execute(query)
    for edge in result["productTypes"]["edges"]:
        pt = edge["node"]
        print(f"Type: {pt['name']} | Shipping Required: {pt['isShippingRequired']} | Is Digital: {pt.get('isDigital', 'N/A')}")

if __name__ == "__main__":
    check_types(get_client())
