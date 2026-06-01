@echo off
chcp 65001 >nul
title ytDownloader Native Messaging Installer (Windows)

echo =============================================
echo   ytDownloader Native Messaging Installer    
echo =============================================
echo.
echo Dieses Skript registriert den Hintergrund-Helper vollautomatisch in der Windows-Registrierung.
echo.

:: Stable Predefined Extension ID
set "EXT_ID=gibiaahjfmmffegkhbhhgbkcddaelejk"

:: Get absolute directory path
set "DIR=%~dp0"
:: Strip trailing backslash
set "DIR=%DIR:~0,-1%"
:: Escape backslashes for JSON
set "ESCAPED_DIR=%DIR:\=\=%"
set "HELPER_PATH=%ESCAPED_DIR%\\helper.js"

echo.
echo Verwende Erweiterungs-ID: %EXT_ID%
echo Helper-Pfad: %DIR%\helper.js
echo.

:: Create dynamic JSON file for Windows (Chrome wants .json path in Registry)
set "MANIFEST_PATH=%DIR%\com.ytdownloader.helper.win.json"

echo { > "%MANIFEST_PATH%"
echo   "name": "com.ytdownloader.helper", >> "%MANIFEST_PATH%"
echo   "description": "ytDownloader background helper for video and audio downloads", >> "%MANIFEST_PATH%"
echo   "path": "%HELPER_PATH%", >> "%MANIFEST_PATH%"
echo   "type": "stdio", >> "%MANIFEST_PATH%"
echo   "allowed_origins": [ >> "%MANIFEST_PATH%"
echo     "chrome-extension://%EXT_ID%/" >> "%MANIFEST_PATH%"
echo   ] >> "%MANIFEST_PATH%"
echo } >> "%MANIFEST_PATH%"

echo Schreibe in die Windows-Registrierung...

:: Register for Google Chrome
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.ytdownloader.helper" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f >nul
if %errorlevel% equ 0 (
    echo ✅ Registriert für Google Chrome.
) else (
    echo ❌ Fehler beim Registrieren für Google Chrome (Admin-Rechte erforderlich?).
)

:: Register for Brave Browser (if wanted)
reg add "HKCU\Software\Software\Brave-Browser\NativeMessagingHosts\com.ytdownloader.helper" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f >nul 2>&1

echo.
echo 🎉 Der Hintergrund-Helper wurde erfolgreich in der Windows Registry registriert!
echo Bitte starten Sie Chrome neu, falls geöffnet.
echo.
pause
