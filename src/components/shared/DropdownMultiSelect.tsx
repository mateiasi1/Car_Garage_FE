import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

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
  error?: string;
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
  error,
}: DropdownMultiSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionId: string) => {
    const nextSelection = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];

    onSelectionChange(nextSelection);
  };

  const getDisplayText = () => {
    if (selectedIds.length === 0) return placeholder;
    if (selectedIds.length === 1) {
      const selectedOption = options.find((opt) => getOptionId(opt) === selectedIds[0]);
      return selectedOption ? getOptionLabel(selectedOption) : placeholder;
    }
    return selectedCountMessage(selectedIds.length);
  };

  const displayText = getDisplayText();
  const isPlaceholder = selectedIds.length === 0;

  return (
    <div className={`relative mb-6 ${className}`} ref={ref}>
      {label && <label className="block text-text text-sm font-semibold font-body mb-2">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-surface border border-border
          text-text font-body
          flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <span className={isPlaceholder ? 'text-muted' : ''}>{displayText || '—'}</span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2
            bg-surface rounded-lg border border-border
            max-h-60 overflow-y-auto z-[999]
          "
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm font-body text-muted">{emptyMessage}</div>
          ) : (
            options.map((option) => {
              const optionId = getOptionId(option);
              const checked = selectedIds.includes(optionId);

              return (
                <div
                  key={optionId}
                  className="
                    flex items-center gap-3 px-4 py-2
                    cursor-pointer font-body text-text
                    hover:bg-primary-light transition
                  "
                  onClick={() => handleToggle(optionId)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggle(optionId)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>{getOptionLabel(option)}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};

export default DropdownMultiSelect;
