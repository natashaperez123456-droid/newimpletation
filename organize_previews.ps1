$folders = "a-day-with-my-meow", "adventure-cozy", "animals-mandala-coloring", "dog-and-cats-coloring-pages", "floral-potraits", "kawaii-coloring", "COZY-ANIMALS"
$baseDest = "storefront/public/preview"

if (!(Test-Path $baseDest)) {
    New-Item -ItemType Directory -Path $baseDest
}

foreach ($folder in $folders) {
    $srcPath = $folder
    $destPath = Join-Path $baseDest $folder.ToLower()
    
    if (Test-Path $srcPath) {
        if (!(Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath
        }
        
        $files = Get-ChildItem -Path $srcPath -Filter *.jpeg
        $i = 1
        foreach ($file in $files) {
            $newName = "page-$i.jpg"
            Copy-Item $file.FullName (Join-Path $destPath $newName) -Force
            $i++
        }
        Write-Host "Processed $folder -> $destPath"
    } else {
        Write-Host "Folder $folder not found"
    }
}
