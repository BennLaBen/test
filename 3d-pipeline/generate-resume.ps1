$slug = if ($args[0]) { $args[0] } else { "roller-h125" }
$targetDir = "d:\MPEB\public\images\aerotools\360\$slug"
$targetCount = 108

Write-Host "`n=== LLEDO Turntable Auto-Resume Generator ===" -ForegroundColor Cyan
Write-Host "   Slug: $slug"
Write-Host "   Target: $targetCount images`n"

$run = 0
while ($true) {
    $existing = (Get-ChildItem "$targetDir\*.webp" -ErrorAction SilentlyContinue | Measure-Object).Count
    if ($existing -ge $targetCount) {
        Write-Host "`n✅ All $targetCount images generated!" -ForegroundColor Green
        break
    }
    $run++
    Write-Host "--- Run #$run ($existing/$targetCount done) ---" -ForegroundColor Yellow
    
    & node --max-old-space-size=8192 "d:\MPEB\3d-pipeline\generate-turntable.js" $slug 36 3 1200 2>&1 | Out-Host
    
    Start-Sleep -Seconds 3
}

Write-Host "`nDone! Check: $targetDir" -ForegroundColor Green
