import React from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';
import { useMicrophoneAudio } from '../hooks/useMicrophoneAudio';

/** Maps 0-100 level to a CSS color class (green → yellow → red) */
function levelColor(level) {
  if (level > 80) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
  if (level > 55) return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]';
  return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
}

export default function MicChannel({
  isActive, isMuted, volume, level, error,
  start, stop, setVolume, toggleMute, deviceName
}) {

  return (
    <div className="flex flex-col gap-3 w-full max-w-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400">
          <Mic size={11} />
          {deviceName || 'Microphone'}
          {isActive && !isMuted && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          )}
        </span>
        <button
          onClick={toggleMute}
          disabled={!isActive}
          title={isMuted ? 'Unmute' : 'Mute'}
          className={`p-1 rounded transition-colors disabled:opacity-30 ${
            isMuted
              ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
              : 'text-gray-400 hover:bg-white/10'
          }`}
        >
          {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
        </button>
      </div>

      {/* Live level meter – 20 segments */}
      <div className="flex gap-0.5 h-3 items-end">
        {Array.from({ length: 20 }, (_, i) => {
          const threshold = ((i + 1) / 20) * 100;
          const active    = !isMuted && level >= threshold;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-75 ${
                active ? levelColor(threshold) : 'bg-white/5'
              }`}
              style={{ height: active ? '100%' : '40%' }}
            />
          );
        })}
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-600 w-5 text-right">{volume}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={!isActive}
          className="flex-1 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-30"
        />
      </div>

      {/* Processing badges */}
      {isActive && (
        <div className="flex gap-1 flex-wrap">
          {['Echo Cancel', 'Noise Supp', 'Auto Gain', 'HPF 80Hz', 'Compressor'].map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[10px] text-red-400 leading-tight">{error}</p>
      )}

      {/* Toggle button */}
      <button
        onClick={isActive ? stop : start}
        className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
          isActive
            ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
            : 'border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20'
        }`}
      >
        <Radio size={12} />
        {isActive ? 'Stop Mic' : 'Start Mic'}
      </button>
    </div>
  );
}
