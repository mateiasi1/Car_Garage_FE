import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    'rounded-lg font-heading font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-text hover:bg-primary-hover disabled:bg-primary-disabled',
    secondary: 'bg-card text-text border border-text/10 hover:bg-background',
    danger: 'bg-error text-primary-text hover:bg-error/90',
    warning: 'bg-warning text-text hover:bg-warning/90',
    ghost: 'bg-transparent text-primary-text hover:bg-card/60',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-primary-text border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
