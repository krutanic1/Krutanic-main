const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // System info
  ping: () => ipcRenderer.invoke('ping'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // File operations
  showSaveDialog: (defaultName) => ipcRenderer.invoke('dialog:save-file', defaultName),
  saveBuffer: (name, buffer)    => ipcRenderer.invoke('ffmpeg:save-buffer', name, buffer),
  getRecordingsPath: ()         => ipcRenderer.invoke('recordings:get-path'),
  openFilePath: (filePath)      => ipcRenderer.invoke('shell:open-path', filePath),

  // FFmpeg merge
  mergeRecordings: (opts) => ipcRenderer.invoke('ffmpeg:merge', opts),

  // FFmpeg progress events
  onMergeProgress: (cb) => ipcRenderer.on('ffmpeg:progress', (_e, data) => cb(data)),
  onMergeDone:     (cb) => ipcRenderer.on('ffmpeg:done',     (_e, data) => cb(data)),
  onMergeError:    (cb) => ipcRenderer.on('ffmpeg:error',    (_e, data) => cb(data)),
  removeMergeListeners: () => {
    ipcRenderer.removeAllListeners('ffmpeg:progress');
    ipcRenderer.removeAllListeners('ffmpeg:done');
    ipcRenderer.removeAllListeners('ffmpeg:error');
  },

  // Power management (prevent sleep during recording)
  startPowerBlock: ()  => ipcRenderer.invoke('power:start-blocking'),
  stopPowerBlock:  ()  => ipcRenderer.invoke('power:stop-blocking'),

  // Streaming chunk writers (memory-efficient long recordings)
  streamOpen:   (sessionId, filename) => ipcRenderer.invoke('stream:open',   sessionId, filename),
  streamAppend: (sessionId, buffer)   => ipcRenderer.invoke('stream:append', sessionId, buffer),
  streamClose:  (sessionId)           => ipcRenderer.invoke('stream:close',  sessionId),
  streamAbort:  (sessionId)           => ipcRenderer.invoke('stream:abort',  sessionId),

  // Disk space
  checkDiskSpace: () => ipcRenderer.invoke('disk:check-space'),
});
