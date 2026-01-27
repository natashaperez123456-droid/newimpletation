
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
if (-not $channelId) { Write-Error "Channel $channelSlug not found"; exit }
Write-Host "Got Channel ID: $channelId"

# 3. Create Collection
$createCollectionQuery = @"
mutation {
  collectionCreate(
    input: {
      name: "Featured Products"
      slug: "featured-products"
      isPublished: true
    }
  ) {
    collection {
      id
    }
    errors {
      field
      message
    }
  }
}
"@
$collectionResponse = Execute-GraphQL -Query $createCollectionQuery -Token $token
$collectionId = $collectionResponse.data.collectionCreate.collection.id
if ($collectionResponse.data.collectionCreate.errors) {
    Write-Host "Error creating collection (might already exist?):"
    $collectionResponse.data.collectionCreate.errors | Format-Table
    # If it exists, we might need to find it to update channel listing.
    # Try fetching it.
    $findResponse = Execute-GraphQL -Query "query { collection(slug: `"featured-products`") { id } }" -Token $token
    $collectionId = $findResponse.data.collection.id
}
if (-not $collectionId) { Write-Error "Could not get collection ID"; exit }
Write-Host "Got Collection ID: $collectionId"

# 4. Update Channel Listing
$updateChannelQuery = @"
mutation {
  collectionChannelListingUpdate(
    id: "$collectionId"
    input: {
      addChannels: [
        { channelId: "$channelId", isPublished: true }
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
$listingResponse = Execute-GraphQL -Query $updateChannelQuery -Token $token
if ($listingResponse.data.collectionChannelListingUpdate.errors) {
    Write-Host "Error updating channel listing:"
    $listingResponse.data.collectionChannelListingUpdate.errors | Format-Table
} else {
    Write-Host "Collection created and published to channel successfully!"
}
