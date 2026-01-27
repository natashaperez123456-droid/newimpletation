import os
import json
import requests
import mimetypes

# Configuración
SALEOR_API_URL = "http://localhost:8000/graphql/"
AUTH_TOKEN = "24KxQ3Qe7S63o97jB1o7C5v9r8d4t1"
VARIANT_ID = "UHJvZHVjdFZhcmlhbnQ6MzQw" # Variante de "A DAY WITH MY MEOW"
FILE_PATH = "extracted_assets/a-day-with-my-meow-coloring-book.pdf"

def debug_upload():
    # Intento 1: Usando variantId (como variable y campo)
    print("--- Intento 1: variantId ---")
    query = """
    mutation CreateDigitalContent($variantId: ID!, $file: Upload!, $useDefaultSettings: Boolean!) {
        digitalContentCreate(input: {
            variantId: $variantId,
            useDefaultSettings: $useDefaultSettings,
            file: $file
        }) {
            digitalContent {
                id
            }
            errors {
                field
                message
            }
        }
    }
    """
    
    operations = {
        "query": query,
        "variables": {
            "variantId": VARIANT_ID,
            "useDefaultSettings": True,
            "file": None
        }
    }
    
    map_data = {
        "0": ["variables.file"]
    }
    
    try:
        with open(FILE_PATH, "rb") as f:
            files = {
                "0": (os.path.basename(FILE_PATH), f, mimetypes.guess_type(FILE_PATH)[0])
            }
            response = requests.post(
                SALEOR_API_URL,
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                data={"operations": json.dumps(operations), "map": json.dumps(map_data)},
                files=files
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

    # Intento 2: Usando productVariantId (como variable y campo)
    print("\n--- Intento 2: productVariantId ---")
    query_2 = """
    mutation CreateDigitalContent($productVariantId: ID!, $file: Upload!, $useDefaultSettings: Boolean!) {
        digitalContentCreate(input: {
            productVariantId: $productVariantId,
            useDefaultSettings: $useDefaultSettings,
            file: $file
        }) {
            digitalContent {
                id
            }
            errors {
                field
                message
            }
        }
    }
    """
    
    operations_2 = {
        "query": query_2,
        "variables": {
            "productVariantId": VARIANT_ID,
            "useDefaultSettings": True,
            "file": None
        }
    }
    
    try:
        with open(FILE_PATH, "rb") as f:
            files = {
                "0": (os.path.basename(FILE_PATH), f, mimetypes.guess_type(FILE_PATH)[0])
            }
            response = requests.post(
                SALEOR_API_URL,
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                data={"operations": json.dumps(operations_2), "map": json.dumps(map_data)},
                files=files
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_upload()
