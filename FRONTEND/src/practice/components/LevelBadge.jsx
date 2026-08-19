import React from 'react';

const levelConfig = {
  Beginner: {
    label: 'Beginner',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  Intermediate: {
    label: 'Intermediate',
    className: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  Advanced: {
    label: 'Advanced',
    className: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};

const LevelBadge = ({ level, size = 'sm' }) => {
  const config = levelConfig[level] || levelConfig['Beginner'];
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default LevelBadge;
