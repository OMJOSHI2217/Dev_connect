import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-500/20 focus:ring-teal-500 focus:ring-offset-slate-900 border border-teal-500/30 active:scale-[0.98]',
    secondary: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-slate-400 border border-slate-300/60 dark:border-slate-700 active:scale-[0.98]',
    outline: 'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-slate-400 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-400 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 border border-rose-500/20 active:scale-[0.98]',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 focus:ring-indigo-500 focus:ring-offset-slate-900 border border-indigo-500/30 active:scale-[0.98]'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
};
