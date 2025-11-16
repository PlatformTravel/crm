@REM @echo off
@REM REM BTM Travel CRM - Start Everything (Windows)
@REM REM This script starts both frontend and backend together

@REM echo ========================================
@REM echo   🚀 BTM Travel CRM - Starting All
@REM echo ========================================
@REM echo.

@REM REM Check if Deno is installed
@REM where deno >nul 2>nul
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo ❌ Deno is not installed!
@REM     echo.
@REM     echo 📥 Install Deno first:
@REM     echo.
@REM     echo PowerShell:
@REM     echo   irm https://deno.land/install.ps1 ^| iex
@REM     echo.
@REM     pause
@REM     exit /b 1
@REM )

@REM echo ✅ Deno is installed
@REM echo.

@REM echo 🔧 Starting Backend Server...
@REM start "BTM Backend" cmd /k "cd backend && deno run --allow-net --allow-env server.tsx"

@REM echo ⏳ Waiting 3 seconds for backend to start...
@REM timeout /t 3 /nobreak >nul

@REM echo.
@REM echo 🎨 Starting Frontend...
@REM start "BTM Frontend" cmd /k "npm run dev"

@REM echo.
@REM echo ========================================
@REM echo   ✅ Both servers are starting!
@REM echo ========================================
@REM echo.
@REM echo 📊 Backend:  http://localhost:8000
@REM echo 🖥️  Frontend: http://localhost:3000 (or your dev port)
@REM echo.
@REM echo 🔐 Default Login:
@REM echo    Username: admin
@REM echo    Password: admin123
@REM echo.
@REM echo Two terminal windows will open:
@REM echo  - One for Backend (keep running)
@REM echo  - One for Frontend (keep running)
@REM echo.
@REM echo Close this window or press any key...
@REM echo ========================================
@REM pause
