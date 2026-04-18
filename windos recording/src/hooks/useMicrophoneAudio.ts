import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Manages a full Web Audio API processing chain for microphone input.
 */
export function useMicrophoneAudio(deviceId: string = '') {
  const [isActive, setIsActive]   = useState(false);
  const [isMuted, setIsMuted]     = useState(false);
  const [volume, setVolume]       = useState(80);   // 0-100
  const [level, setLevel]         = useState(0);    // 0-100  (live RMS)
  const [error, setError]         = useState<string | null>(null);

  // Web Audio refs
  const ctxRef      = useRef<AudioContext | null>(null);
  const sourceRef   = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainRef     = useRef<GainNode | null>(null);
  const filterRef   = useRef<BiquadFilterNode | null>(null);
  const compRef     = useRef<DynamicsCompressorNode | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const streamRef      = useRef<MediaStream | null>(null);
  const rafRef         = useRef<number | null>(null);
  const streamDestRef  = useRef<MediaStreamAudioDestinationNode | null>(null);

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

      // 3. BiquadFilter – highpass at 80 Hz
      const filter = ctx.createBiquadFilter();
      filter.type            = 'highpass';
      filter.frequency.value = 80;
      filter.Q.value         = 0.7;
      filterRef.current = filter;

      // 4. DynamicsCompressor
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value      = 30;
      comp.ratio.value     = 12;
      comp.attack.value    = 0.003;
      comp.release.value   = 0.25;
      compRef.current = comp;

      // 5. AnalyserNode
      const analyser = ctx.createAnalyser();
      analyser.fftSize            = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // 5b. MediaStreamAudioDestinationNode
      const streamDest = ctx.createMediaStreamDestination();
      streamDestRef.current = streamDest;

      // Wire chain
      source.connect(gain);
      gain.connect(filter);
      filter.connect(comp);
      comp.connect(analyser);
      comp.connect(streamDest);

      setIsActive(true);
      startLevelMeter(analyser);
    } catch (err: any) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied.'
          : `Mic error: ${err.message}`
      );
    }
  }, [volume, deviceId]);

  // ── Live level meter via requestAnimationFrame ─────────────────
  const startLevelMeter = (analyser: AnalyserNode) => {
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(buf);
      const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
      setLevel(Math.min(100, (rms / 128) * 100));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ── Stop chain ─────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close().catch(() => {});
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

  // ── Mute – disconnect/reconnect compressor from analyser ───
  useEffect(() => {
    if (!compRef.current || !analyserRef.current || !ctxRef.current) return;
    if (isMuted) {
      try { compRef.current.disconnect(analyserRef.current); } catch (_) {}
    } else {
      try { compRef.current.connect(analyserRef.current); } catch (_) {}
    }
  }, [isMuted]);

  useEffect(() => () => stop(), [stop]);

  return {
    isActive, isMuted, volume, level, error,
    start, stop,
    setVolume,
    toggleMute: () => setIsMuted((m) => !m),
    streamDestRef, // expose for MediaRecorder
  };
}
