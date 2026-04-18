import React, { useRef, useEffect, useCallback } from 'react';
import { GripHorizontal, Loader2 } from 'lucide-react';

interface Layout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WebcamOverlayProps {
  webcamStream: MediaStream | null;
  isBackgroundRemoved: boolean;
  layout: Layout;
  onLayoutChange: (newLayout: Layout) => void;
}

export default function WebcamOverlay({ 
  webcamStream, 
  isBackgroundRemoved, 
  layout, 
  onLayoutChange 
}: WebcamOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Drag state
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  // Resize state
  const resizeRef = useRef({ active: false, startX: 0, startY: 0, startW: 0 });

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  // ── Drag handlers ──────────────────────────────────────────────
  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: layout.x,
      startPosY: layout.y,
    };

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      onLayoutChange({
        ...layout,
        x: dragRef.current.startPosX + dx,
        y: dragRef.current.startPosY + dy
      });
    };

    const onUp = () => {
      dragRef.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layout, onLayoutChange]);

  // ── Resize handlers ────────────────────────────────────────────
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: layout.w,
    };

    const onMove = (me: MouseEvent) => {
      if (!resizeRef.current.active) return;
      const dx = me.clientX - resizeRef.current.startX;
      const newW = Math.max(160, resizeRef.current.startW + dx);
      const newH = Math.round(newW * (9 / 16)); // maintain 16:9
      onLayoutChange({
        ...layout,
        w: newW,
        h: newH
      });
    };

    const onUp = () => {
      resizeRef.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layout, onLayoutChange]);

  const style: React.CSSProperties = {
    width: layout.w,
    height: layout.h,
    left: layout.x,
    top: layout.y,
    transition: dragRef.current.active || resizeRef.current.active ? 'none' : 'all 0.1s ease-out'
  };

  return (
    <div
      ref={overlayRef}
      className={`absolute z-20 rounded-2xl overflow-hidden group/overlay ${
        isBackgroundRemoved 
          ? 'shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
          : 'border-2 border-brand-primary/40 shadow-2xl shadow-black/80'
      } select-none`}
      style={style}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className={`w-full h-full object-cover transition-colors duration-500 ${
          isBackgroundRemoved ? 'bg-transparent scale-105' : 'bg-obs-bg'
        }`}
      />

      {/* Controller Overlays (Hover Only) */}
      <div className="absolute inset-0 opacity-0 group-hover/overlay:opacity-100 transition-opacity duration-300">
        {/* Drag handle */}
        <div
          onMouseDown={onDragStart}
          className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center cursor-grab active:cursor-grabbing bg-gradient-to-b from-black/80 to-transparent"
        >
          <GripHorizontal size={16} className="text-white/60 drop-shadow-md" />
        </div>

        {/* Framing border */}
        <div className="absolute inset-0 border border-brand-primary/20 pointer-events-none rounded-2xl" />

        {/* Resize handle */}
        <div
          onMouseDown={onResizeStart}
          className="absolute bottom-1 right-1 w-6 h-6 cursor-se-resize flex items-end justify-end p-1 hover:scale-125 transition-transform"
        >
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-brand-primary/60 border-b-[8px] border-b-transparent rotate-45 transform translate-x-1 translate-y-1" />
        </div>
      </div>

      {/* Initialization State */}
      {!webcamStream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-obs-bg/90 backdrop-blur-md gap-3 text-center px-4">
          <div className="p-3 bg-brand-primary/10 rounded-full">
            <Loader2 size={24} className="text-brand-primary animate-spin" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-200 font-black uppercase tracking-widest">Vision Engine</span>
            <span className="text-[8px] text-gray-500 font-medium uppercase tracking-[0.2em]">Authenticating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
