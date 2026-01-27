$token = (Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType 'application/json' -Body (Get-Content auth_query.json -Raw)).data.tokenCreate.token

$headers = @{
    Authorization = "Bearer $token"
}

$response = Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType 'application/json' -Headers $headers -Body (Get-Content check_digital.json -Raw)
$response | ConvertTo-Json -Depth 10
