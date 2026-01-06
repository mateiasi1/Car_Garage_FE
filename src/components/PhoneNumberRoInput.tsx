import React, { FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import flagRo from '../assets/images/flag-ro.png';

interface PhoneNumberRoInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  isRequired?: boolean;
}

export const PhoneNumberRoInput: FC<PhoneNumberRoInputProps> = ({
  value,
  onChange,
  label,
  error,
  isRequired,
  placeholder = '712345678',
}) => {
  // Extract local part, handling various formats
  let localPart = value;
  if (localPart.startsWith('+40')) {
    localPart = localPart.slice(3);
  } else if (localPart.startsWith('0040')) {
    localPart = localPart.slice(4);
  } else if (localPart.startsWith('40') && localPart.length > 2) {
    // Only remove '40' prefix if followed by valid Romanian number (7xx)
    const afterPrefix = localPart.slice(2);
    if (afterPrefix.startsWith('7')) {
      localPart = afterPrefix;
    }
  }
  // Remove leading 0 if present (Romanian numbers start with 7)
  if (localPart.startsWith('0') && localPart.length > 1) {
    localPart = localPart.slice(1);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Only digits

    // Remove leading 0 if present
    if (inputValue.startsWith('0') && inputValue.length > 1) {
      inputValue = inputValue.slice(1);
    }

    // Limit to 9 digits
    const onlyDigits = inputValue.slice(0, 9);
    const fullValue = onlyDigits ? `+40${onlyDigits}` : '';
    onChange(fullValue);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-text text-sm font-semibold font-body mb-2">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

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
          className="flex-1 outline-none border-0 bg-transparent text-text text-sm sm:text-base placeholder:text-muted/50"
          placeholder={placeholder}
        />
      </div>

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
