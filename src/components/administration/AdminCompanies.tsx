import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchAdminCompaniesQuery } from '../../rtk/services/admin-service';
import CompanyForm from '../company/CompanyForm';
import Drawer from '../shared/Drawer';
import { Company } from '../../models/Company';
import GenericTable, { TableColumn, TableAction } from '../shared/GenericTable';

const AdminCompanies: FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [usersDrawerOpen, setUsersDrawerOpen] = useState(false);
    const [branchesDrawerOpen, setBranchesDrawerOpen] = useState(false);
    const [selectedCompanyForView, setSelectedCompanyForView] = useState<Company | null>(null);
    const [search, setSearch] = useState('');

    const { data: companies, error, isLoading } = useFetchAdminCompaniesQuery();
    const { t } = useTranslation();

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
        setSelectedCompanyForView(company);
        setUsersDrawerOpen(true);
    };

    const handleViewBranches = (company: Company) => {
        setSelectedCompanyForView(company);
        setBranchesDrawerOpen(true);
    };

    // Define table columns - mark which are searchable
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
            render: (company) => company.phoneNumber || '-',
            searchable: true,
        },
        {
            key: 'location',
            label: t('adminCompanies.location'),
            width: '2fr',
            render: (company) => `${company.city}, ${company.country}`,
            searchable: true,
        },
    ];

    // Define ALL actions in Actions column - uniform gray colors
    const actions: TableAction<Company>[] = [
        {
            icon: 'fa-users',
            label: t('adminCompanies.viewUsers'),
            onClick: handleViewUsers,
        },
        {
            icon: 'fa-sitemap',
            label: t('adminCompanies.viewBranches'),
            onClick: handleViewBranches,
        },
        {
            icon: 'fa-edit',
            label: t('adminCompanies.edit'),
            onClick: handleEditCompany,
        },
    ];

    // Toolbar actions (Add Company button)
    const toolbarActions = (
        <button
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
            onClick={handleAddCompany}
        >
            {t('adminCompanies.addCompany')}
        </button>
    );

    if (error) {
        return <div className="text-center p-8 text-error">{t('adminCompanies.failedToLoadCompanies')}</div>;
    }

    return (
        <>
            <GenericTable
                data={companies || []}
                columns={columns}
                actions={actions}
                isLoading={isLoading}
                toolbarActions={toolbarActions}
                showNumberColumn={false}
                search={search}
                onSearchChange={setSearch}
                onSearch={(searchTerm) => setSearch(searchTerm)}
                searchPlaceholder={t('adminCompanies.searchCompanies')}
                showFilters={true}
            />

            {/* Edit/Add Company Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                title={selectedCompany ? t('adminCompanies.editCompany') : t('adminCompanies.addCompany')}
            >
                <CompanyForm selectedCompany={selectedCompany} onCloseDrawer={handleCloseDrawer} />
            </Drawer>

            {/* Users Drawer */}
            <Drawer
                isOpen={usersDrawerOpen}
                onClose={() => setUsersDrawerOpen(false)}
                title={`${t('adminCompanies.users')} - ${selectedCompanyForView?.name}`}
            >
                <div className="p-4">
                    <p>{t('adminCompanies.usersForCompany')}: {selectedCompanyForView?.name}</p>
                    {/* TODO: Add users list component */}
                </div>
            </Drawer>

            {/* Branches Drawer */}
            <Drawer
                isOpen={branchesDrawerOpen}
                onClose={() => setBranchesDrawerOpen(false)}
                title={`${t('adminCompanies.branches')} - ${selectedCompanyForView?.name}`}
            >
                <div className="p-4">
                    <p>{t('adminCompanies.branchesForCompany')}: {selectedCompanyForView?.name}</p>
                    {/* TODO: Add branches list component */}
                </div>
            </Drawer>
        </>
    );
};

export default AdminCompanies;