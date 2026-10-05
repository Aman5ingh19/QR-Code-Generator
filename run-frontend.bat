@echo off
title React Frontend - QR Code Generator
echo ========================================================
echo Starting React Vite Frontend (Port 5173)
echo ========================================================

cd /d "%~dp0frontend"

call npm run dev
pause
