@echo off
echo ========================================
echo FORCE RESTART BACKEND SERVER
echo ========================================
echo.
echo This will:
echo  1. Kill all Deno processes
echo  2. Wait 3 seconds
echo  3. Start the backend server fresh
echo.
pause

echo.
echo [1/3] Killing all Deno processes...
taskkill /F /IM deno.exe >nul 2>&1
if errorlevel 1 (
    echo No Deno processes found (this is OK)
) else (
    echo ✅ Killed existing Deno processes
)

echo.
echo [2/3] Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting backend server...
echo.
cd backend
echo Starting server... Press Ctrl+C to stop
echo.
deno run --allow-all server.tsx
