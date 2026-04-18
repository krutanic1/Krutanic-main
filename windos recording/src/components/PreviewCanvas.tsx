import React from 'react';
import { Monitor } from 'lucide-react';
import WebcamOverlay from './WebcamOverlay';
import { useStore } from '../store/useStore';

interface PreviewCanvasProps {
  isRecording: boolean;
  timer: string;
  activeSceneName: string;
  stream: MediaStream | null;
  webcamStream: MediaStream | null;
  isWebcamOn: boolean;
  isBackgroundRemoved: boolean;
  showFloatingCamera: boolean;
}

export default function PreviewCanvas({ 
  isRecording, timer, activeSceneName, 
  stream, webcamStream, isWebcamOn,
  isBackgroundRemoved,
  showFloatingCamera
}: PreviewCanvasProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const store = useStore();

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex-1 bg-obs-bg flex flex-col items-center justify-center relative p-8 group overflow-hidden">
      {/* Viewport Frame */}
      <div className="w-full h-full max-w-5xl aspect-video bg-black border-[1px] border-obs-border rounded-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden group/canvas">
        {/* Stream / Placeholder */}
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover animate-in fade-in duration-700"
          />
        ) : (
          <div className="text-gray-800 flex flex-col items-center gap-6 animate-pulse">
            <div className="p-8 rounded-full bg-white/5 border border-white/5">
              <Monitor size={80} strokeWidth={1} className="opacity-10" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-black opacity-10 uppercase tracking-[.4em]">{activeSceneName || "KRUTANIC_PRO"}</p>
              <div className="h-[2px] w-12 bg-white/5" />
            </div>
          </div>
        )}

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute top-6 right-6 flex items-center gap-4 bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-red-500/30 animate-in fade-in zoom-in-95 duration-500 shadow-2xl z-30">
            <div className="relative">
               <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping absolute scale-150 opacity-50" />
               <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-white font-mono text-sm tracking-widest tabular-nums font-bold">{timer}</span>
          </div>
        )}

        {/* Webcam Overlay */}
        {isWebcamOn && !showFloatingCamera && (
          <WebcamOverlay 
            webcamStream={webcamStream} 
            isBackgroundRemoved={isBackgroundRemoved}
            layout={store.webcamLayout}
            onLayoutChange={store.setWebcamLayout}
          />
        )}

        {/* Scene Indicator */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <div className="bg-brand-primary/10 border border-brand-primary/20 p-2 rounded-lg">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-tight">Active Source</span>
            <span className="text-[12px] font-bold text-gray-400 capitalize">Display Capture 01</span>
          </div>
        </div>

        {/* Canvas Guides (Hover Only) */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/canvas:opacity-5 transition-opacity duration-500">
           <div className="grid grid-cols-3 grid-rows-3 w-full h-full border-white border divide-x divide-y divide-white">
              {[...Array(9)].map((_, i) => <div key={i} />)}
           </div>
        </div>
      </div>

      {/* Aesthetic Backdrop Blur circles */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
