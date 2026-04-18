import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import SceneList from './components/SceneList';
import PreviewCanvas from './components/PreviewCanvas';
import ControlPanel from './components/ControlPanel';
import AudioMixer from './components/AudioMixer';
import SaveToast from './components/SaveToast';
import StatusBar from './components/StatusBar';
import FloatingCameraMonitor from './components/FloatingCameraMonitor';
import { useMediaRecorder } from './hooks/useMediaRecorder';
import { useDevices } from './hooks/useDevices';
import { useMicrophoneAudio } from './hooks/useMicrophoneAudio';
import { useVirtualBackground } from './hooks/useVirtualBackground';
import { useAudioMixer } from './hooks/useAudioMixer';
import { useLiveCompositor } from './hooks/useLiveCompositor';
import { useStore } from './store/useStore';

const RESOLUTIONS: Record<string, { width: number; height: number }> = {
  '720p':  { width: 1280,  height: 720  },
  '1080p': { width: 1920,  height: 1080 },
  '1440p': { width: 2560,  height: 1440 },
};

function App() {
  const store = useStore();

  // YouTube Initialization
  useEffect(() => {
    async function initYouTube() {
      try {
        const isAuthed = await window.electronAPI.youtubeCheckAuth();
        if (isAuthed) {
          const user = await window.electronAPI.youtubeLogin(); // This handles refresh/getUserInfo internally in our service logic
          store.setYoutubeUser(user);
        }
      } catch (err) {
        console.error('YouTube init failed:', err);
      }
    }
    initYouTube();
  }, []);

  // Screen stream state
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  // Webcam state
  const [webcamStream, setWebcamStream] = React.useState<MediaStream | null>(null);
  const [isWebcamOn, setIsWebcamOn] = React.useState(false);
  const webcamRef = useRef<MediaStream | null>(null);

  // Device enumeration
  const {
    cameras, microphones,
    selectedCamera, setSelectedCamera,
    selectedMic,    setSelectedMic,
  } = useDevices();

  // Mic control
  const mic = useMicrophoneAudio(selectedMic);

  // Error state
  const [captureError, setCaptureError] = React.useState<string | null>(null);

  // Device disconnect handler
  const handleDeviceDisconnect = useCallback((device: 'webcam' | 'microphone') => {
    setCaptureError(
      device === 'webcam'
        ? '📷 Webcam disconnected. Recording continues without camera overlay.'
        : '🎙️ Microphone disconnected. Recording continues without mic audio.'
    );
    if (device === 'webcam') {
      setWebcamStream(null);
      setIsWebcamOn(false);
    }
  }, []);

  // MediaRecorder hook
  const {
    isRecording, isPaused, timer,
    mergeStatus, mergePercent,
    savedPath, bytesWritten,
    error: recordError,
    startRecording, stopRecording, togglePause,
  } = useMediaRecorder({ onDeviceDisconnect: handleDeviceDisconnect });

  const webcamSettings = useMemo(() => ({
    bgMode: store.bgMode,
    brightness: store.cameraBrightness,
    contrast: store.cameraContrast,
  }), [store.bgMode, store.cameraBrightness, store.cameraContrast]);

  // Apply virtual background if enabled
  const processedWebcamStream = useVirtualBackground(webcamStream, store.isVirtualBgEnabled, webcamSettings);

  // ── Pro Streaming Compositor ────────────────────────────────────
  const mixedAudio = useAudioMixer([
    stream, 
    mic.streamDestRef?.current?.stream || null
  ]);

  const compositeVideo = useLiveCompositor({
    screenStream: stream,
    webcamStream: processedWebcamStream,
    isWebcamOn,
    layout: {
      x: store.webcamLayout.x / 1280,
      y: store.webcamLayout.y / 720,
      w: store.webcamLayout.w / 1280,
      h: store.webcamLayout.h / 720
    },
    isActive: isRecording && store.isStreamingEnabled
  });

  const [liveStream, setLiveStream] = React.useState<MediaStream | null>(null);
  useEffect(() => {
    if (compositeVideo && mixedAudio) {
      const live = new MediaStream([
        ...compositeVideo.getVideoTracks(),
        ...mixedAudio.getAudioTracks()
      ]);
      setLiveStream(live);
    }
  }, [compositeVideo, mixedAudio]);

  const error = store.globalError || captureError || recordError;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      webcamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Screen capture ─────────────────────────────────────────────────────
  const solveHandleStop = useCallback(() => {
    const container = document.querySelector('.aspect-video');
    let relativeLayout = null;
    if (container) {
      const cw = container.clientWidth || 1280;
      const ch = container.clientHeight || 720;
      relativeLayout = {
        x: Math.max(0, Math.min(1, store.webcamLayout.x / cw)),
        y: Math.max(0, Math.min(1, store.webcamLayout.y / ch)),
        w: Math.max(0.1, Math.min(1, store.webcamLayout.w / cw)),
        h: Math.max(0.1, Math.min(1, store.webcamLayout.h / ch)),
      };
    }

    const targetRes = RESOLUTIONS[store.resolution] || RESOLUTIONS['1080p'];
    stopRecording(relativeLayout, targetRes, { cropTop: store.cropTop, cropBottom: store.cropBottom });
    
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, [stopRecording, store]);

  const handleStart = useCallback(async () => {
    setCaptureError(null);
    const { width, height } = RESOLUTIONS[store.resolution] || RESOLUTIONS['1080p'];

    try {
      let finalStreamKey = store.streamKey;

      // YouTube Phase 3: Auto-create broadcast if needed
      if (store.isStreamingEnabled && store.youtubeUser && store.isAutoBroadcastEnabled) {
        try {
          const broadcast = await window.electronAPI.youtubeCreateBroadcast(
            `Krutanic Live - ${new Date().toLocaleString()}`
          );
          finalStreamKey = broadcast.streamKey;
          store.setStreamKey(broadcast.streamKey);
          store.setActiveBroadcastId(broadcast.broadcastId);
        } catch (err: any) {
          console.error('Auto-broadcast failed:', err);
          setCaptureError(`YouTube Broadcast failed: ${err.message}. streaming might fail.`);
        }
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: width }, height: { ideal: height }, frameRate: { ideal: store.fps } },
        audio: true,
      });

      mediaStream.getVideoTracks()[0].onended = solveHandleStop;
      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (!mic.isActive) await mic.start();

      const container = document.querySelector('.aspect-video');
      const cw = container?.clientWidth || 1280;
      const ch = container?.clientHeight || 720;
      
      const startLayout = {
        x: Math.max(0, Math.min(1, store.webcamLayout.x / cw)),
        y: Math.max(0, Math.min(1, store.webcamLayout.y / ch)),
        w: Math.max(0.1, Math.min(1, store.webcamLayout.w / cw)),
        h: Math.max(0.1, Math.min(1, store.webcamLayout.h / ch)),
      };

      const recordingWebcamStream = store.showFloatingCamera ? null : processedWebcamStream;
      startRecording(
        mediaStream, 
        recordingWebcamStream, 
        mic.streamDestRef, 
        startLayout,
        { enabled: store.isStreamingEnabled, key: finalStreamKey, liveStream: liveStream || undefined }
      );
    } catch (err: any) {
      setCaptureError(err.name === 'NotAllowedError' ? 'Permission denied.' : `Capture failed: ${err.message}`);
    }
  }, [store, mic, startRecording, processedWebcamStream, liveStream, solveHandleStop]);

  const handlePause = useCallback(() => {
    if (!stream) return;
    const vt = stream.getVideoTracks()[0];
    if (vt) vt.enabled = isPaused;
    togglePause();
  }, [stream, isPaused, togglePause]);

  const handleToggleWebcam = useCallback(async () => {
    if (isWebcamOn) {
      webcamRef.current?.getTracks().forEach((t) => t.stop());
      setWebcamStream(null);
      setIsWebcamOn(false);
    } else {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined, width: 1280, height: 720 },
          audio: false
        });
        webcamRef.current = cam;
        setWebcamStream(cam);
        setIsWebcamOn(true);
      } catch (err: any) {
        setCaptureError(err.name === 'NotAllowedError' ? 'Camera permission denied.' : `Camera error: ${err.message}`);
      }
    }
  }, [isWebcamOn, selectedCamera]);

  return (
    <div className="h-screen flex flex-col bg-obs-bg overflow-hidden text-gray-200 font-sans">
      <header className="flex items-center justify-between px-6 py-3 border-b border-obs-border bg-obs-panel bg-gradient-to-r from-obs-panel to-black/20 shadow-xl z-20">
        <div className="flex items-center gap-4">
          <img src="/assets/logo.png" alt="Krutanic" className="h-5 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          <div className="h-4 w-px bg-white/10" />
          <span className="text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">Pro Broadcast Studio</span>
        </div>
        
        {isRecording && (
          <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-1.5 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
              <span className="text-red-500 text-[11px] font-black tracking-widest">LIVE</span>
            </div>
            <div className="w-px h-3 bg-red-500/20" />
            <span className="text-white font-mono text-xs tabular-nums tracking-wider">{timer}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-md px-2 py-0.5">
            <span className="text-[9px] font-black text-gray-500 uppercase">Res</span>
            <span className="text-[10px] font-bold text-gray-300">{store.resolution}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-md px-2 py-0.5">
            <span className="text-[9px] font-black text-gray-500 uppercase">FPS</span>
            <span className="text-[10px] font-bold text-gray-300">{store.fps}</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center justify-between bg-red-500/20 border-b border-red-500/30 px-6 py-2 text-[11px] text-red-100 font-bold tracking-wide animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-white rounded-full p-0.5 text-[8px]">!</span>
            <span>{error}</span>
          </div>
          <button onClick={() => { setCaptureError(null); store.setGlobalError(null); }} className="opacity-50 hover:opacity-100 transition-opacity p-1">✕</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <SceneList 
          scenes={[{ id: 1, name: 'Main Display' }]} 
          activeScene={1} 
          onSelect={() => {}} 
          onAdd={() => {}} 
          onRemove={() => {}} 
        />

        <PreviewCanvas
          isRecording={isRecording}
          isPaused={isPaused}
          timer={timer}
          activeSceneName="Main Display"
          stream={stream}
          webcamStream={processedWebcamStream}
          isWebcamOn={isWebcamOn}
          isBackgroundRemoved={store.isVirtualBgEnabled && store.bgMode === 'remove'}
          webcamLayout={store.webcamLayout}
          setWebcamLayout={store.setWebcamLayout}
          showFloatingCamera={store.showFloatingCamera}
        />

        <ControlPanel
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStart}
          onStop={solveHandleStop}
          onPause={handlePause}
          isWebcamOn={isWebcamOn}
          onToggleWebcam={handleToggleWebcam}
          mergeStatus={mergeStatus}
          mergePercent={mergePercent}
          cameras={cameras}
          microphones={microphones}
          selectedCamera={selectedCamera}
          setSelectedCamera={setSelectedCamera}
          selectedMic={selectedMic}
          setSelectedMic={setSelectedMic}
        />
      </div>

      <AudioMixer micProps={mic} microphones={microphones} selectedMic={selectedMic} />
      <StatusBar isRecording={isRecording} bytesWritten={bytesWritten} />
      <SaveToast savedPath={savedPath} onDismiss={() => {}} />

      <FloatingCameraMonitor
        webcamStream={processedWebcamStream}
        isWebcamOn={isWebcamOn}
        visible={store.showFloatingCamera}
        width={store.floatingCameraWidth}
        onWidthChange={store.setFloatingCameraWidth}
      />
    </div>
  );
}

export default App;
