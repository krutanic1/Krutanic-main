import { useState, useRef, useCallback } from 'react';
import { classifyError, ERR } from '../utils/errors';

/** Flush accumulated chunks to disk every N seconds (chunks = 1 per second). */
const FLUSH_EVERY = 30;

/** 
 * useMediaRecorder
 *
 * - Streams MediaRecorder chunks to disk incrementally (no OOM for 3+ hour recordings)
 * - Prevents system sleep via Electron powerSaveBlocker
 * - Recovers gracefully from device disconnects
 * - Uses user-friendly error messages
 */
export function useMediaRecorder({ onDeviceDisconnect } = {}) {
  const [isRecording,  setIsRecording]  = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [seconds,      setSeconds]      = useState(0);
  const [mergeStatus,  setMergeStatus]  = useState(null);
  const [mergePercent, setMergePercent] = useState(0);
  const [savedPath,    setSavedPath]    = useState(null);
  const [bytesWritten, setBytesWritten] = useState(0);
  const [error,        setError]        = useState(null);

  // Recorder instances
  const screenRecRef = useRef(null);
  const webcamRecRef = useRef(null);
  const micRecRef    = useRef(null);

  // In-flight (unflushed) chunks
  const screenPending = useRef([]);
  const webcamPending = useRef([]);
  const micPending    = useRef([]);

  // Flush counters
  const screenCount   = useRef(0);
  const webcamCount   = useRef(0);
  const micCount      = useRef(0);

  // Session IDs for the streaming writers
  const sessionId = useRef(null);
  const activeKeysRef = useRef({ screen: null, webcam: null, mic: null });
  const streamOpenStateRef = useRef({});

  // Bytes written counters (approximate)
  const bytesRef = useRef(0);

  // Pending IPC flush promise (prevents concurrent flushes)
  const flushLock = useRef(Promise.resolve());

  // Timer
  const timerRef = useRef(null);

  const startTimer = () => { timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000); };
  const pauseTimer = () => clearInterval(timerRef.current);
  const resetTimer = () => { clearInterval(timerRef.current); setSeconds(0); };

  const formatTime = (s) => {
    const h   = Math.floor(s / 3600).toString().padStart(2, '0');
    const m   = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const pickMime = (video = true) => {
    const candidates = video
      ? ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      : ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
  };

  const hasElectron = () => !!window.electronAPI?.streamOpen;

  const isNoOpenSessionError = (err) => {
    const msg = err?.message || String(err || '');
    return msg.includes('No open stream for session');
  };

  // ── Flush pending chunks of one stream to disk via IPC ─────────────────
  const flushStream = useCallback(async (streamKey, pendingRef) => {
    if (!pendingRef.current.length) return;
    if (!hasElectron()) return;
    if (!streamOpenStateRef.current[streamKey]) {
      // Stream was already closed/aborted; drop pending chunks safely.
      pendingRef.current.splice(0);
      return;
    }
    const chunks = pendingRef.current.splice(0); // drain the pending array
    for (const chunk of chunks) {
      const buf = await chunk.arrayBuffer();
      try {
        await window.electronAPI.streamAppend(streamKey, buf);
      } catch (err) {
        if (isNoOpenSessionError(err)) {
          streamOpenStateRef.current[streamKey] = false;
          setError(ERR.CHUNK_WRITE_FAIL);
          return;
        }
        throw err;
      }
      bytesRef.current += buf.byteLength;
    }
    setBytesWritten(bytesRef.current);
  }, []);

  // ── Build a MediaRecorder with periodic chunk flushing ─────────────────
  const makeRecorder = useCallback((stream, pendingRef, countRef, streamKey, mimeType) => {
    if (!stream?.getTracks().length) return null;

    const rec = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
      audioBitsPerSecond:   192_000,
    });

    rec.ondataavailable = (e) => {
      if (!e.data?.size) return;
      pendingRef.current.push(e.data);
      countRef.current++;
      //recoder conslone is off it in teh console

      // console.log(`[Recorder] ${streamKey} chunk ${countRef.current}`);

      // Flush every FLUSH_EVERY chunks (≈ 30 seconds)
      if (countRef.current % FLUSH_EVERY === 0) {
        // Chain onto the lock to avoid concurrent writes
        flushLock.current = flushLock.current
          .then(() => flushStream(streamKey, pendingRef))
          .catch((err) => {
            console.error('Chunk flush error:', err);
            setError(ERR.CHUNK_WRITE_FAIL);
          });
      }
    };

    rec.onerror = (e) => {
      const msg = e.error?.message ?? 'Unknown recorder error';
      console.error('MediaRecorder error:', msg);
      // Don't abort immediately — try to salvage what's recorded
      setError(`${ERR.RECORDER_CRASH} (${msg})`);
    };

    return rec;
  }, [flushStream]);

  const webcamLayoutRef = useRef(null);

  // ── Start ────────────────────────────────────────────────────────────────
  const startRecording = useCallback(async (screenStream, webcamStream, micDestRef, currentLayout) => {
    webcamLayoutRef.current = currentLayout;
    setError(null);
    setMergeStatus(null);
    setMergePercent(0);
    setSavedPath(null);
    setBytesWritten(0);
    bytesRef.current = 0;

    if (!screenStream) {
      setError(ERR.NO_SCREEN_STREAM);
      return;
    }

    // Generate a unique session ID
    sessionId.current = Date.now().toString(36);
    const sid = sessionId.current;
    const ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Open streaming write sessions in parallel
    // NOTE: sessionId key already encodes track name (${sid}-screen etc.)
    //       so the filename only needs the timestamp to avoid double-naming.
    const screenKey = `${sid}-screen`;
    const webcamKey = `${sid}-webcam`;
    const micKey    = `${sid}-mic`;

    activeKeysRef.current = { screen: screenKey, webcam: webcamKey, mic: micKey };

    if (hasElectron()) {
      const [screenOpen, webcamOpen, micOpen, powerOpen] = await Promise.allSettled([
        window.electronAPI.streamOpen(screenKey, `${ts}.webm`),
        window.electronAPI.streamOpen(webcamKey, `${ts}.webm`),
        window.electronAPI.streamOpen(micKey, `${ts}.webm`),
        window.electronAPI.startPowerBlock(),
      ]);

      streamOpenStateRef.current[screenKey] = screenOpen.status === 'fulfilled';
      streamOpenStateRef.current[webcamKey] = webcamOpen.status === 'fulfilled';
      streamOpenStateRef.current[micKey]    = micOpen.status === 'fulfilled';

      if (powerOpen.status === 'rejected') {
        console.warn('Power blocker failed to start:', powerOpen.reason);
      }

      if (!streamOpenStateRef.current[screenKey]) {
        throw new Error('Failed to open screen stream writer');
      }
    }

    // Disk space warning (non-blocking)
    if (window.electronAPI?.checkDiskSpace) {
      window.electronAPI.checkDiskSpace().then((info) => {
        if (info && info.free < 5 * 1e9) { // < 5 GB free
          setError(`Low disk space: only ${info.freeGB} GB remaining. Recording may stop early.`);
        }
      });
    }

    const videoMime = pickMime(true);
    const audioMime = pickMime(false);

    // Reset pending / counter refs
    screenPending.current = []; screenCount.current = 0;
    webcamPending.current = []; webcamCount.current = 0;
    micPending.current    = []; micCount.current    = 0;

    // Screen recorder
    const screenTracks = [...screenStream.getVideoTracks(), ...screenStream.getAudioTracks()];
    screenRecRef.current = makeRecorder(
      new MediaStream(screenTracks), screenPending, screenCount, screenKey, videoMime
    );

    // Webcam recorder
    webcamRecRef.current = null;
    if (webcamStream?.getVideoTracks().length > 0) {
      const wcStream = new MediaStream(webcamStream.getVideoTracks());
      // Force VP9 for webcam if we want transparent background (alpha support)
      const wcMime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : videoMime;
      
      webcamRecRef.current = makeRecorder(wcStream, webcamPending, webcamCount, webcamKey, wcMime);

      // Handle webcam disconnect
      webcamStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (webcamRecRef.current?.state !== 'inactive') {
          try { webcamRecRef.current?.stop(); } catch (_) {}
        }
        onDeviceDisconnect?.('webcam');
      });
    }

    // Mic recorder
    micRecRef.current = null;
    const micDest = micDestRef?.current;
    if (micDest?.stream) {
      const micStream = new MediaStream(micDest.stream.getAudioTracks());
      micRecRef.current = makeRecorder(micStream, micPending, micCount, micKey, audioMime);

      // Handle mic disconnect
      micDest.stream.getAudioTracks()[0]?.addEventListener('ended', () => {
        if (micRecRef.current?.state !== 'inactive') {
          try { micRecRef.current?.stop(); } catch (_) {}
        }
        onDeviceDisconnect?.('microphone');
      });
    }

    // Start all recorders with 1-second timeslices
    [screenRecRef, webcamRecRef, micRecRef].forEach((ref) => {
      try {
        if (ref.current && ref.current.state === 'inactive') {
          ref.current.start(1000);
        }
      } catch (err) {
        console.error(`[MediaRecorder] Failed to start recorder:`, err);
      }
    });

    setIsRecording(true);
    setIsPaused(false);
    resetTimer();
    startTimer();
  }, [makeRecorder, onDeviceDisconnect]);

  // ── Stop ─────────────────────────────────────────────────────────────────
  const stopRecording = useCallback(async (relativeLayout, targetResolution) => {
    if (!screenRecRef.current) return;

    if (relativeLayout) {
      webcamLayoutRef.current = relativeLayout;
    }

    const waitForStop = (rec) =>
      new Promise((resolve) => {
        if (!rec || rec.state === 'inactive') { resolve(); return; }
        rec.onstop = resolve;
        try { rec.stop(); } catch (_) { resolve(); }
      });

    // Stop all recorders
    await Promise.all([
      waitForStop(screenRecRef.current),
      waitForStop(webcamRecRef.current),
      waitForStop(micRecRef.current),
    ]);

    resetTimer();
    setIsRecording(false);
    setIsPaused(false);

    // Stop system from preventing power save
    window.electronAPI?.stopPowerBlock?.();

    setMergeStatus('merging');
    setMergePercent(0);

    try {
      // Wait for any in-flight flushes to settle
      await flushLock.current;

      let screenPath = null, webcamPath = null, micPath = null;
      const { screen: screenKey, webcam: webcamKey, mic: micKey } = activeKeysRef.current;

      if (hasElectron()) {
        // Final flush of any remaining buffered chunks
        await Promise.all([
          flushStream(screenKey, screenPending),
          webcamRecRef.current ? flushStream(webcamKey, webcamPending) : Promise.resolve(),
          micRecRef.current    ? flushStream(micKey, micPending) : Promise.resolve(),
        ]);

        // Close all write streams and get the file paths
        [screenPath, webcamPath, micPath] = await Promise.all([
          window.electronAPI.streamClose(screenKey),
          window.electronAPI.streamClose(webcamKey),
          window.electronAPI.streamClose(micKey),
        ]);

        streamOpenStateRef.current[screenKey] = false;
        streamOpenStateRef.current[webcamKey] = false;
        streamOpenStateRef.current[micKey] = false;
      } else {
        // Browser fallback: build blobs from pending (unflushed) chunks only
        const videoMime = pickMime(true);
        const blob = new Blob(screenPending.current, { type: videoMime });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        setMergeStatus('done');
        return;
      }

      // Register merge event listeners
      window.electronAPI.onMergeProgress(({ percent }) => setMergePercent(percent));
      window.electronAPI.onMergeDone(({ outputPath }) => {
        setSavedPath(outputPath);
        setMergeStatus('done');
        setMergePercent(100);
        window.electronAPI.removeMergeListeners();
      });
      window.electronAPI.onMergeError(({ message }) => {
        setError(`${ERR.FFMPEG_FAIL} (${message})`);
        setMergeStatus('error');
        window.electronAPI.removeMergeListeners();
      });

      // Trigger FFmpeg merge
      await window.electronAPI.mergeRecordings({
        screenPath,
        webcamPath:   webcamPath || null,
        micPath:      micPath    || null,
        webcamLayout: webcamLayoutRef.current,
        targetResolution,
      });
    } catch (err) {
      setError(`Export error: ${classifyError(err)}`);
      setMergeStatus('error');

      // Abort any open write streams
      const { screen: screenKey, webcam: webcamKey, mic: micKey } = activeKeysRef.current;
      if (window.electronAPI?.streamAbort) {
        await Promise.allSettled([
          window.electronAPI.streamAbort(screenKey),
          window.electronAPI.streamAbort(webcamKey),
          window.electronAPI.streamAbort(micKey),
        ]);

        streamOpenStateRef.current[screenKey] = false;
        streamOpenStateRef.current[webcamKey] = false;
        streamOpenStateRef.current[micKey] = false;
      }
    }
  }, [flushStream]);

  // ── Pause / Resume ───────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    [screenRecRef, webcamRecRef, micRecRef].forEach((ref) => {
      if (!ref.current) return;
      if (ref.current.state === 'recording') ref.current.pause();
      else if (ref.current.state === 'paused') ref.current.resume();
    });
    setIsPaused((p) => {
      if (p) startTimer(); else pauseTimer();
      return !p;
    });
  }, []);

  return {
    isRecording, isPaused, timer: formatTime(seconds),
    mergeStatus, mergePercent, savedPath,
    bytesWritten, // expose for status bar
    error,
    startRecording, stopRecording, togglePause,
  };
}
