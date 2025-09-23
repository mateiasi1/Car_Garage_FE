import { FC, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdministrationItem, AdministrationItemProps } from '../../components/administration/AdministrationItem';
import { faPeopleGroup, faUsers, faBuilding, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../utils/enums/Role';
import { Role as RoleModel } from '../../models/Role';
import { AuthContext } from '../../contexts/authContext';
import UserProfile from '../../components/administration/UserProfile';
import InspectorsList from '../../components/administration/InspectorsList';
import CustomersList from '../../components/administration/CustomersList';

interface AdministrationSetting extends AdministrationItemProps {
  roles: Role[];
  component: React.ReactNode;
}

const AdministrationPage: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState<AdministrationSetting | null>(null);

  const items: AdministrationSetting[] = [
    {
      icon: faIdCard,
      name: 'profile',
      link: '/administration/profile',
      roles: [Role.owner, Role.inspector],
      component: <UserProfile />,
      onSelect: () => {},
    },
    {
      icon: faUsers,
      name: 'inspectors',
      link: '/administration/inspectors',
      roles: [Role.owner],
      component: <InspectorsList />,
      onSelect: () => {},
    },
    {
      icon: faPeopleGroup,
      name: 'customers',
      link: '/administration/customers',
      roles: [Role.owner, Role.inspector],
      component: <CustomersList />,
      onSelect: () => {},
    },
    {
      icon: faBuilding,
      name: 'companyData',
      link: '/administration/company-data',
      roles: [Role.owner, Role.inspector],
      component: <div>Company Data Component</div>,
      onSelect: () => {},
    },
    {
      icon: faBuilding,
      name: 'companies',
      link: '/administration/companies',
      roles: [Role.admin],
      component: <div>Companies Component</div>,
      onSelect: () => {},
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!user?.roles) return false;
    return user.roles.some((role: RoleModel) => item.roles.includes(role.name as Role));
  });

  useEffect(() => {
    if (filteredItems.length > 0 && !selectedItem) {
      setSelectedItem(filteredItems[0]);
    }
  }, [filteredItems]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background p-6">
      <div className="flex gap-6 pt-12 h-[calc(100vh-4rem)]">
        <div className="w-1/6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-heading mb-6">{t('administration')}</h2>
          <div className="flex flex-col gap-4">
            {filteredItems.map((item, index) => (
              <AdministrationItem
                key={index}
                icon={item.icon}
                name={item.name}
                link={item.link}
                isSelected={selectedItem?.link === item.link}
                onSelect={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </div>

        <div className="w-5/6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-heading mb-6">{t(selectedItem?.name ?? '')}</h2>
          <div className="h-full">{selectedItem?.component}</div>
        </div>
      </div>
    </div>
  );
};

export default AdministrationPage;
