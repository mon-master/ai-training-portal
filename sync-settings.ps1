# NASとの設定・メモリ同期スクリプト
param(
    [ValidateSet("backup","restore")]
    [string]$Mode = "backup"
)

$NAS_DIR   = "Z:\ai-training-materials"
$LOCAL_DIR = $PSScriptRoot

if ($Mode -eq "backup") {
    Write-Host "[backup] 設定・メモリをNASに保存します..." -ForegroundColor Cyan

    # settings をNASにコピー
    $srcSettings = "$LOCAL_DIR\.claude\settings.local.json"
    $dstSettings = "$NAS_DIR\settings\settings.local.json"
    if (Test-Path $srcSettings) {
        Copy-Item $srcSettings $dstSettings -Force
        Write-Host "  settings.local.json -> NAS" -ForegroundColor Green
    }

    # claude-memory をNASにコピー
    $srcMemory = "$LOCAL_DIR\.claude\projects"
    $dstMemory = "$NAS_DIR\claude-memory"
    if (Test-Path $srcMemory) {
        Copy-Item $srcMemory $dstMemory -Recurse -Force
        Write-Host "  claude-memory -> NAS" -ForegroundColor Green
    }

    Write-Host "[backup] 完了" -ForegroundColor Cyan
}
elseif ($Mode -eq "restore") {
    Write-Host "[restore] NASから設定・メモリを復元します..." -ForegroundColor Cyan

    # settings をNASから復元
    $srcSettings = "$NAS_DIR\settings\settings.local.json"
    $dstSettings = "$LOCAL_DIR\.claude\settings.local.json"
    if (Test-Path $srcSettings) {
        New-Item -ItemType Directory -Force -Path "$LOCAL_DIR\.claude" | Out-Null
        Copy-Item $srcSettings $dstSettings -Force
        Write-Host "  settings.local.json <- NAS" -ForegroundColor Green
    }

    # claude-memory をNASから復元
    $srcMemory = "$NAS_DIR\claude-memory"
    $dstMemory = "$LOCAL_DIR\.claude\projects"
    if (Test-Path $srcMemory) {
        New-Item -ItemType Directory -Force -Path "$LOCAL_DIR\.claude" | Out-Null
        Copy-Item $srcMemory $dstMemory -Recurse -Force
        Write-Host "  claude-memory <- NAS" -ForegroundColor Green
    }

    Write-Host "[restore] 完了" -ForegroundColor Cyan
}
