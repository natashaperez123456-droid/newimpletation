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

def inspect_input(client):
    query = gql("""
    query {
        __type(name: "DigitalContentUploadInput") {
            inputFields {
                name
                type {
                    name
                    kind
                }
            }
        }
    }
    """)
    result = client.execute(query)
    print("DigitalContentUploadInput Fields:")
    for field in result["__type"]["inputFields"]:
        # Safer type extraction
        t = field['type']
        t_name = t['name']
        t_kind = t['kind']
        
        while t['ofType']:
            t = t['ofType']
            if t['name']:
                t_name = t['name']
            if t['kind']:
                t_kind = t['kind']
        
        print(f"- {field['name']}: {t_name} ({t_kind})")

if __name__ == "__main__":
    inspect_input(get_client())
