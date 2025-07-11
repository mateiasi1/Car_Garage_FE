import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Inspection } from '../../models/Inspection';
import { InspectionType } from '../../utils/enums/InspectionTypes';

type InspectionsTableBodyProps = {
  inspections: Inspection[];
  isLoading: boolean;
  showScrollbarGutter?: boolean;
  page: number;
};

const InspectionsTableBody: FC<InspectionsTableBodyProps> = ({
  inspections,
  isLoading,
  showScrollbarGutter = false,
  page,
}) => {
  const { i18n } = useTranslation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString(i18n.language, { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const expiresAt = (dateStr: string, inspectionType: string) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);

    switch (inspectionType) {
      case InspectionType.halfYear:
        date.setMonth(date.getMonth() + 6);
        break;
      case InspectionType.oneYear:
        date.setFullYear(date.getFullYear() + 1);
        break;
      case InspectionType.twoYears:
        date.setFullYear(date.getFullYear() + 2);
        break;
      default:
        break;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString(i18n.language, { month: 'short' }).replace('.', '');
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getExpirationColor = (dateStr: string, inspectionType: string): string => {
    if (!dateStr) return '';

    const now = new Date();
    const expiry = new Date(dateStr);

    switch (inspectionType) {
      case InspectionType.halfYear:
        expiry.setMonth(expiry.getMonth() + 6);
        break;
      case InspectionType.oneYear:
        expiry.setFullYear(expiry.getFullYear() + 1);
        break;
      case InspectionType.twoYears:
        expiry.setFullYear(expiry.getFullYear() + 2);
        break;
      default:
        break;
    }

    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'text-error';
    if (diffDays < 7) return 'text-orange';
    return '';
  };

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading...</div>;
  if (!inspections.length) return <div className="py-8 text-center text-gray-400">No inspections found.</div>;

  return (
    <>
      {inspections.map((inspection, idx) => (
        <div
          key={inspection.id}
          className={`grid border-b border-gray-200 last:border-b-0 text-sm hover:cursor-pointer hover:bg-gray-200 ${
            showScrollbarGutter ? 'grid-cols-7' : 'grid-cols-6'
          }`}
          style={showScrollbarGutter ? { gridTemplateColumns: `repeat(6, minmax(0, 1fr))` } : undefined}
        >
          <div className="py-2 px-4 text-left">{(page - 1) * 25 + (idx + 1)}</div>
          <div className="py-2 px-4 text-left">
            {inspection.inspectedBy?.firstName} {inspection.inspectedBy?.lastName}
          </div>
          <div className="py-2 px-4 text-left">{inspection.car?.licensePlate}</div>
          <div className="py-2 px-4 text-left">
            {inspection.car?.customer?.firstName} {inspection.car?.customer?.lastName}
          </div>
          <div className="py-2 px-4 text-left">{formatDate(inspection.inspectedAt)}</div>
          <div className={`py-2 px-4 text-left ${getExpirationColor(inspection.inspectedAt, inspection.type)}`}>
            {expiresAt(inspection.inspectedAt, inspection.type)}
          </div>
        </div>
      ))}
    </>
  );
};

export default InspectionsTableBody;
