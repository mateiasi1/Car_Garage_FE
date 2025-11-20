import { FC, useState } from 'react';
import { useFetchInspectorsQuery } from '../../rtk/services/inspector-service';
import Drawer from '../shared/Drawer';
import { PersonItemBase } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';
import { useTranslation } from 'react-i18next';
import InspectorForm from '../forms/InspectorForm.tsx';
import {UserBranch} from "../../models/UserBranch";

interface InspectorListItem extends PersonItemBase {
  id: string;
  username: string;
  branches?: UserBranch[];
}

const InspectorsList: FC = () => {
  const { data: inspectors, error, isLoading } = useFetchInspectorsQuery();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InspectorListItem | null>(null);
  const { t } = useTranslation();

  if (isLoading) return <p>Loading inspectors...</p>;
  if (error) return <p>Failed to load inspectors</p>;

  const handleItemClick = (item: InspectorListItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const items: InspectorListItem[] =
    inspectors?.map((user) => ({
      id: user?.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ?? null,
      phoneNumber: null,
      branches: user.branches,
    })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('inspectors')}</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          onClick={() => setDrawerOpen(true)}
        >
          {t('addInspector')}
        </button>
      </div>

      <PersonList items={items} onItemClick={handleItemClick} />

      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? t('editInspector') : t('addInspector')}
      >
        <InspectorForm selectedInspector={selectedItem} onCloseDrawer={handleDrawerClose}  />
      </Drawer>
    </div>
  );
};

export default InspectorsList;
