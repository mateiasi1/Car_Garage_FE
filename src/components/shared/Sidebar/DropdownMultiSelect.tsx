import { useState, useEffect, useRef } from 'react';

interface DropdownMultiSelectProps<T> {
    label: string;
    options: T[];
    selectedIds: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    getOptionId: (option: T) => string;
    getOptionLabel: (option: T) => string;
    placeholder: string;
    emptyMessage: string;
    selectedCountMessage: (count: number) => string;
    className?: string;
    disabled?: boolean;
}

const DropdownMultiSelect = <T,>({
     label,
     options,
     selectedIds,
     onSelectionChange,
     getOptionId,
     getOptionLabel,
     placeholder,
     emptyMessage,
     selectedCountMessage,
     className = '',
     disabled = false,
}: DropdownMultiSelectProps<T>) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (optionId: string) => {
        const newSelection = selectedIds.includes(optionId)
            ? selectedIds.filter((id) => id !== optionId)
            : [...selectedIds, optionId];

        onSelectionChange(newSelection);
    };

    const getDisplayText = () => {
        if (selectedIds.length === 0) return placeholder;
        if (selectedIds.length === 1) {
            const selectedOption = options.find(opt => getOptionId(opt) === selectedIds[0]);
            return selectedOption ? getOptionLabel(selectedOption) : placeholder;
        }
        return selectedCountMessage(selectedIds.length);
    };

    const inputBaseClass =
        'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <label className="block font-semibold mb-1">{label}</label>
            <button
                type="button"
                onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
                disabled={disabled}
                className={`${inputBaseClass} flex items-center justify-between bg-white ${
                    disabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
            >
                <span className={selectedIds.length === 0 ? 'text-gray-400' : ''}>
                    {getDisplayText()}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.length === 0 ? (
                        <div className="p-3 text-gray-500 text-sm">{emptyMessage}</div>
                    ) : (
                        <div className="py-1">
                            {options.map((option) => {
                                const optionId = getOptionId(option);
                                return (
                                    <label
                                        key={optionId}
                                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(optionId)}
                                            onChange={() => handleToggle(optionId)}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="ml-2 text-sm">{getOptionLabel(option)}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownMultiSelect;