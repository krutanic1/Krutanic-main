"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/preload.ts
var preload_exports = {};
module.exports = __toCommonJS(preload_exports);
var import_electron = require("electron");
var api = {
  ping: () => import_electron.ipcRenderer.invoke("ping"),
  getSystemInfo: () => import_electron.ipcRenderer.invoke("get-system-info"),
  getScreenInfo: () => import_electron.ipcRenderer.invoke("screen:get-info"),
  showSaveDialog: (defaultName) => import_electron.ipcRenderer.invoke("dialog:save-file", defaultName),
  saveBuffer: (name, buffer) => import_electron.ipcRenderer.invoke("ffmpeg:save-buffer", name, buffer),
  getRecordingsPath: () => import_electron.ipcRenderer.invoke("recordings:get-path"),
  openFilePath: (filePath) => import_electron.ipcRenderer.invoke("shell:open-path", filePath),
  mergeRecordings: (opts) => import_electron.ipcRenderer.invoke("ffmpeg:merge", opts),
  onMergeProgress: (cb) => import_electron.ipcRenderer.on("ffmpeg:progress", (_e, data) => cb(data)),
  onMergeDone: (cb) => import_electron.ipcRenderer.on("ffmpeg:done", (_e, data) => cb(data)),
  onMergeError: (cb) => import_electron.ipcRenderer.on("ffmpeg:error", (_e, data) => cb(data)),
  removeMergeListeners: () => {
    import_electron.ipcRenderer.removeAllListeners("ffmpeg:progress");
    import_electron.ipcRenderer.removeAllListeners("ffmpeg:done");
    import_electron.ipcRenderer.removeAllListeners("ffmpeg:error");
  },
  startPowerBlock: () => import_electron.ipcRenderer.invoke("power:start-blocking"),
  stopPowerBlock: () => import_electron.ipcRenderer.invoke("power:stop-blocking"),
  streamOpen: (sessionId, filename) => import_electron.ipcRenderer.invoke("stream:open", sessionId, filename),
  streamAppend: (sessionId, buffer) => import_electron.ipcRenderer.invoke("stream:append", sessionId, buffer),
  streamClose: (sessionId) => import_electron.ipcRenderer.invoke("stream:close", sessionId),
  streamAbort: (sessionId) => import_electron.ipcRenderer.invoke("stream:abort", sessionId),
  checkDiskSpace: () => import_electron.ipcRenderer.invoke("disk:check-space"),
  liveStreamStart: (opts) => import_electron.ipcRenderer.invoke("ffmpeg:live-start", opts),
  liveStreamFeed: (sid, buf) => import_electron.ipcRenderer.invoke("ffmpeg:live-feed", sid, buf),
  liveStreamStop: (sid) => import_electron.ipcRenderer.invoke("ffmpeg:live-stop", sid),
  onLiveStreamError: (cb) => import_electron.ipcRenderer.on("ffmpeg:live-error", (_e, data) => cb(data)),
  // YouTube Integration
  youtubeLogin: () => import_electron.ipcRenderer.invoke("youtube:login"),
  youtubeLogout: () => import_electron.ipcRenderer.invoke("youtube:logout"),
  youtubeCheckAuth: () => import_electron.ipcRenderer.invoke("youtube:check-auth"),
  youtubeCreateBroadcast: (opts) => import_electron.ipcRenderer.invoke("youtube:create-broadcast", opts)
};
import_electron.contextBridge.exposeInMainWorld("electronAPI", api);
//# sourceMappingURL=preload.js.map
