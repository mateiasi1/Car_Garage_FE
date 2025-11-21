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
      variant={isSelected ? 'primary' : 'ghost'}
      fullWidth
      onClick={onSelect}
      className={clsx(
        'group flex items-center lg:justify-start justify-center gap-3 rounded-2xl px-4 h-14 transition-all duration-200',
        !isSelected && 'bg-transparent text-text hover:bg-primary hover:text-primary-text',
        isSelected && 'text-primary-text'
      )}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0',
          isSelected ? 'bg-primary-text/15' : 'bg-primary/5 group-hover:bg-primary/20'
        )}
      >
        <Icon
          className={clsx('w-4 h-4', isSelected ? 'text-primary-text' : 'text-primary group-hover:text-primary-text')}
        />
      </span>

      <span
        className={clsx(
          'hidden lg:inline truncate whitespace-nowrap text-sm font-body',
          isSelected ? 'text-primary-text' : 'text-text group-hover:text-primary-text'
        )}
      >
        {t(name)}
      </span>
    </Button>
  );
};
