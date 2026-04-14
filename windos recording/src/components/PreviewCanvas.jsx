import React from 'react';
import { Monitor } from 'lucide-react';
import WebcamOverlay from './WebcamOverlay';

export default function PreviewCanvas({ 
  isRecording, timer, activeSceneName, 
  stream, webcamStream, isWebcamOn,
  isBackgroundRemoved, webcamLayout, setWebcamLayout
}) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center relative p-8 group">
      {/* Viewport Frame */}
      <div className="w-full h-full max-w-5xl aspect-video bg-obs-bg border-4 border-obs-border rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden">
        {/* Stream / Placeholder */}
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-700 flex flex-col items-center gap-4">
            <Monitor size={64} className="opacity-20" />
            <p className="text-xl font-bold opacity-20 uppercase tracking-widest">{activeSceneName || "Preview Area"}</p>
          </div>
        )}

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30 animate-in fade-in zoom-in duration-300">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <span className="text-red-500 font-bold text-xs tracking-widest">REC ●</span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-white font-mono text-sm tracking-tighter w-16">{timer}</span>
          </div>
        )}

        {/* Webcam Overlay */}
        {isWebcamOn && (
          <WebcamOverlay 
            webcamStream={webcamStream} 
            isBackgroundRemoved={isBackgroundRemoved}
            layout={webcamLayout}
            onLayoutChange={setWebcamLayout}
          />
        )}

        {/* Scene Indicator */}
        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur px-3 py-1 rounded text-[10px] text-gray-400 uppercase tracking-widest border border-white/5">
          Source: Display Capture 01
        </div>
      </div>

      {/* Grid Overlay Toggle (Hidden by default) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 flex items-center justify-center">
        <div className="w-full h-full border-x border-y border-white flex divide-x divide-white">
          <div className="flex-1 flex flex-col divide-y divide-white">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-white">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-white">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
