"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_config = require("dotenv/config");
var import_electron2 = require("electron");
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
var os = __toESM(require("os"));
var import_electron_is_dev = __toESM(require("electron-is-dev"));
var import_fluent_ffmpeg = __toESM(require("fluent-ffmpeg"));
var import_ffmpeg_static = __toESM(require("ffmpeg-static"));

// electron/youtubeService.ts
var import_googleapis = require("googleapis");
var import_http = __toESM(require("http"));
var import_electron = require("electron");
var import_electron_store = __toESM(require("electron-store"));
var store = new import_electron_store.default();
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "PENDING";
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "PENDING";
var REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/callback";
var YouTubeService = class {
  oauth2Client;
  activeServer = null;
  constructor() {
    this.oauth2Client = new import_googleapis.google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    const tokens = store.get("youtube_tokens");
    if (tokens) {
      this.oauth2Client.setCredentials(tokens);
    }
    this.oauth2Client.on("tokens", (newTokens) => {
      const existingTokens = store.get("youtube_tokens") || {};
      const merged = { ...existingTokens, ...newTokens };
      store.set("youtube_tokens", merged);
      console.log("[YouTubeService] Tokens updated and persisted");
    });
  }
  async isAuthenticated() {
    const tokens = this.oauth2Client.credentials;
    if (!tokens || !tokens.access_token) return false;
    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      try {
        await this.oauth2Client.getAccessToken();
        return true;
      } catch (err) {
        console.error("[YouTubeService] Token refresh failed:", err);
        return false;
      }
    }
    return true;
  }
  async login() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly"
      ],
      prompt: "consent"
    });
    return new Promise((resolve, reject) => {
      if (this.activeServer) {
        this.activeServer.close();
        this.activeServer = null;
      }
      this.activeServer = import_http.default.createServer(async (req, res) => {
        if (req.url?.startsWith("/callback")) {
          const url = new URL(req.url, REDIRECT_URI);
          const code = url.searchParams.get("code");
          if (code) {
            try {
              const { tokens } = await this.oauth2Client.getToken(code);
              this.oauth2Client.setCredentials(tokens);
              store.set("youtube_tokens", tokens);
              res.end("Authentication successful! You can close this window.");
              if (this.activeServer) {
                this.activeServer.close();
                this.activeServer = null;
              }
              const userInfo = await this.getUserInfo();
              resolve(userInfo);
            } catch (err) {
              res.end("Authentication failed. Please check the logs.");
              reject(err);
            }
          }
        }
      }).listen(3e3, () => {
        import_electron.shell.openExternal(authUrl);
      });
      setTimeout(() => {
        if (this.activeServer) {
          this.activeServer.close();
          this.activeServer = null;
        }
        reject(new Error("Authentication timed out"));
      }, 3e5);
    });
  }
  async logout() {
    store.delete("youtube_tokens");
    this.oauth2Client.setCredentials({});
  }
  async getUserInfo() {
    const youtube2 = import_googleapis.google.youtube({ version: "v3", auth: this.oauth2Client });
    const response = await youtube2.channels.list({
      part: ["snippet", "statistics"],
      mine: true
    });
    return response.data.items?.[0] || null;
  }
  /**
   * createBroadcast: Complete flow to get an RTMP stream key
   * 1. Insert Broadcast
   * 2. Insert Stream
   * 3. Bind Broadcast to Stream
   */
  async createBroadcast(title = `Krutanic Live - ${(/* @__PURE__ */ new Date()).toLocaleString()}`) {
    const youtube2 = import_googleapis.google.youtube({ version: "v3", auth: this.oauth2Client });
    const broadcastResp = await youtube2.liveBroadcasts.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: {
        snippet: {
          title,
          scheduledStartTime: (/* @__PURE__ */ new Date()).toISOString()
        },
        status: {
          privacyStatus: "private",
          // Default to private as requested
          selfDeclaredMadeForKids: false
        },
        contentDetails: {
          enableAutoStart: true,
          enableAutoStop: true,
          monitorStream: {
            enableMonitorStream: false
          }
        }
      }
    });
    const broadcastId = broadcastResp.data.id;
    const streamResp = await youtube2.liveStreams.insert({
      part: ["snippet", "cdn", "status"],
      requestBody: {
        snippet: { title: `Stream for ${broadcastId}` },
        cdn: {
          frameRate: "30fps",
          ingestionType: "rtmp",
          resolution: "1080p"
        }
      }
    });
    const streamId = streamResp.data.id;
    const rtmpUrl = streamResp.data.cdn.ingestionInfo.ingestionAddress;
    const streamKey = streamResp.data.cdn.ingestionInfo.streamName;
    await youtube2.liveBroadcasts.bind({
      id: broadcastId,
      part: ["id", "contentDetails"],
      streamId
    });
    return { rtmpUrl, streamKey, broadcastId };
  }
};

