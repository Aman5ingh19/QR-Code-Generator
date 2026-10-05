@echo off
title Spring Boot Backend - QR Code Generator
echo ========================================================
echo Starting Spring Boot QR Code Generator Backend (Port 8080)
echo ========================================================

cd /d "%~dp0backend"

:: Check if JAVA_HOME is set; if not, check default user path
if "%JAVA_HOME%"=="" (
    if exist "%USERPROFILE%\.jdks\jdk-21.0.6+7" (
        set "JAVA_HOME=%USERPROFILE%\.jdks\jdk-21.0.6+7"
        set "PATH=%USERPROFILE%\.jdks\jdk-21.0.6+7\bin;%PATH%"
    )
)

:: Check if Maven is available or in user wrapper cache
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    for /d %%D in ("%USERPROFILE%\.m2\wrapper\dists\apache-maven-*") do (
        for /r "%%D" %%F in (mvn.cmd) do (
            if exist "%%F" (
                set "PATH=%%~dpF;%PATH%"
                goto :found_mvn
            )
        )
    )
)
:found_mvn

mvn spring-boot:run
pause
