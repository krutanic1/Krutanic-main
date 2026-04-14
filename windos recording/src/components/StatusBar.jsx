import React, { useState, useEffect } from 'react';
import { HardDrive, Cpu, AlertTriangle } from 'lucide-react';

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export default function StatusBar({ isRecording, seconds, bytesWritten }) {
  const [memMB,    setMemMB]    = useState(null);
  const [diskInfo, setDiskInfo] = useState(null);

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
    window.electronAPI?.checkDiskSpace?.().then((info) => {
      if (info) setDiskInfo(info);
    });
  }, [isRecording]);

  const lowMem  = memMB !== null && memMB > 1500;
  const lowDisk = diskInfo && diskInfo.free < 5 * 1e9;

  if (!isRecording) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-black/30 border-t border-obs-border text-[10px] text-gray-600 font-mono">
      {/* Written to disk */}
      <div className="flex items-center gap-1.5">
        <HardDrive size={10} />
        <span>Written: {formatBytes(bytesWritten)}</span>
      </div>

      {/* JS heap */}
      {memMB !== null && (
        <div className={`flex items-center gap-1.5 ${lowMem ? 'text-yellow-500' : ''}`}>
          <Cpu size={10} />
          <span>Heap: {memMB} MB</span>
          {lowMem && <AlertTriangle size={10} className="text-yellow-500" />}
        </div>
      )}

      {/* Disk space */}
      {diskInfo && (
        <div className={`flex items-center gap-1.5 ${lowDisk ? 'text-red-500' : ''}`}>
          <HardDrive size={10} />
          <span>Free: {diskInfo.freeGB} GB</span>
          {lowDisk && <AlertTriangle size={10} className="text-red-500" />}
        </div>
      )}

      <div className="ml-auto text-gray-700">
        {isRecording && `Streaming to disk every 30s`}
      </div>
    </div>
  );
}
