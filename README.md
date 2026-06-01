# ytDownloader QuickLink — Chrome Extension & Background Helper

> [!IMPORTANT]
> **Zusatz / Companion-Erweiterung**: Dieses Projekt ist eine eigenständige Browser-Erweiterung und ein Klick-Zusatz, der speziell als Begleiter für die hervorragende Desktop-App [ytDownloader by @aandrew-me](https://github.com/aandrew-me/ytDownloader) entwickelt wurde.
>
> Sie ermöglicht es Ihnen, Videos und Audios mit einem einzigen Klick direkt aus Ihrem Webbrowser (Vivaldi, Chrome, Brave, Edge) herunterzuladen, ohne die Desktop-App manuell öffnen zu müssen!

---

## 🌟 Features

* **Automatische Erkennung**: Erkennt beim Öffnen des Popups sofort die Video-URL Ihres aktiven Browser-Tabs (z. B. auf YouTube, Facebook, X/Twitter, TikTok).
* **Aus Zwischenablage einfügen**: Ein dedizierter Button (`#pasteUrlBtn`) liest Ihre Zwischenablage aus, fügt die URL ein und startet die URL-Prüfung sofort.
* **Unsichtbarer Hintergrund-Helper**: Verwendet die **Chrome Native Messaging API**. Chrome startet den Node.js-Helper im Hintergrund völlig automatisch, wenn Sie die Erweiterung öffnen, und beendet ihn selbstständig nach Abschluss des Downloads.
* **Premium Dark/Neon Glassmorphism UI**: Ein atemberaubendes, modernes 2026-Design mit sanften Glüheffekten, HSL-Farben und flüssigen Micro-Animationen.
* **Direktes Speichern**: Alle heruntergeladenen Medien werden direkt in Ihrem Standard-`Downloads`-Ordner abgelegt (gesteuert durch `yt-dlp` und `ffmpeg`).

---

## 🛠️ Voraussetzungen

* **Node.js** (Version 16 oder neuer) muss auf Ihrem System installiert sein, um den Hintergrund-Helper auszuführen.
* Ein Chromium-basierter Browser (z. B. Google Chrome, Brave, Edge, Vivaldi, Opera).

---

## 🚀 Installation & Einrichtung

Die Installation besteht aus zwei einfachen Schritten:

### Schritt 1: Hintergrund-Helper registrieren

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

### Schritt 2: Erweiterung in Chrome laden

1. Öffnen Sie Ihren Browser und gehen Sie zu `chrome://extensions/` (bzw. `vivaldi://extensions/`).
2. Aktivieren Sie oben rechts den **Entwicklermodus** (Developer Mode).
3. Klicken Sie oben links auf **Entpackte Erweiterung laden** (Load unpacked).
4. Wählen Sie das Verzeichnis `extension/` aus diesem Repository aus.
5. Heften Sie die Erweiterung **ytDownloader QuickLink** an Ihre Symbolleiste an!

---

## 💡 Nutzung

1. Gehen Sie im Browser auf ein beliebiges Video (z. B. YouTube, Facebook oder ein Tweet auf X).
2. Klicken Sie auf das **ytDownloader QuickLink** Symbol.
3. Die Erweiterung holt sich automatisch die Details (Titel, Thumbnail, Dauer) und zeigt diese in einer wunderschönen Vorschaukarte an.
4. Wählen Sie Ihr gewünschtes Format (MP4 Video oder MP3 Audio) und die Qualität aus.
5. Klicken Sie auf **Download starten**! Der Helper lädt das Video live herunter und meldet den echten Fortschritt im UI zurück.

*Hinweis*: Wenn Sie sich auf einer Feed-Seite (z. B. `x.com/home` oder `youtube.com`) befinden, wird das URL-Feld automatisch geleert. Kopieren Sie einfach eine Video-URL in Ihre Zwischenablage und klicken Sie auf den **Zwischenablage**-Button neben dem Suchfeld, um sie sofort zu laden!

---

## 🔒 Privatsphäre & Sicherheit

* **Kein Tracking**: Diese Erweiterung erfasst keinerlei Telemetriedaten oder persönliche Informationen.
* **Sicheres Clipboard-Management**: Es findet kein automatisches Auslesen Ihrer Zwischenablage im Hintergrund statt. Ihre Zwischenablage wird ausschließlich dann ausgelesen, wenn Sie explizit auf den Button "Aus Zwischenablage einfügen" klicken.

---

## 📄 Lizenz

Dieses Projekt lizenziert unter der MIT-Lizenz.

*Dieses Projekt steht in keiner direkten geschäftlichen Verbindung mit den offiziellen Entwicklern von ytDownloader oder yt-dlp. Alle Warenzeichen sind Eigentum ihrer jeweiligen Inhaber.*
