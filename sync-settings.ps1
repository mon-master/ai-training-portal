# NASとの設定・メモリ同期スクリプト
param(
    [ValidateSet("backup","restore")]
    [string]$Mode = "backup"
)

$NAS_DIR   = "Z:\ai-training-materials"
$LOCAL_DIR = $PSScriptRoot

if ($Mode -eq "backup") {
    Write-Host "backup: 設定・メモリをNASに保存します..." -ForegroundColor Cyan

    # settings をNASにコピー
    New-Item -ItemType Directory -Force -Path "$NAS_DIR\settings" | Out-Null
    $settingsFiles = Get-ChildItem "$LOCAL_DIR\*.settings.local.json" -ErrorAction SilentlyContinue
    foreach ($f in $settingsFiles) {
        Copy-Item $f.FullName "$NAS_DIR\settings\$($f.Name)" -Force
        Write-Host "  $($f.Name) をNASに保存しました" -ForegroundColor Green
    }

    # claude-memory をNASにコピー
    $srcMemory = "C:\Users\simma\.claude\projects\C--Users-simma\memory"
    $dstMemory = "$NAS_DIR\claude-memory"
    if (Test-Path $srcMemory) {
        New-Item -ItemType Directory -Force -Path $dstMemory | Out-Null
        Copy-Item "$srcMemory\*" $dstMemory -Recurse -Force
        Write-Host "  claude-memory をNASに保存しました" -ForegroundColor Green
    }

    Write-Host "backup: 完了しました" -ForegroundColor Cyan
}
elseif ($Mode -eq "restore") {
    Write-Host "restore: NASから設定・メモリを復元します..." -ForegroundColor Cyan

    # settings をNASから復元
    $srcSettingsDir = "$NAS_DIR\settings"
    if (Test-Path $srcSettingsDir) {
        $settingsFiles = Get-ChildItem "$srcSettingsDir\*.settings.local.json" -ErrorAction SilentlyContinue
        foreach ($f in $settingsFiles) {
            Copy-Item $f.FullName "$LOCAL_DIR\$($f.Name)" -Force
            Write-Host "  $($f.Name) を復元しました" -ForegroundColor Green
        }
    }

    # claude-memory をNASから復元
    $srcMemory = "$NAS_DIR\claude-memory"
    $dstMemory = "C:\Users\simma\.claude\projects\C--Users-simma\memory"
    if (Test-Path $srcMemory) {
        New-Item -ItemType Directory -Force -Path $dstMemory | Out-Null
        Copy-Item "$srcMemory\*" $dstMemory -Recurse -Force
        Write-Host "  claude-memory を復元しました" -ForegroundColor Green
    }

    Write-Host "restore: 完了しました" -ForegroundColor Cyan
}
