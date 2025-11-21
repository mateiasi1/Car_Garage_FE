// src/components/shared/IconButton.tsx
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';

type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'dangerGhost' | 'ghost';
type IconButtonSize = 'sm' | 'md';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: 'full' | 'xl';
  children: ReactNode;
}

export const IconButton: FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  rounded = 'full',
  className,
  disabled,
  children,
  ...props
}) => {
  const base = 'flex items-center justify-center transition-all duration-200 active:scale-[0.97]';

  const variantClasses: Record<IconButtonVariant, string> = {
    primary: 'bg-primary text-primary-text hover:bg-primary-hover',
    secondary: 'bg-card text-text border border-text/10 hover:bg-background',
    danger: 'bg-error text-primary-text hover:bg-error/90',
    dangerGhost: 'bg-transparent text-error hover:bg-error/10 hover:text-error', // 👈 icon roșu, bg transparent
    ghost: 'bg-transparent text-primary-text hover:bg-card/40',
  };

  const sizeClasses: Record<IconButtonSize, string> = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
  };

  const roundedClasses = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';

  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        base,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses,
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};
