import { FC, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  className?: string;
  smallValue?: boolean;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  className = '',
  smallValue = false,
}) => {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-4 h-4 text-text/40" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    return <TrendingDown className="w-4 h-4 text-error" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-text/60';
    if (change > 0) return 'text-success';
    return 'text-error';
  };

  return (
    <div className={`bg-surface rounded-xl border border-border p-4 sm:p-6 min-w-0 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-text/60 text-sm font-body mb-1 truncate">{title}</p>
          <p
            className={`font-heading font-bold text-text truncate ${smallValue ? 'text-base sm:text-lg' : 'text-2xl sm:text-3xl'}`}
          >
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}
                {change.toFixed(1)}%
              </span>
              {changeLabel && <span className="text-text/50 text-xs ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>}
      </div>
    </div>
  );
};
