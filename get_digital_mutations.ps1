$query = @{
    query = 'query { __type(name: "Mutation") { fields { name } } }'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/graphql/" -Method Post -Body $query -ContentType "application/json"
$response.data.__type.fields | Where-Object { $_.name -like "*digital*" } | ConvertTo-Json | Out-File -FilePath "digital_mutations.json"
