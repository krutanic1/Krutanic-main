import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Move, VideoOff } from 'lucide-react';

const MIN_W = 180;
const MAX_W = 520;

export default function FloatingCameraMonitor({
  webcamStream,
  isWebcamOn,
  visible,
  width,
  onWidthChange,
}) {
  const videoRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, startLeft: 0, startTop: 0 });
  const [pipActive, setPipActive] = useState(false);

  const initialPos = useMemo(() => {
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

  const [position, setPosition] = useState(initialPos);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = webcamStream || null;
    }
  }, [webcamStream]);

  const openPiP = async () => {
    const videoEl = videoRef.current;
    if (!videoEl || !document.pictureInPictureEnabled || videoEl.disablePictureInPicture) {
      return false;
    }

    try {
      await videoEl.play();
      if (document.pictureInPictureElement !== videoEl) {
        await videoEl.requestPictureInPicture();
      }
      return true;
    } catch (err) {
      console.error('PiP open failed:', err);
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
    const handleVisibility = () => {
      // When recorder window gets minimized/hidden, keep camera alive outside the app.
      if (document.hidden && isWebcamOn && visible) {
        openPiP();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isWebcamOn, visible]);

  useEffect(() => {
    if (position.left === null || position.top === null) return;
    try {
      localStorage.setItem('floating-camera-pos', JSON.stringify(position));
    } catch (_) {}
  }, [position]);

  if (!isWebcamOn || !visible) return null;

  const safeWidth = Math.max(MIN_W, Math.min(MAX_W, Number(width) || 280));
  const safeHeight = Math.round(safeWidth * (9 / 16));

  const wrapperStyle = {
    width: safeWidth,
    height: safeHeight + 28,
  };

  if (position.left === null || position.top === null) {
    wrapperStyle.right = 20;
    wrapperStyle.bottom = 20;
  } else {
    wrapperStyle.left = position.left;
    wrapperStyle.top = position.top;
  }

  const startDrag = (e) => {
    e.preventDefault();
    const el = e.currentTarget.parentElement;
    const rect = el.getBoundingClientRect();

    dragRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    };

    const onMove = (me) => {
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
      className="fixed z-80 rounded-xl overflow-hidden border border-brand-primary/40 bg-black/80 shadow-2xl backdrop-blur"
      style={wrapperStyle}
    >
      <div
        onMouseDown={startDrag}
        className="h-7 bg-black/70 flex items-center justify-between px-2 cursor-move select-none"
      >
        <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Live Cam</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={togglePiP}
            className={`text-[9px] px-1.5 py-0.5 rounded border ${pipActive
              ? 'border-green-500/60 text-green-400 bg-green-500/10'
              : 'border-white/20 text-white/70 bg-black/40'
              }`}
            title="Pop out camera outside app window"
          >
            {pipActive ? 'DOCK' : 'POPOUT'}
          </button>
          <Move size={12} className="text-white/60" />
        </div>
      </div>

      <div className="relative" style={{ height: safeHeight }}>
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        {!webcamStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-obs-bg/90">
            <VideoOff size={24} className="text-gray-500" />
          </div>
        )}
      </div>

      <div className="px-2 py-1 bg-black/80 border-t border-white/10">
        <input
          type="range"
          min={MIN_W}
          max={MAX_W}
          step={10}
          value={safeWidth}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="w-full h-1 accent-brand-primary"
          title="Camera size"
        />
      </div>
    </div>
  );
}
