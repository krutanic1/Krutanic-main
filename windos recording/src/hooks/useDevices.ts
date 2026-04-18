import { useState, useEffect, useCallback } from 'react';

/**
 * useDevices
 * Enumerates available cameras and microphones.
 * Triggers re-enumeration when devices are plugged in/removed.
 */
export function useDevices() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');

  const enumerate = useCallback(async () => {
    try {
      // A brief permission grant gives us device labels
      const tempStream = await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .catch(() => null);
      if (tempStream) tempStream.getTracks().forEach((t) => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();

      const cams = devices.filter((d) => d.kind === 'videoinput');
      const mics = devices.filter((d) => d.kind === 'audioinput');

      setCameras(cams);
      setMicrophones(mics);

      // Select first device if nothing chosen yet
      if (cams.length && !selectedCamera) setSelectedCamera(cams[0].deviceId);
      if (mics.length && !selectedMic)    setSelectedMic(mics[0].deviceId);
    } catch (err) {
      console.warn('Device enumeration failed:', err);
    }
  }, [selectedCamera, selectedMic]);

  useEffect(() => {
    enumerate();
    
    const nav = navigator.mediaDevices as any;
    if (nav?.addEventListener) {
      nav.addEventListener('devicechange', enumerate);
      return () => nav.removeEventListener('devicechange', enumerate);
    }
  }, [enumerate]);

  return {
    cameras, 
    microphones,
    selectedCamera, 
    setSelectedCamera,
    selectedMic,    
    setSelectedMic,
    enumerate,
  };
}
