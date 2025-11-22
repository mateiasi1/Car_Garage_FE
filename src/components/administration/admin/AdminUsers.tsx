import { FC, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pencil, Users } from 'lucide-react';

import { AdminUser, useFetchAdminCompanyUsersQuery } from '../../../rtk/services/admin-service';
import Drawer from '../../shared/Drawer';
import GenericTable, { TableColumn, TableAction } from '../../shared/GenericTable';
import UserForm from '../../forms/UserForm';
import { Button } from '../../shared/Button';
import { CustomText } from '../../shared/CustomText';
import { PageHeader } from '../../shared/PageHeader';

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

  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useFetchAdminCompanyUsersQuery(companyId || '', {
    skip: !companyId,
  });

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

  const columns: TableColumn<AdminUser>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('adminUsers.name'),
        width: '2fr',
        render: (user) => `${user.firstName} ${user.lastName}`,
        getSearchValue: (user) => `${user.firstName} ${user.lastName}`,
        searchable: true,
      },
      {
        key: 'username',
        label: t('adminUsers.username'),
        width: '2fr',
        searchable: true,
      },
      {
        key: 'role',
        label: t('adminUsers.role'),
        width: '1.5fr',
        render: (user) => {
          const role = user.roles[0]; // primul rol
          if (role === 'owner') return t('roles.owner');
          if (role === 'inspector') return t('roles.inspector');
          return role;
        },
      },
      {
        key: 'branches',
        label: t('adminUsers.branches'),
        width: '3fr',
        render: (user) => {
          const isOwner = user.roles.includes('owner');
          if (isOwner) return '—';
          if (!user.branches || user.branches.length === 0) return '—';

          return user.branches.map((b) => b.name).join(', ');
        },
        getSearchValue: (user) =>
          user.branches && user.branches.length > 0 ? user.branches.map((b) => b.name).join(' ') : '',
        searchable: true,
      },
    ],
    [t]
  );

  const actions: TableAction<AdminUser>[] = useMemo(
    () => [
      {
        icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
        label: t('adminUsers.edit'),
        onClick: handleEditUser,
      },
    ],
    [t]
  );

  const toolbarActions = (
    <Button
      type="button"
      variant="primary"
      size="md"
      fullWidth={false}
      className="whitespace-nowrap"
      onClick={handleAddUser}
    >
      {t('adminUsers.addUser')}
    </Button>
  );

  if (!companyId) {
    return null;
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title={t('adminUsers.title')} icon={Users} />
        <div className="flex-1 flex items-center justify-center">
          <CustomText className="text-error">{t('adminUsers.failedToLoadUsers')}</CustomText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('adminUsers.title')} icon={Users} />

      <div className="flex-1 min-h-0">
        <GenericTable<AdminUser>
          data={users || []}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          toolbarActions={toolbarActions}
          showNumberColumn
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('adminUsers.searchUsers')}
          showFilters
          embedded
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedUser ? t('adminUsers.editUser') : t('adminUsers.addUser')}
      >
        <UserForm selectedUser={selectedUser} companyId={companyId} onCloseDrawer={handleCloseDrawer} />
      </Drawer>
    </div>
  );
};

export default AdminUsers;
