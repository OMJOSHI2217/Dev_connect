import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
