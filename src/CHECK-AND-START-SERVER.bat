@echo off
echo ========================================
echo BTM TRAVEL CRM - SERVER CHECKER
echo ========================================
echo.

echo Checking if backend server is running...
echo.

REM Try to ping the health endpoint
curl -s http://localhost:8000/health >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ GOOD NEWS: Backend server is RUNNING!
    echo.
    curl -s http://localhost:8000/health
    echo.
    echo.
    echo If your frontend still shows errors, try:
    echo 1. Refresh your browser (Ctrl+F5^)
    echo 2. Clear browser cache
    echo 3. Check browser console for errors
    echo.
) else (
    echo ❌ Backend server is NOT running!
    echo.
    echo Starting the backend server now...
    echo.
    echo ⚠️  IMPORTANT: Keep this window open!
    echo    Closing this window will stop the server.
    echo.
    echo Press Ctrl+C to stop the server when done.
    echo.
    echo ========================================
    echo.
    
    cd backend
    
    REM Check if Deno is installed
    where deno >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ ERROR: Deno is not installed!
        echo.
        echo Please install Deno first:
        echo.
        echo Option 1: Using PowerShell (as Administrator^):
        echo    irm https://deno.land/install.ps1 ^| iex
        echo.
        echo Option 2: Download from https://deno.land
        echo.
        echo After installing, restart this script.
        echo.
        pause
        exit /b 1
    )
    
    echo Starting server with Deno...
    echo.
    deno run --allow-all server.tsx
)

pause
