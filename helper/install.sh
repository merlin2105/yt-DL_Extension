#!/bin/bash

# Target directories for all common Chrome/Chromium-based browsers, including Flatpaks & Snaps
PATHS=(
    "$HOME/.config/google-chrome/NativeMessagingHosts"
    "$HOME/.config/chromium/NativeMessagingHosts"
    "$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
    "$HOME/.config/BraveSoftware/Brave-Origin-Beta/NativeMessagingHosts"
    "$HOME/.config/vivaldi/NativeMessagingHosts"
    "$HOME/.var/app/com.google.Chrome/config/google-chrome/NativeMessagingHosts"
    "$HOME/.var/app/com.google.ChromeDev/config/google-chrome-unstable/NativeMessagingHosts"
    "$HOME/.var/app/org.chromium.Chromium/config/chromium/NativeMessagingHosts"
    "$HOME/.var/app/io.github.ungoogled_software.ungoogled_chromium/config/chromium/NativeMessagingHosts"
    "$HOME/.var/app/com.microsoft.Edge/config/microsoft-edge/NativeMessagingHosts"
)

# Names matching the PATHS array for nice console output
NAMES=(
    "Google Chrome (Standard)"
    "Chromium (Standard)"
    "Brave Browser (Standard)"
    "Brave Browser (Beta)"
    "Vivaldi"
    "Google Chrome (Flatpak)"
    "Google Chrome Dev (Flatpak)"
    "Chromium (Flatpak)"
    "Ungoogled Chromium (Flatpak)"
    "Microsoft Edge (Flatpak)"
)

# Get absolute path of this directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TEMPLATE_PATH="$DIR/com.ytdownloader.helper.json"

echo "============================================="
echo "  ytDownloader Native Messaging Installer    "
echo "============================================="
echo ""
echo "Dieses Skript registriert den Hintergrund-Helper vollautomatisch bei Ihren Browsern."
echo ""
echo "Erweiterungs-ID: gibiaahjfmmffegkhbhhgbkcddaelejk"
echo "Pfad zu helper.js: $DIR/helper.js"
echo ""

installed_any=false

# Verify Node.js and FFmpeg dependencies
PARENT_DIR="$DIR/../.."
FFMPEG_DIR="$PARENT_DIR/ffmpeg"
NODE_BIN="$PARENT_DIR/node"

echo "Überprüfe Abhängigkeiten..."

# 1. Check/Setup Node.js
if ! command -v node >/dev/null 2>&1 && [ ! -f "$NODE_BIN" ]; then
    echo "-> Node.js nicht auf dem System gefunden. Lade Node.js herunter..."
    if command -v wget >/dev/null 2>&1; then
        wget "https://github.com/aandrew-me/ffmpeg-builds/releases/download/v8/node_linux_amd64" -O "$NODE_BIN"
    elif command -v curl >/dev/null 2>&1; then
        curl -L "https://github.com/aandrew-me/ffmpeg-builds/releases/download/v8/node_linux_amd64" -o "$NODE_BIN"
    else
        echo "❌ Fehler: Weder wget noch curl ist installiert. Node.js kann nicht automatisch geladen werden."
    fi
    if [ -f "$NODE_BIN" ]; then
        chmod +x "$NODE_BIN"
        echo "✅ Node.js erfolgreich heruntergeladen und eingerichtet."
    fi
else
    echo "✅ Node.js ist verfügbar."
    if [ -f "$NODE_BIN" ]; then
        chmod +x "$NODE_BIN" 2>/dev/null
    fi
fi

# 2. Check/Setup FFmpeg
if [ ! -d "$FFMPEG_DIR" ]; then
    echo "-> FFmpeg Ordner nicht gefunden. Suche nach Archiv oder lade herunter..."
    if [ -f "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz" ]; then
        echo "Extrahiere vorhandenes ffmpeg_linux_amd64.tar.xz..."
        tar -xf "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz" -C "$PARENT_DIR"
        mv "$PARENT_DIR/ffmpeg_linux_amd64" "$FFMPEG_DIR"
    else
        echo "Lade FFmpeg herunter..."
        if command -v wget >/dev/null 2>&1; then
            wget "https://github.com/aandrew-me/ffmpeg-builds/releases/download/v8/ffmpeg_linux_amd64.tar.xz" -O "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz"
        elif command -v curl >/dev/null 2>&1; then
            curl -L "https://github.com/aandrew-me/ffmpeg-builds/releases/download/v8/ffmpeg_linux_amd64.tar.xz" -o "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz"
        else
            echo "❌ Fehler: Weder wget noch curl ist installiert. FFmpeg kann nicht automatisch geladen werden."
        fi
        
        if [ -f "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz" ]; then
            echo "Extrahiere FFmpeg..."
            tar -xf "$PARENT_DIR/ffmpeg_linux_amd64.tar.xz" -C "$PARENT_DIR"
            mv "$PARENT_DIR/ffmpeg_linux_amd64" "$FFMPEG_DIR"
        fi
    fi
fi

# Ensure FFmpeg binaries are executable
if [ -d "$FFMPEG_DIR" ]; then
    echo "Stelle sicher, dass die FFmpeg-Dateien ausführbar sind..."
    chmod +x "$FFMPEG_DIR"/bin/ffmpeg 2>/dev/null
    chmod +x "$FFMPEG_DIR"/bin/ffprobe 2>/dev/null
    chmod +x "$FFMPEG_DIR"/bin/ffplay 2>/dev/null
    echo "✅ FFmpeg ist eingerichtet und ausführbar."
else
    echo "⚠️  Warnung: FFmpeg konnte nicht eingerichtet werden. Das Zusammenfügen von Video und Audio könnte fehlschlagen."
fi

echo ""

# Make sure helper.sh is executable
chmod +x "$DIR/helper.sh" 2>/dev/null

echo "Durchsuche Browser-Verzeichnisse und installiere Manifest..."
echo "---------------------------------------------"

for i in "${!PATHS[@]}"; do
    target_path="${PATHS[$i]}"
    browser_name="${NAMES[$i]}"
    parent_dir="$(dirname "$target_path")"
    
    # Check if the browser's config directory exists
    if [ -d "$parent_dir" ]; then
        mkdir -p "$target_path"
        # Replace HOST_PATH placeholder with the absolute script location dynamically
        sed "s|HOST_PATH|$DIR/helper.sh|g" "$TEMPLATE_PATH" > "$target_path/com.ytdownloader.helper.json"
        echo "✅ Erfolgreich registriert für: $browser_name"
        installed_any=true
    fi
done

echo "---------------------------------------------"

if [ "$installed_any" = true ]; then
    echo ""
    echo "🎉 Der Hintergrund-Helper wurde erfolgreich registriert!"
    echo "⚠️  WICHTIG: Bitte starten Sie Ihren Browser einmal komplett neu,"
    echo "   damit Chrome die neue Native-Messaging-Konfiguration lädt."
    echo "============================================="
else
    echo "❌ Fehler: Es konnte kein passendes Browser-Konfigurationsverzeichnis gefunden werden."
    echo "Bitte stellen Sie sicher, dass Google Chrome, Brave, Vivaldi oder Edge installiert sind."
    echo "============================================="
    exit 1
fi
