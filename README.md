# ytDownloader QuickLink — Chrome Extension & Background Helper

---
**Language / Sprache:** **[English](#english-version)** | **[Deutsch](#deutsche-version)**
---

---

## English Version

> [!IMPORTANT]
> **Companion Add-on**: This project is an independent browser extension and one-click downloader companion specifically designed to be used alongside the excellent desktop application [ytDownloader by @aandrew-me](https://github.com/aandrew-me/ytDownloader).
>
> It allows you to download videos and audio with a single click directly from your web browser (Vivaldi, Chrome, Brave, Edge) into your local Downloads folder without needing to manually copy links into the desktop GUI!

---

### 🌟 Features

* **Automatic Active Tab Scanning**: Automatically detects and fetches the video URL of your active browser tab (e.g., YouTube, Facebook, X/Twitter, TikTok) immediately upon opening.
* **Manual Clipboard Paste**: A dedicated physical paste button (`#pasteUrlBtn`) reads your clipboard, populates the input, and initiates validation instantly.
* **Invisible Background Helper**: Utilizes the secure **Chrome Native Messaging API**. Chrome spawns a background Node.js helper instance automatically when you open the popup, and terminates it gracefully once the download completes. No manual background servers or daemons needed!
* **Premium Dark/Neon Glassmorphism UI**: A gorgeous, modern design featuring subtle acrylic blur backdrops, HSL glow states, platform-specific card brand color changes, and fluid micro-animations.
* **Direct Download Delivery**: All downloads are saved directly into your system's default `Downloads` folder using `yt-dlp` and `ffmpeg` under the hood.

---

### 🛠️ Prerequisites

* **Node.js** (Version 16 or newer) must be installed on your system to run the background helper.
* A Chromium-based browser (e.g., Google Chrome, Brave, Edge, Vivaldi, Opera).

---

### 🚀 Installation & Setup

Setup is simple and takes only two steps:

#### Step 1: Register the Background Helper

The helper tells Chrome how to launch the download process on demand.

* **Linux & macOS**:
  1. Open a terminal in the `helper/` directory.
  2. Make the installer script executable and run it:
     ```bash
     chmod +x install.sh
     ./install.sh
     ```
  3. The script automatically detects your browser setup and registers the Native Messaging Host config. It supports standard builds, Vivaldi, Brave, and sandboxed Flatpak/Snap environments!

* **Windows**:
  1. Navigate to the `helper/` directory.
  2. Double-click the `install.bat` file (run as administrator if required).

---

#### Step 2: Load the Extension in Chrome

1. Open your browser and navigate to `chrome://extensions/` (or `vivaldi://extensions/`).
2. Toggle the **Developer Mode** switch in the top right corner.
3. Click the **Load unpacked** button in the top left corner.
4. Select the `extension/` directory from this repository.
5. Pin the **ytDownloader QuickLink** extension to your toolbar!

---

### 💡 How to Use

1. Go to any video page on your browser (e.g. a YouTube video or an X/Twitter post containing a video).
2. Click the **ytDownloader QuickLink** icon in your toolbar.
3. The extension scans the tab, loads video details (title, duration, thumbnail), and displays them in a premium preview card.
4. Select your preferred format (MP4 Video or MP3 Audio) and quality settings.
5. Click **Start Download**! The helper runs in the background and reports live progress back to the extension UI.

*Note*: If you are on a main feed or homepage (e.g. `youtube.com` feed or `x.com/home`), the URL field will automatically clear itself. Simply copy a video URL to your clipboard, open the popup, and click the **Clipboard Paste** button next to the input to grab and validate it manually!

---

### 🔒 Privacy & Security

* **100% Offline & Private**: This extension does not track you, collect metrics, or communicate with external analytics servers.
* **Safe Clipboard Handling**: The extension never reads your clipboard automatically or in the background. Clipboard data is only read when you explicitly click the physical "Clipboard Paste" button.

---

### 📄 License

This project is licensed under the MIT License.

---

---

## Deutsche Version

> [!IMPORTANT]
> **Zusatz / Companion-Erweiterung**: Dieses Projekt ist eine eigenständige Browser-Erweiterung und ein Klick-Zusatz, der speziell als Begleiter für die hervorragende Desktop-App [ytDownloader by @aandrew-me](https://github.com/aandrew-me/ytDownloader) entwickelt wurde.
>
> Sie ermöglicht es Ihnen, Videos und Audios mit einem einzigen Klick direkt aus Ihrem Webbrowser (Vivaldi, Chrome, Brave, Edge) herunterzuladen, ohne die Desktop-App manuell öffnen zu müssen!

---

### 🌟 Features

* **Automatische Erkennung**: Erkennt beim Öffnen des Popups sofort die Video-URL Ihres aktiven Browser-Tabs (z. B. auf YouTube, Facebook, X/Twitter, TikTok).
* **Aus Zwischenablage einfügen**: Ein dedizierter Button (`#pasteUrlBtn`) liest Ihre Zwischenablage aus, fügt die URL ein und startet die URL-Prüfung sofort.
* **Unsichtbarer Hintergrund-Helper**: Verwendet die **Chrome Native Messaging API**. Chrome startet den Node.js-Helper im Hintergrund völlig automatisch, wenn Sie die Erweiterung öffnen, und beendet ihn selbstständig nach Abschluss des Downloads.
* **Premium Dark/Neon Glassmorphism UI**: Ein atemberaubendes, modernes 2026-Design mit sanften Glüheffekten, HSL-Farben und flüssigen Micro-Animationen.
* **Direktes Speichern**: Alle heruntergeladenen Medien werden direkt in Ihrem Standard-`Downloads`-Ordner abgelegt (gesteuert durch `yt-dlp` und `ffmpeg`).

---

### 🛠️ Voraussetzungen

* **Node.js** (Version 16 oder neuer) muss auf Ihrem System installiert sein, um den Hintergrund-Helper auszuführen.
* Ein Chromium-basierter Browser (z. B. Google Chrome, Brave, Edge, Vivaldi, Opera).

---

### 🚀 Installation & Einrichtung

Die Installation besteht aus zwei einfachen Schritten:

#### Schritt 1: Hintergrund-Helper registrieren

Der Helper teilt Chrome mit, wie er ausgeführt werden soll.

* **Linux & macOS**:
  1. Öffnen Sie ein Terminal im Ordner `helper/`.
  2. Machen Sie das Skript ausführbar und führen Sie es aus:
     ```bash
     chmod +x install.sh
     ./install.sh
     ```
  3. Das Skript ermittelt automatisch Ihren Browser und registriert den Native Messaging Host. Es ist für Standard-Installationen, Brave, Vivaldi sowie Flatpak- und Snap-Sandboxes optimiert!

* **Windows**:
  1. Navigieren Sie in den Ordner `helper/`.
  2. Führen Sie die Datei `install.bat` per Doppelklick als Administrator aus.

---

#### Schritt 2: Erweiterung in Chrome laden

1. Öffnen Sie Ihren Browser und gehen Sie zu `chrome://extensions/` (bzw. `vivaldi://extensions/`).
2. Aktivieren Sie oben rechts den **Entwicklermodus** (Developer Mode).
3. Klicken Sie oben links auf **Entpackte Erweiterung laden** (Load unpacked).
4. Wählen Sie das Verzeichnis `extension/` aus diesem Repository aus.
5. Heften Sie die Erweiterung **ytDownloader QuickLink** an Ihre Symbolleiste an!

---

### 💡 Nutzung

1. Gehen Sie im Browser auf ein beliebiges Video (z. B. YouTube, Facebook oder ein Tweet auf X).
2. Klicken Sie auf das **ytDownloader QuickLink** Symbol.
3. Die Erweiterung holt sich automatisch die Details (Titel, Thumbnail, Dauer) und zeigt diese in einer wunderschönen Vorschaukarte an.
4. Wählen Sie Ihr gewünschtes Format (MP4 Video oder MP3 Audio) und die Qualität aus.
5. Klicken Sie auf **Download starten**! Der Helper lädt das Video live herunter und meldet den echten Fortschritt im UI zurück.

*Hinweis*: Wenn Sie sich auf einer Feed-Seite (z. B. `x.com/home` oder `youtube.com`) befinden, wird das URL-Feld automatisch geleert. Kopieren Sie einfach eine Video-URL in Ihre Zwischenablage und klicken Sie auf den **Zwischenablage**-Button neben dem Suchfeld, um sie sofort zu laden!

---

### 🔒 Privatsphäre & Sicherheit

* **Kein Tracking**: Diese Erweiterung erfasst keinerlei Telemetriedaten oder persönliche Informationen.
* **Sicheres Clipboard-Management**: Es findet kein automatisches Auslesen Ihrer Zwischenablage im Hintergrund statt. Ihre Zwischenablage wird ausschließlich dann ausgelesen, wenn Sie explizit auf den Button "Aus Zwischenablage einfügen" klicken.

---

### 📄 Lizenz

Dieses Projekt lizenziert unter der MIT-Lizenz.

*Dieses Projekt steht in keiner direkten geschäftlichen Verbindung mit den offiziellen Entwicklern von ytDownloader oder yt-dlp. Alle Warenzeichen sind Eigentum ihrer jeweiligen Inhaber.*
