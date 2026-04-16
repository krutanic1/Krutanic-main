import React, { useState } from 'react';
import { Play, Square, Pause, Settings, Info, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import AdvancedSettings from './AdvancedSettings';

export default function ControlPanel({
  isRecording, isPaused, onStart, onStop, onPause,
  isWebcamOn, onToggleWebcam,
  mergeStatus, mergePercent,
  // Advanced settings props
  cameras, microphones,
  selectedCamera, setSelectedCamera,
  selectedMic,    setSelectedMic,
  fps,            setFps,
  resolution,     setResolution,
  isVirtualBgEnabled, setIsVirtualBgEnabled,
  bgMode,             setBgMode,
  cameraBrightness,   setCameraBrightness,
  cameraContrast,     setCameraContrast,
  floatingCameraWidth, setFloatingCameraWidth,
  showFloatingCamera, setShowFloatingCamera,
}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-full bg-obs-panel border-l border-obs-border w-64 overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b border-obs-border flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <img src="/assets/icon.png" alt="" className="w-3.5 h-3.5 rounded-sm" />
          Controls
        </h3>
        <button
          onClick={() => setShowSettings((s) => !s)}
          title="Advanced Settings"
          className={`p-1 rounded-md transition-colors ${
            showSettings ? 'bg-brand-primary/20 text-brand-primary' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <ChevronDown size={14} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main recording actions */}
      <div className="p-4 space-y-2">
        {!isRecording ? (
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-md font-bold transition-all shadow-lg shadow-brand-primary/20"
          >
            <Play size={18} fill="currentColor" />
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={onStop}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold transition-all shadow-lg shadow-red-600/20"
            >
              <Square size={18} fill="currentColor" />
              Stop Recording
            </button>

            <button
              onClick={onPause}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium border transition-all ${
                isPaused
                  ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                  : 'border-white/10 text-gray-300 hover:bg-white/5'
              }`}
            >
              <Pause size={16} fill={isPaused ? 'currentColor' : 'none'} />
              {isPaused ? 'Resume Recording' : 'Pause Recording'}
            </button>
          </>
        )}
      </div>

      {/* FFmpeg merge progress */}
      {mergeStatus === 'merging' && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <Loader2 size={12} className="animate-spin" />
            Exporting MP4… {mergePercent}%
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${mergePercent}%` }}
            />
          </div>
        </div>
      )}
      {mergeStatus === 'done' && (
        <div className="px-4 pb-3 flex items-center gap-2 text-xs text-green-400">
          <CheckCircle2 size={12} />
          MP4 saved to Recordings folder!
        </div>
      )}
      {mergeStatus === 'error' && (
        <div className="px-4 pb-3 text-xs text-red-400">
          Export failed. Check console.
        </div>
      )}

      {/* Advanced settings (collapsible) */}
      {showSettings && (
        <AdvancedSettings
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
          isWebcamOn={isWebcamOn}
          onToggleWebcam={onToggleWebcam}
          isVirtualBgEnabled={isVirtualBgEnabled}
          setIsVirtualBgEnabled={setIsVirtualBgEnabled}
          bgMode={bgMode}
          setBgMode={setBgMode}
          cameraBrightness={cameraBrightness}
          setCameraBrightness={setCameraBrightness}
          cameraContrast={cameraContrast}
          setCameraContrast={setCameraContrast}
          floatingCameraWidth={floatingCameraWidth}
          setFloatingCameraWidth={setFloatingCameraWidth}
          showFloatingCamera={showFloatingCamera}
          setShowFloatingCamera={setShowFloatingCamera}
        />
      )}

      {/* Footer */}
      <div className="mt-auto p-4 bg-black/20 text-center border-t border-obs-border">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Info size={12} />
          <span>Output: Videos/Recordings</span>
        </div>
      </div>
    </div>
  );
}
