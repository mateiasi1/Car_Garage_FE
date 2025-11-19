import {FC, useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '../shared/Drawer';
import { Branch } from '../../models/Branch';
import GenericTable, { TableColumn, TableAction } from '../shared/GenericTable';
import BranchForm from "../branches/BranchForm.tsx";
import PackageSubscribeDialog from "../../dialogs/PackageSubscribeDialog.tsx";
import {useFetchAdminCompanyBranchesQuery} from "../../rtk/services/admin-service.tsx";
import {useFetchPackagesQuery} from "../../rtk/services/package-service.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";

const AdminBranches: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [packageDialogOpen, setPackageDialogOpen] = useState(false);
    const [selectedBranchForPackage, setSelectedBranchForPackage] = useState<Branch | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!companyId) {
            navigate('/administration/companies', { replace: true });
        }
    }, [companyId, navigate]);

    const { data: branches, error, isLoading, refetch } = useFetchAdminCompanyBranchesQuery(companyId || '', {
        skip: !companyId,
    });

    const { data: packages } = useFetchPackagesQuery();

    const packageMap = useMemo(() => {
        if (!packages) return {};
        return packages.reduce((acc, pkg) => {
            acc[pkg.id] = pkg.name;
            return acc;
        }, {} as Record<string, string>);
    }, [packages]);

    if (!companyId) {
        return null;
    }

    const handleEditBranch = (branch: Branch) => {
        setSelectedBranch(branch);
        setDrawerOpen(true);
    };

    const handleAddBranch = () => {
        setSelectedBranch(null);
        setDrawerOpen(true);
    };

    // ⭐ Close drawer and refetch data (after add/edit/delete)
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedBranch(null);
        refetch();
    };

    const handleManagePackage = (branch: Branch) => {
        setSelectedBranchForPackage(branch);
        setPackageDialogOpen(true);
    };

    const handleClosePackageDialog = () => {
        setPackageDialogOpen(false);
        setSelectedBranchForPackage(null);
        refetch();
    };

    const columns: TableColumn<Branch>[] = [
        {
            key: 'name',
            label: t('adminBranches.branchName'),
            width: '2fr',
            searchable: true,
        },
        {
            key: 'phoneNumber',
            label: t('adminBranches.phoneNumber'),
            width: '1.5fr',
            render: (branch) => branch.phoneNumber || '-',
            searchable: true,
        },
        {
            key: 'location',
            label: t('adminBranches.location'),
            width: '2fr',
            render: (branch) => `${branch.city}, ${branch.country}`,
            searchable: true,
        },
        {
            key: 'package',
            label: t('adminBranches.package'),
            width: '1.5fr',
            render: (branch) => {
                if (!branch.activePackage?.packageId) return '-';
                return packageMap[branch.activePackage.packageId] || '-';
            },
        },
    ];

    const actions: TableAction<Branch>[] = [
        {
            icon: 'fa-store',
            label: t('adminBranches.managePackage'),
            onClick: handleManagePackage,
        },
        {
            icon: 'fa-edit',
            label: t('adminBranches.edit'),
            onClick: handleEditBranch,
        },
    ];

    const toolbarActions = (
        <button
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
            onClick={handleAddBranch}
        >
            {t('adminBranches.addBranch')}
        </button>
    );

    if (error) {
        return <div className="text-center p-8 text-error">{t('adminBranches.failedToLoadBranches')}</div>;
    }

    return (
        <>
            <GenericTable
                data={branches || []}
                columns={columns}
                actions={actions}
                isLoading={isLoading}
                toolbarActions={toolbarActions}
                showNumberColumn={false}
                search={search}
                onSearchChange={setSearch}
                onSearch={(searchTerm) => setSearch(searchTerm)}
                searchPlaceholder={t('adminBranches.searchBranches')}
                showFilters={true}
            />

            <Drawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                title={selectedBranch ? t('adminBranches.editBranch') : t('adminBranches.addBranch')}
            >
                <BranchForm
                    selectedBranch={selectedBranch}
                    companyId={companyId}
                    onCloseDrawer={handleCloseDrawer}
                />
            </Drawer>

            {selectedBranchForPackage && (
                <PackageSubscribeDialog
                    isOpen={packageDialogOpen}
                    onClose={handleClosePackageDialog}
                    currentPackageId={selectedBranchForPackage.activePackage?.packageId}
                    branchId={selectedBranchForPackage.id}
                />
            )}
        </>
    );
};

export default AdminBranches;