import requests
import json
import os

API_URL = "http://localhost:8000/graphql/"

MAPPING = {
    "cozy-animals": "PDFs/COZY-ANIMALS-coloring-book.pdf",
    "a-day-with-my-meow": "PDFs/a-day-with-my-meow-coloring-book.pdf",
    "adventure-cozy": "PDFs/adventure-cozy-bear-coloring-book.pdf",
    "animals-mandala-coloring": "PDFs/animals-mandala-coloring-book.pdf",
    "dog-and-cats-coloring-pages": "PDFs/dog-and-cats-coloring-pages-book.pdf",
    "floral-potraits": "PDFs/floral-potraits-coloring-book.pdf",
    "kawaii-coloring": "PDFs/adventure-cozy-coloring-book.pdf"
}

VARIANTS = {
    "cozy-animals": "UHJvZHVjdFZhcmlhbnQ6NDEy",
    "a-day-with-my-meow": "UHJvZHVjdFZhcmlhbnQ6MzQw",
    "adventure-cozy": "UHJvZHVjdFZhcmlhbnQ6Mzcy",
    "animals-mandala-coloring": "UHJvZHVjdFZhcmlhbnQ6MzMz",
    "dog-and-cats-coloring-pages": "UHJvZHVjdFZhcmlhbnQ6MzQ4",
    "floral-potraits": "UHJvZHVjdFZhcmlhbnQ6NDEw",
    "kawaii-coloring": "UHJvZHVjdFZhcmlhbnQ6Mzg2"
}

def get_token():
    query = """
    mutation {
      tokenCreate(email: "admin@example.com", password: "admin") {
        token
      }
    }
    """
    response = requests.post(API_URL, json={'query': query})
    return response.json()['data']['tokenCreate']['token']

def upload_pdf(variant_id, pdf_path, token):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # Correct mutation for uploading digital content
    mutation = """
    mutation CreateDigital($variantId: ID!, $file: Upload!) {
      digitalContentCreate(variantId: $variantId, input: {
        useDefaultSettings: true,
        contentFile: $file
      }) {
        content { id }
        errors { field message }
      }
    }
    """
    
    operations = {
        'query': mutation,
        'variables': {'variantId': variant_id, 'file': None}
    }
    map_data = {'0': ['variables.file']}
    
    with open(pdf_path, 'rb') as f:
        files = {
            '0': (os.path.basename(pdf_path), f, 'application/pdf')
        }
        payload = {
            'operations': json.dumps(operations),
            'map': json.dumps(map_data)
        }
        print(f"Uploading {pdf_path} to {variant_id}...")
        res = requests.post(API_URL, data=payload, files=files, headers=headers)
        print(res.text)

def main():
    try:
        token = get_token()
        print("Got token.")
        for slug, pdf in MAPPING.items():
            variant_id = VARIANTS.get(slug)
            if variant_id:
                upload_pdf(variant_id, pdf, token)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
