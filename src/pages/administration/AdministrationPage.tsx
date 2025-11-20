import {faBuilding, faBuildingUser, faIdCard, faPeopleGroup, faStore, faUsers} from '@fortawesome/free-solid-svg-icons';
import {FC, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import AdminCompanies from '../../components/administration/AdminCompanies';
import {AdministrationItem, AdministrationItemProps} from '../../components/administration/AdministrationItem';
import CustomersList from '../../components/administration/CustomersList';
import InspectorsList from '../../components/administration/InspectorsList';
import UserProfile from '../../components/administration/UserProfile';
import {AuthContext} from '../../contexts/authContext';
import {Role as RoleModel} from '../../models/Role';
import {Role} from '../../utils/enums/Role';
import CompanyDetails from '../../components/administration/CompanyDetails';
import Packages from '../../components/administration/Packages';
import BranchDetails from "../../components/administration/BranchDetails";
import AdminUsers from "../../components/administration/AdminUsers";
import AdminBranches from "../../components/administration/AdminBranches";

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

    const items: AdministrationSetting[] = useMemo(() => [
        {
            icon: faIdCard,
            name: 'profile',
            link: '/administration/profile',
            tabKey: 'profile',
            roles: [Role.owner, Role.inspector],
            component: <UserProfile />,
            onSelect: () => {},
        },
        {
            icon: faUsers,
            name: 'inspectors',
            link: '/administration/inspectors',
            tabKey: 'inspectors',
            roles: [Role.owner],
            component: <InspectorsList />,
            onSelect: () => {},
        },
        {
            icon: faPeopleGroup,
            name: 'customers',
            link: '/administration/customers',
            tabKey: 'customers',
            roles: [Role.owner, Role.inspector],
            component: <CustomersList />,
            onSelect: () => {},
        },
        {
            icon: faBuilding,
            name: 'companyData',
            link: '/administration/company-data',
            tabKey: 'company-data',
            roles: [Role.owner],
            component: <CompanyDetails />,
            onSelect: () => {},
        },
        {
            icon: faBuildingUser,
            name: 'branchData',
            link: '/administration/branch-data',
            tabKey: 'branch-data',
            roles: [Role.owner, Role.inspector],
            component: <BranchDetails />,
            onSelect: () => {},
        },
        {
            icon: faBuilding,
            name: 'companies',
            link: '/administration/companies',
            tabKey: 'companies',
            roles: [Role.admin],
            component: <AdminCompanies />,
            onSelect: () => {},
        },
        {
            icon: faStore,
            name: 'packages.name',
            link: '/administration/packages',
            tabKey: 'packages',
            roles: [Role.admin, Role.owner],
            component: <Packages />,
            onSelect: () => {},
        },
        {
            icon: faPeopleGroup,
            name: 'companyUsers',
            link: '/administration/company-users',
            tabKey: 'company-users',
            roles: [Role.admin],
            component: <AdminUsers />,
            onSelect: () => {},
            hidden: true,
        },
        {
            icon: faBuilding,
            name: 'companyBranches',
            link: '/administration/company-branches',
            tabKey: 'company-branches',
            roles: [Role.admin],
            component: <AdminBranches />,
            onSelect: () => {},
            hidden: true,
        },
    ], []);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (!user?.roles) return false;
            return user.roles.some((role: RoleModel) => item.roles.includes(role.name as Role));
        });
    }, [items, user?.roles]);

    const menuItems = useMemo(() => {
        return filteredItems.filter(item => !item.hidden);
    }, [filteredItems]);

    useEffect(() => {
        if (menuItems.length === 0) return;

        const existingTab = filteredItems.find(i => i.tabKey === tab);

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
        <div className="min-h-screen w-full bg-background">
            <div className="h-screen flex flex-col lg:flex-row lg:gap-6 lg:p-6 lg:pt-12">
                <aside className="lg:w-64 xl:w-72 bg-card lg:rounded-xl lg:shadow-md">
                    <div className="p-4 lg:p-6">
                        <h2 className="text-xl lg:text-2xl font-heading font-bold text-text mb-4 lg:mb-6 hidden lg:block">
                            {t('administration')}
                        </h2>

                        <nav className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                            {menuItems.map((item, index) => (
                                <AdministrationItem
                                    key={index}
                                    icon={item.icon}
                                    name={item.name}
                                    link={item.link}
                                    isSelected={selectedItem?.tabKey === item.tabKey}
                                    onSelect={() => handleSelectItem(item)}
                                />
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 bg-card lg:rounded-xl lg:shadow-md overflow-hidden">
                    <div className="h-full overflow-y-auto p-4 lg:p-6">{selectedItem?.component}</div>
                </main>
            </div>
        </div>
    );
};

export default AdministrationPage;