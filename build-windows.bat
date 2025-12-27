@echo off
echo.
echo ================================================================
echo  SoupModMaker Windows Build Script
echo ================================================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

echo [1/4] Installing dependencies...
echo.
call npm run setup
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/4] Building core package...
echo.
cd core
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build core package!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Building electron app...
echo.
cd electron-app
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build electron app!
    pause
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.
echo ================================================================
echo  BUILD SUCCESSFUL!
echo ================================================================
echo.
echo Your SoupModMaker.exe is ready at:
echo    %cd%\release\SoupModMaker-Portable-0.1.0.exe
echo.
echo Double-click the .exe file to run SoupModMaker!
echo.
pause
