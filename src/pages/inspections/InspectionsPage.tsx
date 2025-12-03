import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, MessageCircle, Pencil, Trash2 } from 'lucide-react';

import GenericTable, { TableAction, TableColumn } from '../../components/shared/GenericTable';
import {
  InspectionsFilters as ApiFilters,
  useFetchInspectionsQuery,
  useDeleteInspectionMutation,
} from '../../rtk/services/inspections-service';
import { useSendInspectionReminderMutation } from '../../rtk/services/sms-service';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useDemo } from '../../hooks/useDemo';
import { setSelectedInspection } from '../../slices/inspectionSlice';
import { Inspection } from '../../models/Inspection';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../../components/shared/ConfirmationModal';
import { Button } from '../../components/shared/Button';
import { routes } from '../../constants/routes';
import { PageHeader } from '../../components/shared/PageHeader';

const InspectionsPage: FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDemo } = useDemo();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ApiFilters>({
    page: 1,
    licensePlate: '',
    inspectionType: '',
    customerName: '',
    inspectorName: '',
  });

  const { data, isLoading } = useFetchInspectionsQuery(filters);
  const inspections = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteInspection] = useDeleteInspectionMutation();
  const [sendReminder] = useSendInspectionReminderMutation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString(i18n.language, { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getExpiryDate = (dateStr: string, inspectionType: string) => {
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

    return formatDate(date.toISOString());
  };

  const getExpirationColorClass = (dateStr: string, inspectionType: string): string => {
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

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleMessageClick = async (inspection: Inspection) => {
    try {
      const response = await sendReminder(inspection.id).unwrap();
      showToast(`SMS reminder sent successfully to ${response.data.customerName}`, 'success');
    } catch {
      showToast(t('unknownError'), 'error');
    }
  };

  const handleEditClick = (inspection: Inspection) => {
    dispatch(setSelectedInspection(inspection));
    navigate(routes.ADD_INSPECTION);
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
    } catch {
      showToast(t('inspectionDeletedError'), 'error');
    } finally {
      setIsDeleteModalOpen(false);
      dispatch(setSelectedInspection(null));
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    dispatch(setSelectedInspection(null));
  };

  const columns: TableColumn<Inspection>[] = [
    {
      key: 'inspectedBy',
      label: t('inspectedBy'),
      width: '2fr',
      render: (inspection) =>
        `${inspection.inspectedBy?.firstName ?? ''} ${inspection.inspectedBy?.lastName ?? ''}`.trim(),
      getSearchValue: (inspection) =>
        `${inspection.inspectedBy?.firstName ?? ''} ${inspection.inspectedBy?.lastName ?? ''}`.trim(),
      searchable: true,
    },
    {
      key: 'licensePlate',
      label: t('licensePlate'),
      width: '2fr',
      render: (inspection) => (
        <span className="flex items-center gap-2">
          {inspection.car?.licensePlate ?? ''}
          {inspection.deletedAt && (
            <span className="text-xs bg-border text-muted px-2 py-0.5 rounded-full">{t('archived')}</span>
          )}
        </span>
      ),
      getSearchValue: (inspection) => inspection.car?.licensePlate ?? '',
      searchable: true,
    },
    {
      key: 'customerName',
      label: t('customerName'),
      width: '2fr',
      render: (inspection) =>
        `${inspection.car?.customer?.firstName ?? ''} ${inspection.car?.customer?.lastName ?? ''}`.trim(),
      getSearchValue: (inspection) =>
        `${inspection.car?.customer?.firstName ?? ''} ${inspection.car?.customer?.lastName ?? ''}`.trim(),
      searchable: true,
    },
    {
      key: 'inspectedAt',
      label: t('inspectionDate'),
      width: '2fr',
      render: (inspection) => formatDate(inspection.inspectedAt),
      getSearchValue: (inspection) => formatDate(inspection.inspectedAt),
    },
    {
      key: 'inspectionExpiresAt',
      label: t('inspectionExpiresAt'),
      width: '2fr',
      render: (inspection) => (
        <span className={`font-body ${getExpirationColorClass(inspection.inspectedAt, inspection.type)}`}>
          {getExpiryDate(inspection.inspectedAt, inspection.type)}
        </span>
      ),
      getSearchValue: (inspection) => getExpiryDate(inspection.inspectedAt, inspection.type),
    },
  ];

  const actions: TableAction<Inspection>[] = [
    {
      icon: <MessageCircle className={`w-5 h-5 ${isDemo ? 'text-muted' : 'text-green-600 hover:text-green-700'}`} />,
      label: t('sendReminder'),
      onClick: handleMessageClick,
      isDisabled: (inspection) => isDemo || !!inspection.deletedAt,
    },
    {
      icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('edit'),
      onClick: handleEditClick,
      isDisabled: (inspection) => !!inspection.deletedAt,
    },
    {
      icon: <Trash2 className="w-5 h-5 text-error hover:text-red-700" />,
      label: t('delete'),
      onClick: handleDeleteClick,
      isDisabled: (inspection) => !!inspection.deletedAt,
    },
  ];

  const toolbarActions = (
    <Button
      type="button"
      variant="primary"
      size="md"
      fullWidth={false}
      className="whitespace-nowrap"
      onClick={() => {
        dispatch(setSelectedInspection(null));
        navigate(routes.ADD_INSPECTION);
      }}
    >
      {t('addNewInspection')}
    </Button>
  );

  return (
    <div className="p-6 pt-8 w-full">
      <div className="w-full max-w-6xl mx-auto">
        <PageHeader title={t('inspections')} icon={ClipboardCheck} />

        <GenericTable
          data={inspections}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          toolbarActions={toolbarActions}
          showNumberColumn
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('searchInspections')}
          showFilters
          page={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          rowClassName={(inspection) => (inspection.deletedAt ? 'opacity-50' : '')}
        />
      </div>

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t('areYouSure')}
        message={t('areYouSureDeleteInspection')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default InspectionsPage;
