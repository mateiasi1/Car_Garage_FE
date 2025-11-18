import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchAdminCompaniesQuery } from '../../rtk/services/admin-service';
import CompanyForm from '../company/CompanyForm';
import Drawer from '../shared/Drawer';
import { PersonItemBase } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';

interface CompanyListItem extends PersonItemBase {
  id: string;
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
}

const AdminCompanies: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CompanyListItem | null>(null);
  const { data: companies, error, isLoading } = useFetchAdminCompaniesQuery();
  const { t } = useTranslation();

  if (isLoading) return <p>Loading companies...</p>;
  if (error) {
    return <p>Failed to load companies</p>;
  }

  const handleClick = (item: CompanyListItem) => {
    setDrawerOpen(true);
    setSelectedItem(item);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const items: CompanyListItem[] =
    companies?.map((company) => ({
      id: company.id,
      firstName: company.name,
      name: company.name,
      email: company.email,
      phoneNumber: company.phoneNumber || '',
      lastName: '',
      country: company.country,
      city: company.city,
      street: company.street,
      streetNumber: company.streetNumber,
      houseNumber: company.houseNumber,
    })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('companies')}</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          onClick={() => setDrawerOpen(true)}
        >
          {t('addCompany')}
        </button>
      </div>

      <PersonList items={items} onItemClick={handleClick} />

      <Drawer isOpen={drawerOpen} onClose={handleCloseDrawer} title={selectedItem ? t('editCompany') : t('addCompany')}>
        <CompanyForm selectedCompany={selectedItem} onCloseDrawer={handleCloseDrawer} />
      </Drawer>
    </div>
  );
};

export default AdminCompanies;
