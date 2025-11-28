import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { IdCard, Users, UserCog, Building2, Building, Store, Percent } from 'lucide-react';
import { PageContainer } from '../../components/shared/PageContainer';
import { CustomText } from '../../components/shared/CustomText';
import { AdminCard } from '../../components/shared/AdminCard';
import { AdministrationItem, AdministrationItemProps } from '../../components/administration/AdministrationItem';
import UserProfile from '../../components/administration/profile/UserProfile';
import InspectorsList from '../../components/administration/InspectorsList';
import CustomersList from '../../components/administration/CustomersList';
import CompanyDetails from '../../components/administration/CompanyDetails';
import BranchDetails from '../../components/administration/BranchDetails';
import AdminCompanies from '../../components/administration/admin/AdminCompanies';
import Packages from '../../components/administration/package/Packages';
import AdminUsers from '../../components/administration/admin/AdminUsers';
import AdminBranches from '../../components/administration/admin/AdminBranches';
import AdminDiscounts from '../../components/administration/admin/AdminDiscounts';
import { AuthContext } from '../../contexts/authContext';
import { Role as RoleModel } from '../../models/Role';
import { Role } from '../../utils/enums/Role';

interface AdministrationSetting extends AdministrationItemProps {
  roles: Role[];
  component: React.ReactNode;
  tabKey: string;
  hidden?: boolean;
}

const AdministrationPage: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();
  const [selectedItem, setSelectedItem] = useState<AdministrationSetting | null>(null);

  const items: AdministrationSetting[] = useMemo(
    () => [
      {
        icon: IdCard,
        name: 'profile',
        link: '/administration/profile',
        tabKey: 'profile',
        roles: [Role.owner, Role.inspector],
        component: <UserProfile />,
        onSelect: () => {},
      },
      {
        icon: Users,
        name: 'inspectors',
        link: '/administration/inspectors',
        tabKey: 'inspectors',
        roles: [Role.owner],
        component: <InspectorsList />,
        onSelect: () => {},
      },
      {
        icon: UserCog,
        name: 'customers',
        link: '/administration/customers',
        tabKey: 'customers',
        roles: [Role.owner, Role.inspector],
        component: <CustomersList />,
        onSelect: () => {},
      },
      {
        icon: Building2,
        name: 'companyData',
        link: '/administration/company-data',
        tabKey: 'company-data',
        roles: [Role.owner],
        component: <CompanyDetails />,
        onSelect: () => {},
      },
      {
        icon: Building,
        name: 'branchData',
        link: '/administration/branch-data',
        tabKey: 'branch-data',
        roles: [Role.owner, Role.inspector],
        component: <BranchDetails />,
        onSelect: () => {},
      },
      {
        icon: Building2,
        name: 'companies',
        link: '/administration/companies',
        tabKey: 'companies',
        roles: [Role.admin],
        component: <AdminCompanies />,
        onSelect: () => {},
      },
      {
        icon: Store,
        name: 'packages.name',
        link: '/administration/packages',
        tabKey: 'packages',
        roles: [Role.admin, Role.owner],
        component: <Packages />,
        onSelect: () => {},
      },
      {
        icon: Percent,
        name: 'discounts.title',
        link: '/administration/discounts',
        tabKey: 'discounts',
        roles: [Role.admin],
        component: <AdminDiscounts />,
        onSelect: () => {},
      },
      {
        icon: Users,
        name: 'companyUsers',
        link: '/administration/company-users',
        tabKey: 'company-users',
        roles: [Role.admin],
        component: <AdminUsers />,
        onSelect: () => {},
        hidden: true,
      },
      {
        icon: Building2,
        name: 'companyBranches',
        link: '/administration/company-branches',
        tabKey: 'company-branches',
        roles: [Role.admin],
        component: <AdminBranches />,
        onSelect: () => {},
        hidden: true,
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (!user?.roles) return [];
    return items.filter((item) => user.roles.some((role: RoleModel) => item.roles.includes(role.name as Role)));
  }, [items, user?.roles]);

  const menuItems = useMemo(() => filteredItems.filter((item) => !item.hidden), [filteredItems]);

  useEffect(() => {
    if (menuItems.length === 0) return;
    const existingTab = filteredItems.find((i) => i.tabKey === tab);
    if (!tab || !existingTab) {
      setSelectedItem(menuItems[0]);
      navigate(`/administration/${menuItems[0].tabKey}`, { replace: true });
    } else {
      setSelectedItem(existingTab);
    }
  }, [filteredItems, menuItems, navigate, tab]);

  const handleSelectItem = (item: AdministrationSetting) => {
    setSelectedItem(item);
    navigate(`/administration/${item.tabKey}`);
  };

  return (
    <PageContainer className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
      <div className="w-full max-w-6xl mx-auto h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 xl:w-80 lg:h-full flex">
          <AdminCard fullHeight className="flex-1 flex flex-col overflow-hidden">
            <CustomText variant="h3" className="p-4 sm:p-5 lg:p-6 hidden lg:block text-primary mb-2">
              {t('administration')}
            </CustomText>
            <nav className="mt-2 flex-1 flex flex-row flex-wrap justify-center items-center lg:flex-col lg:items-stretch lg:justify-start gap-3 lg:gap-2 lg:overflow-y-auto pr-1">
              {menuItems.map((item) => (
                <AdministrationItem
                  key={item.tabKey}
                  icon={item.icon}
                  name={item.name}
                  link={item.link}
                  isSelected={selectedItem?.tabKey === item.tabKey}
                  onSelect={() => handleSelectItem(item)}
                />
              ))}
            </nav>
          </AdminCard>
        </div>

        <div className="flex-1 h-full flex">
          <AdminCard fullHeight className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">{selectedItem?.component}</div>
          </AdminCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdministrationPage;
