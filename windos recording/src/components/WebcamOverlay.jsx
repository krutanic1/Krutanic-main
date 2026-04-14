import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoOff, GripHorizontal } from 'lucide-react';

export default function WebcamOverlay({ webcamStream, isBackgroundRemoved, layout, onLayoutChange }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  // Drag state
  const drag = useRef({ active: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  // Resize state
  const resize = useRef({ active: false, startX: 0, startY: 0, startW: 0, startH: 0 });

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  // ── Drag handlers ──────────────────────────────────────────────
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    const rect = overlayRef.current.getBoundingClientRect();
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: layout.x,
      startPosY: layout.y,
    };

    const onMove = (me) => {
      if (!drag.current.active) return;
      const dx = me.clientX - drag.current.startX;
      const dy = me.clientY - drag.current.startY;
      onLayoutChange({
        ...layout,
        x: drag.current.startPosX + dx,
        y: drag.current.startPosY + dy
      });
    };
    const onUp = () => {
      drag.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layout, onLayoutChange]);

  // ── Resize handlers ────────────────────────────────────────────
  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resize.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: layout.w,
      startH: layout.h,
    };

    const onMove = (me) => {
      if (!resize.current.active) return;
      const dx = me.clientX - resize.current.startX;
      const newW = Math.max(160, resize.current.startW + dx);
      const newH = Math.round(newW * (9 / 16)); // maintain 16:9
      onLayoutChange({
        ...layout,
        w: newW,
        h: newH
      });
    };
    const onUp = () => {
      resize.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layout, onLayoutChange]);

  const style = {
    width: layout.w,
    height: layout.h,
    left: layout.x,
    top: layout.y,
    right: 'auto',
    bottom: 'auto',
  };

  return (
    <div
      ref={overlayRef}
      className={`absolute z-20 rounded-xl overflow-hidden transition-all duration-300 ${
      isBackgroundRemoved 
        ? 'border-0 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
        : 'border-2 border-brand-primary/60 shadow-2xl shadow-black/60'
    } select-none`}
      style={style}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className={`w-full h-full object-cover transition-colors ${
          isBackgroundRemoved ? 'bg-transparent' : 'bg-black'
        }`}
      />

      {/* Drag handle */}
      <div
        onMouseDown={onDragStart}
        className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center cursor-grab active:cursor-grabbing bg-gradient-to-b from-black/70 to-transparent"
      >
        <GripHorizontal size={14} className="text-white/50" />
      </div>

      {/* Resize handle – bottom-right corner */}
      <div
        onMouseDown={onResizeStart}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pb-1 pr-1"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-white/40 fill-current">
          <path d="M0 10L10 0V10H0Z" />
        </svg>
      </div>

      {/* Camera-off fallback */}
      {!webcamStream && (
        <div className="absolute inset-0 flex items-center justify-center bg-obs-bg">
          <VideoOff size={32} className="text-gray-600" />
        </div>
      )}
    </div>
  );
}
