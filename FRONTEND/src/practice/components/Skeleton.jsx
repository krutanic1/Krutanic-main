import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
    <div className="h-28 bg-slate-200 dark:bg-slate-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
      </div>
      <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ rows = 5 }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
    <div className="h-10 bg-slate-100 dark:bg-slate-800" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
      </div>
    ))}
  </div>
);

export const QuestionPageSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
    </div>
    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      ))}
    </div>
  </div>
);

export const PathCardSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
