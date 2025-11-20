import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {AdminUser, useFetchAdminCompanyUsersQuery} from '../../rtk/services/admin-service';
import Drawer from '../shared/Drawer';
import GenericTable, { TableColumn, TableAction } from '../shared/GenericTable';
import UserForm from "../users/UserForm";

const AdminUsers: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!companyId) {
            navigate('/administration/companies', { replace: true });
        }
    }, [companyId, navigate]);

    const { data: users, error, isLoading, refetch } = useFetchAdminCompanyUsersQuery(companyId || '', {
        skip: !companyId,
    });

    if (!companyId) {
        return null;
    }

    const handleEditUser = (user: AdminUser) => {
        setSelectedUser(user);
        setDrawerOpen(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedUser(null);
        refetch();
    };

    const columns: TableColumn<AdminUser>[] = [
        {
            key: 'username',
            label: t('adminUsers.username'),
            width: '2fr',
            searchable: true,
        },
        {
            key: 'name',
            label: t('adminUsers.name'),
            width: '2fr',
            render: (user) => `${user.firstName} ${user.lastName}`,
            searchable: true,
        },
        {
            key: 'role',
            label: t('adminUsers.role'),
            width: '1.5fr',
            render: (user) => {
                const role = user.roles[0]; // Take first role
                if (role === 'owner') return t('roles.owner');
                if (role === 'inspector') return t('roles.inspector');
                return role;
            },
        },
        {
            key: 'branches',
            label: t('adminUsers.branches'),
            width: '2fr',
            render: (user) => {
                const isOwner = user.roles.includes('owner');
                if (isOwner) return '-';

                if (!user.branches || user.branches.length === 0) return '-';

                return user.branches.map(b => b.name).join(', ');
            },
        },
    ];

    const actions: TableAction<AdminUser>[] = [
        {
            icon: 'fa-edit',
            label: t('adminUsers.edit'),
            onClick: handleEditUser,
        },
    ];

    const toolbarActions = (
        <button
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
            onClick={handleAddUser}
        >
            {t('adminUsers.addUser')}
        </button>
    );

    if (error) {
        return <div className="text-center p-8 text-error">{t('adminUsers.failedToLoadUsers')}</div>;
    }

    return (
        <>
            <GenericTable
                data={users || []}
                columns={columns}
                actions={actions}
                isLoading={isLoading}
                toolbarActions={toolbarActions}
                showNumberColumn={false}
                search={search}
                onSearchChange={setSearch}
                onSearch={(searchTerm) => setSearch(searchTerm)}
                searchPlaceholder={t('adminUsers.searchUsers')}
                showFilters={true}
            />

            <Drawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                title={selectedUser ? t('adminUsers.editUser') : t('adminUsers.addUser')}
            >
                <UserForm
                    selectedUser={selectedUser}
                    companyId={companyId}
                    onCloseDrawer={handleCloseDrawer}
                />
            </Drawer>
        </>
    );
};

export default AdminUsers;