import React, { useEffect, useState } from 'react';
import { CheckCircle2, FolderOpen, X, Film } from 'lucide-react';

/**
 * SaveToast
 * Appears when a recording has been saved successfully.
 * Auto-dismisses after 8 seconds.
 *
 * Props:
 *   savedPath  – absolute path to the saved MP4 file
 *   onDismiss  – callback to clear the path in parent state
 */
export default function SaveToast({ savedPath, onDismiss }) {
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
    setTimeout(onDismiss, 300); // wait for fade-out
  };

  const handleOpenFolder = () => {
    if (window.electronAPI?.openFilePath) {
      window.electronAPI.openFilePath(savedPath);
    }
  };

  const filename = savedPath ? savedPath.split(/[\\/]/).pop() : '';

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <div className="bg-obs-panel border border-green-500/30 rounded-xl shadow-2xl shadow-black/50 p-4 flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 size={20} className="text-green-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-400">Recording Saved!</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
            <Film size={10} />
            {filename}
          </p>

          {/* Open folder button */}
          <button
            onClick={handleOpenFolder}
            className="mt-2 flex items-center gap-1.5 text-xs text-brand-primary hover:text-white transition-colors font-medium"
          >
            <FolderOpen size={12} />
            Open File Location
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors self-start"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar auto-dismiss indicator */}
      {visible && (
        <div className="mt-1 h-0.5 bg-white/5 rounded overflow-hidden">
          <div className="h-full bg-green-500/50 animate-[shrink_8s_linear_forwards]" />
        </div>
      )}
    </div>
  );
}
