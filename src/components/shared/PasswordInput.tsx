import { FC, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface PasswordInputProps {
  name: string;
  label: string;
  value: string;
  showPassword: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  name,
  label,
  value,
  showPassword,
  onChange,
  onToggleVisibility,
}) => {
  const inputBaseClass =
    'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputBaseClass} pr-10`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
