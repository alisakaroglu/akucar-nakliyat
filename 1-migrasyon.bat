@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Akucar Nakliyat - Veritabani hazirligi
echo ============================================
echo.
echo [1/2] Prisma client uretiliyor...
call npx prisma generate
if errorlevel 1 goto hata
echo.
echo [2/2] Migration'lar Neon'a uygulaniyor (guvenli, sadece ekler)...
call npx prisma migrate deploy
if errorlevel 1 goto hata
echo.
echo ============================================
echo   BITTI. Sunucuyu baslatmak icin 2-baslat.bat
echo ============================================
pause
exit /b 0

:hata
echo.
echo !!! HATA olustu. Yukaridaki mesaji kontrol edin.
echo     (Cogu zaman .env / DATABASE_URL veya internet baglantisi ile ilgilidir)
pause
exit /b 1
