import { contextBridge, ipcRenderer } from 'electron';

export interface IElectronAPI {
  // System info
  ping: () => Promise<string>;
  getSystemInfo: () => Promise<any>;
  getScreenInfo: () => Promise<any[]>;

  // File operations
  showSaveDialog: (defaultName?: string) => Promise<string | null>;
  saveBuffer: (name: string, buffer: ArrayBuffer) => Promise<string>;
  getRecordingsPath: () => Promise<string>;
  openFilePath: (filePath: string) => Promise<void>;

  // FFmpeg merge
  mergeRecordings: (opts: any) => Promise<{ outputPath: string }>;

  // FFmpeg progress events
  onMergeProgress: (cb: (data: { percent: number }) => void) => void;
  onMergeDone: (cb: (data: { outputPath: string }) => void) => void;
  onMergeError: (cb: (data: { message: string }) => void) => void;
  removeMergeListeners: () => void;

  // Power management
  startPowerBlock: () => Promise<number>;
  stopPowerBlock: () => Promise<void>;

  // Streaming chunk writers
  streamOpen: (sessionId: string, filename: string) => Promise<string>;
  streamAppend: (sessionId: string, buffer: ArrayBuffer) => Promise<void>;
  streamClose: (sessionId: string) => Promise<string | null>;
  streamAbort: (sessionId: string) => Promise<void>;

  // Disk space
  checkDiskSpace: () => Promise<any>;

  // Live Streaming (RTMP)
  liveStreamStart: (opts: any) => Promise<any>;
  liveStreamFeed: (sid: string, buf: ArrayBuffer) => Promise<void>;
  liveStreamStop: (sid: string) => Promise<string | null>;
  onLiveStreamError: (cb: (data: any) => void) => void;

  // YouTube API (Phase 3)
  youtubeLogin: () => Promise<any>;
  youtubeLogout: () => Promise<void>;
  youtubeCheckAuth: () => Promise<any>;
  youtubeCreateBroadcast: (opts: any) => Promise<any>;
}

const api: IElectronAPI = {
  ping: () => ipcRenderer.invoke('ping'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getScreenInfo: () => ipcRenderer.invoke('screen:get-info'),

  showSaveDialog: (defaultName) => ipcRenderer.invoke('dialog:save-file', defaultName),
  saveBuffer: (name, buffer) => ipcRenderer.invoke('ffmpeg:save-buffer', name, buffer),
  getRecordingsPath: () => ipcRenderer.invoke('recordings:get-path'),
  openFilePath: (filePath) => ipcRenderer.invoke('shell:open-path', filePath),

  mergeRecordings: (opts) => ipcRenderer.invoke('ffmpeg:merge', opts),

  onMergeProgress: (cb) => ipcRenderer.on('ffmpeg:progress', (_e, data) => cb(data)),
  onMergeDone: (cb) => ipcRenderer.on('ffmpeg:done', (_e, data) => cb(data)),
  onMergeError: (cb) => ipcRenderer.on('ffmpeg:error', (_e, data) => cb(data)),
  removeMergeListeners: () => {
    ipcRenderer.removeAllListeners('ffmpeg:progress');
    ipcRenderer.removeAllListeners('ffmpeg:done');
    ipcRenderer.removeAllListeners('ffmpeg:error');
  },

  startPowerBlock: () => ipcRenderer.invoke('power:start-blocking'),
  stopPowerBlock: () => ipcRenderer.invoke('power:stop-blocking'),

  streamOpen: (sessionId, filename) => ipcRenderer.invoke('stream:open', sessionId, filename),
  streamAppend: (sessionId, buffer) => ipcRenderer.invoke('stream:append', sessionId, buffer),
  streamClose: (sessionId) => ipcRenderer.invoke('stream:close', sessionId),
  streamAbort: (sessionId) => ipcRenderer.invoke('stream:abort', sessionId),

  checkDiskSpace: () => ipcRenderer.invoke('disk:check-space'),

  liveStreamStart: (opts) => ipcRenderer.invoke('ffmpeg:live-start', opts),
  liveStreamFeed: (sid, buf) => ipcRenderer.invoke('ffmpeg:live-feed', sid, buf),
  liveStreamStop: (sid) => ipcRenderer.invoke('ffmpeg:live-stop', sid),
  onLiveStreamError: (cb) => ipcRenderer.on('ffmpeg:live-error', (_e, data) => cb(data)),

  // YouTube Integration
  youtubeLogin: () => ipcRenderer.invoke('youtube:login'),
  youtubeLogout: () => ipcRenderer.invoke('youtube:logout'),
  youtubeCheckAuth: () => ipcRenderer.invoke('youtube:check-auth'),
  youtubeCreateBroadcast: (opts) => ipcRenderer.invoke('youtube:create-broadcast', opts),
};

contextBridge.exposeInMainWorld('electronAPI', api);
