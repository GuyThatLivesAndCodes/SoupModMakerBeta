@echo off
echo.
echo ================================================================
echo  SoupModMaker Quick Build (No Packaging)
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Installing dependencies...
call npm run setup
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Building core...
cd core
call npm run build
cd ..

echo.
echo [3/3] Building app (unpacked)...
cd electron-app
call npm run build:dir

echo.
echo ================================================================
echo  BUILD SUCCESSFUL!
echo ================================================================
echo.
echo Your app is ready at:
echo    %cd%\release\win-unpacked\SoupModMaker.exe
echo.
echo This is an UNPACKED version - just run the .exe directly!
echo No installer needed, no signing issues!
echo.
pause
