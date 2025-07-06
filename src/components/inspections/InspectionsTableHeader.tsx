import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface InspectionsTableHeaderProps {
  showScrollbarGutter?: boolean;
}

const InspectionsTableHeader: FC<InspectionsTableHeaderProps> = ({ showScrollbarGutter = false }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`grid min-w-full border-b border-gray-200 font-semibold text-sm text-gray-700 flex-shrink-0 grid-cols-6 ${
        showScrollbarGutter ? 'pr-[16px]' : ''
      }`}
    >
      <div className="py-2 px-4 text-left">{t('number')}</div>
      <div className="py-2 px-4 text-left">{t('inspectedBy')}</div>
      <div className="py-2 px-4 text-left">{t('licensePlate')}</div>
      <div className="py-2 px-4 text-left">{t('customerName')}</div>
      <div className="py-2 px-4 text-left">{t('inspectionDate')}</div>
      <div className="py-2 px-4 text-left">{t('inspectionExpiresAt')}</div>
    </div>
  );
};

export default InspectionsTableHeader;
