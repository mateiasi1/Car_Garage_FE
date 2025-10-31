import { faBuilding, faIdCard, faPeopleGroup, faUsers, faStore } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminCompanies from '../../components/administration/AdminCompanies';
import { AdministrationItem, AdministrationItemProps } from '../../components/administration/AdministrationItem';
import CustomersList from '../../components/administration/CustomersList';
import InspectorsList from '../../components/administration/InspectorsList';
import UserProfile from '../../components/administration/UserProfile';
import { AuthContext } from '../../contexts/authContext';
import { Role as RoleModel } from '../../models/Role';
import { Role } from '../../utils/enums/Role';
import CompanyDetails from '../../components/administration/CompanyDetails';
import Packages from "../../components/administration/Packages.tsx";

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
            component: <CompanyDetails />,
            onSelect: () => {},
        },
        {
            icon: faBuilding,
            name: 'companies',
            link: '/administration/companies',
            roles: [Role.admin],
            component: <AdminCompanies />,
            onSelect: () => {},
        },
        {
            icon: faStore,
            name: 'packages.name',
            link: '/administration/packages',
            roles: [Role.admin],
            component: <Packages />,
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
        <div className="min-h-screen w-full bg-background">
            <div className="h-screen flex flex-col lg:flex-row lg:gap-6 lg:p-6 lg:pt-12">
                <aside className="lg:w-64 xl:w-72 bg-card lg:rounded-xl lg:shadow-md">
                    <div className="p-4 lg:p-6">
                        <h2 className="text-xl lg:text-2xl font-heading font-bold text-text mb-4 lg:mb-6 hidden lg:block">
                            {t('administration')}
                        </h2>

                        <nav className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
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
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 bg-card lg:rounded-xl lg:shadow-md overflow-hidden">
                    <div className="h-full overflow-y-auto p-4 lg:p-6">
                        {selectedItem?.component}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdministrationPage;