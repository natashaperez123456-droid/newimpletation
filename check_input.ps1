$query = @{ query = "query { __type(name: ""DigitalContentCreateInput"") { inputFields { name type { name } } } }" } | ConvertTo-Json
$res = Invoke-RestMethod -Uri http://localhost:8000/graphql/ -Method Post -ContentType "application/json" -Body $query
$res.data.__type.inputFields | ConvertTo-Json
