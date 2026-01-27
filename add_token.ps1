$res = Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType 'application/json' -Body (Get-Content auth_query.json -Raw)
$token = $res.data.tokenCreate.token
if ($token) {
    Add-Content -Path storefront/.env -Value "SALEOR_APP_TOKEN=$token"
    Write-Host "Token added to storefront/.env"
} else {
    Write-Host "Failed to get token"
}
