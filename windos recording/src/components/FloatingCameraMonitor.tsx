import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Move, Loader2, Maximize2, Minimize2, Radio } from 'lucide-react';

const MIN_W = 180;
const MAX_W = 560;

interface Position {
  left: number | null;
  top: number | null;
}

interface FloatingCameraMonitorProps {
  webcamStream: MediaStream | null;
  isWebcamOn: boolean;
  visible: boolean;
  width: number;
  onWidthChange: (w: number) => void;
}

export default function FloatingCameraMonitor({
  webcamStream,
  isWebcamOn,
  visible,
  width,
  onWidthChange,
}: FloatingCameraMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, startLeft: 0, startTop: 0 });
  const [pipActive, setPipActive] = useState(false);

  const initialPos = useMemo<Position>(() => {
    try {
      const raw = localStorage.getItem('floating-camera-pos');
      if (!raw) return { left: null, top: null };
      const parsed = JSON.parse(raw);
      if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
        return parsed;
      }
    } catch (_) {}
    return { left: null, top: null };
  }, []);

  const [position, setPosition] = useState<Position>(initialPos);

  // Ensure camera stays within window bounds
  useEffect(() => {
    const handleResize = () => {
      if (position.left !== null && position.top !== null) {
        setPosition(prev => ({
          left: Math.min(prev.left || 0, window.innerWidth - 100),
          top: Math.min(prev.top || 0, window.innerHeight - 100)
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject !== (webcamStream || null)) {
      video.srcObject = webcamStream || null;
      if (webcamStream) {
        video.play().catch(() => {}); 
      }
    }
  }, [webcamStream, visible, isWebcamOn]);

  const openPiP = async () => {
    const videoEl = videoRef.current;
    if (!videoEl || !document.pictureInPictureEnabled || videoEl.disablePictureInPicture) {
      return false;
    }

    try {
      if (videoEl.readyState < 1) {
        await new Promise<void>((resolve) => {
          const onMetadata = () => {
            videoEl.removeEventListener('loadedmetadata', onMetadata);
            resolve();
          };
          videoEl.addEventListener('loadedmetadata', onMetadata);
          setTimeout(resolve, 2000);
        });
      }

      if (videoEl.readyState >= 2) {
        try {
          await videoEl.play();
        } catch (playErr: any) {
          if (playErr.name !== 'AbortError') throw playErr;
        }
      }

      if (document.pictureInPictureElement !== videoEl) {
        await videoEl.requestPictureInPicture();
      }
      return true;
    } catch (err: any) {
      const ignore = ['AbortError', 'NotAllowedError', 'InvalidStateError'];
      if (!ignore.includes(err.name)) {
        console.error('PiP open failed:', err);
      }
      return false;
    }
  };

  const closePiP = async () => {
    if (!document.pictureInPictureElement) return;
    try {
      await document.exitPictureInPicture();
    } catch (err) {
      console.error('PiP close failed:', err);
    }
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const onEnter = () => setPipActive(true);
    const onLeave = () => setPipActive(false);

    videoEl.addEventListener('enterpictureinpicture', onEnter);
    videoEl.addEventListener('leavepictureinpicture', onLeave);

    return () => {
      videoEl.removeEventListener('enterpictureinpicture', onEnter);
      videoEl.removeEventListener('leavepictureinpicture', onLeave);
    };
  }, [webcamStream]);

  useEffect(() => {
    if (position.left === null || position.top === null) return;
    try {
      localStorage.setItem('floating-camera-pos', JSON.stringify(position));
    } catch (_) {}
  }, [position]);

  if (!isWebcamOn || !visible) return null;

  const safeWidth = Math.max(MIN_W, Math.min(MAX_W, Number(width) || 280));
  const safeHeight = Math.round(safeWidth * (9 / 16));

  const wrapperStyle: React.CSSProperties = {
    width: safeWidth,
    height: safeHeight + 36,
    position: 'fixed' as const,
    zIndex: 100,
  };

  if (position.left === null || position.top === null) {
    wrapperStyle.right = 24;
    wrapperStyle.bottom = 24;
  } else {
    wrapperStyle.left = position.left;
    wrapperStyle.top = position.top;
  }

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = (e.currentTarget as HTMLElement).parentElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    dragRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    };

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = me.clientX - dragRef.current.x;
      const dy = me.clientY - dragRef.current.y;
      setPosition({
        left: Math.max(8, dragRef.current.startLeft + dx),
        top: Math.max(8, dragRef.current.startTop + dy),
      });
    };

    const onUp = () => {
      dragRef.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
      await closePiP();
      return;
    }
    await openPiP();
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border border-brand-primary/40 bg-obs-panel/90 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] backdrop-blur-2xl transition-all duration-300 ring-1 ring-white/5"
      style={wrapperStyle}
    >
      <div
        onMouseDown={startDrag}
        className="h-9 bg-black/40 flex items-center justify-between px-3 cursor-move select-none group/header"
      >
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
           <span className="text-[10px] text-gray-400 font-black uppercase tracking-[.25em]">Monitor_01</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={togglePiP}
            className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border transition-all ${
              pipActive
              ? 'border-green-500/30 text-green-500 bg-green-500/5'
              : 'border-white/10 text-gray-500 bg-white/5 hover:border-brand-primary/30 hover:text-brand-primary'
              }`}
          >
            {pipActive ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
            {pipActive ? 'Dock' : 'PiP'}
          </button>
          <Move size={12} className="text-gray-700 group-hover/header:text-brand-primary transition-colors" />
        </div>
      </div>

      <div className="relative group/cam" style={{ height: safeHeight }}>
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
        
        {/* Frame overlay */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none" />
        <div className="absolute top-2 right-2 p-1 bg-black/40 rounded-md backdrop-blur-md opacity-0 group-hover/cam:opacity-100 transition-opacity">
           <Radio size={10} className="text-brand-primary" />
        </div>

        {!webcamStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obs-bg/95 gap-3">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <Loader2 size={24} className="text-brand-primary animate-spin" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Vision_Engine</span>
              <span className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">Initializing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-2 bg-black/60 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Zoom</span>
          <input
            type="range"
            min={MIN_W}
            max={MAX_W}
            step={10}
            value={safeWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="flex-1 h-[2px] bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary ring-offset-black transition-all"
          />
        </div>
      </div>
    </div>
  );
}
