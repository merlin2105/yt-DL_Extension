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
