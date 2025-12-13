import { FC, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const CustomCheckbox: FC<CheckboxProps> = ({
  label,
  error,
  className,
  wrapperClassName,
  disabled,
  checked,
  ...props
}) => {
  return (
    <div className={clsx('flex flex-col', wrapperClassName)}>
      <label
        className={clsx(
          'flex items-center gap-3 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="relative">
          <input
            {...props}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className={clsx(
              'peer appearance-none w-5 h-5 rounded border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50',
              disabled
                ? 'border-border/50 bg-background cursor-not-allowed'
                : checked
                  ? 'border-primary bg-primary'
                  : 'border-border bg-surface hover:border-primary/70',
              error && 'border-error',
              className
            )}
          />
          <Check
            className={clsx(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-opacity duration-200',
              checked ? 'opacity-100 text-white' : 'opacity-0'
            )}
            strokeWidth={3}
          />
        </div>

        {label && (
          <span className={clsx('text-sm font-body', disabled ? 'text-text/40' : 'text-text', error && 'text-error')}>
            {label}
          </span>
        )}
      </label>

      {error && <p className="text-error text-sm mt-1 font-body ml-8">{error}</p>}
    </div>
  );
};
