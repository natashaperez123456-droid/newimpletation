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

# 2. Create Categories
$createCategoryQuery = @"
mutation {
  catKids: categoryCreate(input: { name: "Kids", slug: "kids" }) {
    category { id name slug }
    errors { field message }
  }
  catAdults: categoryCreate(input: { name: "Adults", slug: "adults" }) {
    category { id name slug }
    errors { field message }
  }
}
"@

$response = Execute-GraphQL -Query $createCategoryQuery -Token $token

if ($response.data.catKids.errors) {
    Write-Host "Error creating Kids category:"
    $response.data.catKids.errors | Format-Table
} else {
    Write-Host "Created Kids Category: $($response.data.catKids.category.id)"
}

if ($response.data.catAdults.errors) {
    Write-Host "Error creating Adults category:"
    $response.data.catAdults.errors | Format-Table
} else {
    Write-Host "Created Adults Category: $($response.data.catAdults.category.id)"
}
