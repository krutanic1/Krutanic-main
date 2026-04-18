import { create } from 'zustand';

interface Layout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AppState {
  // Recording State
  isRecording: boolean;
  isPaused: boolean;
  isStreaming: boolean;
  timer: number;
  
  // Settings
  fps: number;
  resolution: string;
  isVirtualBgEnabled: boolean;
  bgMode: 'blur' | 'remove';
  cameraBrightness: number;
  cameraContrast: number;
  showFloatingCamera: boolean;
  floatingCameraWidth: number;
  isStreamingEnabled: boolean;
  streamKey: string;
  cropTop: number;
  cropBottom: number;
  webcamLayout: Layout;

  // YouTube Phase 3 State
  youtubeUser: any | null;
  activeBroadcastId: string | null;
  isAutoBroadcastEnabled: boolean;
  globalError: string | null;

  // Actions
  setRecording: (val: boolean) => void;
  setPaused: (val: boolean) => void;
  setStreaming: (val: boolean) => void;
  setTimer: (val: number | ((prev: number) => number)) => void;
  setFps: (val: number) => void;
  setResolution: (val: string) => void;
  setVirtualBgEnabled: (val: boolean) => void;
  setBgMode: (val: 'blur' | 'remove') => void;
  setCameraBrightness: (val: number) => void;
  setCameraContrast: (val: number) => void;
  setShowFloatingCamera: (val: boolean) => void;
  setFloatingCameraWidth: (val: number) => void;
  setIsStreamingEnabled: (val: boolean) => void;
  setStreamKey: (val: string) => void;
  setCropTop: (val: number) => void;
  setCropBottom: (val: number) => void;
  setWebcamLayout: (val: Layout) => void;
  setYoutubeUser: (val: any) => void;
  setActiveBroadcastId: (val: string | null) => void;
  setIsAutoBroadcastEnabled: (val: boolean) => void;
  setGlobalError: (val: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial State
  isRecording: false,
  isPaused: false,
  isStreaming: false,
  timer: 0,
  fps: 30,
  resolution: '1080p',
  isVirtualBgEnabled: false,
  bgMode: 'blur',
  cameraBrightness: 100,
  cameraContrast: 100,
  showFloatingCamera: false,
  floatingCameraWidth: 280,
  isStreamingEnabled: false,
  streamKey: localStorage.getItem('krutanic_stream_key') || '',
  cropTop: 0,
  cropBottom: 0,
  webcamLayout: { x: 20, y: 20, w: 320, h: 180 },
  youtubeUser: null,
  activeBroadcastId: null,
  isAutoBroadcastEnabled: true,
  globalError: null,

  // Actions
  setRecording: (isRecording) => set({ isRecording }),
  setPaused: (isPaused) => set({ isPaused }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setTimer: (val) => set((state) => ({ 
    timer: typeof val === 'function' ? val(state.timer) : val 
  })),
  setFps: (fps) => set({ fps }),
  setResolution: (resolution) => set({ resolution }),
  setVirtualBgEnabled: (isVirtualBgEnabled) => set({ isVirtualBgEnabled }),
  setBgMode: (bgMode) => set({ bgMode }),
  setCameraBrightness: (cameraBrightness) => set({ cameraBrightness }),
  setCameraContrast: (cameraContrast) => set({ cameraContrast }),
  setShowFloatingCamera: (showFloatingCamera) => set({ showFloatingCamera }),
  setFloatingCameraWidth: (floatingCameraWidth) => set({ floatingCameraWidth }),
  setIsStreamingEnabled: (isStreamingEnabled) => set({ isStreamingEnabled }),
  setStreamKey: (streamKey) => {
    localStorage.setItem('krutanic_stream_key', streamKey);
    set({ streamKey });
  },
  setCropTop: (cropTop) => set({ cropTop }),
  setCropBottom: (cropBottom) => set({ cropBottom }),
  setWebcamLayout: (webcamLayout) => set({ webcamLayout }),
  setYoutubeUser: (youtubeUser) => set({ youtubeUser }),
  setActiveBroadcastId: (activeBroadcastId) => set({ activeBroadcastId }),
  setIsAutoBroadcastEnabled: (isAutoBroadcastEnabled) => set({ isAutoBroadcastEnabled }),
  setGlobalError: (globalError) => set({ globalError }),
}));
