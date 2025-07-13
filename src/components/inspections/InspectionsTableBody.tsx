import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Inspection } from '../../models/Inspection';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { showToast } from '../../utils/showToast';
import { setSelectedInspection } from '../../slices/inspectionSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';

type InspectionsTableBodyProps = {
  inspections: Inspection[];
  isLoading: boolean;
  page: number;
};

const InspectionsTableBody: FC<InspectionsTableBodyProps> = ({ inspections, isLoading, page }) => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleMessageClick = () => {
    showToast('Should send SMS when implemented', 'info');
  };

  const handleEditClick = (inspection: Inspection) => {
    dispatch(setSelectedInspection(inspection));
    navigate('/add-inspection');
  };

  const handleDeleteClick = (id: string) => {
    console.log('Delete', id);
  };

  if (isLoading) return <div className="py-8 text-center text-gray-400">Loading...</div>;
  if (!inspections.length) return <div className="py-8 text-center text-gray-400">No inspections found.</div>;

  return (
    <>
      {inspections.map((inspection, idx) => (
        <div
          key={inspection.id}
          className={`group grid border-b border-gray-200 last:border-b-0 text-sm hover:cursor-pointer hover:bg-gray-200 ${
            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }`}
          style={{ gridTemplateColumns: '150px 2fr 2fr 2fr 2fr 2fr 100px' }}
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
          <div className="py-2 px-4 text-left flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <FontAwesomeIcon
              icon={faMessage}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={handleMessageClick}
            />
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => handleEditClick(inspection)}
            />
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => handleDeleteClick(inspection.id)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default InspectionsTableBody;
