@echo off
title Start Full QR Code Generator Application
echo ========================================================
echo Launching Spring Boot Backend and React Frontend
echo ========================================================

start "Spring Boot Backend (8080)" "%~dp0run-backend.bat"
timeout /t 3 /nobreak >nul
start "React Frontend (5173)" "%~dp0run-frontend.bat"

echo.
echo Both servers are launching:
echo - Backend API:  http://localhost:8080/api/qrcode/history
echo - Frontend UI:  http://localhost:5173
echo.
