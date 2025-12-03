import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export interface AdministrationItemProps {
  icon: LucideIcon;
  name: string;
  link: string;
  isSelected?: boolean;
  onSelect: () => void;
}

export const AdministrationItem: FC<AdministrationItemProps> = ({ icon: Icon, name, isSelected, onSelect }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'group relative flex items-center justify-center lg:justify-start gap-3',
        'rounded-lg',
        'h-12 lg:h-11',
        'px-2 lg:px-3',
        'w-auto lg:w-full',
        'transition-all duration-200',
        !isSelected && 'bg-transparent hover:bg-primary-light',
        isSelected && 'bg-primary-light'
      )}
    >
      {/* Left indicator for selected state on desktop */}
      {isSelected && (
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
      )}

      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-lg w-10 h-10 lg:w-8 lg:h-8 flex-shrink-0',
          'transition-colors duration-200',
          !isSelected && 'bg-primary/10 group-hover:bg-primary/15',
          isSelected && 'bg-primary'
        )}
      >
        <Icon
          className={clsx(
            'w-5 h-5 lg:w-4 lg:h-4 transition-colors duration-200',
            !isSelected && 'text-primary',
            isSelected && 'text-primary-text'
          )}
        />
      </span>

      <span
        className={clsx(
          'hidden lg:inline truncate whitespace-nowrap text-sm font-body font-medium',
          'transition-colors duration-200',
          !isSelected && 'text-text',
          isSelected && 'text-primary'
        )}
      >
        {t(name)}
      </span>
    </button>
  );
};
