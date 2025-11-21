import { FC, ReactNode } from 'react';
import clsx from 'clsx';

type TextVariant = 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'label' | 'muted';

interface TextProps {
  variant?: TextVariant;
  className?: string;
  color?: string;
  children: ReactNode;
}

export const Text: FC<TextProps> = ({ variant = 'body', className, color, children }) => {
  const base = 'font-body';

  const variants: Record<TextVariant, string> = {
    h1: 'text-3xl sm:text-4xl font-heading font-bold',
    h2: 'text-2xl sm:text-3xl font-heading font-bold',
    h3: 'text-xl sm:text-2xl font-heading font-semibold',
    subtitle: 'text-sm sm:text-base',
    body: 'text-sm sm:text-base',
    label: 'text-xs sm:text-sm font-semibold',
    muted: 'text-xs sm:text-sm text-text/60',
  };

  const classes = clsx(base, variants[variant], color && `text-${color}`, className);

  switch (variant) {
    case 'h1':
      return <h1 className={classes}>{children}</h1>;
    case 'h2':
      return <h2 className={classes}>{children}</h2>;
    case 'h3':
      return <h3 className={classes}>{children}</h3>;
    case 'label':
      return <span className={classes}>{children}</span>;
    default:
      return <p className={classes}>{children}</p>;
  }
};
