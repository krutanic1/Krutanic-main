import { useState, useEffect, useRef } from 'react';

/**
 * useAudioMixer
 * 
 * Mixes multiple MediaStreams (e.g., System Audio + Microphone) into a single 
 * MediaStreamDestination for live streaming.
 */
export function useAudioMixer(streams: (MediaStream | null)[] = []) {
  const [mixedStream, setMixedStream] = useState<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const sourcesRef = useRef<Map<MediaStream, MediaStreamAudioSourceNode>>(new Map());

  useEffect(() => {
    // Initialize AudioContext on first valid stream
    if (!ctxRef.current && streams.some(s => s && s.getAudioTracks().length > 0)) {
      ctxRef.current = new AudioContext();
      destRef.current = ctxRef.current.createMediaStreamDestination();
      setMixedStream(destRef.current.stream);
    }

    const ctx = ctxRef.current;
    if (!ctx || !destRef.current) return;

    // Connect new streams, disconnect old ones
    const currentStreams = new Set(streams.filter((s): s is MediaStream => s !== null && s.getAudioTracks().length > 0));
    
    // 1. Remove sources that are no longer in the list
    for (const [s, node] of sourcesRef.current.entries()) {
      if (!currentStreams.has(s)) {
        node.disconnect();
        sourcesRef.current.delete(s);
      }
    }

    // 2. Add new sources
    for (const s of currentStreams) {
      if (!sourcesRef.current.has(s)) {
        try {
          const source = ctx.createMediaStreamSource(s);
          source.connect(destRef.current);
          sourcesRef.current.set(s, source);
        } catch (err) {
          console.error('[AudioMixer] Failed to connect stream:', err);
        }
      }
    }

    // Handle context state
    if (ctx.state === 'suspended' && currentStreams.size > 0) {
      ctx.resume().catch(() => {});
    }

  }, [streams]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return mixedStream;
}
