import React, { useState, useEffect, useRef, useCallback } from 'react';
import SceneList from './components/SceneList';
import PreviewCanvas from './components/PreviewCanvas';
import ControlPanel from './components/ControlPanel';
import AudioMixer from './components/AudioMixer';
import SaveToast from './components/SaveToast';
import StatusBar from './components/StatusBar';
import { useMediaRecorder } from './hooks/useMediaRecorder';
import { useDevices } from './hooks/useDevices';
import { useMicrophoneAudio } from './hooks/useMicrophoneAudio';
import { useVirtualBackground } from './hooks/useVirtualBackground';

const RESOLUTIONS = {
  '720p':  { width: 1280,  height: 720  },
  '1080p': { width: 1920,  height: 1080 },
  '1440p': { width: 2560,  height: 1440 },
};

function App() {
  // Scenes
  const [scenes, setScenes] = useState([
    { id: 1, name: 'Main Display' },
    { id: 2, name: 'Webcam Overlay' },
    { id: 3, name: 'Branding Loop' },
  ]);
  const [activeScene, setActiveScene] = useState(1);

  // Screen stream state
  const [stream, setStream] = useState(null);
  const streamRef           = useRef(null);

  // Webcam state
  const [webcamStream, setWebcamStream] = useState(null);
  const [isWebcamOn,   setIsWebcamOn]   = useState(false);
  const webcamRef                       = useRef(null);

  // Mic tap for MediaRecorder
  const micDestRef = useRef(null);

  // Capture settings
  const [fps,        setFps]        = useState(30);
  const [resolution, setResolution] = useState('1080p');
  const [isVirtualBgEnabled, setIsVirtualBgEnabled] = useState(false);
  const [bgMode,             setBgMode]             = useState('blur'); // 'blur' | 'remove'
  const [cameraBrightness,   setCameraBrightness]   = useState(100);
  const [cameraContrast,     setCameraContrast]     = useState(100);
  const [webcamLayout,       setWebcamLayout]       = useState({
    x: 20, y: 350, w: 320, h: 180 // Default to bottom-left (approx) and larger
  });

  // Device enumeration
  const {
    cameras, microphones,
    selectedCamera, setSelectedCamera,
    selectedMic,    setSelectedMic,
  } = useDevices();

  // Mic control
  const mic = useMicrophoneAudio(selectedMic);

  // Removed redundant mic sync effect

  // Errors
  const [captureError, setCaptureError] = useState(null);

  // Device disconnect handler
  const handleDeviceDisconnect = useCallback((device) => {
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

  const error = captureError || recordError;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      webcamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Screen capture ─────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setCaptureError(null);
    const { width, height } = RESOLUTIONS[resolution] || RESOLUTIONS['1080p'];

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: width }, height: { ideal: height }, frameRate: { ideal: fps } },
        audio: true,
      });

      mediaStream.getVideoTracks()[0].addEventListener('ended', handleStop);
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // AUTO-START MIC if not already active
      if (!mic.isActive) {
        await mic.start();
      }

      // Calculate relative layout FOR THE START of recording as well (used as baseline)
      const container = document.querySelector('.aspect-video');
      let startLayout = webcamLayout;
      if (container) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 100) { // sanity check
           startLayout = {
             x: webcamLayout.x / rect.width,
             y: webcamLayout.y / rect.height,
             w: webcamLayout.w / rect.width,
             h: webcamLayout.h / rect.height
           };
        }
      }

      startRecording(mediaStream, processedWebcamStream, mic.streamDestRef, startLayout);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCaptureError('Permission denied. Please allow screen capture.');
      } else {
        setCaptureError(`Capture failed: ${err.message}`);
      }
    }
  }, [resolution, fps, mic.isActive, mic, startRecording, webcamLayout]);

  const handleStop = useCallback(() => {
    // Calculate relative layout for resolution-independent merging
    const container = document.querySelector('.aspect-video');
    let relativeLayout = null;
    if (container) {
      const rect = container.getBoundingClientRect();
      // Ensure we have valid dimensions to avoid division by zero or invalid scales
      const cw = rect.width > 100 ? rect.width : 1280;
      const ch = rect.height > 100 ? rect.height : 720;
      
      relativeLayout = {
        x: Math.max(0, Math.min(1, webcamLayout.x / cw)),
        y: Math.max(0, Math.min(1, webcamLayout.y / ch)),
        w: Math.max(0.1, Math.min(1, webcamLayout.w / cw)),
        h: Math.max(0.1, Math.min(1, webcamLayout.h / ch)),
      };
      console.log('[Layout] Final relative:', relativeLayout);
    }

    stopRecording(relativeLayout);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, [stopRecording, webcamLayout]);

  const handlePause = useCallback(() => {
    if (!stream) return;
    const vt = stream.getVideoTracks()[0];
    if (vt) vt.enabled = isPaused;
    togglePause();
  }, [stream, isPaused, togglePause]);

  // ── Webcam toggle using selected device ────────────────────────────────
  const handleToggleWebcam = useCallback(async () => {
    if (isWebcamOn) {
      webcamRef.current?.getTracks().forEach((t) => t.stop());
      webcamRef.current = null;
      setWebcamStream(null);
      setIsWebcamOn(false);
    } else {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({
          video: {
            ...(selectedCamera ? { deviceId: { exact: selectedCamera } } : {}),
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        webcamRef.current = cam;
        setWebcamStream(cam);
        setIsWebcamOn(true);
      } catch (err) {
        setCaptureError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied.'
            : `Camera error: ${err.message}`
        );
      }
    }
  }, [isWebcamOn, selectedCamera]);

  // Apply virtual background if enabled
  const processedWebcamStream = useVirtualBackground(webcamStream, isVirtualBgEnabled, {
    bgMode,
    brightness: cameraBrightness,
    contrast:   cameraContrast,
  });

  const activeSceneName = scenes.find((s) => s.id === activeScene)?.name;

  return (
    <div className="h-screen flex flex-col bg-obs-bg overflow-hidden text-gray-200">
      {/* App header with recording dot */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-obs-border bg-obs-panel">
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="Krutanic" className="h-4 w-auto object-contain" />
          <div className="h-3 w-px bg-white/10 mx-1" />
          <span className="text-gray-400 text-[10px] font-medium tracking-tight uppercase">Screen Recorder</span>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-600/30 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-red-600 relative" />
            <span className="text-red-400 text-xs font-bold tracking-widest">REC</span>
            <span className="text-white/60 text-xs font-mono w-16">{timer}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{resolution}</span>
          <span>·</span>
          <span>{fps}fps</span>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-900/80 border-b border-red-700 px-4 py-2 text-sm text-red-200">
          <span>⚠ {error}</span>
          <button onClick={() => setCaptureError(null)} className="ml-4 text-red-400 hover:text-red-200 font-bold">✕</button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        <SceneList
          scenes={scenes}
          activeScene={activeScene}
          onSelect={setActiveScene}
          onAdd={() => {
            const newId = Math.max(0, ...scenes.map((s) => s.id)) + 1;
            setScenes([...scenes, { id: newId, name: `New Scene ${newId}` }]);
          }}
          onRemove={(id) => {
            const updated = scenes.filter((s) => s.id !== id);
            setScenes(updated);
            if (activeScene === id && updated.length > 0) setActiveScene(updated[0].id);
          }}
        />

        <PreviewCanvas
          isRecording={isRecording}
          isPaused={isPaused}
          timer={timer}
          activeSceneName={activeSceneName}
          stream={stream}
          webcamStream={processedWebcamStream}
          isWebcamOn={isWebcamOn}
          isBackgroundRemoved={isVirtualBgEnabled && bgMode === 'remove'}
          webcamLayout={webcamLayout}
          setWebcamLayout={setWebcamLayout}
        />

        <ControlPanel
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStart}
          onStop={handleStop}
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
          fps={fps}
          setFps={setFps}
          resolution={resolution}
          setResolution={setResolution}
          isVirtualBgEnabled={isVirtualBgEnabled}
          setIsVirtualBgEnabled={setIsVirtualBgEnabled}
          bgMode={bgMode}
          setBgMode={setBgMode}
          cameraBrightness={cameraBrightness}
          setCameraBrightness={setCameraBrightness}
          cameraContrast={cameraContrast}
          setCameraContrast={setCameraContrast}
        />
      </div>

      <AudioMixer 
        micProps={mic} 
        microphones={microphones}
        selectedMic={selectedMic} 
      />

      <StatusBar isRecording={isRecording} bytesWritten={bytesWritten} />

      <SaveToast savedPath={savedPath} onDismiss={() => {}} />
    </div>
  );
}

export default App;
