import { faMessage, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { Inspection } from '../../models/Inspection';
import { useDeleteInspectionMutation } from '../../rtk/services/inspections-service';
import { setSelectedInspection } from '../../slices/inspectionSlice';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { useSendInspectionReminderMutation } from '../../rtk/services/sms-service.tsx';

type InspectionsTableBodyProps = {
  inspections: Inspection[];
  isLoading: boolean;
  page: number;
};

const InspectionsTableBody: FC<InspectionsTableBodyProps> = ({ inspections, isLoading, page }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteInspection] = useDeleteInspectionMutation();
  const [sendReminder] = useSendInspectionReminderMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);

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

  const handleMessageClick = async (inspectionId: string): Promise<void> => {
      try {
          const response = await sendReminder(inspectionId).unwrap();

          showToast(
              `SMS reminder sent successfully to ${response.data.customerName}`,
              'success'
          );
      } catch (error) {
          showToast(t('unknownError'), 'error');
      }
  };

  const handleEditClick = (inspection: Inspection) => {
    dispatch(setSelectedInspection(inspection));
    navigate('/add-inspection');
  };

  const handleDeleteClick = (inspection: Inspection) => {
    dispatch(setSelectedInspection(inspection));
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInspection) return;

    try {
      await deleteInspection(selectedInspection.id).unwrap();
      showToast(t('inspectionDeleted'), 'success');
    } catch (error) {
      showToast(t('inspectionDeletedError'), 'error');
    } finally {
      handleDeleteCancel();
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedInspection(null);
  };

  if (isLoading) return <div className="py-8 text-center text-gray-400">{t('loading')}</div>;
  if (!inspections.length) return <div className="py-8 text-center text-gray-400">{t('noInspectionsFound')}</div>;

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
              onClick={() => handleMessageClick(inspection.id)}
            />
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => handleEditClick(inspection)}
            />
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => handleDeleteClick(inspection)}
            />
          </div>
        </div>
      ))}

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t('areYouSure')}
        message={t('areYouSureDeleteInspection')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default InspectionsTableBody;
