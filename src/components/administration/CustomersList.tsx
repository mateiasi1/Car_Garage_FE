import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, UserCog } from 'lucide-react';

import GenericTable, { TableAction, TableColumn } from '../shared/GenericTable';
import { useFetchAllCustomersQuery } from '../../rtk/services/customer-service';
import Drawer from '../shared/Drawer';
import CustomerForm from '../forms/CustomerForm';
import { Button } from '../shared/Button';
import { CustomText } from '../shared/CustomText';

interface CustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const CustomersList: FC = () => {
  const { t } = useTranslation();
  const { data: customers, isLoading, error } = useFetchAllCustomersQuery();

  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);

  const items: CustomerRow[] = useMemo(
    () =>
      customers?.map((customer) => ({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
      })) ?? [],
    [customers]
  );

  const columns: TableColumn<CustomerRow>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('name'),
        width: '2fr',
        render: (item) => `${item.firstName} ${item.lastName}`,
        getSearchValue: (item) => `${item.firstName} ${item.lastName}`,
        searchable: true,
      },
      {
        key: 'phoneNumber',
        label: t('phoneNumber'),
        width: '2fr',
        render: (item) => item.phoneNumber || '—',
        getSearchValue: (item) => item.phoneNumber ?? '',
        searchable: true,
      },
    ],
    [t]
  );

  const actions: TableAction<CustomerRow>[] = useMemo(
    () => [
      {
        icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
        label: t('edit'),
        onClick: (item) => {
          setSelectedCustomer(item);
          setDrawerOpen(true);
        },
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
      onClick={() => {
        setSelectedCustomer(null);
        setDrawerOpen(true);
      }}
    >
      {t('addCustomer')}
    </Button>
  );

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCog className="w-6 h-6 text-primary" />
          </div>
          <CustomText variant="h3" color="primary">
            {t('customers')}
          </CustomText>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <CustomText className="text-error">{t('failedToLoadCustomers')}</CustomText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UserCog className="w-6 h-6 text-primary" />
        </div>
        <CustomText variant="h3" color="primary">
          {t('customers')}
        </CustomText>
      </div>

      <div className="flex-1 min-h-0">
        <GenericTable
          data={items}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          showNumberColumn
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('searchCustomers')}
          showFilters
          toolbarActions={toolbarActions}
          embedded
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        title={selectedCustomer ? t('editCustomer') : t('addCustomer')}
      >
        <CustomerForm
          key={selectedCustomer?.id ?? 'new'}
          selectedCustomer={selectedCustomer}
          onCloseDrawer={handleDrawerClose}
        />
      </Drawer>
    </div>
  );
};

export default CustomersList;