// electron/main.ts
var youtube = new YouTubeService();
function getRecordingsDir() {
  const dir = path.join(import_electron2.app.getPath("videos"), "Recordings");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function generateFilename(ext = "mp4") {
  const now = /* @__PURE__ */ new Date();
  const ts = now.toISOString().replace(/T/, "_").replace(/:/g, "-").slice(0, 19);
  return `Recording_${ts}.${ext}`;
}
var ffmpegBin = import_ffmpeg_static.default;
if (ffmpegBin && ffmpegBin.includes("app.asar")) {
  ffmpegBin = ffmpegBin.replace("app.asar", "app.asar.unpacked");
}
import_fluent_ffmpeg.default.setFfmpegPath(ffmpegBin);
var mainWindow = null;
function createWindow() {
  const win = new import_electron2.BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    },
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0f172a",
      symbolColor: "#94a3b8",
      height: 32
    },
    icon: path.join(__dirname, "../public/assets/icon.png")
  });
  const startUrl = import_electron_is_dev.default ? "http://localhost:5173" : `file://${path.join(__dirname, "../dist/index.html")}`;
  win.loadURL(startUrl);
  win.once("ready-to-show", () => win.show());
  win.webContents.session.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(["media", "microphone", "camera", "audioCapture", "videoCapture"].includes(permission));
  });
  win.webContents.session.setDisplayMediaRequestHandler((_request, callback) => {
    import_electron2.desktopCapturer.getSources({ types: ["screen", "window"] }).then((sources) => callback({ video: sources[0], audio: "loopback" })).catch(() => callback({ video: void 0 }));
  }, { useSystemPicker: true });
  if (import_electron_is_dev.default) win.webContents.openDevTools();
  return win;
}
import_electron2.app.whenReady().then(() => {
  mainWindow = createWindow();
});
import_electron2.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (youtube.activeServer) {
      try {
        youtube.activeServer.close();
      } catch (e) {
      }
    }
    for (const [_, entry] of liveStreams) {
      if (entry.proc) {
        try {
          if (entry.proc.ffmpegProc) {
            entry.proc.ffmpegProc.stdin?.end();
          }
          entry.proc.kill("SIGKILL");
        } catch (e) {
        }
      }
    }
    import_electron2.app.exit(0);
  }
});
import_electron2.ipcMain.handle("ping", async () => "pong");
var powerSaveId = null;
import_electron2.ipcMain.handle("power:start-blocking", async () => {
  if (powerSaveId === null) {
    powerSaveId = import_electron2.powerSaveBlocker.start("prevent-display-sleep");
  }
  return powerSaveId;
});
import_electron2.ipcMain.handle("power:stop-blocking", async () => {
  if (powerSaveId !== null && import_electron2.powerSaveBlocker.isStarted(powerSaveId)) {
    import_electron2.powerSaveBlocker.stop(powerSaveId);
    powerSaveId = null;
  }
});
var writeStreams = /* @__PURE__ */ new Map();
import_electron2.ipcMain.handle("stream:open", async (_event, sessionId, filename) => {
  const filePath = path.join(os.tmpdir(), `obs-rec-${sessionId}-${filename}`);
  const ws = fs.createWriteStream(filePath, { flags: "w" });
  writeStreams.set(sessionId, { ws, filePath });
  return filePath;
});
import_electron2.ipcMain.handle("stream:append", async (_event, sessionId, buffer) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) throw new Error(`No open stream for session ${sessionId}`);
  const chunk = Buffer.from(buffer);
  return new Promise((resolve) => {
    if (entry.ws.write(chunk)) resolve();
    else entry.ws.once("drain", resolve);
  });
});
import_electron2.ipcMain.handle("stream:close", async (_event, sessionId) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) return null;
  await new Promise((resolve) => entry.ws.end(resolve));
  writeStreams.delete(sessionId);
  return entry.filePath;
});
import_electron2.ipcMain.handle("stream:abort", async (_event, sessionId) => {
  const entry = writeStreams.get(sessionId);
  if (!entry) return;
  entry.ws.destroy();
  writeStreams.delete(sessionId);
  try {
    fs.unlinkSync(entry.filePath);
  } catch (_) {
  }
});
import_electron2.ipcMain.handle("disk:check-space", async () => {
  const recDir = getRecordingsDir();
  try {
    const stat = await fs.promises.statfs(recDir);
    const free = stat.bfree * stat.bsize;
    const total = stat.blocks * stat.bsize;
    return { free, total, freeGB: (free / 1e9).toFixed(1) };
  } catch {
    return null;
  }
});
import_electron2.ipcMain.handle("get-system-info", async () => ({
  platform: process.platform,
  arch: process.arch,
  version: process.version
}));
import_electron2.ipcMain.handle("screen:get-info", async () => {
  return import_electron2.screen.getAllDisplays().map((d) => ({
    id: d.id,
    bounds: d.bounds,
    workArea: d.workArea,
    scaleFactor: d.scaleFactor
  }));
});
import_electron2.ipcMain.handle("ffmpeg:save-buffer", async (_event, name, buffer) => {
  const tmpPath = path.join(os.tmpdir(), `obs-recorder-${name}`);
  await fs.promises.writeFile(tmpPath, Buffer.from(buffer));
  return tmpPath;
});
import_electron2.ipcMain.handle("dialog:save-file", async (_event, defaultName) => {
  if (!mainWindow) return null;
  const { canceled, filePath } = await import_electron2.dialog.showSaveDialog(mainWindow, {
    title: "Save Recording",
    defaultPath: path.join(getRecordingsDir(), defaultName || generateFilename()),
    filters: [
      { name: "MP4 Video", extensions: ["mp4"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  return canceled ? null : filePath;
});
import_electron2.ipcMain.handle("recordings:get-path", async () => getRecordingsDir());
import_electron2.ipcMain.handle("shell:open-path", async (_event, filePath) => {
  if (fs.existsSync(filePath)) import_electron2.shell.showItemInFolder(filePath);
  else import_electron2.shell.openPath(getRecordingsDir());
});
import_electron2.ipcMain.handle("youtube:login", async () => youtube.login());
import_electron2.ipcMain.handle("youtube:logout", async () => youtube.logout());
import_electron2.ipcMain.handle("youtube:check-auth", async () => youtube.isAuthenticated());
import_electron2.ipcMain.handle("youtube:create-broadcast", async (_event, title) => youtube.createBroadcast(title));
var liveStreams = /* @__PURE__ */ new Map();
import_electron2.ipcMain.handle("ffmpeg:live-start", async (event, opts) => {
  const { sessionId, streamKey, outputPath, fps = 30 } = opts;
  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
  const localFile = outputPath || path.join(getRecordingsDir(), generateFilename());
  return new Promise((resolve, reject) => {
    try {
      const proc = (0, import_fluent_ffmpeg.default)().input("pipe:0").inputFormat("webm").videoCodec("h264_nvenc").audioCodec("aac").outputOptions([
        "-preset p1",
        // NVENC lowest latency
        "-maxrate 2500k",
        // Requested 2500kbps
        "-bufsize 5000k",
        "-pix_fmt yuv420p",
        "-g 60",
        "-f tee"
      ]).output(`[f=flv]${rtmpUrl}|[f=mp4]${localFile}`).on("start", (cmd) => {
        console.log("[LiveStream] Started with NVENC:", cmd);
        resolve({ localFile });
      }).on("error", (err) => {
        if (err.message.includes("Unknown encoder") || err.message.includes("Cannot find encoder")) {
          console.warn("[LiveStream] NVENC failed, falling back to libx264");
          const fallback = (0, import_fluent_ffmpeg.default)().input("pipe:0").inputFormat("webm").videoCodec("libx264").audioCodec("aac").outputOptions([
            "-preset veryfast",
            "-maxrate 2500k",
            "-bufsize 5000k",
            "-pix_fmt yuv420p",
            "-g 60",
            "-f tee"
          ]).output(`[f=flv]${rtmpUrl}|[f=mp4]${localFile}`).on("start", () => resolve({ localFile }));
          const stdin = fallback.run();
          liveStreams.set(sessionId, { proc: fallback, localFile });
          return;
        }
        event.sender.send("ffmpeg:live-error", { sessionId, message: err.message });
      });
      proc.run();
      liveStreams.set(sessionId, { proc, localFile });
    } catch (err) {
      reject(err);
    }
  });
});
import_electron2.ipcMain.handle("ffmpeg:live-feed", async (_event, sessionId, buffer) => {
  const entry = liveStreams.get(sessionId);
  if (entry?.proc?.ffmpegProc?.stdin) {
    entry.proc.ffmpegProc.stdin.write(Buffer.from(buffer));
  }
});
import_electron2.ipcMain.handle("ffmpeg:live-stop", async (_event, sessionId) => {
  const entry = liveStreams.get(sessionId);
  if (!entry) return null;
  return new Promise((resolve) => {
    entry.proc.ffmpegProc.stdin.end();
    entry.proc.on("end", () => {
      liveStreams.delete(sessionId);
      resolve(entry.localFile);
    });
    setTimeout(() => {
      if (liveStreams.has(sessionId)) {
        entry.proc.kill("SIGINT");
        liveStreams.delete(sessionId);
        resolve(entry.localFile);
      }
    }, 3e3);
  });
});
import_electron2.ipcMain.handle("ffmpeg:merge", async (event, opts) => {
  const { screenPath } = opts;
  const outputPath = opts.outputPath || path.join(getRecordingsDir(), generateFilename());
  return new Promise((resolve, reject) => {
    (0, import_fluent_ffmpeg.default)(screenPath).outputOptions(["-c:v libx264", "-preset fast", "-crf 22", "-pix_fmt yuv420p", "-c:a aac"]).output(outputPath).on("progress", (p) => event.sender.send("ffmpeg:progress", p)).on("end", () => resolve({ outputPath })).on("error", (err) => reject(err)).run();
  });
});
//# sourceMappingURL=main.js.map
