@echo off
title Kill NanoMD Server
echo ==========================================
echo        NanoMD - Kill Running Instances
echo ==========================================
echo.

echo Scanning for any Vite server running on port 5173...
echo.

set "FOUND=0"
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr "0.0:5173"') DO (
    set "FOUND=1"
    echo [-] Found running server (Process ID: %%T). Terminating...
    taskkill /F /PID %%T
)

if "%FOUND%"=="0" (
    echo [v] No running instances found.
)

echo.
echo ==========================================
echo ===            Operation Done!         ===
echo ==========================================
pause
