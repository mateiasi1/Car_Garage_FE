import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Inspection } from '../../models/Inspection';

type InspectionsTableBodyProps = {
  inspections: Inspection[];
  isLoading: boolean;
  showScrollbarGutter?: boolean;
};

const InspectionsTableBody: FC<InspectionsTableBodyProps> = ({
  inspections,
  isLoading,
  showScrollbarGutter = false,
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

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading...</div>;
  if (!inspections.length) return <div className="py-8 text-center text-gray-400">No inspections found.</div>;

  return (
    <>
      {inspections.map((inspection, idx) => (
        <div
          key={inspection.id}
          className={`grid border-b border-gray-200 last:border-b-0 text-sm ${
            showScrollbarGutter ? 'grid-cols-7' : 'grid-cols-6'
          }`}
          style={showScrollbarGutter ? { gridTemplateColumns: `repeat(6, minmax(0, 1fr))` } : undefined}
        >
          <div className="py-2 px-4 text-left">{idx + 1}</div>
          <div className="py-2 px-4 text-left">
            {inspection.inspectedBy?.firstName} {inspection.inspectedBy?.lastName}
          </div>
          <div className="py-2 px-4 text-left">{inspection.car?.licensePlate}</div>
          <div className="py-2 px-4 text-left">
            {inspection.car?.customer?.firstName} {inspection.car?.customer?.lastName}
          </div>
          <div className="py-2 px-4 text-left">{formatDate(inspection.inspectedAt)}</div>
          <div className="py-2 px-4 text-left">{inspection.type}</div>
        </div>
      ))}
    </>
  );
};

export default InspectionsTableBody;
