import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

export interface AdministrationItemProps {
  icon: IconDefinition;
  name: string;
  link: string;
  isSelected?: boolean;
  onSelect: () => void;
}

export const AdministrationItem = ({ icon, name, isSelected, onSelect }: AdministrationItemProps) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center justify-center lg:justify-start gap-0 lg:gap-4 
        p-3 lg:p-4 rounded-lg cursor-pointer 
        min-w-[3rem] lg:min-w-0 lg:w-full
        border border-transparent transition-all duration-200 group
        ${isSelected ? 'bg-primary text-primary-text' : 'hover:bg-primary hover:text-primary-text'}
      `}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-xl ${isSelected ? 'text-primary-text' : 'text-primary group-hover:text-primary-text'}`}
      />
      <span
        className={`
        hidden lg:inline font-body text-lg 
        ${isSelected ? 'text-primary-text' : 'text-text group-hover:text-primary-text'}
      `}
      >
        {t(name)}
      </span>
    </div>
  );
};
