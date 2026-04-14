import { useState, useEffect, useCallback } from 'react';

/**
 * useDevices
 * Enumerates available cameras and microphones.
 * Triggers re-enumeration when devices are plugged in/removed.
 */
export function useDevices() {
  const [cameras,       setCameras]       = useState([]);
  const [microphones,   setMicrophones]   = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic,    setSelectedMic]   = useState('');

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
    navigator.mediaDevices?.addEventListener('devicechange', enumerate);
    return () => navigator.mediaDevices?.removeEventListener('devicechange', enumerate);
  }, [enumerate]);

  return {
    cameras, microphones,
    selectedCamera, setSelectedCamera,
    selectedMic,    setSelectedMic,
    enumerate,
  };
}
