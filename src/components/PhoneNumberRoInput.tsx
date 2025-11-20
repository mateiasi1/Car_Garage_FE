import React, { FC } from 'react';
import flagRo from '../assets/images/flag-ro.png';

interface PhoneNumberRoInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const PhoneNumberRoInput: FC<PhoneNumberRoInputProps> = ({
    value,
    onChange,
    className = '',
}) => {
    const localPart = value.startsWith('+40') ? value.slice(3) : value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
        const fullValue = onlyDigits ? `+40${onlyDigits}` : '';
        onChange(fullValue);
    };

    return (
        <div
            className={`flex items-center border rounded-md px-3 py-2 bg-white
                  focus-within:ring-2 focus-within:ring-primary
                  focus-within:border-primary border-gray-300 ${className}`}
        >
            <img
                src={flagRo}
                alt="Romania flag"
                className="w-5 h-5 mr-2 rounded-sm object-cover"
            />
            <span className="mr-2 text-sm text-gray-700 font-medium">+40</span>
            <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={localPart}
                onChange={handleChange}
                className="flex-1 outline-none border-0 bg-transparent text-gray-900"
                placeholder="712345678"
            />
        </div>
    );
};
