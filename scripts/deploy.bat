@echo off
chcp 65001 >nul
echo ===================================================
echo   Deploying NanoMD to GitHub (Cloudflare Pages)
echo ===================================================

echo [1/3] Adding changes to Git...
git add .

echo [2/3] Committing changes...
set /p commitMsg="Enter commit message (or press enter for default): "
if "%commitMsg%"=="" set commitMsg="Deploy update to Cloudflare Pages"
git commit -m "%commitMsg%"

echo [3/3] Pushing to GitHub...
git push origin main

echo ===================================================
echo   Deployment Triggered Successfully!
echo ===================================================
pause
