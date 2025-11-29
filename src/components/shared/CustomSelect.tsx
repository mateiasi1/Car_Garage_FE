import { FC, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
}

export const CustomSelect: FC<CustomSelectProps> = ({ label, value, onChange, options, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value.toString() === value)?.label ?? '';

  return (
    <div className="relative mb-6" ref={ref}>
      {label && <label className="block text-text text-sm font-semibold font-body mb-2">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full px-4 py-3 rounded-lg bg-surface
          border border-border
          text-text
          font-body flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors
        "
      >
        <span className={selectedLabel ? '' : 'text-muted'}>{selectedLabel || '—'}</span>
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
          {options.map((opt) => {
            const isActive = opt.value.toString() === value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value.toString());
                  setOpen(false);
                }}
                className={`
                  px-4 py-2 cursor-pointer font-body text-text
                  hover:bg-primary-light transition
                  ${isActive ? 'bg-primary-light font-semibold' : ''}
                `}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
