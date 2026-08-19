import React from 'react';

const difficultyConfig = {
  Easy: {
    label: 'Easy',
    className: 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  },
  Hard: {
    label: 'Hard',
    className: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  },
};

const DifficultyBadge = ({ difficulty, size = 'sm' }) => {
  const config = difficultyConfig[difficulty] || difficultyConfig['Easy'];
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-md font-semibold ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
};

export default DifficultyBadge;
