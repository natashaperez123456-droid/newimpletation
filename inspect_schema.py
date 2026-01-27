import requests
import json

API_URL = "http://localhost:8000/graphql/"

def main():
    query = """
    query {
      __type(name: "DigitalContentUploadInput") {
        inputFields {
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
    """
    response = requests.post(API_URL, json={'query': query})
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    main()
