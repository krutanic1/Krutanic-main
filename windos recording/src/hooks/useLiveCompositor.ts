import { useState, useEffect, useRef } from 'react';

interface Layout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Resolution {
  width: number;
  height: number;
}

interface LiveCompositorProps {
  screenStream: MediaStream | null;
  webcamStream: MediaStream | null;
  isWebcamOn: boolean;
  layout: Layout;
  isActive: boolean;
  resolution?: Resolution;
}

/**
 * useLiveCompositor
 * 
 * Draws the screen and webcam overlay onto a hidden canvas to create a 
 * single composite stream for live streaming.
 */
export function useLiveCompositor({ 
  screenStream, 
  webcamStream, 
  isWebcamOn, 
  layout, 
  isActive,
  resolution = { width: 1920, height: 1080 }
}: LiveCompositorProps) {
  const [compositeStream, setCompositeStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Initialize hidden DOM elements
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = resolution.width;
      canvasRef.current.height = resolution.height;
      setCompositeStream(canvasRef.current.captureStream(30));
    }

    if (!screenVideoRef.current) {
      screenVideoRef.current = document.createElement('video');
      screenVideoRef.current.muted = true;
    }

    if (!webcamVideoRef.current) {
      webcamVideoRef.current = document.createElement('video');
      webcamVideoRef.current.muted = true;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const screenVideo = screenVideoRef.current;
    const webcamVideo = webcamVideoRef.current;

    if (!ctx || !screenVideo || !webcamVideo) return;

    // Attach streams
    if (screenStream && screenVideo.srcObject !== screenStream) {
      screenVideo.srcObject = screenStream;
      screenVideo.play().catch(() => {});
    }
    if (webcamStream && webcamVideo.srcObject !== webcamStream) {
      webcamVideo.srcObject = webcamStream;
      webcamVideo.play().catch(() => {});
    }

    const render = () => {
      // 1. Draw Background (Screen)
      if (screenVideo.readyState >= 2) {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Overlay (Webcam)
      if (isWebcamOn && webcamVideo.readyState >= 2 && layout) {
        const wcW = Math.round(canvas.width * layout.w);
        const wcH = Math.round(wcW * (9 / 16)); // 16:9
        const wcX = Math.round(canvas.width * layout.x);
        const wcY = Math.round(canvas.height * layout.y);
        
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 10;
        
        // Add a rounded clip for the webcam (Pro look)
        ctx.beginPath();
        const r = 20; // corner radius
        ctx.moveTo(wcX + r, wcY);
        ctx.arcTo(wcX + wcW, wcY, wcX + wcW, wcY + wcH, r);
        ctx.arcTo(wcX + wcW, wcY + wcH, wcX, wcY + wcH, r);
        ctx.arcTo(wcX, wcY + wcH, wcX, wcY, r);
        ctx.arcTo(wcX, wcY, wcX + wcW, wcY, r);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(webcamVideo, wcX, wcY, wcW, wcH);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, screenStream, webcamStream, isWebcamOn, layout, resolution.width, resolution.height]);

  return compositeStream;
}
