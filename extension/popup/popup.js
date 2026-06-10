// Chrome Extension Popup Logic (2026 Modern Aesthetic)

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const statusBox = document.getElementById('statusBox');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const urlInput = document.getElementById('urlInput');
    
    const previewCard = document.getElementById('previewCard');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoDuration = document.getElementById('videoDuration');
    const videoTitle = document.getElementById('videoTitle');
    const videoSource = document.getElementById('videoSource');
    
    const formatSelect = document.getElementById('formatSelect');
    const qualityWrapper = document.getElementById('qualityWrapper');
    const qualitySelect = document.getElementById('qualitySelect');
    
    const progressCard = document.getElementById('progressCard');
    const progressStatus = document.getElementById('progressStatus');
    const progressPercent = document.getElementById('progressPercent');
    const progressBar = document.getElementById('progressBar');
    const progressSpeed = document.getElementById('progressSpeed');
    const progressEta = document.getElementById('progressEta');
    
    const downloadBtn = document.getElementById('downloadBtn');
    const checkUrlBtn = document.getElementById('checkUrlBtn');
    const pasteUrlBtn = document.getElementById('pasteUrlBtn');
    const sponsorBlockChecked = document.getElementById('sponsorBlockChecked');

    let currentUrl = '';
    let isHelperConnected = false;
    let nativePort = null;

    // Load and restore saved settings from chrome.storage.local
    chrome.storage.local.get(['defaultType', 'defaultQuality', 'sponsorBlock'], (items) => {
        if (items.defaultType) {
            formatSelect.value = items.defaultType;
            if (items.defaultType === 'audio') {
                qualityWrapper.classList.add('hidden');
            } else {
                qualityWrapper.classList.remove('hidden');
            }
        }
        if (items.defaultQuality) {
            qualitySelect.value = items.defaultQuality;
        }
        if (items.sponsorBlock !== undefined) {
            sponsorBlockChecked.checked = items.sponsorBlock;
        }
    });

    // Helper to format duration seconds to MM:SS or HH:MM:SS
    function formatTime(secs) {
        if (!secs || isNaN(secs)) return '00:00';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = Math.floor(secs % 60);
        const pad = (num) => String(num).padStart(2, '0');
        return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }

    // Update status dot and text
    function setStatus(type, text) {
        statusBox.className = 'status-indicator-box ' + type;
        statusText.textContent = text;
        
        if (type === 'online') {
            statusDot.classList.remove('pulsing');
            isHelperConnected = true;
        } else if (type === 'offline') {
            statusDot.classList.remove('pulsing');
            isHelperConnected = false;
            downloadBtn.disabled = true;
        } else {
            statusDot.classList.add('pulsing');
        }
    }

    // Trigger URL validation and metadata fetch
    function triggerUrlCheck() {
        const url = urlInput.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            currentUrl = url;
            
            // Reset previous video info UI
            previewCard.classList.add('hidden');
            downloadBtn.disabled = true;
            
            setStatus('loading', 'Prüfe URL...');
            
            nativePort.postMessage({
                action: 'getInfo',
                url: currentUrl
            });
        } else {
            urlInput.value = '';
            urlInput.placeholder = "Ungültige oder leere URL!";
        }
    }

    // Add event listeners for check triggers
    checkUrlBtn.addEventListener('click', triggerUrlCheck);

    // Paste from clipboard on click
    pasteUrlBtn.addEventListener('click', async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText && (clipboardText.trim().startsWith('http://') || clipboardText.trim().startsWith('https://'))) {
                urlInput.value = clipboardText.trim();
                triggerUrlCheck();
            } else {
                urlInput.value = '';
                urlInput.placeholder = 'Keine gültige URL in der Zwischenablage!';
            }
        } catch (err) {
            console.warn('Failed to read clipboard on button click:', err);
            urlInput.value = '';
            urlInput.placeholder = 'Zugriff auf Zwischenablage verweigert!';
        }
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            triggerUrlCheck();
        }
    });

    // Toggle quality wrapper depending on chosen format (no quality selection for MP3)
    formatSelect.addEventListener('change', () => {
        if (formatSelect.value === 'audio') {
            qualityWrapper.classList.add('hidden');
        } else {
            qualityWrapper.classList.remove('hidden');
        }
        chrome.storage.local.set({ defaultType: formatSelect.value });
    });

    qualitySelect.addEventListener('change', () => {
        chrome.storage.local.set({ defaultQuality: qualitySelect.value });
    });

    sponsorBlockChecked.addEventListener('change', () => {
        chrome.storage.local.set({ sponsorBlock: sponsorBlockChecked.checked });
    });

    // Establish Native Messaging connection
    function connectToHelper() {
        setStatus('loading', 'Verbinde...');
        
        try {
            nativePort = chrome.runtime.connectNative('com.ytdownloader.helper');
            
            nativePort.onMessage.addListener(handleHelperMessage);
            
            nativePort.onDisconnect.addListener(() => {
                const err = chrome.runtime.lastError;
                console.warn('Native Host disconnected:', err ? err.message : 'No error details');
                setStatus('offline', 'Helper offline');
            });

            // Send initial ping to check if helper is responsive
            nativePort.postMessage({ action: 'ping' });
        } catch (e) {
            console.error('Failed to connect to native messaging host:', e);
            setStatus('offline', 'Helper offline');
        }
    }

    // Receive message from background helper
    function handleHelperMessage(msg) {
        console.log('Received from helper:', msg);

        if (msg.status === 'online') {
            setStatus('online', 'Helper bereit');
            detectAndFetchTabUrl();
            return;
        }

        if (msg.type === 'status') {
            // Downloading yt-dlp binary status
            progressCard.classList.remove('hidden');
            progressStatus.textContent = msg.message;
            progressPercent.textContent = '';
            progressBar.style.width = '100%';
            progressBar.style.background = 'var(--gradient-primary)';
            return;
        }

        if (msg.type === 'info') {
            // Video metadata loaded
            setStatus('online', 'Helper bereit');
            previewCard.classList.remove('hidden');
            videoTitle.textContent = msg.title || 'Video ohne Titel';
            videoThumbnail.src = msg.thumbnail || '../../assets/images/thumb.png';
            videoDuration.textContent = formatTime(msg.duration);
            
            // Source formatting
            const extractor = msg.extractor ? msg.extractor.toLowerCase() : '';
            if (extractor.includes('youtube')) {
                videoSource.textContent = 'YouTube';
                videoSource.style.color = 'var(--neon-rose)';
            } else if (extractor.includes('facebook')) {
                videoSource.textContent = 'Facebook';
                videoSource.style.color = 'var(--neon-cyan)';
            } else if (extractor.includes('twitter') || extractor.includes('x')) {
                videoSource.textContent = 'X (Twitter)';
                videoSource.style.color = '#fff';
            } else {
                videoSource.textContent = msg.extractor || 'Webseite';
                videoSource.style.color = 'var(--neon-violet)';
            }

            downloadBtn.disabled = false;
            return;
        }

        if (msg.type === 'progress') {
            // Download progress updates
            progressCard.classList.remove('hidden');
            progressStatus.textContent = 'Lade herunter...';
            
            const pct = Math.round(msg.percent) || 0;
            progressPercent.textContent = `${pct}%`;
            progressBar.style.width = `${pct}%`;
            
            progressSpeed.textContent = msg.speed || '0 B/s';
            progressEta.textContent = msg.eta || '00:00';
            return;
        }

        if (msg.type === 'complete') {
            // Download finished successfully
            progressStatus.textContent = '✅ Download abgeschlossen!';
            progressPercent.textContent = '100%';
            progressBar.style.width = '100%';
            progressBar.style.background = 'var(--neon-green)';
            
            progressSpeed.textContent = 'Fertig';
            progressEta.textContent = '00:00';
            
            downloadBtn.disabled = false;
            downloadBtn.querySelector('.btn-text').textContent = 'Fertig!';
            downloadBtn.style.boxShadow = '0 4px 20px var(--neon-green-glow)';
            
            setTimeout(() => {
                downloadBtn.querySelector('.btn-text').textContent = 'Download starten';
                downloadBtn.style.boxShadow = '0 4px 20px var(--neon-violet-glow)';
                progressCard.classList.add('hidden');
            }, 4000);
            return;
        }

        if (msg.type === 'error') {
            // Error occurred
            setStatus('online', 'Helper bereit');
            
            // If the video preview is hidden, this was a getInfo (URL check) failure!
            if (previewCard.classList.contains('hidden')) {
                urlInput.value = '';
                urlInput.placeholder = 'Ungültige oder nicht unterstützte Video-URL!';
                downloadBtn.disabled = true;
                progressCard.classList.add('hidden');
            } else {
                // It was a download failure
                progressStatus.textContent = '❌ Fehler beim Herunterladen';
                progressPercent.textContent = 'Error';
                progressBar.style.width = '100%';
                progressBar.style.background = 'var(--neon-rose)';
                downloadBtn.disabled = false;
            }
            
            console.error('Helper reported error:', msg.message);
            return;
        }
    }

    // Read active tab URL and trigger info fetching
    // Returns true if a valid video URL was detected and checked, false otherwise
    async function detectAndFetchTabUrl() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url) {
                urlInput.value = '';
                urlInput.placeholder = "Video-URL hier einfügen...";
                setStatus('online', 'Bereit für URL...');
                return false;
            }

            const activeUrl = tab.url;

            // Only fetch metadata if it's a web page and not a generic homepage/feed
            if (activeUrl.startsWith('http://') || activeUrl.startsWith('https://')) {
                const isMainFeed = activeUrl.endsWith('/home') || 
                                   activeUrl.endsWith('/feed') || 
                                   activeUrl.match(/^https?:\/\/(www\.)?(youtube|x|twitter|facebook|instagram|tiktok)\.com\/?$/i);

                if (!isMainFeed) {
                    urlInput.value = activeUrl;
                    triggerUrlCheck();
                    return true;
                }
            }
            
            urlInput.value = '';
            urlInput.placeholder = "Video-URL hier einfügen...";
            setStatus('online', 'Bereit für URL...');
            return false;
        } catch (e) {
            console.error('Error fetching tab URL:', e);
            urlInput.value = '';
            urlInput.placeholder = "Video-URL hier einfügen...";
            setStatus('online', 'Bereit für URL...');
            return false;
        }
    }



    // Trigger download request on click
    downloadBtn.addEventListener('click', () => {
        if (!isHelperConnected || !currentUrl) return;

        downloadBtn.disabled = true;
        downloadBtn.querySelector('.btn-text').textContent = 'Warte auf Helper...';
        
        progressCard.classList.remove('hidden');
        progressStatus.textContent = 'Starte Download...';
        progressBar.style.width = '0%';
        progressBar.style.background = 'linear-gradient(90deg, var(--neon-violet) 0%, var(--neon-cyan) 100%)';
        
        nativePort.postMessage({
            action: 'download',
            url: currentUrl,
            type: formatSelect.value,
            quality: qualitySelect.value,
            sponsorBlock: sponsorBlockChecked.checked
        });
    });

    // Start connection
    connectToHelper();
});
