@echo off
title Installing NanoMD Dependencies
echo ==========================================
echo        NanoMD - Install Dependencies
echo ==========================================
echo.

:: Navigate to project root
cd /d "%~dp0\.."

echo [1/2] Cleaning cache...
echo [2/2] Installing dependencies using npm...
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm command failed. 
    echo Please make sure Node.js is installed AND you have restarted this folder/terminal.
    echo If you just installed Node.js, you MUST close this window and open a new one!
)

echo.
echo ==========================================
echo ===            Operation Done!         ===
echo ==========================================
pause
