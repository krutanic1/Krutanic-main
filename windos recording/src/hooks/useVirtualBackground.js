import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';

/**
 * useVirtualBackground
 * 
 * Takes a raw webcam MediaStream and applies real-time selfie segmentation.
 * Outputs a processed MediaStream that only contains the human (transparent/black background).
 *
 * @param {MediaStream} rawStream - The source webcam stream
 * @param {boolean} enabled - Whether background removal is active
 * @returns {MediaStream|null} - The processed stream (or raw if disabled)
 */
export function useVirtualBackground(rawStream, enabled = false, settings = { bgMode: 'blur', brightness: 100, contrast: 100 }) {
  const [processedStream, setProcessedStream] = useState(null);
  
  // A stream needs processing if AI background is ON OR filters are applied
  const isProcessingRequired = enabled || settings.brightness !== 100 || settings.contrast !== 100;

  // Use a ref for settings to avoid recreating the processing loop on every slider change
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Refs for processing pipeline
  const segmenterRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const outputStreamRef = useRef(null);
  const tempCanvasRef   = useRef(null); // Used for blurring/compositing
  const mainCtxRef      = useRef(null);
  const tempCtxRef      = useRef(null);

  // Initialize MediaPipe Segmenter
  useEffect(() => {
    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const segmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false
        });
        segmenterRef.current = segmenter;
        console.log('[MediaPipe] Segmenter initialized');
      } catch (err) {
        console.error('[MediaPipe] Init failed:', err);
      }
    }
    init();

    return () => {
      segmenterRef.current?.close();
    };
  }, []);

  // Process frames
  const processFrame = useCallback(() => {
    if (!isProcessingRequired || !videoRef.current || !canvasRef.current) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const { brightness, contrast, bgMode } = settingsRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!mainCtxRef.current) {
      mainCtxRef.current = canvas.getContext('2d', {
        alpha: true,
        willReadFrequently: true,
      });
    }
    const ctx = mainCtxRef.current;
    
    if (video.paused || video.ended || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // CASE 1: Only Filters (No AI Background)
    if (!enabled) {
      ctx.save();
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // CASE 2: AI Background + Filters
    if (!segmenterRef.current) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Initialize temp canvas if needed
    if (!tempCanvasRef.current) {
      tempCanvasRef.current = document.createElement('canvas');
    }
    const tempCanvas = tempCanvasRef.current;
    if (tempCanvas.width !== canvas.width) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
    }
    if (!tempCtxRef.current) {
      tempCtxRef.current = tempCanvas.getContext('2d', { willReadFrequently: true });
    }
    const tctx = tempCtxRef.current;

    const startTimeMs = performance.now();
    
    segmenterRef.current.segmentForVideo(video, startTimeMs, (result) => {
      const mask = result.categoryMask.getAsUint8Array();

      // 2. Prepare background based on mode
      if (bgMode === 'blur') {
        ctx.save();
        ctx.filter = `blur(10px) brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        // Mode 'remove' (No background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // 3. Create the "Person Cutout" on temp canvas
      tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tctx.save();
      tctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      tctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      tctx.restore();
      
      const imageData = tctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;

      // Apply mask to temp canvas (making background transparent)
      for (let i = 0; i < mask.length; i++) {
        // Evidence shows mask[i] === 0 is the PERSON, and > 0 is the BACKGROUND
        if (mask[i] !== 0) { 
          data[i * 4 + 3] = 0; 
        }
      }
      tctx.putImageData(imageData, 0, 0);

      // 4. Draw the person cutout on top of the blurred background (or empty background)
      ctx.drawImage(tempCanvas, 0, 0);
    });

    requestRef.current = requestAnimationFrame(processFrame);
  }, [enabled, isProcessingRequired]); // settings removed to keep callback stable

  // Handle stream changes
  useEffect(() => {
    if (!rawStream) {
      setProcessedStream(null);
      return;
    }

    if (!isProcessingRequired) {
      setProcessedStream(rawStream);
      return;
    }

    // Setup processing hardware only if necessary
    if (!videoRef.current) {
      const video = document.createElement('video');
      video.srcObject = rawStream;
      video.muted = true;
      video.play();
      videoRef.current = video;

      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;

      // Capture processed stream ONCE
      const outStream = canvas.captureStream(30);
      outputStreamRef.current = outStream;
      setProcessedStream(outStream);
    } else {
      // Update existing video source if rawStream changed but we already have processing hardware
      if (videoRef.current.srcObject !== rawStream) {
        videoRef.current.srcObject = rawStream;
      }
    }

    // Start loop
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(processFrame);

    return () => {
      // Cleanup only if stream or processing requirements truly change
    };
  }, [rawStream, isProcessingRequired, processFrame]);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, []);


  return processedStream;
}
