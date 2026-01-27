
$tokenUrl = "http://localhost:8000/graphql/"
$email = "admin@example.com"
$password = "admin"

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

# 2. Create Digital Product Type
$createTypeQuery = @"
mutation {
  productTypeCreate(
    input: {
      name: "Digital Product"
      slug: "digital-product"
      isShippingRequired: false
      isDigital: true
      hasVariants: false
      kind: NORMAL
    }
  ) {
    productType {
      id
      name
      isShippingRequired
    }
    errors {
      field
      message
    }
  }
}
"@

$typeResponse = Execute-GraphQL -Query $createTypeQuery -Token $token

if ($typeResponse.data.productTypeCreate.errors) {
    Write-Host "Error creating Product Type:"
    $typeResponse.data.productTypeCreate.errors | Format-Table
} else {
    Write-Host "Digital Product Type created successfully!"
    $typeResponse.data.productTypeCreate.productType | Format-List
}
