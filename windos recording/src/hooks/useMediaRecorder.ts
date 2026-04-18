import { useState, useRef, useCallback } from 'react';
import { ERR } from '../utils/errors';

/** Flush accumulated chunks to disk every N seconds (chunks = 1 per second). */
const FLUSH_EVERY = 30;

interface Layout {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface StreamingOptions {
  enabled: boolean;
  key: string;
  liveStream?: MediaStream;
}

interface CropOptions {
  cropTop: number;
  cropBottom: number;
}

interface DeviceDisconnectCallback {
  (device: 'webcam' | 'microphone'): void;
}

/** 
 * useMediaRecorder
 */
export function useMediaRecorder({ onDeviceDisconnect }: { onDeviceDisconnect?: DeviceDisconnectCallback } = {}) {
  const [isRecording,  setIsRecording]  = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [seconds,      setSeconds]      = useState(0);
  const [mergeStatus,  setMergeStatus]  = useState<'merging' | 'done' | 'error' | null>(null);
  const [mergePercent, setMergePercent] = useState(0);
  const [savedPath,    setSavedPath]    = useState<string | null>(null);
  const [bytesWritten, setBytesWritten] = useState(0);
  const [error,        setError]        = useState<string | null>(null);
  const [isStreaming,  setIsStreaming]  = useState(false);

  // Recorder instances
  const screenRecRef = useRef<MediaRecorder | null>(null);
  const webcamRecRef = useRef<MediaRecorder | null>(null);
  const micRecRef    = useRef<MediaRecorder | null>(null);
  const liveRecRef   = useRef<MediaRecorder | null>(null);

  // In-flight (unflushed) chunks
  const screenPending = useRef<Blob[]>([]);
  const webcamPending = useRef<Blob[]>([]);
  const micPending    = useRef<Blob[]>([]);

  // Flush counters
  const screenCount   = useRef(0);
  const webcamCount   = useRef(0);
  const micCount      = useRef(0);

  // Session IDs for the streaming writers
  const sessionId = useRef<string | null>(null);
  const activeKeysRef = useRef<{ screen: string | null; webcam: string | null; mic: string | null }>({ screen: null, webcam: null, mic: null });
  const streamOpenStateRef = useRef<Record<string, boolean>>({});

  // Bytes written counters (approximate)
  const bytesRef = useRef(0);

  // Pending IPC flush promise (prevents concurrent flushes)
  const flushLock = useRef(Promise.resolve());

  // Timer
  const timerRef = useRef<any>(null);

  const startTimer = () => { timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000); };
  const pauseTimer = () => clearInterval(timerRef.current);
  const resetTimer = () => { clearInterval(timerRef.current); setSeconds(0); };

