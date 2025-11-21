import { FC, InputHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

export const Input: FC<InputProps> = ({
  label,
  type = 'text',
  error,
  fullWidth = true,
  className,
  wrapperClassName,
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={clsx(fullWidth && 'w-full', 'mb-4', wrapperClassName)}>
      {label && (
        <label className={clsx('block text-sm font-semibold font-body mb-2', disabled ? 'text-text/40' : 'text-text')}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          type={actualType}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 rounded-2xl border bg-card font-body shadow-sm',
            'focus:outline-none focus:ring-2',
            disabled
              ? 'border-text/10 text-text/40 bg-background placeholder:text-text/30 cursor-not-allowed focus:ring-0'
              : 'border-text/20 text-text placeholder:text-text/50 focus:ring-primary',
            !disabled && error && 'border-error focus:ring-error text-error placeholder:text-error/70',
            className
          )}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
