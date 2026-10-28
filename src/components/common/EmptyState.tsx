import React from 'react';
import { LucideIcon, FolderOpen, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-[var(--surface)] text-[var(--text)] rounded-[20px] border border-dashed border-[var(--border)] p-8 sm:p-12 text-center max-w-lg mx-auto my-6 shadow-sm">
      <div className="w-14 h-14 rounded-[16px] bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
        <Icon className="w-7 h-7 text-[#3FE0C5]" aria-hidden="true" />
      </div>
      <h3 className="text-base font-heading font-bold text-[var(--text)]">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-5 !text-xs !py-1.5 !min-h-[44px]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
