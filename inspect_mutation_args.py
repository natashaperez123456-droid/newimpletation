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

def inspect_mutation(client):
    query = gql("""
    query {
        __type(name: "Mutation") {
            fields {
                name
                args {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }
    }
    """)
    result = client.execute(query)
    for field in result["__type"]["fields"]:
        if field["name"] == "digitalContentCreate":
            print(f"Mutation: {field['name']}")
            for arg in field["args"]:
                type_name = arg['type']['name'] or (arg['type']['ofType']['name'] if arg['type']['ofType'] else "Unknown")
                print(f"  Arg: {arg['name']} -> {type_name}")

if __name__ == "__main__":
    inspect_mutation(get_client())
