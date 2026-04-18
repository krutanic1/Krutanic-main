import React, { useEffect, useState } from 'react';
import { CheckCircle2, FolderOpen, X, Film, ShieldCheck } from 'lucide-react';

interface SaveToastProps {
  savedPath: string | null;
  onDismiss: () => void;
}

export default function SaveToast({ savedPath, onDismiss }: SaveToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (savedPath) {
      setVisible(true);
      const id = setTimeout(handleDismiss, 8000);
      return () => clearTimeout(id);
    }
  }, [savedPath]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleOpenFolder = () => {
    if (savedPath && (window as any).electronAPI?.openFilePath) {
      (window as any).electronAPI.openFilePath(savedPath);
    }
  };

  const filename = savedPath ? savedPath.split(/[\\/]/).pop() : '';

  if (!savedPath && !visible) return null;

  return (
    <div
      className={`
        fixed bottom-10 right-10 z-[100] max-w-sm w-full transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'}
      `}
    >
      <div className="bg-obs-panel bg-gradient-to-br from-obs-panel to-black/40 border border-green-500/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] p-5 flex gap-4 backdrop-blur-xl group/toast">
        {/* Status Indicator Bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-green-500 rounded-r-full shadow-[0_0_15px_rgba(34,197,94,0.4)]" />

        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/10 group-hover/toast:scale-110 transition-transform duration-300">
           <ShieldCheck size={24} className="text-green-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black text-green-500 uppercase tracking-[.2em]">Success</span>
             <div className="h-px flex-1 bg-green-500/10" />
          </div>
          <p className="text-[13px] font-black text-white tracking-tight leading-tight">ENCODING COMPLETE</p>
          <p className="text-[11px] text-gray-500 mt-1 truncate flex items-center gap-1.5 font-medium tabular-nums px-2 py-1 bg-black/20 rounded-lg">
            <Film size={12} className="opacity-40" />
            {filename}
          </p>

          <button
            onClick={handleOpenFolder}
            className="mt-4 flex items-center gap-2 text-[10px] font-black text-brand-primary hover:text-white transition-all uppercase tracking-widest bg-brand-primary/5 hover:bg-brand-primary px-3 py-1.5 rounded-lg border border-brand-primary/10 hover:border-brand-primary active:scale-95"
          >
            <FolderOpen size={12} />
            Show in Folder
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-all self-start"
        >
          <X size={16} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {visible && (
        <div className="absolute bottom-[-4px] left-6 right-6 h-1 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-300 animate-[shrink_8s_linear_forwards]" />
        </div>
      )}
    </div>
  );
}
