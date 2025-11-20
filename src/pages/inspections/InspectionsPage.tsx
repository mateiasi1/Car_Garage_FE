import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    faMessage,
    faPenToSquare,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import GenericTable, {
    TableAction,
    TableColumn,
} from '../../components/shared/GenericTable';
import {
    InspectionsFilters as ApiFilters,
    useFetchInspectionsQuery,
    useDeleteInspectionMutation,
} from '../../rtk/services/inspections-service';
import { useSendInspectionReminderMutation } from '../../rtk/services/sms-service';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSelectedInspection } from '../../slices/inspectionSlice';
import { Inspection } from '../../models/Inspection';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../../components/shared/ConfirmationModal';

const InspectionsPage: FC = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    const selectedInspection = useAppSelector(
        (state) => state.inspection.selectedInspection,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [deleteInspection] = useDeleteInspectionMutation();
    const [sendReminder] = useSendInspectionReminderMutation();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date
            .toLocaleString(i18n.language, { month: 'short' })
            .replace('.', '');
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

    const getExpirationColorClass = (
        dateStr: string,
        inspectionType: string,
    ): string => {
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

    const handleSearchSubmit = (searchTerm: string) => {
        setSearch(searchTerm);
        setFilters((prev) => ({
            ...prev,
            page: 1,
            customerName: searchTerm,
            licensePlate: searchTerm,
            inspectorName: searchTerm,
            inspectionType: '',
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const handleMessageClick = async (inspection: Inspection) => {
        try {
            const response = await sendReminder(inspection.id).unwrap();
            showToast(
                `SMS reminder sent successfully to ${response.data.customerName}`,
                'success',
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
                `${inspection.inspectedBy?.firstName ?? ''} ${
                    inspection.inspectedBy?.lastName ?? ''
                }`.trim(),
            searchable: true,
        },
        {
            key: 'licensePlate',
            label: t('licensePlate'),
            width: '2fr',
            render: (inspection) => inspection.car?.licensePlate ?? '',
            searchable: true,
        },
        {
            key: 'customerName',
            label: t('customerName'),
            width: '2fr',
            render: (inspection) =>
                `${inspection.car?.customer?.firstName ?? ''} ${
                    inspection.car?.customer?.lastName ?? ''
                }`.trim(),
            searchable: true,
        },
        {
            key: 'inspectedAt',
            label: t('inspectionDate'),
            width: '2fr',
            render: (inspection) => formatDate(inspection.inspectedAt),
        },
        {
            key: 'inspectionExpiresAt',
            label: t('inspectionExpiresAt'),
            width: '2fr',
            render: (inspection) => (
                <span
                    className={getExpirationColorClass(
                        inspection.inspectedAt,
                        inspection.type,
                    )}
                >
          {getExpiryDate(inspection.inspectedAt, inspection.type)}
        </span>
            ),
        },
    ];

    const actions: TableAction<Inspection>[] = [
        {
            icon: faMessage,
            label: t('sendReminder'),
            onClick: handleMessageClick,
        },
        {
            icon: faPenToSquare,
            label: t('edit'),
            onClick: handleEditClick,
        },
        {
            icon: faTrashCan,
            label: t('delete'),
            onClick: handleDeleteClick,
        },
    ];

    const toolbarActions = (
        <button
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
            onClick={() => {
                dispatch(setSelectedInspection(null));
                navigate('/add-inspection');
            }}
        >
            {t('addNewInspection')}
        </button>
    );

    return (
        <div className="flex flex-col min-h-screen w-full bg-background p-6">
            <div className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col h-[calc(100vh-6rem)]">
                <GenericTable
                    data={inspections}
                    columns={columns}
                    actions={actions}
                    isLoading={isLoading}
                    toolbarActions={toolbarActions}
                    showNumberColumn
                    search={search}
                    onSearchChange={setSearch}
                    onSearch={handleSearchSubmit}
                    searchPlaceholder={t('searchInspections')}
                    showFilters
                    page={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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
