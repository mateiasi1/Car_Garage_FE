import { FC, InputHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: FC<InputProps> = ({ label, type = 'text', error, fullWidth = true, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={clsx(fullWidth && 'w-full', 'mb-4')}>
      {label && <label className="block text-text text-sm font-semibold font-body mb-2">{label}</label>}

      <div className="relative">
        <input
          {...props}
          type={actualType}
          className={clsx(
            'w-full px-4 py-2 rounded-2xl border bg-white font-body shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            error ? 'border-error focus:ring-error' : 'border-gray-300 focus:border-primary',
            className
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
