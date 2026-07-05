@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Kurumsal alt sayfalarini Neon'a ekle
echo   (Vizyon/Misyon, Kalite, IK, Belgelerimiz)
echo   SADECE Page tablosu - migration YOK, guvenli.
echo ============================================
echo.
call npx tsx scripts/upsert-corporate-pages.ts
if errorlevel 1 goto hata
echo.
echo ============================================
echo   BITTI. Sunucuyu yeniden baslatin (2-baslat.bat)
echo   Menu: Kurumsal -^> alt sayfalar. Panelde: Sayfalar.
echo ============================================
pause
exit /b 0

:hata
echo.
echo !!! HATA olustu. Yukaridaki mesaji kontrol edin.
pause
exit /b 1
