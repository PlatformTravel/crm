@echo off
REM BTM Travel CRM - Start Everything (Windows)
REM This script starts both frontend and backend together

echo ========================================
echo   🚀 BTM Travel CRM - Starting All
echo ========================================
echo.

REM Check if Deno is installed
where deno >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deno is not installed!
    echo.
    echo 📥 Install Deno first:
    echo.
    echo PowerShell:
    echo   irm https://deno.land/install.ps1 ^| iex
    echo.
    pause
    exit /b 1
)

echo ✅ Deno is installed
echo.

echo 🔧 Starting Backend Server...
start "BTM Backend" cmd /k "cd backend && deno run --allow-net --allow-env server.tsx"

echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo 🎨 Starting Frontend...
start "BTM Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   ✅ Both servers are starting!
echo ========================================
echo.
echo 📊 Backend:  http://localhost:8000
echo 🖥️  Frontend: http://localhost:3000 (or your dev port)
echo.
echo 🔐 Default Login:
echo    Username: admin
echo    Password: admin123
echo.
echo Two terminal windows will open:
echo  - One for Backend (keep running)
echo  - One for Frontend (keep running)
echo.
echo Close this window or press any key...
echo ========================================
pause
