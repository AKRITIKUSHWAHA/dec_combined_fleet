import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'kanban' | 'detail';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-lg flex items-center justify-between px-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'kanban') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-24 bg-white dark:bg-slate-800 rounded-lg shadow-sm" />
            <div className="h-24 bg-white dark:bg-slate-800 rounded-lg shadow-sm" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800/80 rounded w-1/2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
        </div>
      ))}
    </div>
  );
};
