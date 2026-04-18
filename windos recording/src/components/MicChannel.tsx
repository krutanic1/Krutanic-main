import React from 'react';
import { Mic, MicOff, Radio, Activity } from 'lucide-react';

interface MicChannelProps {
  isActive: boolean;
  isMuted: boolean;
  volume: number;
  level: number;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  deviceName: string;
}

function levelColor(level: number) {
  if (level > 85) return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]';
  if (level > 65) return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]';
  return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
}

export default function MicChannel({
  isActive, isMuted, volume, level, error,
  start, stop, setVolume, toggleMute, deviceName
}: MicChannelProps) {

  return (
    <div className="flex flex-col gap-4 w-full max-w-[240px] animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 tracking-wider">
            <Mic size={12} className="text-brand-primary" />
            {deviceName.split('(')[0].trim() || 'Core Mic'}
          </span>
          {isActive && !isMuted ? (
            <span className="text-[8px] text-green-500 font-bold tracking-widest animate-pulse mt-0.5">SAMPLING ACTIVE</span>
          ) : (
            <span className="text-[8px] text-gray-600 font-bold tracking-widest mt-0.5">STANDBY</span>
          )}
        </div>
        
        <button
          onClick={toggleMute}
          disabled={!isActive}
          className={`p-2 rounded-xl transition-all ${
            isMuted
              ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20 active:scale-90 shadow-lg'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          } disabled:opacity-20`}
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>

      {/* Live VU meter */}
      <div className="flex gap-[2px] h-4 items-end bg-black/40 p-1 rounded-lg border border-white/5">
        {Array.from({ length: 24 }, (_, i) => {
          const threshold = ((i + 1) / 24) * 100;
          const active    = !isMuted && isActive && level >= threshold;
          return (
            <div
              key={i}
              className={`flex-1 rounded-[1px] transition-all duration-100 ${
                active ? levelColor(threshold) : 'bg-white/5'
              }`}
              style={{ height: active ? '100%' : '20%' }}
            />
          );
        })}
      </div>

      {/* Volume & Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0" max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={!isActive}
            className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary disabled:opacity-20"
          />
          <span className="text-[10px] font-mono font-bold text-gray-500 w-6">{volume}%</span>
        </div>

        {isActive && (
          <div className="flex gap-1.5 flex-wrap">
            {['ECHO_CLR', 'AI_NOISE', 'GAIN_H', 'L_CUT'].map((tag) => (
              <span
                key={tag}
                className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 text-gray-500 border border-white/5 font-black tracking-tighter"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[9px] text-red-400 leading-tight font-bold">DEVICE_ERR: {error}</p>
        </div>
      )}

      {/* Control Toggle */}
      <button
        onClick={isActive ? stop : start}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] border transition-all active:scale-95 ${
          isActive
            ? 'border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500/10'
            : 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10'
        }`}
      >
        <Activity size={12} className={isActive ? 'animate-pulse' : ''} />
        {isActive ? 'CLOSE CHANNEL' : 'ENGAGE PIPELINE'}
      </button>
    </div>
  );
}
