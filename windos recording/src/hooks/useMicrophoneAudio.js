import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Manages a full Web Audio API processing chain for microphone input.
 *
 * Chain: getUserMedia → MediaStreamSource → GainNode → BiquadFilter (highpass)
 *        → DynamicsCompressor → AnalyserNode → AudioContext.destination
 *                            └→ MediaStreamAudioDestinationNode (for recording)
 *
 * Returns controls, live level data, and a processedStreamRef for MediaRecorder.
 */
export function useMicrophoneAudio(deviceId = '') {
  const [isActive, setIsActive]   = useState(false);
  const [isMuted, setIsMuted]     = useState(false);
  const [volume, setVolume]       = useState(80);   // 0-100
  const [level, setLevel]         = useState(0);    // 0-100  (live RMS)
  const [error, setError]         = useState(null);

  // Web Audio refs – kept in refs so they survive re-renders without effect churn
  const ctxRef      = useRef(null);
  const sourceRef   = useRef(null);
  const gainRef     = useRef(null);
  const filterRef   = useRef(null);
  const compRef     = useRef(null);
  const analyserRef    = useRef(null);
  const streamRef      = useRef(null);
  const rafRef         = useRef(null);
  const streamDestRef  = useRef(null); // processed audio for MediaRecorder

  // ── Build processing chain ─────────────────────────────────────
  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl:  true,
          ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
        },
        video: false,
      });

      streamRef.current = stream;

      const ctx = new AudioContext();
      ctxRef.current = ctx;

      // Ensure context is not suspended (browser/electron security)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 1. Source
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // 2. GainNode – volume control
      const gain = ctx.createGain();
      gain.gain.value = volume / 100;
      gainRef.current = gain;

      // 3. BiquadFilter – highpass at 80 Hz removes rumble/low noise
      const filter = ctx.createBiquadFilter();
      filter.type            = 'highpass';
      filter.frequency.value = 80;
      filter.Q.value         = 0.7;
      filterRef.current = filter;

      // 4. DynamicsCompressor – balances loud/quiet audio
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value      = 30;
      comp.ratio.value     = 12;
      comp.attack.value    = 0.003;
      comp.release.value   = 0.25;
      compRef.current = comp;

      // 5. AnalyserNode – feeds the live level meter
      const analyser = ctx.createAnalyser();
      analyser.fftSize            = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // 5b. MediaStreamAudioDestinationNode – captures processed audio for recording
      const streamDest = ctx.createMediaStreamDestination();
      streamDestRef.current = streamDest;

      // Wire chain
      source.connect(gain);
      gain.connect(filter);
      filter.connect(comp);
      comp.connect(analyser);

      // Default: DO NOT connect to destination (speakers) to avoid feedback
      // BUT, connect comp to streamDest for recording
      comp.connect(streamDest);

      setIsActive(true);
      startLevelMeter(analyser);
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied.'
          : `Mic error: ${err.message}`
      );
    }
  }, [volume, deviceId]);

  // ── Live level meter via requestAnimationFrame ─────────────────
  const startLevelMeter = (analyser) => {
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(buf);
      // RMS approximation
      const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
      setLevel(Math.min(100, (rms / 128) * 100));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ── Stop chain ─────────────────────────────────────────────────
  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    streamDestRef.current = null;
    setIsActive(false);
    setLevel(0);
  }, []);

  // ── Sync volume → GainNode ────────────────────────────────────
  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        volume / 100,
        ctxRef.current.currentTime,
        0.01
      );
    }
  }, [volume]);

  // ── Mute – disconnect/reconnect compressor from destination ───
  useEffect(() => {
    if (!compRef.current || !analyserRef.current || !ctxRef.current) return;
    if (isMuted) {
      try { compRef.current.disconnect(analyserRef.current); } catch (_) {}
    } else {
      try { compRef.current.connect(analyserRef.current); } catch (_) {}
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    isActive, isMuted, volume, level, error,
    start, stop,
    setVolume,
    toggleMute: () => setIsMuted((m) => !m),
    streamDestRef, // expose for MediaRecorder
  };
}
