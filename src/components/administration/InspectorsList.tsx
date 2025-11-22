import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Users } from 'lucide-react';

import GenericTable, { TableAction, TableColumn } from '../shared/GenericTable';
import { useFetchInspectorsQuery } from '../../rtk/services/inspector-service';
import Drawer from '../shared/Drawer';
import InspectorForm from '../forms/InspectorForm';
import { Button } from '../shared/Button';
import { CustomText } from '../shared/CustomText';
import { UserBranch } from '../../models/UserBranch';
import { PageHeader } from '../shared/PageHeader.tsx';

interface InspectorRow {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  branches?: UserBranch[];
}

const InspectorsList: FC = () => {
  const { t } = useTranslation();
  const { data: inspectors, isLoading, error } = useFetchInspectorsQuery();

  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<InspectorRow | null>(null);

  const items: InspectorRow[] = useMemo(
    () =>
      inspectors?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        branches: user.branches,
      })) ?? [],
    [inspectors]
  );

  const columns: TableColumn<InspectorRow>[] = useMemo(
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
        key: 'branches',
        label: t('assignedBranches'),
        width: '3fr',
        render: (item) => item.branches?.map((b) => b.name).join(', ') || '—',
        getSearchValue: (item) => item.branches?.map((b) => b.name).join(' ') ?? '',
        searchable: true,
      },
    ],
    [t]
  );

  const actions: TableAction<InspectorRow>[] = useMemo(
    () => [
      {
        icon: <Pencil className="w-5 h-5 text-primary hover:text-primary-hover" />,
        label: t('edit'),
        onClick: (item) => {
          setSelectedInspector(item);
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
        setSelectedInspector(null);
        setDrawerOpen(true);
      }}
    >
      {t('addInspector')}
    </Button>
  );

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedInspector(null);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title={t('inspectors')} icon={Users} />
        <div className="flex-1 flex items-center justify-center">
          <CustomText className="text-error">{t('failedToLoadInspectors')}</CustomText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('inspectors')} icon={Users} />
      <div className="flex-1 min-h-0">
        <GenericTable<InspectorRow>
          data={items}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          showNumberColumn
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('searchInspectors')}
          showFilters
          toolbarActions={toolbarActions}
          embedded
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        title={selectedInspector ? t('editInspector') : t('addInspector')}
      >
        <InspectorForm
          key={selectedInspector?.id ?? 'new'}
          selectedInspector={selectedInspector}
          onCloseDrawer={handleDrawerClose}
        />
      </Drawer>
    </div>
  );
};

export default InspectorsList;
