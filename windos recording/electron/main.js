const { app, BrowserWindow, ipcMain, dialog, shell, powerSaveBlocker, desktopCapturer } = require('electron');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');
const isDev   = require('electron-is-dev');
const ffmpeg  = require('fluent-ffmpeg');

// ── Recordings folder ──────────────────────────────────────────────────────
function getRecordingsDir() {
  const dir = path.join(app.getPath('videos'), 'Recordings');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function generateFilename(ext = 'mp4') {
  const now = new Date();
  const ts  = now.toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);
  return `Recording_${ts}.${ext}`;
}

// ── FFmpeg binary path ─────────────────────────────────────────────────────
// ffmpeg-static ships a pre-built binary; point fluent-ffmpeg at it.
// In production (asar), the binary is unpacked via electron-builder config.
let ffmpegBin = require('ffmpeg-static');
// When running from an asar archive, fix the path
if (ffmpegBin && ffmpegBin.includes('app.asar')) {
  ffmpegBin = ffmpegBin.replace('app.asar', 'app.asar.unpacked');
}
ffmpeg.setFfmpegPath(ffmpegBin);

// ── Window ─────────────────────────────────────────────────────────────────
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#94a3b8',
      height: 32,
    },
    icon: path.join(__dirname, '../public/assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // ── Grant microphone / camera permissions ─────────────────────────────────
  // Electron blocks getUserMedia by default. These handlers allow mic + camera.
  mainWindow.webContents.session.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      const allowed = ['media', 'microphone', 'camera', 'audioCapture', 'videoCapture'];
      callback(allowed.includes(permission));
    }
  );

  mainWindow.webContents.session.setPermissionCheckHandler(
    (_webContents, permission) => {
      const allowed = ['media', 'microphone', 'camera', 'audioCapture', 'videoCapture'];
      return allowed.includes(permission);
    }
  );

  // ── Fix getDisplayMedia in Electron renderer ─────────────────────────────
  // Without this handler, getDisplayMedia throws "Not supported" in Electron.
  // useSystemPicker: true → shows the native Windows screen/window picker UI.
  // audio: 'loopback'    → captures system audio on Windows.
  mainWindow.webContents.session.setDisplayMediaRequestHandler(
    (_request, callback) => {
      desktopCapturer
        .getSources({ types: ['screen', 'window'] })
        .then((sources) => callback({ video: sources[0], audio: 'loopback' }))
        .catch(() => callback({ video: null }));
    },
    { useSystemPicker: true }
  );

  if (isDev) mainWindow.webContents.openDevTools();

  return mainWindow;
}

let mainWindow;
app.whenReady().then(() => {
  mainWindow = createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Basic IPC ──────────────────────────────────────────────────────────────
ipcMain.handle('ping', async () => 'pong');

// ── Power saver blocker – prevent system sleep during recording ────────────
let powerSaveId = null;

ipcMain.handle('power:start-blocking', async () => {
  if (powerSaveId === null) {
    powerSaveId = powerSaveBlocker.start('prevent-display-sleep');
    console.log('PowerSaveBlocker started:', powerSaveId);
  }
  return powerSaveId;
});

ipcMain.handle('power:stop-blocking', async () => {
  if (powerSaveId !== null && powerSaveBlocker.isStarted(powerSaveId)) {
    powerSaveBlocker.stop(powerSaveId);
    powerSaveId = null;
    console.log('PowerSaveBlocker stopped');
  }
});

// ── Streaming chunk writers (for long recordings, avoids OOM) ─────────────
const writeStreams = new Map(); // sessionId → { ws: WriteStream, filePath }

ipcMain.handle('stream:open', async (_event, sessionId, filename) => {
  const filePath = path.join(os.tmpdir(), `obs-rec-${sessionId}-${filename}`);
  const ws = fs.createWriteStream(filePath, { flags: 'w' });
  writeStreams.set(sessionId, { ws, filePath });
  return filePath;
});

ipcMain.handle('stream:append', async (_event, sessionId, buffer) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) throw new Error(`No open stream for session ${sessionId}`);
  const chunk = Buffer.from(buffer);
  return new Promise((resolve, reject) => {
    const ok = entry.ws.write(chunk);
    if (ok) resolve();
    else entry.ws.once('drain', resolve); // back-pressure handling
  });
});

ipcMain.handle('stream:close', async (_event, sessionId) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) return null;
  await new Promise((resolve) => entry.ws.end(resolve));
  writeStreams.delete(sessionId);
  return entry.filePath;
});

