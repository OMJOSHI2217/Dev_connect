import React from 'react';
import { X } from 'lucide-react';

interface SkillTagProps {
  name: string;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const SkillTag: React.FC<SkillTagProps> = ({
  name,
  onRemove,
  selected = false,
  onClick,
  size = 'md'
}) => {
  const isInteractive = Boolean(onClick);

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-lg font-sans font-medium transition-colors ${sizeClasses[size]} ${
        selected
          ? 'bg-teal-600 text-white border border-teal-500 shadow-sm'
          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300'
      } ${isInteractive ? 'cursor-pointer' : ''}`}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-rose-400 transition-colors p-0.5 -mr-1"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
