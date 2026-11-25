import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500'
          } ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">{helperText}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full rounded-xl bg-slate-50 dark:bg-slate-950/70 border ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500'
        } px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">{helperText}</p>}
    </div>
  );
};
