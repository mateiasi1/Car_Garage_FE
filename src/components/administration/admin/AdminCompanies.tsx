import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, GitBranch, Pencil, Building2 } from 'lucide-react';

import { useFetchAdminCompaniesQuery } from '../../../rtk/services/admin-service';
import { Company } from '../../../models/Company';
import GenericTable, { TableColumn, TableAction } from '../../shared/GenericTable';
import Drawer from '../../shared/Drawer';
import CompanyForm from '../../forms/CompanyForm';
import { Button } from '../../shared/Button';
import { CustomText } from '../../shared/CustomText';
import { PageHeader } from '../../shared/PageHeader';

const AdminCompanies: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [search, setSearch] = useState('');

  const { data: companies = [], error, isLoading } = useFetchAdminCompaniesQuery();

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCompany(null);
  };

  const handleViewUsers = (company: Company) => {
    navigate(`/administration/company-users?companyId=${company.id}`);
  };

  const handleViewBranches = (company: Company) => {
    navigate(`/administration/company-branches?companyId=${company.id}`);
  };

  const columns: TableColumn<Company>[] = [
    {
      key: 'name',
      label: t('adminCompanies.companyName'),
      width: '2fr',
      searchable: true,
    },
    {
      key: 'email',
      label: t('adminCompanies.email'),
      width: '2fr',
      searchable: true,
    },
    {
      key: 'phoneNumber',
      label: t('adminCompanies.phoneNumber'),
      width: '1.5fr',
      render: (company) => company.phoneNumber || '—',
      searchable: true,
    },
    {
      key: 'location',
      label: t('adminCompanies.location'),
      width: '2fr',
      render: (company) => {
        const cityName = company.cityRef?.name || '';
        const countyName = company.cityRef?.county?.name || '';
        return [cityName, countyName].filter(Boolean).join(', ') || '—';
      },
      getSearchValue: (company) => {
        const cityName = company.cityRef?.name || '';
        const countyName = company.cityRef?.county?.name || '';
        return `${cityName} ${countyName}`;
      },
      searchable: true,
    },
    {
      key: 'isIndividual',
      label: t('adminCompanies.type'),
      width: '1fr',
      render: (company) => company.isIndividual ? (
        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {t('individual')}
        </span>
      ) : (
        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          {t('legalEntity')}
        </span>
      ),
    },
  ];

  const actions: TableAction<Company>[] = [
    {
      icon: <Users className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('adminCompanies.viewUsers'),
      onClick: handleViewUsers,
    },
    {
      icon: <GitBranch className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('adminCompanies.viewBranches'),
      onClick: handleViewBranches,
    },
    {
      icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
      label: t('adminCompanies.edit'),
      onClick: handleEditCompany,
    },
  ];

  const toolbarActions = (
    <Button
      type="button"
      variant="primary"
      size="md"
      fullWidth={false}
      className="whitespace-nowrap flex items-center gap-2"
      onClick={handleAddCompany}
    >
      {t('adminCompanies.addCompany')}
    </Button>
  );

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title={t('adminCompanies.title')} icon={Building2} />
        <div className="flex-1 flex items-center justify-center">
          <CustomText className="text-error">{t('adminCompanies.failedToLoadCompanies')}</CustomText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('adminCompanies.title')} icon={Building2} />

      <div className="flex-1 min-h-0">
        <GenericTable
          data={companies}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          toolbarActions={toolbarActions}
          showNumberColumn
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('adminCompanies.searchCompanies')}
          showFilters
          embedded
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedCompany ? t('adminCompanies.editCompany') : t('adminCompanies.addCompany')}
      >
        <CompanyForm
          key={selectedCompany?.id ?? 'new'}
          selectedCompany={selectedCompany}
          onCloseDrawer={handleCloseDrawer}
        />
      </Drawer>
    </div>
  );
};

export default AdminCompanies;
