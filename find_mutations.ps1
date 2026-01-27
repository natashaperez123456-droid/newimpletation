$authBody = @{
    query = "mutation { tokenCreate(email: ""admin@example.com"", password: ""admin"") { token } }"
} | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType "application/json" -Body $authBody
$token = $authRes.data.tokenCreate.token

$query = @{ query = "query { __type(name: ""Mutation"") { fields { name } } }" } | ConvertTo-Json
$res = Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType "application/json" -Body $query
$res.data.__type.fields | Where-Object { $_.name -like "*digital*" } | ForEach-Object { $_.name } | Out-File -FilePath "digital_mutations.txt"
