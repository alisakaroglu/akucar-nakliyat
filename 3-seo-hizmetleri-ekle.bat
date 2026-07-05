@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   SEO ulke hizmetlerini Neon'a ekle
echo   (Dubai, Katar, Kuveyt, S.Arabistan, Urdun)
echo   SSS/Hero SIFIRLANMAZ - guvenli.
echo ============================================
echo.
call npx tsx scripts/upsert-seo-services.ts
if errorlevel 1 goto hata
echo.
echo ============================================
echo   BITTI. Sunucuyu yeniden baslatin (2-baslat.bat)
echo   ve /hizmetler sayfasini kontrol edin.
echo ============================================
pause
exit /b 0

:hata
echo.
echo !!! HATA olustu. Yukaridaki mesaji kontrol edin.
pause
exit /b 1
