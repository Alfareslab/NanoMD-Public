@echo off
chcp 65001 >nul
echo ===================================================
echo   Deploying NanoMD directly to Cloudflare Pages
echo ===================================================

echo [1/2] Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Aborting deployment.
    pause
    exit /b %errorlevel%
)

echo [2/2] Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist --project-name=nanomd

echo ===================================================
echo   Deployment Process Finished!
echo ===================================================
pause
