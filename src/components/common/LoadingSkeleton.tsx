import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'kanban' | 'detail';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="bg-[var(--surface)] rounded-[20px] border border-[var(--border)] p-5 animate-pulse space-y-4">
        <div className="h-6 bg-[var(--surface-2)] rounded-[10px] w-1/4" />
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-12 bg-[var(--surface-2)]/60 rounded-[12px] flex items-center justify-between px-4">
              <div className="h-4 bg-[var(--border)] rounded w-1/3" />
              <div className="h-4 bg-[var(--border)] rounded w-1/4" />
              <div className="h-4 bg-[var(--border)] rounded w-16" />
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
          <div key={i} className="bg-[var(--surface-2)] rounded-[20px] p-4 space-y-3 border border-[var(--border)]">
            <div className="h-4 bg-[var(--border)] rounded w-1/2" />
            <div className="h-24 bg-[var(--surface)] rounded-[14px] shadow-sm" />
            <div className="h-24 bg-[var(--surface)] rounded-[14px] shadow-sm" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[var(--surface)] rounded-[20px] p-5 border border-[var(--border)] space-y-3">
          <div className="h-4 bg-[var(--surface-2)] rounded w-3/4" />
          <div className="h-8 bg-[var(--surface-2)] rounded w-1/2" />
          <div className="h-3 bg-[var(--surface-2)] rounded w-full" />
        </div>
      ))}
    </div>
  );
};
