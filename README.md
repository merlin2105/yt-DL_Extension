# ytDownloader QuickLink — Chrome Extension & Background Helper

> [!IMPORTANT]
> **Companion Add-on**: This project is an independent browser extension and one-click downloader companion specifically designed to be used alongside the excellent desktop application [ytDownloader by @aandrew-me](https://github.com/aandrew-me/ytDownloader).
>
> It allows you to download videos and audio with a single click directly from your web browser (Vivaldi, Chrome, Brave, Edge) into your local Downloads folder without needing to manually copy links into the desktop GUI!

---

## 🌟 Features

* **Automatic Active Tab Scanning**: Automatically detects and fetches the video URL of your active browser tab (e.g., YouTube, Facebook, X/Twitter, TikTok) immediately upon opening.
* **Manual Clipboard Paste**: A dedicated physical paste button (`#pasteUrlBtn`) reads your clipboard, populates the input, and initiates validation instantly.
* **Invisible Background Helper**: Utilizes the secure **Chrome Native Messaging API**. Chrome spawns a background Node.js helper instance automatically when you open the popup, and terminates it gracefully once the download completes. No manual background servers or daemons needed!
* **Premium Dark/Neon Glassmorphism UI**: A gorgeous, modern design featuring subtle acrylic blur backdrops, HSL glow states, platform-specific card brand color changes, and fluid micro-animations.
* **Direct Download Delivery**: All downloads are saved directly into your system's default `Downloads` folder using `yt-dlp` and `ffmpeg` under the hood.

---

## 🛠️ Prerequisites

* **Node.js** (Version 16 or newer) must be installed on your system to run the background helper.
* A Chromium-based browser (e.g., Google Chrome, Brave, Edge, Vivaldi, Opera).

---

## 🚀 Installation & Setup

Setup is simple and takes only two steps:

### Step 1: Register the Background Helper

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

### Step 2: Load the Extension in Chrome

1. Open your browser and navigate to `chrome://extensions/` (or `vivaldi://extensions/`).
2. Toggle the **Developer Mode** switch in the top right corner.
3. Click the **Load unpacked** button in the top left corner.
4. Select the `extension/` directory from this repository.
5. Pin the **ytDownloader QuickLink** extension to your toolbar!

---

## 💡 How to Use

1. Go to any video page on your browser (e.g. a YouTube video or an X/Twitter post containing a video).
2. Click the **ytDownloader QuickLink** icon in your toolbar.
3. The extension scans the tab, loads video details (title, duration, thumbnail), and displays them in a premium preview card.
4. Select your preferred format (MP4 Video or MP3 Audio) and quality settings.
5. Click **Start Download**! The helper runs in the background and reports live progress back to the extension UI.

*Note*: If you are on a main feed or homepage (e.g. `youtube.com` feed or `x.com/home`), the URL field will automatically clear itself. Simply copy a video URL to your clipboard, open the popup, and click the **Clipboard Paste** button next to the input to grab and validate it manually!

---

## 🔒 Privacy & Security

* **100% Offline & Private**: This extension does not track you, collect metrics, or communicate with external analytics servers.
* **Safe Clipboard Handling**: The extension never reads your clipboard automatically or in the background. Clipboard data is only read when you explicitly click the physical "Clipboard Paste" button.

---

## 📄 License

This project is licensed under the MIT License.

*Disclaimer: This project is an independent community contribution and is not directly affiliated with the official developers of ytDownloader or yt-dlp. All trademarks belong to their respective owners.*
