@echo off
color 0A
cls

echo.
echo ═══════════════════════════════════════════════════════
echo   🚀 BTM TRAVEL CRM - STARTING BACKEND SERVER
echo ═══════════════════════════════════════════════════════
echo.
echo   This will start the MongoDB backend server.
echo   Keep this window OPEN while using the CRM!
echo.
echo ═══════════════════════════════════════════════════════
echo.

REM Kill any existing backend on port 8000
echo Cleaning up old processes...
taskkill /F /IM deno.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server on http://localhost:8000
echo.
echo ⚠️  IMPORTANT: Keep this window OPEN!
echo.

cd backend
deno run --allow-net --allow-env --allow-read --allow-write server.tsx

pause
