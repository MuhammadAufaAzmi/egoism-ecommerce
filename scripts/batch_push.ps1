git reset HEAD~1

$files = Get-ChildItem -Path "public\products\" -File
$batchSize = 30

for ($i = 0; $i -lt $files.Count; $i += $batchSize) {
    $batch = $files | Select-Object -Skip $i -First $batchSize
    foreach ($file in $batch) {
        git add $file.FullName
    }
    git commit -m "chore: adding product images batch $([math]::floor($i / $batchSize) + 1)"
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push batch $([math]::floor($i / $batchSize) + 1). Retrying..."
        Start-Sleep -Seconds 2
        git push
    }
}

git add scripts/
git commit -m "feat: mass import of product images and pricing scripts"
git push
