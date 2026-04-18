import React, { useState } from 'react';
import { Play, Square, Pause, Info, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import AdvancedSettings from './AdvancedSettings';
import { useStore } from '../store/useStore';

interface ControlPanelProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  isWebcamOn: boolean;
  onToggleWebcam: () => void;
  mergeStatus: string | null;
  mergePercent: number;
  cameras: any[];
  microphones: any[];
  selectedCamera: string;
  setSelectedCamera: (id: string) => void;
  selectedMic: string;
  setSelectedMic: (id: string) => void;
}

export default function ControlPanel({
  isRecording, isPaused, onStart, onStop, onPause,
  isWebcamOn, onToggleWebcam,
  mergeStatus, mergePercent,
  cameras, microphones,
  selectedCamera, setSelectedCamera,
  selectedMic,    setSelectedMic,
}: ControlPanelProps) {
  const store = useStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-full bg-obs-panel border-l border-obs-border w-64 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="p-4 border-b border-obs-border flex items-center justify-between bg-black/10">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
          CONTROL CENTER
        </h3>
        <button
          onClick={() => setShowSettings((s) => !s)}
          className={`p-1.5 rounded-md transition-all ${
            showSettings ? 'bg-brand-primary/20 text-brand-primary' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <ChevronDown size={14} className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main recording actions */}
      <div className="p-5 space-y-3">
        {!isRecording ? (
          <button
            onClick={onStart}
            className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-br from-brand-primary to-brand-secondary hover:brightness-110 text-white rounded-xl font-bold transition-all shadow-[0_8px_20px_-6px_rgba(56,189,248,0.5)] active:scale-95 group"
          >
            <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
            <span className="tracking-tight">Start Session</span>
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={onStop}
              className="w-full h-14 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-[0_8px_20px_-6px_rgba(220,38,38,0.4)] active:scale-95 group"
            >
              <Square size={20} className="fill-current" />
              <span className="tracking-tight">End Recording</span>
            </button>

            <button
              onClick={onPause}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold border-2 transition-all active:scale-95 ${
                isPaused
                  ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                  : 'border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              <Pause size={16} fill={isPaused ? 'currentColor' : 'none'} />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}
      </div>

      {/* FFmpeg merge progress */}
      {mergeStatus === 'merging' && (
        <div className="px-5 pb-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-yellow-400 animate-pulse flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" />
              FINISHING MP4...
            </span>
            <span className="text-gray-500">{mergePercent}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500 ease-out"
              style={{ width: `${mergePercent}%` }}
            />
          </div>
        </div>
      )}

      {mergeStatus === 'done' && (
        <div className="mx-5 mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex flex-col items-center gap-1.5 text-center animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-green-500" />
          <span className="text-[10px] font-bold text-green-400 leading-tight">RECORDING SAVED SUCCESSFULLY</span>
        </div>
      )}

      {/* Advanced settings (collapsible) */}
      {showSettings && (
        <div className="animate-in slide-in-from-top duration-300">
          <AdvancedSettings
            cameras={cameras}
            microphones={microphones}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            selectedMic={selectedMic}
            setSelectedMic={setSelectedMic}
            isWebcamOn={isWebcamOn}
            onToggleWebcam={onToggleWebcam}
            // All other settings are handled via Zustand store inside AdvancedSettings
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto p-5 bg-black/30 border-t border-obs-border">
        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
          <Info size={14} className="opacity-40" />
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase font-black text-[8px] tracking-widest leading-none mb-1">Storage</span>
            <span className="opacity-60">Videos/Recordings Folder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
