import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import MicChannel from './MicChannel';

/** Simulated channel (Desktop Audio, Game Audio) with fake level animation */
const SimChannel = ({ label, color = 'bg-brand-primary' }) => {
  const [level, setLevel]   = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (isMuted) { setLevel(0); return; }
    const id = setInterval(() => {
      setLevel(Math.random() * volume);
    }, 150);
    return () => clearInterval(id);
  }, [volume, isMuted]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase font-bold text-gray-500">{label}</span>
        <button
          onClick={() => setIsMuted((m) => !m)}
          className={`p-1 rounded transition-colors ${
            isMuted ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* VU bar */}
      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full ${color} transition-all duration-150 ease-out shadow-[0_0_8px_rgba(56,189,248,0.3)]`}
          style={{ width: `${level}%` }}
        />
      </div>

      <input
        type="range"
        min="0" max="100"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
};

export default function AudioMixer({ micProps, microphones, selectedMic }) {
  return (
    <div className="h-52 bg-obs-panel border-t border-obs-border p-4 flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Audio Mixer
        </h3>
      </div>

      <div className="flex-1 flex items-start gap-8 overflow-x-auto pb-2">
        {/* Real mic channel using centralized props */}
        <MicChannel 
          {...micProps} 
          deviceName={microphones.find(m => m.deviceId === selectedMic)?.label || 'Default Microphone'} 
        />

        {/* Simulated channels */}
        <SimChannel label="Desktop Audio"  color="bg-brand-primary" />
        <SimChannel label="Game Audio"     color="bg-purple-500" />
      </div>
    </div>
  );
}
