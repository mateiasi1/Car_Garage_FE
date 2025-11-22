import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../shared/Button';

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
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={clsx(
        'group flex items-center justify-center lg:justify-start gap-3',
        'rounded-full lg:rounded-2xl',
        'h-14 lg:h-14',
        'px-1 lg:px-4',
        'w-auto lg:w-full',
        'transition-colors duration-200',
        // desktop hover
        'hover:bg-transparent hover:text-text',
        !isSelected && 'bg-transparent text-text lg:hover:bg-primary lg:hover:text-primary-text',
        isSelected &&
          'bg-transparent text-text lg:bg-primary lg:text-primary-text lg:hover:bg-primary lg:hover:text-primary-text'
      )}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full w-12 h-12 flex-shrink-0',
          'transition-colors duration-200',
          // neselctat – exact ca înainte
          !isSelected && 'bg-primary/5 group-hover:bg-primary/20',
          // selectat – pe mobil cerc plin cu icon alb, pe desktop rămâne stilul vechi
          isSelected && 'bg-primary text-primary-text shadow-md lg:bg-primary-text/15 lg:shadow-none'
        )}
      >
        <Icon
          className={clsx(
            'w-5 h-5 transition-colors duration-200',
            !isSelected && 'text-primary group-hover:text-primary-text',
            // pe mobil icon alb în cercul plin, pe desktop rămâne albastru în cerc deschis
            isSelected && 'text-primary-text lg:text-primary'
          )}
        />
      </span>

      <span
        className={clsx(
          'hidden lg:inline truncate whitespace-nowrap text-sm font-body',
          'transition-colors duration-200',
          !isSelected && 'text-text group-hover:text-primary-text',
          isSelected && 'text-primary-text'
        )}
      >
        {t(name)}
      </span>
    </Button>
  );
};
