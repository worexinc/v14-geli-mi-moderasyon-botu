@echo off
title Komutlari Deploy Et
color 0b

echo.
echo  ==========================================
echo   Shadex And Worex INC - Komut Deploy
echo   Gelistirici: Cengizhan
echo  ==========================================
echo.

if not exist "node_modules" (
    echo  [BILGI] Paketler yukleniyor...
    npm install
    echo.
)

echo  [BILGI] Komutlar deploy ediliyor...
echo.
node deploy-commands.js

echo.
echo  ==========================================
echo   KOMUTLAR GOZUKMUYORSA:
echo.
echo   Botu sunucuya su linkle davet et:
echo   (clientId'yi config.json'dan al)
echo.
echo   https://discord.com/oauth2/authorize?client_id=CLIENT_ID_BURAYA^&scope=bot+applications.commands^&permissions=8
echo.
echo   'applications.commands' scope olmadan
echo   slash komutlar GORUNMEZ!
echo  ==========================================
echo.
pause
