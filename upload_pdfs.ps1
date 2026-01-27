# 1. Get Token
$token = (curl.exe -s -X POST http://localhost:8000/graphql/ -H "Content-Type: application/json" -d "{ \"query\": \"mutation { tokenCreate(email: \\\"admin@example.com\\\", password: \\\"admin\\\") { token } }\" }" | ConvertFrom-Json).data.tokenCreate.token

# 2. Upload PDFs
$mapping = @{
    "cozy-animals" = "PDFs/COZY-ANIMALS-coloring-book.pdf"
    "a-day-with-my-meow" = "PDFs/a-day-with-my-meow-coloring-book.pdf"
    "adventure-cozy" = "PDFs/adventure-cozy-bear-coloring-book.pdf"
    "animals-mandala-coloring" = "PDFs/animals-mandala-coloring-book.pdf"
    "dog-and-cats-coloring-pages" = "PDFs/dog-and-cats-coloring-pages-book.pdf"
    "floral-potraits" = "PDFs/floral-potraits-coloring-book.pdf"
}

$variants = @{
    "cozy-animals" = "UHJvZHVjdFZhcmlhbnQ6NDEy"
    "a-day-with-my-meow" = "UHJvZHVjdFZhcmlhbnQ6MzQw"
    "adventure-cozy" = "UHJvZHVjdFZhcmlhbnQ6Mzcy"
    "animals-mandala-coloring" = "UHJvZHVjdFZhcmlhbnQ6MzMz"
    "dog-and-cats-coloring-pages" = "UHJvZHVjdFZhcmlhbnQ6MzQ4"
    "floral-potraits" = "UHJvZHVjdFZhcmlhbnQ6NDEw"
}

foreach ($slug in $mapping.Keys) {
    $pdfPath = $mapping[$slug]
    $variantId = $variants[$slug]
    
    if (Test-Path $pdfPath) {
        Write-Host "Uploading $pdfPath to $slug ($variantId)..."
        
        $operations = @"
{
  "query": "mutation CreateDigitalContent(`$variantId: ID!, `$file: Upload!) { digitalContentCreate(variantId: `$variantId, input: {useDefaultSettings: true, maxDownloads: 0, urlValidDays: 0, automaticSettleToken: true}) { content { id } } digitalContentUpload(variantId: `$variantId, file: `$file) { content { id } } }",
  "variables": {
    "variantId": "$variantId",
    "file": null
  }
}
"@
        $map = '{"0": ["variables.file"]}'
        
        $operations | Out-File -FilePath "ops.json" -Encoding ASCII
        $map | Out-File -FilePath "map.json" -Encoding ASCII
        
        curl.exe -s -X POST http://localhost:8000/graphql/ `
            -H "Authorization: Bearer $token" `
            -F "operations=<ops.json" `
            -F "map=<map.json" `
            -F "0=@$pdfPath"
            
        Write-Host "Done $slug"
    }
}
