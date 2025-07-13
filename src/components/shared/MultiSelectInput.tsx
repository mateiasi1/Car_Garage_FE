import { useEffect, useRef, useState } from 'react';

type MultiSelectOption<T> = {
  label: string;
  value: T;
};

interface MultiSelectProps<T> {
  options: MultiSelectOption<T>[];
  selectedValues: T[];
  setSelectedValues: React.Dispatch<React.SetStateAction<T[]>>;
  placeholder?: string;
  label?: string;
}

function MultiSelect<T extends string | number>({
  options,
  selectedValues,
  setSelectedValues,
  placeholder,
  label,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: T) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ');

  return (
    <div className="relative w-full" ref={ref}>
      {label && <label className="block font-semibold mb-1">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {selectedValues.length > 0 ? selectedLabels : placeholder}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border border-gray-300 shadow-md">
          {options.map((option) => (
            <label
              key={String(option.value)}
              className="flex items-center px-4 py-2 hover:bg-primary-hover hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => toggleValue(option.value)}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
