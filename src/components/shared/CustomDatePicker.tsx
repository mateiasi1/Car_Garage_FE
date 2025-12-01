import { FC, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface CustomDatePickerProps {
  label?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const CustomDatePicker: FC<CustomDatePickerProps> = ({
  label,
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder,
  error,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected || new Date());
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const DAYS = [
    t('datePicker.days.mon'),
    t('datePicker.days.tue'),
    t('datePicker.days.wed'),
    t('datePicker.days.thu'),
    t('datePicker.days.fri'),
    t('datePicker.days.sat'),
    t('datePicker.days.sun'),
  ];

  const MONTHS = [
    t('datePicker.months.january'),
    t('datePicker.months.february'),
    t('datePicker.months.march'),
    t('datePicker.months.april'),
    t('datePicker.months.may'),
    t('datePicker.months.june'),
    t('datePicker.months.july'),
    t('datePicker.months.august'),
    t('datePicker.months.september'),
    t('datePicker.months.october'),
    t('datePicker.months.november'),
    t('datePicker.months.december'),
  ];

  // Generate year range (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowMonthSelect(false);
        setShowYearSelect(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view date when selected changes
  useEffect(() => {
    if (selected) {
      setViewDate(selected);
    }
  }, [selected]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (date > max) return true;
    }
    return false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setShowMonthSelect(false);
  };

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setShowYearSelect(false);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = MONTHS[date.getMonth()].slice(0, 3);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const days = getDaysInMonth(viewDate);

  return (
    <div className="mb-4 w-full relative" ref={containerRef}>
      {label && (
        <label className={clsx('block text-sm font-semibold font-body mb-2', disabled ? 'text-text/40' : 'text-text')}>
          {label}
        </label>
      )}

      {/* Input Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-3 rounded-2xl border bg-card font-body shadow-sm',
          'flex items-center justify-between gap-2',
          'focus:outline-none focus:ring-2 transition-colors',
          disabled
            ? 'border-text/10 text-text/40 bg-background cursor-not-allowed'
            : 'border-text/20 text-text hover:border-text/30 focus:ring-primary',
          error && !disabled && 'border-error focus:ring-error'
        )}
      >
        <span className={selected ? 'text-text' : 'text-text/50'}>
          {selected ? formatDate(selected) : placeholder || t('datePicker.selectDate')}
        </span>
        <Calendar className="w-5 h-5 text-text/50" />
      </button>

      {/* Calendar Dropdown - Opens Upward */}
      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 bg-card rounded-xl shadow-2xl border border-text/10 z-[999] overflow-hidden">
          {/* Header with Month/Year Selectors */}
          <div className="flex items-center justify-between px-2 py-2 bg-background/60 border-b border-text/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-card transition-colors text-text/60 hover:text-text"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {/* Month Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthSelect(!showMonthSelect);
                    setShowYearSelect(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-card transition-colors text-sm font-medium text-text"
                >
                  {MONTHS[viewDate.getMonth()].slice(0, 3)}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showMonthSelect && (
                  <div className="absolute top-full left-0 mt-1 bg-card rounded-lg shadow-lg border border-text/10 z-10 max-h-40 overflow-y-auto">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className={clsx(
                          'block w-full px-3 py-1.5 text-left text-sm hover:bg-background transition-colors',
                          viewDate.getMonth() === index ? 'bg-primary/10 text-primary font-medium' : 'text-text'
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearSelect(!showYearSelect);
                    setShowMonthSelect(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-card transition-colors text-sm font-medium text-text"
                >
                  {viewDate.getFullYear()}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showYearSelect && (
                  <div className="absolute top-full right-0 mt-1 bg-card rounded-lg shadow-lg border border-text/10 z-10 max-h-40 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={clsx(
                          'block w-full px-3 py-1.5 text-left text-sm hover:bg-background transition-colors',
                          viewDate.getFullYear() === year ? 'bg-primary/10 text-primary font-medium' : 'text-text'
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-card transition-colors text-text/60 hover:text-text"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 px-2 pt-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-text/50 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid - Compact */}
          <div className="grid grid-cols-7 gap-0.5 p-2">
            {days.map((date, index) => (
              <div key={index}>
                {date ? (
                  <button
                    type="button"
                    onClick={() => !isDateDisabled(date) && handleSelectDate(date)}
                    disabled={isDateDisabled(date)}
                    className={clsx(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-all mx-auto',
                      'flex items-center justify-center',
                      isDateDisabled(date) ? 'text-text/20 cursor-not-allowed' : 'hover:bg-background cursor-pointer',
                      isSelected(date) && 'bg-primary text-primary-text hover:bg-primary-hover',
                      isToday(date) && !isSelected(date) && 'ring-1 ring-primary ring-inset',
                      !isSelected(date) && !isDateDisabled(date) && 'text-text'
                    )}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>

          {/* Footer - Compact */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-text/10 bg-background/40">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="text-xs text-text/60 hover:text-text transition-colors"
            >
              {t('datePicker.clear')}
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  handleSelectDate(today);
                }
              }}
              disabled={minDate && new Date() < minDate}
              className={clsx(
                'text-xs font-medium transition-colors',
                minDate && new Date() < minDate
                  ? 'text-text/30 cursor-not-allowed'
                  : 'text-primary hover:text-primary-hover'
              )}
            >
              {t('datePicker.today')}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-error text-sm mt-1 font-body">{error}</p>}
    </div>
  );
};
