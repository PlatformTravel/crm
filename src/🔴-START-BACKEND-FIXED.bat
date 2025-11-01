@echo off
SETLOCAL EnableDelayedExpansion

:: Colors for Windows Terminal (if supported)
color 0A

echo.
echo ========================================================
echo   BTM TRAVEL CRM - BACKEND SERVER STARTUP
echo ========================================================
echo.
echo Checking for running Deno processes...
echo.

:: Kill any existing Deno processes to prevent port conflicts
tasklist /FI "IMAGENAME eq deno.exe" 2>NUL | find /I /N "deno.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found existing Deno processes. Terminating...
    taskkill /F /IM deno.exe >NUL 2>&1
    timeout /t 2 /nobreak >NUL
    echo Done!
    echo.
)

:: Check if Deno is installed
where deno >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo   ERROR: Deno is not installed!
    echo ========================================================
    echo.
    echo Please install Deno from: https://deno.land/
    echo.
    echo Windows Installation:
    echo   irm https://deno.land/install.ps1 ^| iex
    echo.
    pause
    exit /b 1
)

:: Check if backend directory exists
if not exist "backend" (
    echo.
    echo ========================================================
    echo   ERROR: Backend directory not found!
    echo ========================================================
    echo.
    echo Please make sure you're running this script from the
    echo project root directory.
    echo.
    pause
    exit /b 1
)

:: Check if server.tsx exists
if not exist "backend\server.tsx" (
    echo.
    echo ========================================================
    echo   ERROR: backend\server.tsx not found!
    echo ========================================================
    echo.
    echo Please make sure the backend server file exists.
    echo.
    pause
    exit /b 1
)

echo Starting BTM Travel CRM Backend Server...
echo.
echo ========================================================
echo   IMPORTANT: Keep this window OPEN!
echo   Closing this window will stop the backend server.
echo ========================================================
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo --------------------------------------------------------
echo.

:: Start the backend server
cd backend
deno run --allow-all server.tsx

:: This part only runs if the server exits
echo.
echo ========================================================
echo   Backend Server Stopped
echo ========================================================
echo.
pause
