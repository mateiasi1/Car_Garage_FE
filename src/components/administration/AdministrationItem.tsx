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
      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer w-full
                 border border-transparent transition-all duration-200 group
                 ${
                   isSelected
                     ? 'bg-primary-hover text-white'
                     : 'hover:bg-primary-hover hover:border-primary hover:text-white'
                 }`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-xl ${isSelected ? 'text-white' : 'text-primary group-hover:text-white'}`}
      />
      <span className={`font-body text-lg ${isSelected ? 'text-white' : 'text-text group-hover:text-white'}`}>
        {t(name)}
      </span>
    </div>
  );
};
