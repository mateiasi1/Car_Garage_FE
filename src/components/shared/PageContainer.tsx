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
        'min-h-screen w-full bg-background',
        'flex items-center justify-center',
        'px-4 py-8',
        className
      )}
    >
      {children}
    </div>
  );
};
