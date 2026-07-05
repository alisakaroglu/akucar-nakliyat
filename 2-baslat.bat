@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Akucar Nakliyat - Gelistirme sunucusu
echo ============================================
echo.
echo Site:  http://localhost:3000
echo Panel: http://localhost:3000/admin/login
echo        (admin@akucarnakliyat.com)
echo.
echo Durdurmak icin bu pencerede Ctrl + C.
echo.
call npm run dev
pause
