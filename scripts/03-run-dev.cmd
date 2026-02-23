@echo off
title Run NanoMD
echo ==========================================
echo        NanoMD - Start Application
echo ==========================================
echo.

echo [1/3] Terminating any previously running instances...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr "0.0:5173"') DO (
    taskkill /F /PID %%T >nul 2>&1
)

echo [2/3] Navigate to project root...
cd /d "%~dp0\.."

echo [3/3] Starting development server (browser will open automatically)...
echo.
call npm run dev -- --open

pause
