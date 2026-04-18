import React, { useState, useEffect } from 'react';
import { HardDrive, Cpu, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DiskInfo {
  free: number;
  freeGB: number;
  total: number;
}

interface StatusBarProps {
  isRecording: boolean;
  bytesWritten: number;
}

// Memory extension for TypeScript
interface Memory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

declare global {
  interface Performance {
    memory?: Memory;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export default function StatusBar({ isRecording, bytesWritten }: StatusBarProps) {
  const [memMB, setMemMB] = useState<number | null>(null);
  const [diskInfo, setDiskInfo] = useState<DiskInfo | null>(null);

  // Poll JS heap usage every 5 seconds while recording
  useEffect(() => {
    if (!isRecording) return;
    const update = () => {
      if (performance.memory) {
        setMemMB(Math.round(performance.memory.usedJSHeapSize / 1024 / 1024));
      }
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Check disk space once on mount + on recording start
  useEffect(() => {
    (window as any).electronAPI?.checkDiskSpace?.().then((info: DiskInfo) => {
      if (info) setDiskInfo(info);
    });
  }, [isRecording]);

  const lowMem  = memMB !== null && memMB > 1500;
  const lowDisk = diskInfo && diskInfo.free < 5 * 1e9;

  if (!isRecording) return (
    <div className="flex items-center gap-6 px-6 py-2 bg-obs-panel border-t border-obs-border text-[9px] text-gray-500 font-black tracking-[.2em] uppercase transition-all">
       <div className="flex items-center gap-2">
         <ShieldCheck size={12} className="text-green-500/50" />
         <span>System Ready</span>
       </div>
    </div>
  );

  return (
    <div className="flex items-center gap-6 px-6 py-2 bg-obs-panel border-t border-obs-border text-[9px] text-gray-400 font-mono tracking-tight animate-in slide-in-from-bottom-2 duration-300">
      {/* Written to disk */}
      <div className="flex items-center gap-2 group">
        <HardDrive size={11} className="text-brand-primary opacity-60" />
        <span className="font-bold text-gray-400 tracking-wider">OUTPUT:</span>
        <span className="text-brand-primary group-hover:brightness-125 tabular-nums">{formatBytes(bytesWritten)}</span>
      </div>

      <div className="w-px h-3 bg-white/5" />

      {/* JS heap */}
      {memMB !== null && (
        <div className={`flex items-center gap-2 ${lowMem ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>
          <Cpu size={11} className="opacity-60" />
          <span className="font-bold uppercase tracking-wider">MEM:</span>
          <span className="tabular-nums">{memMB} MB</span>
          {lowMem && <AlertTriangle size={11} />}
        </div>
      )}

      {/* Disk space */}
      {diskInfo && (
        <div className={`flex items-center gap-2 ${lowDisk ? 'text-red-400 animate-bounce' : 'text-gray-500'}`}>
          <HardDrive size={11} className="opacity-60" />
          <span className="font-bold uppercase tracking-wider">DISK:</span>
          <span className="tabular-nums">{typeof diskInfo.freeGB === 'number' ? diskInfo.freeGB.toFixed(1) : diskInfo.freeGB} GB FREE</span>
          {lowDisk && <AlertTriangle size={11} />}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 opacity-30 group">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[.25em]">Secure Stream Active</span>
      </div>
    </div>
  );
}
