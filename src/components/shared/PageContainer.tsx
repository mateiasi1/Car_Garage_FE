import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer: FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'min-h-screen w-full bg-gradient-to-br from-background via-primary to-sidebar',
        'flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};
