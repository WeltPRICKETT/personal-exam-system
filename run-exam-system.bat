@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo   Personal Exam System - One Click Run
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not available in PATH.
  echo Please install Node.js first, then run this script again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm.cmd is not available in PATH.
  echo Please reinstall Node.js or add npm to PATH.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/3] Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
) else (
  echo [1/3] Dependencies already installed.
)

echo [2/3] Building production files...
call npm.cmd run build
if errorlevel 1 (
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo [3/3] Preparing local server...
echo.
echo Checking port 4173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4173" ^| findstr "LISTENING"') do (
  echo Stopping old server process %%a...
  taskkill /F /PID %%a >nul 2>nul
)

echo Opening app after server starts...
start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:4173/'"
echo.
echo App URL: http://127.0.0.1:4173/
echo Keep this window open while using the system.
echo Press Ctrl+C to stop the server.
echo.
call npm.cmd start

pause
