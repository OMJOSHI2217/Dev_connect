import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const variants = {
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
    slate: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
  };

  const dotColors = {
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500',
    slate: 'bg-slate-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-semibold',
    lg: 'text-sm sm:text-base px-3.5 py-2 gap-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-lg border font-sans ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
