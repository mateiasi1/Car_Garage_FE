import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface FormGridProps {
  children: ReactNode;
  className?: string;
}

export const FormGrid: FC<FormGridProps> = ({ children, className }) => (
  <div className={clsx('grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6', className)}>{children}</div>
);

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export const FormSection: FC<FormSectionProps> = ({ title, children }) => (
  <section className="bg-card/80 rounded-2xl shadow-sm border border-card/40">
    <h3 className="text-base sm:text-lg font-heading font-semibold mb-3 sm:mb-4 border-b border-card/40 pb-2 text-text">
      {title}
    </h3>
    <div>{children}</div>
  </section>
);
