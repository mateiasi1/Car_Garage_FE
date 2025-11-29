import React, { FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import flagRo from '../assets/images/flag-ro.png';

interface PhoneNumberRoInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

export const PhoneNumberRoInput: FC<PhoneNumberRoInputProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder = '712345678',
}) => {
  const localPart = value.startsWith('+40') ? value.slice(3) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
    const fullValue = onlyDigits ? `+40${onlyDigits}` : '';
    onChange(fullValue);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-text text-sm font-semibold font-body mb-2">{label}</label>}

      <div
        className={`
          w-full flex items-center
          rounded-lg border bg-surface font-body
          px-4 py-3
          focus-within:outline-none focus-within:ring-2 focus-within:ring-primary
          ${error ? 'border-error focus-within:ring-error' : 'border-border focus-within:border-primary'}
        `}
      >
        <img src={flagRo} alt="RO" className="w-5 h-5 mr-2 rounded-sm object-cover" />
        <span className="mr-2 text-sm text-muted font-medium">+40</span>

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localPart}
          onChange={handleChange}
          className="flex-1 outline-none border-0 bg-transparent text-text text-sm sm:text-base placeholder:text-muted"
          placeholder={placeholder}
        />
      </div>

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
