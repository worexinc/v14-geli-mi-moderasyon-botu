@echo off
title Shadex And Worex INC - Moderasyon Botu
color 0a

echo.
echo  ==========================================
echo   Shadex And Worex INC - Moderasyon Botu
echo   Gelistirici: Cengizhan
echo  ==========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [HATA] Node.js bulunamadi!
    echo  https://nodejs.org adresinden yukleyin.
    echo.
    pause
    exit /b
)

if not exist "node_modules" (
    echo  [BILGI] Paketler yukleniyor...
    echo.
    npm install
    echo.
)

echo  [BILGI] Bot baslatiliyor...
echo.
node index.js

echo.
echo  [UYARI] Bot kapandi!
pause
