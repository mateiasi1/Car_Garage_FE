import { FC, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

export const CustomTextarea: FC<TextareaProps> = ({
  label,
  error,
  fullWidth = true,
  className,
  wrapperClassName,
  disabled,
  ...props
}) => {
  return (
    <div className={clsx(fullWidth && 'w-full', 'mb-4', wrapperClassName)}>
      {label && (
        <label className={clsx('block text-sm font-semibold font-body mb-2', disabled ? 'text-text/40' : 'text-text')}>
          {label}
        </label>
      )}

      <textarea
        {...props}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-3 rounded-lg border font-body resize-none',
          'focus:outline-none focus:ring-2',
          disabled
            ? 'border-border/50 text-muted/70 bg-background cursor-not-allowed focus:ring-0 opacity-60'
            : 'border-border text-text bg-surface placeholder:text-muted/50 focus:ring-primary focus:border-primary',
          !disabled && error && 'border-error focus:ring-error text-error placeholder:text-error/70',
          className
        )}
      />

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
