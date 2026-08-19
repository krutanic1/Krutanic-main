import React from 'react';

const ProgressBar = ({ percentage = 0, solved = 0, total = 0, showLabel = true, height = 'h-2', colorClass = 'bg-gradient-to-r from-blue-500 to-indigo-600' }) => {
  const safePercent = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Progress
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {solved} / {total} solved
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colorClass} ${height} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${safePercent}%` }}
          role="progressbar"
          aria-valuenow={safePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
          {safePercent}% complete
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
