@echo off
chcp 65001 >nul
echo ===================================================
echo   Deploying NanoMD via GitHub to Cloudflare Pages
echo ===================================================

echo [1/3] Adding changes to Git...
git add .

echo [2/3] Committing changes...
git commit -m "NanoMD v1.2.0 - Print and Share Features Update"

echo [3/3] Pushing to GitHub...
git push -u origin main

echo ===================================================
echo   Pushed to GitHub! Cloudflare Pages will build now.
echo ===================================================
pause
