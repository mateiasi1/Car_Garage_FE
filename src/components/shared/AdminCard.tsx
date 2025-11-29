import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const AdminCard: FC<AdminCardProps> = ({ children, className, fullHeight }) => {
  return (
    <div className={clsx('bg-surface rounded-xl border border-border', fullHeight && 'h-full', className)}>
      {children}
    </div>
  );
};