ipcMain.handle('stream:abort', async (_event, sessionId) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) return;
  entry.ws.destroy();
  writeStreams.delete(sessionId);
  try { fs.unlinkSync(entry.filePath); } catch (_) {}
});

// Clean up any abandoned streams on quit
app.on('before-quit', () => {
  for (const [, entry] of writeStreams) {
    try { entry.ws.destroy(); } catch (_) {}
  }
  writeStreams.clear();
});

// ── Disk space check ───────────────────────────────────────────────────────
ipcMain.handle('disk:check-space', async () => {
  const recDir = getRecordingsDir();
  // Use fs.statfs (Node 19+) or fall back to a conservative estimate
  try {
    const stat  = await fs.promises.statfs(recDir);
    const free  = stat.bfree * stat.bsize;
    const total = stat.blocks * stat.bsize;
    return { free, total, freeGB: (free / 1e9).toFixed(1) };
  } catch {
    return null; // Platform doesn't support statfs
  }
});
// Protocol check (placeholder or removed)


ipcMain.handle('get-system-info', async () => ({
  platform: process.platform,
  arch: process.arch,
  version: process.version,
}));
//git porcessing git stach pop and push 
// ── Save ArrayBuffer → temp file ───────────────────────────────────────────
ipcMain.handle('ffmpeg:save-buffer', async (_event, name, buffer) => {
  const tmpPath = path.join(os.tmpdir(), `obs-recorder-${name}`);
  await fs.promises.writeFile(tmpPath, Buffer.from(buffer));
  return tmpPath;
});

