import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  topColorClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  badge?: {
    text: string;
    type?: 'success' | 'warning' | 'error' | 'neutral';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  topColorClass = 'bg-primary-container',
  iconBgClass = 'bg-primary/10',
  iconColorClass = 'text-primary-container',
  badge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-lowest rounded-2xl p-4 sm:p-5 shadow-soft border border-outline relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lift hover:border-primary/40 active:scale-[0.99]' : ''
      }`}
    >
      {/* Top Hairline accent */}
      <div className={`absolute top-0 right-0 left-0 h-1 ${topColorClass}`} />

      {/* Header with Title & Icon */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs sm:text-sm font-semibold text-on-surface-variant line-clamp-1">{title}</span>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1">
        {value}
      </div>

      {/* Footer info or badge */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline/40">
        {subtitle && <span className="truncate">{subtitle}</span>}
        {badge && (
          <span
            className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
              badge.type === 'error'
                ? 'bg-red-100 text-red-800'
                : badge.type === 'warning'
                ? 'bg-amber-100 text-amber-800'
                : badge.type === 'success'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};
