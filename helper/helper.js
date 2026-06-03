#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const { homedir } = require('os');
const https = require('https');

// Create standard folders
const ytDownloaderDir = path.join(homedir(), '.ytDownloader');
if (!fs.existsSync(ytDownloaderDir)) {
    fs.mkdirSync(ytDownloaderDir, { recursive: true });
}

// Log file for debugging native messaging
const logFile = path.join(ytDownloaderDir, 'helper.log');
function log(msg) {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

log('Helper started successfully');

// Standard Native Messaging communication functions
let inputBuffer = Buffer.alloc(0);

process.stdin.on('data', (chunk) => {
    inputBuffer = Buffer.concat([inputBuffer, chunk]);
    processBuffer();
});

process.stdin.on('end', () => {
    log('process.stdin closed, exiting...');
    process.exit(0);
});

function processBuffer() {
    while (inputBuffer.length >= 4) {
        const msgLen = inputBuffer.readInt32LE(0);
        if (inputBuffer.length >= 4 + msgLen) {
            const msgBody = inputBuffer.slice(4, 4 + msgLen).toString('utf8');
            inputBuffer = inputBuffer.slice(4 + msgLen);
            try {
                handleMessage(JSON.parse(msgBody));
            } catch (err) {
                log(`Error handling message: ${err.message}`);
                sendError('Invalid JSON message');
            }
        } else {
            break; // Wait for more data
        }
    }
}

function sendMessage(msg) {
    try {
        const msgBuf = Buffer.from(JSON.stringify(msg), 'utf8');
        const headerBuf = Buffer.alloc(4);
        headerBuf.writeInt32LE(msgBuf.length, 0);
        process.stdout.write(Buffer.concat([headerBuf, msgBuf]));
    } catch (err) {
        log(`Error sending message: ${err.message}`);
    }
}

function sendError(msg, url = '') {
    sendMessage({ type: 'error', message: msg, url });
}

// Ensure yt-dlp is available
async function getExecutablePath() {
    const isWin = process.platform === 'win32';
    const binaryName = isWin ? 'yt-dlp.exe' : 'yt-dlp';
    const localBinaryPath = path.join(ytDownloaderDir, binaryName);

    // 1. Check local .ytDownloader folder
    if (fs.existsSync(localBinaryPath)) {
        return localBinaryPath;
    }

    // 2. Check system PATH
    try {
        const checkCmd = isWin ? 'where yt-dlp' : 'which yt-dlp';
        const pathResult = execSync(checkCmd).toString().trim().split('\n')[0];
        if (fs.existsSync(pathResult)) {
            return pathResult;
        }
    } catch (e) {
        // Not in system path, continue to download
    }

    // 3. Download from GitHub
    log('yt-dlp binary not found. Downloading from GitHub...');
    sendMessage({ type: 'status', message: 'Downloading yt-dlp...' });
    
    const githubUrl = isWin 
        ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
        : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

    try {
        await downloadFile(githubUrl, localBinaryPath);
        if (!isWin) {
            fs.chmodSync(localBinaryPath, 0o755); // Make executable on Unix
        }
        log('yt-dlp downloaded successfully.');
        return localBinaryPath;
    } catch (err) {
        log(`Failed to download yt-dlp: ${err.message}`);
        throw new Error(`Failed to download yt-dlp binary: ${err.message}`);
    }
}

function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

// Find ffmpeg path
function getFfmpegPath() {
    const isWin = process.platform === 'win32';
    // Check system PATH
    try {
        const checkCmd = isWin ? 'where ffmpeg' : 'which ffmpeg';
        const pathResult = execSync(checkCmd).toString().trim().split('\n')[0];
        return pathResult;
    } catch (e) {
        log('ffmpeg not found in system PATH. Checking standard local paths...');
    }

    // Fallback: Check typical paths or local binary if bundled
    return 'ffmpeg'; // Rely on system path fallback
}

// Message handler
async function handleMessage(msg) {
    log(`Received message: ${JSON.stringify(msg)}`);

    if (msg.action === 'ping') {
        sendMessage({ status: 'online', platform: process.platform });
        return;
    }

    if (msg.action === 'getInfo') {
        const { url } = msg;
        if (!url) {
            sendError('No URL provided');
            return;
        }

        try {
            const ytDlpPath = await getExecutablePath();
            log(`Running getInfo for ${url} using ${ytDlpPath}`);

            // Spawn yt-dlp to get info JSON
            const args = ['-j', '--no-playlist', '--no-warnings', url];
            const child = spawn(ytDlpPath, args);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => { stdout += data; });
            child.stderr.on('data', (data) => { stderr += data; });

            child.on('close', (code) => {
                if (code === 0 && stdout) {
                    try {
                        const info = JSON.parse(stdout);
                        sendMessage({
                            type: 'info',
                            title: info.title,
                            thumbnail: info.thumbnail,
                            duration: info.duration,
                            extractor: info.extractor_key,
                            url: url
                        });
                    } catch (e) {
                        sendError('Failed to parse metadata JSON', url);
                    }
                } else {
                    sendError(stderr.trim() || `Process exited with code ${code}`, url);
                }
            });
        } catch (err) {
            sendError(err.message, url);
        }
        return;
    }

    if (msg.action === 'download') {
        const { url, type, quality } = msg;
        if (!url) {
            sendError('No URL provided');
            return;
        }

        try {
            const ytDlpPath = await getExecutablePath();
            const ffmpegPath = getFfmpegPath();
            const ffmpegLocationArgs = [];
            if (path.isAbsolute(ffmpegPath)) {
                ffmpegLocationArgs.push('--ffmpeg-location', path.dirname(ffmpegPath));
            }
            
            const downloadsFolder = path.join(homedir(), 'Downloads');
            
            // Format parameters
            let formatString = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
            let ext = 'mp4';
            let postProcessArgs = [];

            if (type === 'audio') {
                formatString = 'bestaudio/best';
                ext = 'mp3';
                postProcessArgs = ['-x', '--audio-format', 'mp3', '--audio-quality', '0'];
            } else if (quality === '1080p') {
                formatString = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best';
            } else if (quality === '720p') {
                formatString = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best';
            } else if (quality === '480p') {
                formatString = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best';
            }

            const outputTemplate = path.join(downloadsFolder, '%(title)s.%(ext)s');

            const args = [
                '-f', formatString,
                '-o', outputTemplate,
                '--no-playlist',
                ...ffmpegLocationArgs,
                ...postProcessArgs,
                url
            ];

            log(`Spawning yt-dlp download with args: ${args.join(' ')}`);
            const child = spawn(ytDlpPath, args);

            let leftover = '';
            // Match progress e.g. [download]  12.3% of 45.67MiB at  4.56MiB/s ETA 00:10
            const progressRegex = /\[download\]\s+([\d.]+)\%\s+of\s+~?([\d.]+\w+)\s+at\s+([\d.]+\w+\/s)\s+ETA\s+([\d:]+)/;

            child.stdout.on('data', (data) => {
                const lines = (leftover + data.toString()).split(/[\r\n]+/);
                leftover = lines.pop();
                for (const line of lines) {
                    const match = line.match(progressRegex);
                    if (match) {
                        const percent = parseFloat(match[1]);
                        const size = match[2];
                        const speed = match[3];
                        const eta = match[4];
                        sendMessage({
                            type: 'progress',
                            percent,
                            size,
                            speed,
                            eta,
                            url
                        });
                    }
                }
            });

            let stderr = '';
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                if (code === 0) {
                    sendMessage({
                        type: 'complete',
                        message: 'Download complete!',
                        folder: downloadsFolder,
                        url
                    });
                } else {
                    log(`Download process failed with code ${code}. Stderr: ${stderr}`);
                    sendError(`Download failed: ${stderr.trim() || 'Internal Error'}`, url);
                }
            });

        } catch (err) {
            sendError(err.message, url);
        }
        return;
    }

    sendError(`Unknown action: ${msg.action}`);
}
