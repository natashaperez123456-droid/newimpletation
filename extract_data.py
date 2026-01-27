
import json
import requests

API_URL = "https://saleor-api-634185135816.us-east1.run.app/graphql/"

QUERY = """
query GetFullProducts {
  products(first: 50, channel: "default-channel") {
    edges {
      node {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        pricing {
          priceRange {
            start {
              gross {
                amount
                currency
              }
            }
          }
        }
        category {
          id
          name
        }
        variants {
          id
          name
        }
      }
    }
  }
}
"""

def fetch_products():
    print("Extrayendo productos de Saleor...")
    response = requests.post(API_URL, json={'query': QUERY})
    if response.status_code == 200:
        data = response.json()
        if 'errors' in data:
            print("Errores en GraphQL:", data['errors'])
            return None
        
        products = []
        for edge in data['data']['products']['edges']:
            products.append(edge['node'])
        
        return products
    else:
        print(f"Error HTTP {response.status_code}")
        return None

if __name__ == "__main__":
    products = fetch_products()
    if products:
        with open('storefront/src/lib/products_data.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print(f"Éxito: {len(products)} productos guardados en storefront/src/lib/products_data.json")
