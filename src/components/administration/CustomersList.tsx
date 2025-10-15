import { FC, useState } from 'react';
import { useFetchAllCustomersQuery } from '../../rtk/services/customer-service';
import Drawer from '../shared/Drawer';
import { PersonItemBase } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';
import { t } from 'i18next';

const CustomersList: FC = () => {
  const { data: customers, error, isLoading } = useFetchAllCustomersQuery();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PersonItemBase | null>(null);

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p>Failed to load customers</p>;

  const handleItemClick = (item: PersonItemBase) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const items: PersonItemBase[] =
    customers?.map((customer) => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: null,
      phoneNumber: customer.phoneNumber,
    })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('customers')}</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          onClick={() => setDrawerOpen(true)}
        >
          {t('addCustomer')}
        </button>
      </div>

      <PersonList items={items} onItemClick={handleItemClick} />

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedItem ? t('editCustomer') : t('addCustomer')}
      >
        <p>Drawer form</p>
      </Drawer>
    </div>
  );
};

export default CustomersList;
