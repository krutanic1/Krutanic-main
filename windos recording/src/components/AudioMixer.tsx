import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import MicChannel from './MicChannel';

interface SimChannelProps {
  label: string;
  color?: string;
}

/** Simulated channel (Desktop Audio, Game Audio) with fake level animation */
const SimChannel = ({ label, color = 'bg-brand-primary' }: SimChannelProps) => {
  const [level, setLevel]   = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (isMuted) { setLevel(0); return; }
    const id = setInterval(() => {
      setLevel(Math.random() * (volume * 0.8) + (volume * 0.1));
    }, 120);
    return () => clearInterval(id);
  }, [volume, isMuted]);

  return (
    <div className="flex flex-col gap-4 w-full min-w-[180px] p-4 bg-black/20 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{label}</span>
        <button
          onClick={() => setIsMuted((m) => !m)}
          className={`p-1.5 rounded-lg transition-all ${
            isMuted ? 'text-red-500 bg-red-500/10' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      <div className="flex gap-[2px] h-3 items-end bg-black/40 p-0.5 rounded-md overflow-hidden">
        {Array.from({ length: 18 }, (_, i) => {
          const threshold = ((i + 1) / 18) * 100;
          const active = !isMuted && level >= threshold;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-150 ${
                active ? color : 'bg-white/5'
              }`}
              style={{ height: active ? '100%' : '30%' }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range" min="0" max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary opacity-60 hover:opacity-100 transition-opacity"
        />
        <span className="text-[9px] font-mono font-bold text-gray-600 w-5">{volume}%</span>
      </div>
    </div>
  );
};

interface AudioMixerProps {
  micProps: any;
  microphones: any[];
  selectedMic: string;
}

export default function AudioMixer({ micProps, microphones, selectedMic }: AudioMixerProps) {
  const currentMic = microphones.find(m => m.deviceId === selectedMic);

  return (
    <div className="h-64 bg-obs-panel border-t border-obs-border p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.4)] z-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <SlidersHorizontal size={16} className="text-brand-primary" />
        </div>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
          LIVE AUDIO CONSOLE
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {/* Real mic channel */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/10 min-w-[240px]">
          <MicChannel 
            {...micProps} 
            deviceName={currentMic?.label || 'PRIMARY_INPUT'} 
          />
        </div>

        {/* Simulated channels */}
        <SimChannel label="SYSTEM_BUS"  color="bg-brand-secondary shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        <SimChannel label="INTERNAL_LOOP" color="bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
        <SimChannel label="VIRTUAL_AUX" color="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
      </div>
    </div>
  );
}