  const formatTime = (s: number) => {
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

  const hasElectron = () => !!(window as any).electronAPI?.streamOpen;

  const isNoOpenSessionError = (err: any) => {
    const msg = err?.message || String(err || '');
    return msg.includes('No open stream for session');
  };

  // ── Flush pending chunks of one stream to disk via IPC ─────────────────
  const flushStream = useCallback(async (streamKey: string, pendingRef: React.MutableRefObject<Blob[]>) => {
    if (!pendingRef.current.length) return;
    if (!hasElectron()) return;
    if (!streamOpenStateRef.current[streamKey]) {
      pendingRef.current.splice(0);
      return;
    }
    const chunks = pendingRef.current.splice(0);
    const api = (window as any).electronAPI;
    
    for (const chunk of chunks) {
      const buf = await chunk.arrayBuffer();
      try {
        await api.streamAppend(streamKey, buf);
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
  const makeRecorder = useCallback((
    stream: MediaStream, 
    pendingRef: React.MutableRefObject<Blob[]>, 
    countRef: React.MutableRefObject<number>, 
    streamKey: string, 
    mimeType: string
  ) => {
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

      if (countRef.current % FLUSH_EVERY === 0) {
        flushLock.current = flushLock.current
          .then(() => flushStream(streamKey, pendingRef))
          .catch((err) => {
            console.error('Chunk flush error:', err);
            setError(ERR.CHUNK_WRITE_FAIL);
          });
      }

      if (streamKey === 'live-composite' && sessionId.current) {
        e.data.arrayBuffer().then(buf => {
          (window as any).electronAPI.liveStreamFeed(sessionId.current, buf);
        });
      }
    };

    rec.onerror = (e: any) => {
      const msg = e.error?.message ?? 'Unknown recorder error';
      console.error('MediaRecorder error:', msg);
      setError(`${ERR.RECORDER_CRASH} (${msg})`);
    };

    return rec;
  }, [flushStream]);

  const webcamLayoutRef = useRef<Layout | null>(null);

  // ── Start ────────────────────────────────────────────────────────────────
  const startRecording = useCallback(async (
    screenStream: MediaStream, 
    webcamStream: MediaStream | null, 
    micDestRef: React.RefObject<MediaStreamAudioDestinationNode>, 
    currentLayout: Layout, 
    streamingOpts: StreamingOptions = { enabled: false, key: '' }
  ) => {
    webcamLayoutRef.current = currentLayout;
    const api = (window as any).electronAPI;
    
    setError(null);
    setMergeStatus(null);
    setMergePercent(0);
    setSavedPath(null);
    setBytesWritten(0);
    bytesRef.current = 0;
    setIsStreaming(streamingOpts.enabled);

    if (!screenStream) {
      setError(ERR.NO_SCREEN_STREAM);
      return;
    }

    sessionId.current = Date.now().toString(36);
    const sid = sessionId.current!;
    const ts  = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);

    if (streamingOpts.enabled && streamingOpts.key) {
      try {
        await api.liveStreamStart({
          sessionId: sid,
          streamKey: streamingOpts.key,
          width: 1920,
          height: 1080
        });
      } catch (err) {
        console.error('Live stream start failed:', err);
        setError('Failed to start live stream. Recording locally only.');
        setIsStreaming(false);
      }
    }

    const screenKey = `${sid}-screen`;
    const webcamKey = `${sid}-webcam`;
    const micKey    = `${sid}-mic`;

    activeKeysRef.current = { screen: screenKey, webcam: webcamKey, mic: micKey };

    if (hasElectron()) {
      const [screenOpen, webcamOpen, micOpen, powerOpen] = await Promise.allSettled([
        api.streamOpen(screenKey, `${ts}.webm`),
        api.streamOpen(webcamKey, `${ts}.webm`),
        api.streamOpen(micKey, `${ts}.webm`),
        api.startPowerBlock(),
      ]);

      streamOpenStateRef.current[screenKey] = screenOpen.status === 'fulfilled';
      streamOpenStateRef.current[webcamKey] = webcamOpen.status === 'fulfilled';
      streamOpenStateRef.current[micKey]    = micOpen.status === 'fulfilled';

      if (!streamOpenStateRef.current[screenKey]) {
        throw new Error('Failed to open screen stream writer');
      }
    }

    if (api?.checkDiskSpace) {
      api.checkDiskSpace().then((info: any) => {
        if (info && info.free < 5 * 1e9) {
          setError(`Low disk space: only ${info.freeGB} GB remaining.`);
        }
      });
    }

    const videoMime = pickMime(true);
    const audioMime = pickMime(false);

    screenPending.current = []; screenCount.current = 0;
    webcamPending.current = []; webcamCount.current = 0;
    micPending.current    = []; micCount.current    = 0;

    const screenTracks = [...screenStream.getVideoTracks(), ...screenStream.getAudioTracks()];
    screenRecRef.current = makeRecorder(
      new MediaStream(screenTracks), screenPending, screenCount, screenKey, videoMime
    );

    webcamRecRef.current = null;
    if (webcamStream?.getVideoTracks().length) {
      const wcStream = new MediaStream(webcamStream.getVideoTracks());
      const wcMime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : videoMime;
      webcamRecRef.current = makeRecorder(wcStream, webcamPending, webcamCount, webcamKey, wcMime);

      webcamStream.getVideoTracks()[0].onended = () => {
        if (webcamRecRef.current?.state !== 'inactive') {
          try { webcamRecRef.current?.stop(); } catch (_) {}
        }
        onDeviceDisconnect?.('webcam');
      };
    }

    micRecRef.current = null;
    const micDest = micDestRef?.current;
    if (micDest?.stream) {
      const micStream = new MediaStream(micDest.stream.getAudioTracks());
      micRecRef.current = makeRecorder(micStream, micPending, micCount, micKey, audioMime);

      micDest.stream.getAudioTracks()[0]?.addEventListener('ended', () => {
        if (micRecRef.current?.state !== 'inactive') {
          try { micRecRef.current?.stop(); } catch (_) {}
        }
        onDeviceDisconnect?.('microphone');
      });
    }

    if (streamingOpts.liveStream) {
      liveRecRef.current = makeRecorder(
        streamingOpts.liveStream, 
        { current: [] }, 
        { current: 0 }, 
        'live-composite', 
        pickMime(true)
      );
    }

    const recorders = [screenRecRef, webcamRecRef, micRecRef, liveRecRef];
    recorders.forEach((ref) => {
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
  const stopRecording = useCallback(async (
    relativeLayout: Layout | null, 
    targetResolution: { width: number; height: number }, 
    cropOpts: CropOptions = { cropTop: 0, cropBottom: 0 }
  ) => {
    if (!screenRecRef.current) return;
    if (relativeLayout) webcamLayoutRef.current = relativeLayout;
    const api = (window as any).electronAPI;

    const waitForStop = (rec: MediaRecorder | null) =>
      new Promise<void>((resolve) => {
        if (!rec || rec.state === 'inactive') { resolve(); return; }
        rec.onstop = () => resolve();
        try { rec.stop(); } catch (_) { resolve(); }
      });

    await Promise.all([
      waitForStop(screenRecRef.current),
      waitForStop(webcamRecRef.current),
      waitForStop(micRecRef.current),
      waitForStop(liveRecRef.current),
    ]);

    resetTimer();
    setIsRecording(false);
    setIsPaused(false);
    api?.stopPowerBlock?.();

    setMergeStatus('merging');
    setMergePercent(0);

    try {
      await flushLock.current;

      let screenPath = null, webcamPath = null, micPath = null;
      const { screen: screenKey, webcam: webcamKey, mic: micKey } = activeKeysRef.current;

      if (hasElectron()) {
        await Promise.all([
          flushStream(screenKey!, screenPending),
          webcamKey ? flushStream(webcamKey, webcamPending) : Promise.resolve(),
          micKey ? flushStream(micKey, micPending) : Promise.resolve(),
        ]);

        [screenPath, webcamPath, micPath] = await Promise.all([
          api.streamClose(screenKey),
          webcamKey ? api.streamClose(webcamKey) : Promise.resolve(null),
          micKey ? api.streamClose(micKey) : Promise.resolve(null),
        ]);

        streamOpenStateRef.current[screenKey!] = false;
        if (webcamKey) streamOpenStateRef.current[webcamKey] = false;
        if (micKey) streamOpenStateRef.current[micKey] = false;
      } else {
        const videoMime = pickMime(true);
        const blob = new Blob(screenPending.current, { type: videoMime });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        setMergeStatus('done');
        return;
      }

      api.onMergeProgress(({ percent }: { percent: number }) => setMergePercent(percent));
      api.onMergeDone(({ outputPath }: { outputPath: string }) => {
        setSavedPath(outputPath);
        setMergeStatus('done');
        setMergePercent(100);
        api.removeMergeListeners();
      });
      api.onMergeError(({ message }: { message: string }) => {
        setError(`${ERR.FFMPEG_FAIL} (${message})`);
        setMergeStatus('error');
        api.removeMergeListeners();
      });

      await api.mergeRecordings({
        screenPath,
        webcamPath:   webcamPath || null,
        micPath:      micPath    || null,
        webcamLayout: webcamLayoutRef.current,
        targetResolution,
        cropTop: cropOpts.cropTop,
        cropBottom: cropOpts.cropBottom,
      });
    } catch (err: any) {
      setError(`Export error: ${err.message || 'Unknown'}`);
      setMergeStatus('error');

      const { screen: screenKey, webcam: webcamKey, mic: micKey } = activeKeysRef.current;
      if (api?.streamAbort) {
        await Promise.allSettled([
          screenKey ? api.streamAbort(screenKey) : Promise.resolve(),
          webcamKey ? api.streamAbort(webcamKey) : Promise.resolve(),
          micKey ? api.streamAbort(micKey) : Promise.resolve(),
        ]);
      }
    } finally {
      if (sessionId.current) {
        api.liveStreamStop(sessionId.current);
      }
    }
  }, [flushStream]);

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
    bytesWritten,
    error,
    startRecording, stopRecording, togglePause,
  };
}
