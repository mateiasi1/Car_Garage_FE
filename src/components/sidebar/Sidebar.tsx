import {
    faClipboardList,
    faGear,
    faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';
import { Role as RoleModel } from '../../models/Role';
import { Role } from '../../utils/enums/Role';
import SidebarNav, { NavItem } from './SidebarNav';
import LanguageSelector from './LanguageSelector';
import {routes} from "../../constants/routes";

const navItems: NavItem[] = [
    {
        to: routes.INSPECTIONS,
        icon: faClipboardList,
        labelKey: 'inspections',
        roles: [Role.inspector, Role.owner],
    },
    {
        to: '/administration',
        icon: faGear,
        labelKey: 'administration',
        roles: [Role.admin, Role.owner, Role.inspector],
    },
];

const Sidebar: FC = () => {
    const { user, logout } = useContext(AuthContext);
    const userRoles = user?.roles?.map((r: RoleModel) => r.name) || [];

    const initials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || '??';

    return (
        <>
            <div className="hidden md:flex fixed top-0 left-0 h-screen w-16 flex-col items-center bg-primary text-white py-4 z-20">

                <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold text-lg">
                    {initials}
                </div>

                <div className="mt-4 scale-90">
                    <LanguageSelector />
                </div>

                <SidebarNav navItems={navItems} userRoles={userRoles} variant="vertical" />

                <button
                    onClick={logout}
                    className="mt-auto mb-3 w-10 h-10 rounded-full flex items-center justify-center text-red-300 hover:text-red-500"
                    aria-label="Logout"
                >
                    <FontAwesomeIcon icon={faPowerOff} className="text-xl" />
                </button>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white flex items-center px-4 py-3 z-50">

                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm">
                        {initials}
                    </div>
                    <div className="scale-90">
                        <LanguageSelector />
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex gap-8">
                    <SidebarNav navItems={navItems} userRoles={userRoles} variant="bottom" />
                </div>

                <button
                    onClick={logout}
                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-red-300 hover:text-red-500"
                    aria-label="Logout"
                >
                    <FontAwesomeIcon icon={faPowerOff} className="text-lg" />
                </button>

            </div>
        </>
    );
};

export default Sidebar;
