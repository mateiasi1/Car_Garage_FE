import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  isRequired?: boolean;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  searchable = false,
  placeholder = '—',
  disabled = false,
  wrapperClassName = '',
  isRequired = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, searchable]);

  const selectedLabel = options.find((o) => o.value.toString() === value)?.label ?? '';

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lowerSearch));
  }, [options, search]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div className={`relative mb-6 ${wrapperClassName}`} ref={ref}>
      {label && (
        <label className="block text-text text-sm font-semibold font-body mb-2">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg bg-surface
          border border-border
          text-text
          font-body flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors
          ${disabled ? 'opacity-60 cursor-not-allowed bg-background' : 'cursor-pointer'}
        `}
      >
        <span className={`truncate ${selectedLabel ? '' : 'text-muted'}`}>{selectedLabel || placeholder}</span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <X className="w-4 h-4 text-muted hover:text-text transition-colors" onClick={handleClear} />
          )}
          <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2
            bg-surface rounded-lg border border-border
            z-[999] shadow-lg
          "
        >
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Caută..."
                  className="
                    w-full pl-9 pr-3 py-2 rounded-md
                    bg-background border border-border
                    text-text text-sm font-body
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    placeholder:text-muted
                  "
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-muted text-sm font-body text-center">Nicio opțiune găsită</div>
            ) : (
              filteredOptions.map((opt) => {
                const isActive = opt.value.toString() === value;

                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value.toString())}
                    className={`
                      px-4 py-2 cursor-pointer font-body text-text
                      hover:bg-primary-light transition
                      ${isActive ? 'bg-primary-light font-semibold' : ''}
                    `}
                  >
                    {opt.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
