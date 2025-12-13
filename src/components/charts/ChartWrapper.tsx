import { FC, ReactNode } from 'react';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const ChartWrapper: FC<ChartWrapperProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl border border-border p-4 sm:p-6 min-w-0 overflow-hidden ${className}`}>
      <div className="mb-4">
        <h3 className="font-heading font-semibold text-text text-lg truncate">{title}</h3>
        {subtitle && <p className="text-text/60 text-sm font-body mt-1 truncate">{subtitle}</p>}
      </div>
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
