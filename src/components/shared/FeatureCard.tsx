import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, className }) => {
  return (
    <div
      className={clsx(
        'bg-card rounded-3xl shadow-md p-6 flex flex-col gap-3',
        'hover:shadow-xl hover:-translate-y-1 transition-all',
        className
      )}
    >
      {icon && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      )}

      <h3 className="text-lg font-heading font-semibold text-text">{title}</h3>
      <p className="text-sm text-text/70 font-body">{description}</p>
    </div>
  );
};
