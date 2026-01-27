
$tokenUrl = "http://localhost:8000/graphql/"
$email = "admin@example.com"
$password = "admin"
$channelSlug = "default-channel"

function Execute-GraphQL {
    param (
        [string]$Query,
        [string]$Token
    )
    $body = @{ query = $Query } | ConvertTo-Json -Depth 10
    $headers = @{}
    if ($Token) { $headers["Authorization"] = "JWT $Token" }
    
    return Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/json" -Headers $headers
}

# 1. Get Token
$tokenResponse = Execute-GraphQL -Query "mutation { tokenCreate(email: `"$email`", password: `"$password`") { token errors { field message } } }"
$token = $tokenResponse.data.tokenCreate.token
if (-not $token) { Write-Error "No token"; exit }
Write-Host "Got Token."

# 2. Get Channel ID
$channelResponse = Execute-GraphQL -Query "query { channel(slug: `"$channelSlug`") { id } }" -Token $token
$channelId = $channelResponse.data.channel.id
Write-Host "Got Channel ID: $channelId"

# 3. Get Digital Product Type ID
$typeQuery = "query { productTypes(first: 50) { edges { node { id name } } } }"
$typeResponse = Execute-GraphQL -Query $typeQuery -Token $token
$edges = $typeResponse.data.productTypes.edges
$productType = $edges | Where-Object { $_.node.name -eq "Digital Product" }
$productTypeId = $productType.node.id

if (-not $productTypeId) {
    Write-Host "Available Types:"
    $edges.node | Format-Table id, name
    Write-Error "Digital Product Type not found. Run create_digital_type.ps1 first."
    exit 
}
Write-Host "Got Product Type ID: $productTypeId"

# 4. Create Product
$createProductQuery = @"
mutation {
  productCreate(
    input: {
      name: "Sample Digital Coloring Page"
      slug: "sample-digital-coloring-page"
      productType: "$productTypeId"
    }
  ) {
    product {
      id
    }
    errors {
      field
      message
    }
  }
}
"@
$prodResponse = Execute-GraphQL -Query $createProductQuery -Token $token
$productId = $prodResponse.data.productCreate.product.id
if (-not $productId) { 
    Write-Host "Errors creating product:"
    $prodResponse.data.productCreate.errors | Format-Table
    exit 
}
Write-Host "Created Product: $productId"

# 5. Create Variant (Price 10.00)
$createVariantQuery = @"
mutation {
  productVariantCreate(
    input: {
      product: "$productId"
      sku: "DIGITAL-SAMPLE-001"
    }
  ) {
    productVariant {
      id
    }
    errors {
      field
      message
    }
  }
}
"@
$varResponse = Execute-GraphQL -Query $createVariantQuery -Token $token
$variantId = $varResponse.data.productVariantCreate.productVariant.id
Write-Host "Created Variant: $variantId"

# 6. Set Price on Channel
$updateChannelListQuery = @"
mutation {
  productChannelListingUpdate(
    id: "$productId"
    input: {
      updateChannels: [
        {
          channelId: "$channelId"
          isPublished: true
          visibleInListings: true
        }
      ]
    }
  ) {
    errors {
      field
      message
    }
  }
}
"@
$channelListResponse = Execute-GraphQL -Query $updateChannelListQuery -Token $token

# 7. Set Variant Price
$updateVariantChannelQuery = @"
mutation {
  productVariantChannelListingUpdate(
    id: "$variantId"
    input: {
      updateChannels: [
        {
          channelId: "$channelId"
          price: 10.00
        }
      ]
    }
  ) {
    errors {
      field
      message
    }
  }
}
"@
$varChannelResponse = Execute-GraphQL -Query $updateVariantChannelQuery -Token $token

# 8. Add to Featured Collection (Optional but helpful)
# Find collection ID
$collQuery = "query { collection(slug: `"featured-products`") { id } }"
$collResponse = Execute-GraphQL -Query $collQuery -Token $token
$collectionId = $collResponse.data.collection.id

if ($collectionId) {
    $addCollQuery = @"
    mutation {
      collectionAddProducts(
        collectionId: "$collectionId"
        products: ["$productId"]
      ) {
        errors { field message }
      }
    }
"@
    $addCollRes = Execute-GraphQL -Query $addCollQuery -Token $token
    Write-Host "Added to Featured Products collection."
}

Write-Host "Done! 'Sample Digital Coloring Page' is ready."
