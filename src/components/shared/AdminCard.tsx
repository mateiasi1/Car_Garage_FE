import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const AdminCard: FC<AdminCardProps> = ({ children, className, fullHeight }) => {
  return (
    <div className={clsx('bg-card rounded-3xl shadow-2xl border border-card/40', fullHeight && 'h-full', className)}>
      {children}
    </div>
  );
};
