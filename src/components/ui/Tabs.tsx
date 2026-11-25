import React from 'react';

interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer ${
              isActive
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