// ── Show Save-As dialog ────────────────────────────────────────────────────
ipcMain.handle('dialog:save-file', async (_event, defaultName) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Recording',
    defaultPath: path.join(getRecordingsDir(), defaultName || generateFilename()),
    filters: [
      { name: 'MP4 Video', extensions: ['mp4'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return canceled ? null : filePath;
});

// ── Get default Recordings folder path ────────────────────────────────────
ipcMain.handle('recordings:get-path', async () => getRecordingsDir());

// ── Open file or folder in OS file explorer ────────────────────────────────
ipcMain.handle('shell:open-path', async (_event, filePath) => {
  // showItemInFolder highlights the file; openPath opens a folder
  if (fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
  } else {
    shell.openPath(getRecordingsDir());
  }
});

// ── FFmpeg merge ───────────────────────────────────────────────────────────
/**
 * opts: {
 *   screenPath  : string   – webm file (video + optional system audio)
 *   webcamPath? : string   – webm file (video only, for PIP overlay)
 *   micPath?    : string   – webm file (processed mic audio)
 *   outputPath  : string   – destination .mp4
 * }
 */
ipcMain.handle('ffmpeg:merge', async (event, opts) => {
  const { screenPath } = opts;
  const outputPath = opts.outputPath || path.join(getRecordingsDir(), generateFilename());

  if (!screenPath) throw new Error('screenPath is required');

  // ── Validate optional input files ─────────────────────────────────────────
  const isValidFile = (p) => {
    if (!p) return false;
    try {
      return fs.statSync(p).size > 10;
    } catch (_) {
      return false;
    }
  };

  const webcamPath = isValidFile(opts.webcamPath) ? opts.webcamPath : null;
  const micPath    = isValidFile(opts.micPath)    ? opts.micPath    : null;

  console.log('[FFmpeg] screen :', screenPath);
  console.log('[FFmpeg] webcam :', webcamPath || '(skipped)');
  console.log('[FFmpeg] mic    :', micPath    || '(skipped)');

  // ── Detect if Input #0 (Screen) has an audio track ────────────────────────
  const getHasAudio = (p) =>
    new Promise((resolve) => {
      ffmpeg.ffprobe(p, (err, metadata) => {
        if (err || !metadata) return resolve(false);
        resolve(metadata.streams.some((s) => s.codec_type === 'audio'));
      });
    });

  const hasScreenAudio = await getHasAudio(screenPath);

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();

    // ── Input files
    // file input x3s1 ──────────────────────────────────────────────
    cmd.input(screenPath);                         // [0] screen
    if (webcamPath) cmd.input(webcamPath);         // [1] webcam
    if (micPath)    cmd.input(micPath);            // [1 or 2] mic

    // ── Compute filter_complex & output maps ─────────────────────
    let filterComplex = '';
    const maps = [];

    const webcamIdx = webcamPath ? 1 : null;
    const micIdx    = micPath ? (webcamPath ? 2 : 1) : null;

    // 1. Video Overlay (Dynamic Streamer Layout)
    if (webcamPath) {
      const layout = opts.webcamLayout; // Expected relX, relY, relW, relH
      if (layout) {
        // Use relative percentages mapped to final resolution
        filterComplex +=
          `[0:v][${webcamIdx}:v]` +
          `scale2ref=w=iw*${layout.w}:h=-1[wc][base];` +
          `[base][wc]overlay=x=W*${layout.x}:y=H*${layout.y}[v]`;
      } else {
        // Fallback to legacy bottom-right
        filterComplex +=
          `[0:v][${webcamIdx}:v]` +
          `scale2ref=320:180[wc][base];` +
          `[base][wc]overlay=W-w-20:H-h-20[v]`;
      }
      maps.push('-map [v]');
    } else {
      maps.push('-map 0:v');
    }

    // 2. Audio Mixing
    if (micIdx !== null) {
      if (hasScreenAudio) {
        // Both exist -> Mix them
        filterComplex += (filterComplex ? '; ' : '') +
          `[0:a][${micIdx}:a]amix=inputs=2:duration=first:dropout_transition=2[a_mixed]`;
        maps.push('-map [a_mixed]');
      } else {
        // Only Mic exists -> Use mic only
        maps.push(`-map ${micIdx}:a`);
      }
    } else {
      // No Mic -> Use screen audio if it exists, else use nothing (video only)
      if (hasScreenAudio) {
        maps.push('-map 0:a');
      }
    }

    if (filterComplex) {
      cmd.complexFilter(filterComplex);
    }

    // ── Output settings ──────────────────────────────────────────
    cmd
      .outputOptions([
        ...maps,
        '-c:v libx264',
        '-preset fast',
        '-crf 22',
        '-pix_fmt yuv420p',    // broad player compatibility
        '-c:a aac',
        '-b:a 192k',
        '-ar 44100',
        '-movflags +faststart', // web-friendly MP4
        '-avoid_negative_ts make_zero', // sync fix for streams starting at non-zero PTS
      ])
      .output(outputPath)
      .on('start', (ffmpegCmd) => {
        console.log('FFmpeg started:', ffmpegCmd);
        event.sender.send('ffmpeg:progress', { percent: 2, timemark: '00:00:00', status: 'started' });

        // ── File-size-based progress estimator ─────────────────────────
        // WebM inputs have no duration, so progress.percent is always 0.
        // Poll the output file size vs input file size instead.
        const inputSize = (() => {
          try { return fs.statSync(screenPath).size; } catch { return 0; }
        })();

        let lastPercent = 2;
        const pollId = setInterval(() => {
          try {
            const outSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
            if (inputSize > 0) {
              // MP4 (H.264) is typically ~50–70% the size of WebM/VP9
              // Use 65% ratio as the expected final size to estimate progress.
              const estimatedFinal = inputSize * 0.65;
              const rawPercent = Math.round((outSize / estimatedFinal) * 95);
              const percent = Math.min(Math.max(rawPercent, lastPercent), 95);
              lastPercent = percent;
              if (!event.sender.isDestroyed()) {
                event.sender.send('ffmpeg:progress', { percent, timemark: '' });
              }
            }
          } catch (_) {}
        }, 500);

        // Store pollId so we can clear it in end/error
        cmd._pollId = pollId;
      })
      .on('progress', (progress) => {
        // Only use if FFmpeg actually knows the percent (non-zero)
        const raw = progress.percent;
        if (raw && raw > 0 && !event.sender.isDestroyed()) {
          const percent = Math.min(Math.round(raw), 95);
          event.sender.send('ffmpeg:progress', { percent, timemark: progress.timemark });
        }
      })
      .on('end', () => {
        clearInterval(cmd._pollId);
        // Cleanup temp files
        [screenPath, webcamPath, micPath].forEach((p) => {
          if (p) fs.unlink(p, () => {});
        });
        console.log('[FFmpeg] Done →', outputPath);
        if (!event.sender.isDestroyed()) {
          event.sender.send('ffmpeg:progress', { percent: 100, timemark: '' });
          event.sender.send('ffmpeg:done', { outputPath });
        }
        resolve({ outputPath });
      })
      .on('error', (err, stdout, stderr) => {
        clearInterval(cmd._pollId);
        console.error('[FFmpeg] Error:', err.message, '\nstderr:', stderr);
        if (!event.sender.isDestroyed()) {
          event.sender.send('ffmpeg:error', { message: err.message, stderr });
        }
        reject(err);
      })
      .run();
  });
});
