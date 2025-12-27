# SoupModMaker Windows Build Script (PowerShell)
# Run this with: powershell -ExecutionPolicy Bypass -File build-windows.ps1

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " SoupModMaker Windows Build Script" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to script directory
Set-Location $PSScriptRoot

# Function to check if command succeeded
function Test-Success {
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        exit 1
    }
}

# Step 1: Install dependencies
Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
Write-Host ""
npm run setup
Test-Success

# Step 2: Build core package
Write-Host ""
Write-Host "[2/4] Building core package..." -ForegroundColor Yellow
Write-Host ""
Set-Location core
npm run build
Test-Success
Set-Location ..

# Step 3: Build electron app
Write-Host ""
Write-Host "[3/4] Building electron app for Windows..." -ForegroundColor Yellow
Write-Host ""
Set-Location electron-app
npm run build
Test-Success

# Step 4: Complete
Write-Host ""
Write-Host "[4/4] Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host " BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your SoupModMaker.exe is ready at:" -ForegroundColor Cyan
Write-Host "   $PWD\release\SoupModMaker-Portable-0.1.0.exe" -ForegroundColor White
Write-Host ""
Write-Host "Double-click the .exe file to run SoupModMaker!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
