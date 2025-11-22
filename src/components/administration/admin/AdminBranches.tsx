import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, Pencil, Building } from 'lucide-react';

import Drawer from '../../shared/Drawer';
import GenericTable, { TableColumn, TableAction } from '../../shared/GenericTable';
import BranchForm from '../../forms/BranchForm';
import PackageSubscribeDrawer from '../package/PackageSubscribeDrawer';
import { Branch } from '../../../models/Branch';
import { useFetchAdminCompanyBranchesQuery } from '../../../rtk/services/admin-service';
import { useFetchPackagesQuery } from '../../../rtk/services/package-service';
import { Button } from '../../shared/Button';
import { CustomText } from '../../shared/CustomText';
import { PageHeader } from '../../shared/PageHeader';

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

  const {
    data: branches,
    error,
    isLoading,
    refetch,
  } = useFetchAdminCompanyBranchesQuery(companyId || '', {
    skip: !companyId,
  });

  const { data: packages } = useFetchPackagesQuery();

  const packageMap = useMemo(() => {
    if (!packages) return {};
    return packages.reduce(
      (acc, pkg) => {
        acc[pkg.id] = pkg.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [packages]);

  if (!companyId) {
    return null;
  }

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBranch(null);
    refetch();
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
      render: (branch) => branch.phoneNumber || '—',
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
        if (!branch.activePackage?.packageId) return '—';
        return packageMap[branch.activePackage.packageId] || '—';
      },
    },
  ];

  const actions: TableAction<Branch>[] = [
    {
      icon: <Store className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('adminBranches.managePackage'),
      onClick: (branch) => {
        setSelectedBranchForPackage(branch);
        setPackageDialogOpen(true);
      },
    },
    {
      icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('adminBranches.edit'),
      onClick: (branch) => {
        setSelectedBranch(branch);
        setDrawerOpen(true);
      },
    },
  ];

  const toolbarActions = (
    <Button
      type="button"
      variant="primary"
      size="md"
      fullWidth={false}
      className="whitespace-nowrap"
      onClick={handleAddBranch}
    >
      {t('adminBranches.addBranch')}
    </Button>
  );

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title={t('adminCompanies.branches')} icon={Building} />
        <div className="flex-1 flex items-center justify-center">
          <CustomText className="text-error">{t('adminBranches.failedToLoadBranches')}</CustomText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('adminCompanies.branches')} icon={Building} />

      <div className="flex-1 min-h-0">
        <GenericTable<Branch>
          data={branches || []}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          toolbarActions={toolbarActions}
          showNumberColumn={false}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('adminBranches.searchBranches')}
          showFilters
          embedded
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedBranch ? t('adminBranches.editBranch') : t('adminBranches.addBranch')}
      >
        <BranchForm
          key={selectedBranch?.id ?? 'new'}
          selectedBranch={selectedBranch}
          companyId={companyId}
          onCloseDrawer={handleCloseDrawer}
        />
      </Drawer>

      {selectedBranchForPackage && (
        <PackageSubscribeDrawer
          isOpen={packageDialogOpen}
          onClose={handleClosePackageDialog}
          currentPackageId={selectedBranchForPackage.activePackage?.packageId}
          branchId={selectedBranchForPackage.id}
        />
      )}
    </div>
  );
};

export default AdminBranches;
