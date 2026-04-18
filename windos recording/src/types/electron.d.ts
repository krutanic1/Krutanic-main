export interface ElectronAPI {
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
  onMergeProgress: (cb: (data: any) => void) => void;
  onMergeDone:     (cb: (data: any) => void) => void;
  onMergeError:    (cb: (data: any) => void) => void;
  removeMergeListeners: () => void;

  // Power management
  startPowerBlock: ()  => Promise<number>;
  stopPowerBlock:  ()  => Promise<void>;

  // Streaming chunk writers
  streamOpen:   (sessionId: string, filename: string) => Promise<string>;
  streamAppend: (sessionId: string, buffer: ArrayBuffer) => Promise<void>;
  streamClose:  (sessionId: string) => Promise<string>;
  streamAbort:  (sessionId: string) => Promise<void>;

  // Disk space
  checkDiskSpace: () => Promise<{ free: number; total: number; freeGB: string } | null>;

  // Live Streaming (RTMP)
  liveStreamStart: (opts: any) => Promise<{ localFile: string }>;
  liveStreamFeed:  (sid: string, buf: ArrayBuffer) => Promise<void>;
  liveStreamStop:   (sid: string) => Promise<string>;
  onLiveStreamError: (cb: (data: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
