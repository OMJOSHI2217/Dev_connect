import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-teal-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-white dark:bg-slate-900',
          error: 'border-rose-500/30 bg-white dark:bg-slate-900',
          warning: 'border-amber-500/30 bg-white dark:bg-slate-900',
          info: 'border-teal-500/30 bg-white dark:bg-slate-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 flex-1 leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
