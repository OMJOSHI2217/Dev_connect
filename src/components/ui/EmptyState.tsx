import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
