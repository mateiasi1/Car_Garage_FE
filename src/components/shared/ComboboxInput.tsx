import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, Search, X, Loader2 } from 'lucide-react';

interface ComboboxInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allowCustom?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  wrapperClassName?: string;
}

export const ComboboxInput: FC<ComboboxInputProps> = ({
  label,
  value,
  onChange,
  options,
  allowCustom = false,
  error,
  placeholder = '—',
  disabled = false,
  loading = false,
  wrapperClassName = '',
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
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(lowerSearch));
  }, [options, search]);

  const isValueInOptions = options.includes(value);
  const isCustomValue = value && !isValueInOptions;

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

  const handleAddCustom = () => {
    if (search.trim()) {
      onChange(search.trim());
      setOpen(false);
      setSearch('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustom && search.trim() && filteredOptions.length === 0) {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className={`relative mb-6 ${wrapperClassName}`} ref={ref}>
      {label && (
        <label className="block text-text text-sm font-semibold font-body mb-2">
          {label} {!allowCustom && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && !loading && setOpen((prev) => !prev)}
        disabled={disabled || loading}
        className={`
          w-full px-4 py-3 rounded-lg bg-surface
          border border-border
          text-text
          font-body flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors
          ${disabled || loading ? 'opacity-60 cursor-not-allowed bg-background' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2 truncate">
          <span className={`truncate ${value ? '' : 'text-muted'}`}>{value || placeholder}</span>
          {isCustomValue && allowCustom && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
              Custom
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {loading && <Loader2 className="w-4 h-4 text-muted animate-spin" />}
          {value && !disabled && !loading && (
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
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={allowCustom ? 'Search or type custom...' : 'Search...'}
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

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3">
                {allowCustom && search.trim() ? (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="
                      w-full text-left px-3 py-2 rounded-md
                      bg-primary-light hover:bg-primary/20
                      text-text font-body
                      transition-colors
                    "
                  >
                    <span className="font-semibold">Add custom:</span> "{search.trim()}"
                  </button>
                ) : (
                  <div className="text-muted text-sm font-body text-center">No options found</div>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isActive = opt === value;

                return (
                  <div
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`
                      px-4 py-2 cursor-pointer font-body text-text
                      hover:bg-primary-light transition
                      ${isActive ? 'bg-primary-light font-semibold' : ''}
                    `}
                  >
                    {opt}
                  </div>
                );
              })
            )}
          </div>

          {allowCustom && search.trim() && filteredOptions.length > 0 && (
            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={handleAddCustom}
                className="
                  w-full text-left px-3 py-2 rounded-md
                  bg-background hover:bg-primary-light
                  text-text font-body text-sm
                  transition-colors
                "
              >
                <span className="font-semibold">Or add custom:</span> "{search.trim()}"
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
